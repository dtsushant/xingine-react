import {Form, FormInstance, Input} from "antd";
import React, { useState, useCallback,useRef,useEffect } from "react";
import { ExtraProps, renderField } from "./FormGroup.map";
import { NamePath } from "antd/es/form/interface";
import { formGroup } from "./FormGroup";
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
import {useActionExecutionContext} from "../../../context/HierarchicalActionContext";
import {JsonViewerRenderer} from "../JsonViewerRenderer";
import {useFormContext} from "./FormContextBureau";

const shouldRenderField = async (field: FieldMeta, formData: Record<string, unknown>, ctx: ActionExecutionContext): Promise<boolean> => {
    // If no conditional render config, always show
    if (!field.conditionalRender?.condition) return true;

    // Implement basic conditional logic for the specific conditions we're using
    const condition = field.conditionalRender.condition;

    try {
        // Use the showHide action with comprehensive logging for debugging
        console.log(`🔍 Evaluating condition for field '${field.name}':`, condition);
        console.log(`📊 Form data for evaluation:`, formData);

        const sh = await runAction(Actions.showHide(formData, condition).build(), ctx);
        const result = !!sh && sh.success && Boolean(sh.result);

        console.log(`✅ Field '${field.name}' visibility result:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Error evaluating condition for field '${field.name}':`, error);
        // Default to visible on error to prevent fields from disappearing unexpectedly
        return true;
    }
}



// Enhanced form group that filters fields based on xingine's conditional rendering
const createConditionalFormGroup = (formData: Record<string, unknown>, ctx:ActionExecutionContext) => {
    return async (fields: FieldMeta[], isSubmitting: boolean, parentName?: NamePath, callingField?: FieldMeta) => {
        // Filter fields based on xingine's built-in conditional rendering system
        const shouldRenderResults = await Promise.all(
            fields.map(field => shouldRenderField(field, formData, ctx))
        );
        const filteredFields = fields.filter((_, idx) => shouldRenderResults[idx]);

        // Use the existing formGroup function which handles all field types properly
        return formGroup(filteredFields, isSubmitting, parentName, callingField);
    };
};

export const FormSetup: React.FC<
    FormMeta
