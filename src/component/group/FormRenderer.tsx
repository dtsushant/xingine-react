import {Form} from "antd";
import React from "react";
import {FormMeta} from "xingine";
import {FormSetup} from "./form/FormSetup";
import {FormContextBureau} from "./form/FormContextBureau";
import {useActionExecutionContext} from "../../context/HierarchicalActionContext";

export const FormRenderer: React.FC<
  FormMeta
> = (meta) => {
    const [form] = Form.useForm();
    const executionContext = useActionExecutionContext();


    return <FormContextBureau form={form} executionContext={executionContext}>
        <FormSetup {...meta}/>
    </FormContextBureau>
};
