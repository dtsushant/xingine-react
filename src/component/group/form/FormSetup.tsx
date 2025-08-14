import {Form, FormInstance, Input} from "antd";
import React, { useState, useCallback,useRef,useEffect } from "react";
import { ExtraProps, renderField } from "./FormGroup.map";
import { NamePath } from "antd/es/form/interface";
import { formGroup } from "./FormGroup";
import { shouldRenderField } from "./FormGroup.utils";
import { useNavigate } from "react-router-dom";
import {
    FormMeta,
    FieldMeta,
    ButtonTypeProperties,
    runAction,
    ActionExecutionContext,
    Actions,
    resolveSluggedPath
} from "xingine";
import { dynamicShapeDecoder } from "xingine";
import { post } from "../../../xingine-react.service";
import {JsonViewerRenderer} from "../JsonViewerRenderer";
import {useFormContext} from "./FormContextBureau";


export const FormSetup: React.FC<
    FormMeta
> = (meta) => {
    const { dispatch, showJsonEditor = false } = meta;
    const formContext = useFormContext();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jsonData, setJsonData] = useState<Record<string, unknown>>({});
    const formSubmissionSuccessRedirectionPath = '';
    const namedPathPayload = dispatch?.onSuccessRedirectTo?.payloadNamePath;
    const isUpdatingFromJson = useRef(false);  // prevent recursion
    const isUpdatingFromForm = useRef(false);  // prevent recursion


    const executionContext = formContext.executionContext;
    // Memoize sorted fields to avoid sorting on every change
    const sortedFields = React.useMemo(
        () => meta.fields.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        [meta.fields]
    );

    // Track previous form data to optimize conditional renderi
    // Helper function to check if conditional fields actually changed values
    useEffect(() => {
        let mounted = true;

        const initializeForm = async () => {
            if (!mounted) return;

            const onLoad = meta.event?.onInit;

            if (onLoad) {
                try {
                    // Execute onLoad action and wait for completion
                    await runAction(onLoad, {...executionContext, formActionContext: formContext});


                } catch (error) {
                    console.error("Error during onLoad actions:", error);
                }
            }
        };

        initializeForm();

        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [filteredFields, setFilteredFields] = useState<FieldMeta[]>([]); // Start with empty array



    useEffect(() => {
        const filterFields = async () => {
            // Always use initial form data for this effect - this preserves original behavior
            const formData = formContext.getInitialFormData;
            const executionContext = formContext.executionContext;

            // Skip evaluation if initial data is empty
            if (!formData || Object.keys(formData).length === 0) {
                setFilteredFields(sortedFields); // Create new array reference to force re-render
                return;
            }

            // Update JSON viewer with initial form data
            setJsonData(formData);

            // Evaluate each field's visibility
            const shouldRenderResults = await Promise.all(
                sortedFields.map(field => shouldRenderField(field, formData, executionContext))
            );

            // Filter out fields that should not be rendered
            const visibleFields = sortedFields.filter((_, index) => shouldRenderResults[index]);
            setFilteredFields([...visibleFields]); // Create new array reference to force re-render
        };

        filterFields();
    }, [formContext.getInitialFormData, formContext.lastFormUpdateTime, sortedFields, executionContext]); // React to form changes


    // Additional effect to handle form value changes and update filtered fields
   /* useEffect(() => {
        const updateFilteredFieldsOnFormChange = async () => {
            // Only run if we have initial data and the form is initialized
            const initialData = formContext.getInitialFormData;
            if (!initialData || Object.keys(initialData).length === 0 || !formContext.form) {
                return;
            }

            // Get current form values
            const currentFormValues = formContext.form.getFieldsValue();

            // Merge current form values with initial data as fallback
            const formData = { ...initialData, ...currentFormValues };

            // SIMPLIFIED FIX: Only do conditional field restoration when absolutely necessary
            // Check if any conditional fields are missing and need restoration
            let needsFormStateSync = false;
            const conditionalFields = sortedFields.filter(field => field.conditionalRender?.condition);

            // Only restore fields if we're not currently updating from JSON AND a field restoration is actually needed
            if (!isUpdatingFromJson.current) {
                for (const field of conditionalFields) {
                    const condition = field.conditionalRender?.condition;
                    if (!condition || typeof condition !== 'object') continue;

                    // Check if this field should be visible based on current form data
                    const shouldBeVisible = await shouldRenderField(field, formData, executionContext);

                    // Only restore if field should be visible, is missing from form, but exists in initial data
                    if (shouldBeVisible &&
                        currentFormValues[field.name] === undefined &&
                        initialData[field.name] !== undefined &&
                        !isUpdatingFromForm.current) {

                        // Restore the field value
                        formContext.form.setFieldValue(field.name, initialData[field.name]);
                        formData[field.name] = initialData[field.name];
                        needsFormStateSync = true;
                        console.log(`🔧 Restored field "${field.name}" based on conditional logic`);

                        // For object/nested fields, also restore nested structure
                        if (field.inputType === 'object' && typeof initialData[field.name] === 'object') {
                            const nestedData = initialData[field.name] as Record<string, any>;
                            Object.keys(nestedData).forEach(nestedKey => {
                                formContext.form.setFieldValue([field.name, nestedKey], nestedData[nestedKey]);
                            });
                            console.log(`🔧 Restored nested data for field "${field.name}":`, nestedData);
                        }
                    }
                }
            }

            // Always evaluate field visibility for proper rendering
            const shouldRenderResults = await Promise.all(
                sortedFields.map(field => shouldRenderField(field, formData, executionContext))
            );

            // Filter out fields that should not be rendered
            const visibleFields = sortedFields.filter((_, index) => shouldRenderResults[index]);
            setFilteredFields([...visibleFields]);

            console.log('Filtered fields updated due to form change:', {
                visibleFieldNames: visibleFields.map(f => f.name),
                needsFormStateSync,
                isUpdatingFromJson: isUpdatingFromJson.current,
                isUpdatingFromForm: isUpdatingFromForm.current
            });

            // Only trigger additional updates if we actually restored something
            if (needsFormStateSync) {
                setTimeout(() => {
                    formContext.setLastFormUpdateTime();
                }, 100);
            }
        };

        updateFilteredFieldsOnFormChange();
    }, [formContext.lastFormUpdateTime, sortedFields, executionContext, formContext]); // Trigger when form values change

*/
    // Handle form data changes for conditional rendering and JSON viewer
    const handleValuesChange = useCallback(
        async (
            changed: Record<string, unknown>,
            all: Record<string, unknown>
        ) => {
            // Prevent recursion when updating from JSON
            if (isUpdatingFromJson.current) {
                console.log('⏭️ Skipping form update - JSON is currently updating');
                return;
            }
            formContext.setLastFormUpdateTime();



        }, [formContext, sortedFields, executionContext]
    );

   /* useEffect(() => {
        console.info("FormSetup useEffect - lastFormUpdateTime changed:", formContext.lastFormUpdateTime);
        setJsonData(formContext.getFormData());
    }, [formContext.lastFormUpdateTime]);*/

    // Handle JSON data changes - Bidirectional binding with recursion prevention
    const handleJsonChange = useCallback(async (newJsonData: Record<string, unknown>) => {
        console.log("JSON changed by user, updating form:", newJsonData);

        // Prevent recursion when updating from form
        if (isUpdatingFromForm.current) {
            console.log("⏭️ Skipping JSON update - form is currently updating");
            return;
        }

        // Set flag to indicate we're updating from JSON
        isUpdatingFromJson.current = true;

        try {
            // Update the form data
            formContext.setFormData(newJsonData);

            // DON'T update setJsonData here to avoid cursor position issues
            // The JSON viewer should maintain its own state when user is editing

            // Trigger form update to ensure conditional rendering works
            formContext.setLastFormUpdateTime();

            console.log("✅ JSON update completed successfully");
        } finally {
            // Always reset the flag after the update completes
            setTimeout(() => {
                isUpdatingFromJson.current = false;
                console.log("🔓 JSON update flag reset - conditional rendering re-enabled");
            }, 100);
        }

    }, [formContext]);

    const defaultFinish = async (
        values: Record<string, unknown>,
    ): Promise<void> => {

        const result = await post<Record<string, unknown>, unknown>(
            values,
            dynamicShapeDecoder,
            meta.action,
        );

        result.match({
            ok: (res) => {
                console.log("the res", res);
                if (dispatch && formSubmissionSuccessRedirectionPath) {
                    navigate(
                        resolveSluggedPath(
                            formSubmissionSuccessRedirectionPath,
                            res,
                            namedPathPayload,
                        ),
                    );
                }
            },
            err: (e) => {
                console.log("the errors", e);
            },
        });
    };

    const onFinish = async (values: Record<string, unknown>): Promise<void> => {
        setIsSubmitting(true);
        const actionToCall = meta.onFinish ? meta.onFinish : defaultFinish;
        try {
            // await actionToCall(values);
        } finally {
            setIsSubmitting(false);
        }
    };

    const buttonProps: ButtonTypeProperties & ExtraProps = {
        text: "Submit",
        type: "primary",
        isSubmitting: isSubmitting
    };

    // Create conditional form group with current form data
    // Render form content using FormGroup with trigger-based conditional rendering
    const renderForm = () => (
        <Form
            form={formContext.form as FormInstance}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={handleValuesChange}
        >
            {/* Use filteredFields instead of sortedFields for conditional rendering */}
            {formGroup(filteredFields, isSubmitting)}
            <Form.Item key="submit" name={"submit" as NamePath}>
                {renderField('button', buttonProps)}
            </Form.Item>
        </Form>
    );

    // Render with JSON editor if enabled
    if (showJsonEditor) {
        return (
            <div className="flex gap-6">
                <div className="flex-1">
                    {/*<pre style={{fontSize: '12px', background: '#f5f5f5', padding: '10px', marginBottom: '10px'}}>
                        lastFormUpdateTime: {formContext.lastFormUpdateTime}

                        getInitialFormData: {JSON.stringify(formContext.getInitialFormData,null,2)}

                        filteredFields: {JSON.stringify(filteredFields.map(f => ({name: f.name, inputType: f.inputType, conditionalRender: f.conditionalRender})),null,2)}

                        sortedFields: {JSON.stringify(sortedFields.map(f => ({name: f.name, inputType: f.inputType, conditionalRender: f.conditionalRender})),null,2)}
                    </pre>*/}
                    {renderForm()}
                </div>
                <div className="flex-1">
                    <JsonViewerRenderer
                        data={jsonData}
                        title="Form Data (Live Preview)"
                        onChange={handleJsonChange}
                        editable={true}
                    />

                </div>
            </div>
        );
    }

    return renderForm();
};
