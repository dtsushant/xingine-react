import { Form } from "antd";
import React, { useState } from "react";
import {ExtraProps, fieldTypeRenderMap, renderField} from "./form/FormGroup.map";
import { NamePath } from "antd/es/form/interface";
import { formGroup } from "./form/FormGroup";
import { useNavigate } from "react-router-dom";
import { FormMeta } from "xingine/dist/core/component/component-meta-map";
import { dynamicShapeDecoder, resolveDynamicPath } from "xingine";
import {getModuleRegistryService} from "../../xingine-react.registry";
import {post} from "../../xingine-react.service";
import {ButtonTypeProperties} from "xingine/dist/core/component/form-meta-map";

export const FormRenderer: React.FC<
  FormMeta & {
    onFinish?: (values: Record<string, unknown>) => void;
    onValuesChange?: (
      changed: Record<string, unknown>,
      all: Record<string, unknown>,
    ) => void;
  }
> = (meta) => {
  const { dispatch } = meta;
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const formSubmissionSuccessRedirectionPath =
    getModuleRegistryService()?.getComponentPath(
      dispatch?.onSuccessRedirectTo!.component ?? "",
    );
  const namedPathPayload = dispatch?.onSuccessRedirectTo?.payloadNamePath;

  const defaultFinish = async (
    values: Record<string, unknown>,
  ): Promise<void> => {
    console.log("default submission", values, meta.action);

    const result = await post<Record<string, unknown>,unknown>(
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
      await actionToCall(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onValuesChange = (
    changed: Record<string, unknown>,
    all: Record<string, unknown>,
  ): void => {
    console.log("Changed:", changed);
    console.log("All:", all);
  };

  const buttonProps:ButtonTypeProperties & ExtraProps = {
    text: "Submit",
    type: "primary",
    isSubmitting:isSubmitting
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={
        meta.onValuesChange ? meta.onValuesChange : onValuesChange
      }
    >
      {formGroup(meta.fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), isSubmitting)}
      <Form.Item key="submit" name={"submit" as NamePath}>
        {renderField('button', buttonProps)}
      </Form.Item>
    </Form>
  );
};

export default FormRenderer;
