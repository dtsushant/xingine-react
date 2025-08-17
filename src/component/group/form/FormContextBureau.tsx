import React, {createContext, useContext, useMemo, useCallback, useEffect, useRef} from 'react';
import { FormInstance} from 'antd';
import {
    FormActionContext, FormFieldSetterMeta, ActionResult, SerializableAction, runAction, ActionExecutionContext,
    FormMeta, FieldMeta, isObjectField, isObjectArrayField, FormActionEventMeta, Actions, ActionBuilder, ChainBuilder,
    ConditionBuilder, fetchFromActionArgs, formActionEventMetaDecoder
} from 'xingine';
import {shouldRenderField} from "./FormGroup.utils";

// Type guards for field type checking


const hasNestedFields = (field: FieldMeta): boolean => {
    return isObjectField(field) || isObjectArrayField(field);
};

const getNestedFields = (field: FieldMeta): FieldMeta[] => {
    if (isObjectField(field)) {
        return field.properties.fields;
    }
    if (isObjectArrayField(field)) {
        return field.properties.itemFields;
    }
    return [];
};

const createFieldWithUpdatedNestedFields = (field: FieldMeta, visibleNestedFields: FieldMeta[]): FieldMeta => {
    if (isObjectField(field)) {
        return {
            ...field,
            properties: {
                ...field.properties,
                fields: visibleNestedFields
            }
        };
    }
    if (isObjectArrayField(field)) {
        return {
            ...field,
            properties: {
                ...field.properties,
                itemFields: visibleNestedFields
            }
        };
    }
    return field;
};





interface FormContextBureauProps {
  form: FormInstance;
  children: React.ReactNode;
  onSubmit?: (data: Record<string, unknown>) => Promise<ActionResult>;
  executionContext: ActionExecutionContext;
  formMeta:FormMeta;
}

interface FormActionContextExtended extends FormActionContext {
    executionContext: ActionExecutionContext;
    setLastFormUpdateTime: () => void;
    formMeta:FormMeta;
    filteredFields: FieldMeta[];
    setFilteredFields: (fields: FieldMeta[]) => void;
    handleValuesChange:(changed: Record<string, unknown>,
                        all: Record<string, unknown>)=>void;
    onFinish:(all: Record<string, unknown>)=>void
}

const FormContextBureauContext = createContext<FormActionContextExtended | null>(null);

