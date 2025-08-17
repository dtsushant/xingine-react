import {Form, FormInstance, Input} from "antd";
import React, { useState, useCallback,useRef,useEffect } from "react";
import { ExtraProps, renderField } from "./FormGroup.map";
import { NamePath } from "antd/es/form/interface";
import { formGroup } from "./FormGroup";
import { useNavigate } from "react-router-dom";
import {
    ButtonTypeProperties,
    resolveSluggedPath
} from "xingine";
import { dynamicShapeDecoder } from "xingine";
import { post } from "../../../xingine-react.service";
import {JsonViewerRenderer} from "../JsonViewerRenderer";
import {useFormContext} from "./FormContextBureau";


export const FormSetup: React.FC = () => {

    const formContext = useFormContext();
    const meta = formContext.formMeta;
    const { dispatch, showJsonEditor = false } = meta;
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jsonData, setJsonData] = useState<Record<string, unknown>>({});
    const formSubmissionSuccessRedirectionPath = '';
    const namedPathPayload = dispatch?.onSuccessRedirectTo?.payloadNamePath;
    const isUpdatingFromJson = useRef(false);  // prevent recursion
    const isUpdatingFromForm = useRef(false);  // prevent recursion



    // Handle JSON data changes - Bidirectional binding with recursion prevention
    const handleJsonChange = useCallback(async (newJsonData: Record<string, unknown>) => {
        console.warn("JSON changed by user, updating form:", newJsonData);

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
            isUpdatingFromJson.current = false;
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
            onFinish={formContext.onFinish}
            onValuesChange={formContext.handleValuesChange}
        >
            {/* Use filteredFields instead of sortedFields for conditional rendering */}

            {formGroup(formContext.filteredFields, isSubmitting)}
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
                    <pre style={{fontSize: '12px', background: '#f5f5f5', padding: '10px', marginBottom: '10px'}}>
                        {/*lastFormUpdateTime: {formContext.lastFormUpdateTime}

                        getInitialFormData: {JSON.stringify(formContext.getInitialFormData,null,2)}

                        filteredFields: {JSON.stringify(filteredFields.map(f => ({name: f.name, inputType: f.inputType, conditionalRender: f.conditionalRender})),null,2)}

                        sortedFields: {JSON.stringify(sortedFields.map(f => ({name: f.name, inputType: f.inputType, conditionalRender: f.conditionalRender})),null,2)}*/}
                        {/*filteredFields: {JSON.stringify(formContext.filteredFields,null,2)}*/}

                        jsonData: {JSON.stringify(jsonData, null, 2)}
                        formData: {JSON.stringify(formContext.getFormData(), null, 2)}
                    </pre>
                    {renderForm()}
                </div>
                <div className="flex-1">
                    <JsonViewerRenderer
                        data={formContext.getFormData()}
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