> = (meta) => {
    const { dispatch, showJsonEditor = false } = meta;
    const formContext = useFormContext();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [renderConditionChanged, setRenderConditionChanged] = useState(false);
    const [fieldsWithCondition, setFieldsWithCondition] = useState<string[]>([]);
    const [jsonData, setJsonData] = useState<Record<string, unknown>>({});
    const [renderedFields, setRenderedFields] = useState<React.ReactNode>(null);
    const formSubmissionSuccessRedirectionPath = '';
    const namedPathPayload = dispatch?.onSuccessRedirectTo?.payloadNamePath;
    const isUpdatingFromJson = useRef(false);  // prevent recursion
    const isUpdatingFromForm = useRef(false);  // prevent recursion

    const {lastFormUpdateTime} = formContext;

    const executionContext = useActionExecutionContext();
    // Memoize sorted fields to avoid sorting on every change
    const sortedFields = React.useMemo(
        () => meta.fields.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        [meta.fields]
    );

    // Identify fields with conditional rendering on component mount
    useEffect(() => {
        const fieldsWithConditions = sortedFields
            .filter(field => field.conditionalRender?.condition)
            .map(field => field.name);

        // Also identify fields that other fields depend on (dependency fields)
        const dependencyFields = sortedFields
            .filter(field => field.conditionalRender?.condition)
            .map(field => {
                const condition = field.conditionalRender?.condition;
                if (condition && typeof condition === 'object' && 'field' in condition) {
                    return (condition as any).field;
                }
                return null;
            })
            .filter(Boolean);

        // Combine both types of fields for tracking
        const allRelevantFields = [...new Set([...fieldsWithConditions, ...dependencyFields])];

        console.log("Fields with conditional rendering:", fieldsWithConditions);
        console.log("Dependency fields (that affect conditions):", dependencyFields);
        console.log("All fields to track for conditional rendering:", allRelevantFields);
        setFieldsWithCondition(allRelevantFields);
    }, [sortedFields]);

    // Helper function to check if any conditional field changed
    const hasConditionalFieldChanged = useCallback((changedFields: Record<string, unknown>): boolean => {
        const changedFieldNames = Object.keys(changedFields);
        const hasConditionalChange = changedFieldNames.some(fieldName =>
            fieldsWithCondition.includes(fieldName)
        );

        console.log("Changed fields:", changedFieldNames);
        console.log("Fields with conditions:", fieldsWithCondition);
        console.log("Has conditional field changed:", hasConditionalChange);

        return hasConditionalChange;
    }, [fieldsWithCondition]);

    // Track previous form data to optimize conditional rendering
    const previousFormDataRef = useRef<Record<string, unknown>>({});
    const lastConditionalRenderTimeRef = useRef<number>(0);

    // Helper function to check if conditional fields actually changed values
    const hasConditionalFieldsChanged = useCallback((currentData: Record<string, unknown>): boolean => {
        const previous = previousFormDataRef.current;

        // For the first time (initial load), always consider it changed if we have meaningful data
        if (Object.keys(previous).length === 0 && Object.keys(currentData).length > 0) {
            console.log("🚀 Initial form data detected, triggering conditional rendering");
            previousFormDataRef.current = { ...currentData };
            return true;
        }

        // Check if any conditional or dependency fields have different values
        const hasChanges = fieldsWithCondition.some(fieldName => {
            const currentValue = currentData[fieldName];
            const previousValue = previous[fieldName];
            const changed = currentValue !== previousValue;

            if (changed) {
                console.log(`🔄 Conditional field '${fieldName}' changed:`, previousValue, "->", currentValue);
            }

            return changed;
        });

        if (hasChanges) {
            // Update the reference for next comparison
            previousFormDataRef.current = { ...currentData };
        }

        return hasChanges;
    }, [fieldsWithCondition]);

    // Function to re-render conditional fields
    const updateConditionalRendering = useCallback(async (formData: Record<string, unknown>) => {
        console.log("🎯 Updating conditional rendering with data:", formData);

        // Always sync JSON viewer FIRST
        setJsonData(formData);

        const conditionalFormGroupWithDefaults = createConditionalFormGroup(formData, executionContext);
        const fields = await conditionalFormGroupWithDefaults(sortedFields, isSubmitting);
        setRenderedFields(fields);
        setRenderConditionChanged(false);

        lastConditionalRenderTimeRef.current = Date.now();
    }, [executionContext, sortedFields, isSubmitting]);

    useEffect(() => {
        let mounted = true;

        const initializeForm = async () => {
            if (!mounted) return;

            const onLoad = meta.event?.onInit;

            if (onLoad) {
                try {
                    // Execute onLoad action and wait for completion
                    const results = await runAction(onLoad, {...executionContext, formActionContext: formContext});
                    console.log("🚀 onLoad results:", results);

                    if (!mounted) return;

                    // Wait longer for form state to synchronize after API call
                    await new Promise(resolve => {
                        requestAnimationFrame(() => {
                            setTimeout(resolve, 500); // Increased delay for API call completion
                        });
                    });

                    // Force a render condition change after onLoad completes
                    console.info("🔄 Triggering conditional rendering after onLoad completion");
                    setRenderConditionChanged(true);

                } catch (error) {
                    console.error("Error during onLoad actions:", error);
                }
            } else {
                // If no onLoad, still trigger initial rendering
                setRenderConditionChanged(true);
            }
        };

        initializeForm();

        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        console.info("i am triggered on every form update time change",renderConditionChanged, lastFormUpdateTime,formContext.getFormData());

    },[lastFormUpdateTime,renderConditionChanged])

    // Optimized effect: Only trigger conditional rendering when conditional fields actually change values
    useEffect(() => {
        const currentFormData = formContext.getFormData();

        // Skip if form data is empty (initial state)
        if (!currentFormData || Object.keys(currentFormData).length === 0) {
            return;
        }

        // Check if conditional fields actually changed values (not just timestamp)
        const shouldRender = hasConditionalFieldsChanged(currentFormData);

        if (shouldRender) {
            console.log("🎯 Conditional fields changed, updating conditional rendering");

            // Ensure hasCompanyInfo is properly set for business accounts
            if (currentFormData.accountType === 'business' && !('hasCompanyInfo' in currentFormData)) {
                console.log("⚠️ Auto-setting hasCompanyInfo for business account");
                currentFormData.hasCompanyInfo = true;
                formContext.setFormData(currentFormData);
                return; // This will trigger another update cycle
            }

            updateConditionalRendering(currentFormData);
        } else {
            // Even if conditional rendering doesn't change, still sync JSON viewer
            setJsonData(currentFormData);
            console.log("📊 JSON viewer synced without conditional re-render");
        }
    }, [lastFormUpdateTime, hasConditionalFieldsChanged, formContext, updateConditionalRendering]);

    // Trigger conditional rendering when renderConditionChanged flag is set (for initial load)
    useEffect(() => {
        if (renderConditionChanged) {
            const currentFormData = formContext.getFormData();
            console.log("🔄 Render condition flag triggered, updating conditional rendering");
            updateConditionalRendering(currentFormData);
        }
    }, [renderConditionChanged, formContext, updateConditionalRendering]);

    // Additional effect: Handle interactive form changes that may need conditional re-rendering
    useEffect(() => {
        // When form values change interactively, we need to ensure conditional rendering stays consistent
        const currentFormData = formContext.getFormData();

        if (currentFormData && Object.keys(currentFormData).length > 0) {
            // Force conditional rendering update for interactive changes to ensure consistency
            const isBusinessAccount = currentFormData.accountType === 'business';

            // Ensure hasCompanyInfo is correctly set based on account type
            if (isBusinessAccount && !currentFormData.hasCompanyInfo) {
                console.log("🔄 Interactive change detected: setting hasCompanyInfo for business account");
                const updatedData = { ...currentFormData, hasCompanyInfo: true };
                formContext.setFormData(updatedData);
            } else if (!isBusinessAccount && currentFormData.hasCompanyInfo) {
                console.log("🔄 Interactive change detected: clearing hasCompanyInfo for non-business account");
                const updatedData = { ...currentFormData };
                delete updatedData.hasCompanyInfo;
                formContext.setFormData(updatedData);
            }
        }
    }, [formContext]);

    // Handle form data changes for conditional rendering and JSON viewer
    const handleValuesChange = useCallback(
        async (
            changed: Record<string, unknown>,
            all: Record<string, unknown>
        ) => {
            // Prevent recursion when updating from JSON
            if (isUpdatingFromJson.current) {
                return;
            }

            // Set flag to indicate we're updating from form
            isUpdatingFromForm.current = true;

            try {
                // Always update JSON data to reflect form changes FIRST
                setJsonData(all);

                // Check if any conditional field changed - optimize rendering
                const shouldUpdateConditionalRendering = hasConditionalFieldChanged(changed);

                if (shouldUpdateConditionalRendering) {
                    console.log("🎯 Interactive conditional field changed, forcing consistent re-render");

                    // Handle accountType changes with proper field consistency
                    if ('accountType' in changed) {
                        console.log("🔄 AccountType changed to:", all.accountType);

                        // Create updated form data with proper hasCompanyInfo field
                        let updatedFormData = { ...all };

                        if (updatedFormData.accountType === 'business') {
                            updatedFormData.hasCompanyInfo = true;
                            console.log("🔄 Setting hasCompanyInfo=true for business account");
                        } else {
                            // Remove hasCompanyInfo for non-business accounts
                            if ('hasCompanyInfo' in updatedFormData) {
                                delete updatedFormData.hasCompanyInfo;
                                console.log("🔄 Removing hasCompanyInfo for non-business account");
                            }
                        }

                        // Set flag to prevent recursive updates during this operation
                        const wasUpdatingFromForm = isUpdatingFromForm.current;

                        // Update form data and trigger conditional rendering without recursion
                        console.log("🔄 Updating form with consistent data:", updatedFormData);

                        // Force update the form data and JSON viewer synchronously
                        formContext.setFormData(updatedFormData);
                        setJsonData(updatedFormData);

                        // Trigger conditional rendering directly without waiting for timestamp
                        setTimeout(async () => {
                            if (wasUpdatingFromForm) {
                                await updateConditionalRendering(updatedFormData);
                            }
                        }, 50);

                    } else {
                        // For other conditional field changes, trigger immediate re-render
                        await updateConditionalRendering(all);
                    }
                } else {
                    console.log("No conditional fields changed, skipping conditional re-render");
                }

            } finally {
                // Reset flag after update is complete
                setTimeout(() => {
                    isUpdatingFromForm.current = false;
                }, 100);
            }
        },
        [hasConditionalFieldChanged, formContext, updateConditionalRendering]
    );

    // Handle JSON data changes - Bidirectional binding with recursion prevention
    const handleJsonChange = useCallback(async (newJsonData: Record<string, unknown>) => {
        console.warn("source of change", isUpdatingFromForm.current);

        // Prevent recursion when updating from form
        if (isUpdatingFromForm.current) {
            return;
        }

        // Set flag to indicate we're updating from JSON
        isUpdatingFromJson.current = true;

        try {
            // Update the JSON state
            setJsonData(newJsonData);

            console.warn("the json data here is", newJsonData);

            // Update form fields with new JSON data - THIS IS THE CRITICAL FIX
            // Use setTimeout to ensure the form is ready and avoid timing issues
            setTimeout(() => {
                try {
                    formContext.setFormData(newJsonData);
                    console.warn("Successfully set form values:", newJsonData);
                } catch (error) {
                    console.error("Error setting form values:", error);
                }
            }, 0);

            // Re-render conditional fields based on new data
            const cfg = createConditionalFormGroup(newJsonData, executionContext);
            const fields = await cfg(sortedFields, isSubmitting);
            setRenderedFields(fields);

            // REMOVED: Don't force form re-render as it interferes with setFieldsValue
            // setFormKey(prev => prev + 1);
        } finally {
            // Reset flag after update is complete with a small delay to ensure form update completes
            setTimeout(() => {
                isUpdatingFromJson.current = false;
            }, 50);
        }
    }, [formContext, executionContext, sortedFields, isSubmitting]);

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
    // Render form content with a key to force re-mounts
    const renderForm = () => (
        <Form
            form={formContext.form as FormInstance}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={
                handleValuesChange
            }
        >
            {/* Await the async function returned by conditionalFormGroup */}
            {/* Use a React state to store and render the filtered fields */}
            {renderedFields}
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
