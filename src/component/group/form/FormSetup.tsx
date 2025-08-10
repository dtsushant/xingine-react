import {Form, FormInstance, Input} from "antd";
import React, { useState, useCallback,useRef,useEffect } from "react";
import { ExtraProps, renderField } from "./FormGroup.map";
import { NamePath } from "antd/es/form/interface";
import { formGroup } from "./FormGroup";
import { useNavigate } from "react-router-dom";
import {FormMeta, FieldMeta, ButtonTypeProperties, runAction, ActionExecutionContext, Actions} from "xingine";
import { dynamicShapeDecoder, resolveDynamicPath } from "xingine";
import { post } from "../../../xingine-react.service";
import {useActionExecutionContext} from "../../../context/HierarchicalActionContext";
import {JsonViewerRenderer} from "../JsonViewerRenderer";
import {useFormContext} from "./FormContextBureau";

const shouldRenderField = async (field: FieldMeta, formData: Record<string, unknown>, ctx:ActionExecutionContext): Promise<boolean> => {
    // If no conditional render config, always show
    if (!field.conditionalRender?.condition) return true;

    // Implement basic conditional logic for the specific conditions we're using
    const condition = field.conditionalRender.condition;

    // Handle simple field equality conditions
    const sh = await runAction(Actions.showHide(formData,condition).build(), ctx)
    return !!sh && sh.success && Boolean(sh.result);
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
    const [jsonData, setJsonData] = useState<Record<string, unknown>>({});
    const [renderedFields, setRenderedFields] = useState<React.ReactNode>(null);
    const formSubmissionSuccessRedirectionPath = '';
    const namedPathPayload = dispatch?.onSuccessRedirectTo?.payloadNamePath;
    const isUpdatingFromJson = useRef(false);  // prevent recursion
    const isUpdatingFromForm = useRef(false);  // prevent recursion


    const executionContext = useActionExecutionContext();
    // Memoize sorted fields to avoid sorting on every change
    const sortedFields = React.useMemo(
        () => meta.fields.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        [meta.fields]
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (mounted) {

                const onLoad = meta.event?.onInit;
                if(onLoad){
                    try {
                        const results = await runAction(onLoad,{...executionContext, formActionContext: formContext});
                        console.log("onLoad results:", results);
                    } catch (error) {
                        console.error("Error during onLoad actions:", error);
                    }
                }

                const conditionalFormGroupWithDefaults = createConditionalFormGroup(formContext.getFormData(), executionContext);
                const fields = await conditionalFormGroupWithDefaults(
                    sortedFields,
                    isSubmitting
                );
                setRenderedFields(fields);


                console.warn("Default values set successfully");
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);





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
                // Only create the conditional form group once per value change
                const cfg = createConditionalFormGroup(all, executionContext);
                const fields = await cfg(sortedFields, isSubmitting);
                setRenderedFields(fields);

                // Update JSON data to reflect form changes
                setJsonData(all);

                //  meta.onValuesChange?.(changed, all);
            } finally {
                // Reset flag after update is complete
                isUpdatingFromForm.current = false;
            }
        },
        [executionContext, isSubmitting, meta.onValuesChange, sortedFields]
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
                        resolveDynamicPath(
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