export const FormContextBureau: React.FC<FormContextBureauProps> = ({
    form,
    children,
    onSubmit,
    executionContext,
    formMeta
}) => {

    // Add state for tracking form update time
    const [lastFormUpdateTime, setLastFormUpdateTime] = React.useState<number>(0);
    const [initialFormData, setInitialFormData] = React.useState<Record<string,unknown>>({});
    const [filteredFields, setFilteredFields] = React.useState<FieldMeta[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const previousFormValue=useRef<Record<string, unknown>>({});


    const sortedFields = React.useMemo(
        () => formMeta.fields.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        [formMeta.fields]
    );

    const formActionContext = useMemo<Partial<FormActionContextExtended>>(() => {

        const ctx = {
            executionContext: executionContext,
            form: form,
            formMeta: formMeta,

            // Form update tracking for optimized conditional rendering
            lastFormUpdateTime:lastFormUpdateTime,
            filteredFields:filteredFields,
            getLastFormUpdateTime: () => lastFormUpdateTime,

            setLastFormUpdateTime: () => setLastFormUpdateTime(Date.now()),

            // Form data management
            setFormData: (data: Record<string, unknown>) => {
                console.log('Setting form data:', data);
                form.setFieldsValue(data);

                // Force an immediate form update
                form.validateFields().catch(() => {
                    // Ignore validation errors, we just want to trigger form update
                });
                // Update the timestamp when form data is set

                const newTimestamp = Date.now();
                setLastFormUpdateTime(newTimestamp);
            },

            setInitialFormData: async (data: Record<string, unknown>) => {
                // Evaluate each field's visibility
                setInitialFormData(data);
            },

            getInitialFormData: initialFormData,
            getFormData: () => {
                const data = form.getFieldsValue();
                return data;
            },

            // Field management
            setFormField: ({fieldName, value}: FormFieldSetterMeta) => {
                form.setFieldValue(fieldName, value);
            },

            getFormField: (fieldName: string) => {
                return form.getFieldValue(fieldName);
            },

            // Form validation
            validateForm: () => {
                try {
                    form.validateFields();
                    return true;
                } catch (error) {
                    return false;
                }
            },

            validateField: (fieldName: string) => {
                try {
                    form.validateFields([fieldName]);
                    return true;
                } catch (error) {
                    return false;
                }
            },

            // Form state
            getFormErrors: () => {
                const fieldsError = form.getFieldsError();
                const errors: Record<string, string[]> = {};

                fieldsError.forEach(({name, errors: fieldErrors}) => {
                    if (fieldErrors && fieldErrors.length > 0) {
                        const fieldName = Array.isArray(name) ? name.join('.') : String(name);
                        errors[fieldName] = fieldErrors;
                    }
                });

                return errors;
            },

            setFormErrors: (errors: Record<string, string[]>) => {
                const fieldsError = Object.entries(errors).map(([fieldName, fieldErrors]) => ({
                    name: fieldName,
                    errors: fieldErrors
                }));

                form.setFields(fieldsError);
            },

            clearFormErrors: () => {
                const allFields = form.getFieldsValue();
                const fieldNames = Object.keys(allFields);

                form.setFields(fieldNames.map(name => ({
                    name,
                    errors: []
                })));
            },

            // Form actions
            resetForm: () => {
                form.resetFields();
            },

            submitForm: async (arg:FormActionEventMeta): Promise<ActionResult> => {
                try {
                    const values = await form.validateFields();

                    if (onSubmit) {
                        return await onSubmit(values);
                    }

                    return {success: true, result: {submitted: true, data: values}};
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Form validation failed'
                    };
                }
            },
            handleValuesChange:handleFormValueChanged(),
            onFinish:onFinish()


        };

        return ctx;
    }, [form, onSubmit, executionContext, lastFormUpdateTime,filteredFields,initialFormData]); // Added lastFormUpdateTime to dependency array

    const mainContext:ActionExecutionContext = {...executionContext, formActionContext: formActionContext as unknown as  FormActionContext };
    // Call initializeForm on component mount
    useEffect(() => {
        const initialize = async () => {
            const onLoad = formMeta.event?.onInit;

            if (onLoad) {
                try {
                    // Execute onLoad action and wait for completion
                    await runAction(onLoad, mainContext);
                } catch (error) {
                    console.error("Error during onLoad actions:", error);
                }
            }
        };

        initialize();
    }, []);



    // Separate function to handle nested field visibility checking with type guards
    const checkNestedFieldsVisibility = async (
        field: FieldMeta,
        formData: Record<string, unknown>,
        checkFieldVisibilityRecursive: (field: FieldMeta, formData: Record<string, unknown>) => Promise<{ field: FieldMeta, visible: boolean, visibleNestedFields?: FieldMeta[] }>
    ): Promise<{ field: FieldMeta, visible: boolean, visibleNestedFields?: FieldMeta[] }> => {

        // Use type guards to safely determine if field has nested fields
        if (!hasNestedFields(field)) {
            return { field, visible: true };
        }

        // Get nested fields using type-safe getter
        const nestedFields = getNestedFields(field);

        // Recursively check visibility for nested fields
        const nestedVisibilityResults = await Promise.all(
            nestedFields.map(nestedField => checkFieldVisibilityRecursive(nestedField, formData))
        );

        // Filter only visible nested fields
        const visibleNestedFields = nestedVisibilityResults
            .filter(result => result.visible)
            .map(result => {
                // If the nested field has its own visible nested fields, use those
                if (result.visibleNestedFields && result.visibleNestedFields.length > 0) {
                    return createFieldWithUpdatedNestedFields(result.field, result.visibleNestedFields);
                }
                return result.field;
            });

        // Use type-safe field reconstruction
        const updatedField = createFieldWithUpdatedNestedFields(field, visibleNestedFields);

        return {
            field: updatedField,
            visible: true,
            visibleNestedFields
        };
    };

    const showHide = async (fd:Record<string,unknown>) => {
        // Recursive function to check visibility for nested fields
        const checkFieldVisibilityRecursive = async (field: FieldMeta, formData: Record<string, unknown>): Promise<{ field: FieldMeta, visible: boolean, visibleNestedFields?: FieldMeta[] }> => {
            // Check if the current field should be visible
            const isVisible = await shouldRenderField(field, formData, mainContext);

            // If field is not visible, return early
            if (!isVisible) {
                return { field, visible: false };
            }

            // Handle object and object[] types with nested fields
            if (field.inputType === 'object' || field.inputType === 'object[]') {
                return await checkNestedFieldsVisibility(field, formData, checkFieldVisibilityRecursive);
            }

            // For non-object fields, just return visibility status
            return { field, visible: true };
        };

        // Process all top-level fields recursively
        const visibilityResults = await Promise.all(
            sortedFields.map(field => checkFieldVisibilityRecursive(field, fd))
        );

        // Filter out invisible fields and build the final filtered fields list
        const visibleFields = visibilityResults
            .filter(result => result.visible)
            .map(result => result.field);

        setFilteredFields(visibleFields);
    };

    useEffect(() => {
        showHide(initialFormData);
        previousFormValue.current = initialFormData;
    }, [initialFormData, sortedFields]);

    function handleFormValueChanged(){
        const handleValuesChange:(
            changed: Record<string, unknown>,
            all: Record<string, unknown>
        ) => void = (changed, all) => {
            void (async () => {
                console.warn(" is the change taking place ", all ,changed)
                console.warn(JSON.stringify(changed, null, 2));
                //NOTE:- this is done because on showhide the data for hidden form value is preserved first time even though the form field itself is hidden
                const formData = { ...previousFormValue.current, ...all };
                showHide(formData);
                previousFormValue.current = formData;
            })();
        }
        return handleValuesChange;
    }



    function onFinish(){
        const handleFormSubmit = async (values: Record<string, unknown>): Promise<void> => {
            setIsSubmitting(true);
            try {
                console.warn("Need to fetch submittion action and execute it with values", values);
                const submitActionBuilder = Actions.apiCall(formMeta.action,"POST", values);
                const successAction = formMeta.event?.onSubmit && fetchFromActionArgs(formMeta.event?.onSubmit,'onSubmitSuccess') || {} ;
                const failureAction = formMeta.event?.onSubmit && fetchFromActionArgs(formMeta.event?.onSubmit,'onSubmitFailure') || {} ;
                let onSuccess: SerializableAction[];
                let onFailure: SerializableAction[];
                try {
                    onSuccess = formActionEventMetaDecoder.verify(successAction).actionsToExecute || [];
                } catch (error) {
                    onSuccess = [];
                }

                try {
                    onFailure = formActionEventMetaDecoder.verify(failureAction).actionsToExecute || [];
                } catch (error) {
                    onFailure = [];
                }
                submitActionBuilder.withChains(
                    ChainBuilder.create()
                        .whenCondition(ConditionBuilder
                            .field('__result.success')
                            .equals(true)
                        )
                        .thenSerializableActions(
                        ...onSuccess
                        )
                        .build(),
                    ChainBuilder.create()
                        .whenCondition(ConditionBuilder
                            .field('__result.success')
                            .equals(false)
                        )
                        .thenSerializableActions(
                            ...onFailure,
                        )
                        .build()
                )

                ActionBuilder.create('makeApiCall')
                    .withArgs({ url: '/api/user', method: 'GET' })
                    .withChains(ChainBuilder.create()
                        .whenCondition(ConditionBuilder
                            .field('__result.success')
                            .equals(true)
                        )
                        .thenActionBuilders(
                            Actions.setStorage('token','__result.token'),
                            Actions.navigate('/'),

                        )
                        .build())
                    .build();

                console.warn("the submit action is ", submitActionBuilder.build());
                const result =await runAction(
                    submitActionBuilder.build(),
                    mainContext
                );

                console.warn("the result here is ", result);
            } finally {
                setIsSubmitting(false);
            }
        };
        return handleFormSubmit;
    }

  return (
    <FormContextBureauContext.Provider value={formActionContext as FormActionContextExtended}>
        {filteredFields.length>0 && children}
    </FormContextBureauContext.Provider>
  );
};

export const useFormContext = (): FormActionContextExtended => {
  const context = useContext(FormContextBureauContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormContextBureau');
  }

  return context;
};
