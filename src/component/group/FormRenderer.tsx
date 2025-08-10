import {Form} from "antd";
import React from "react";
import {FormMeta} from "xingine";
import {FormSetup} from "./form/FormSetup";
import {FormContextBureau} from "./form/FormContextBureau";

export const FormRenderer: React.FC<
  FormMeta
> = (meta) => {
    const [form] = Form.useForm();


    return <FormContextBureau form={form}>
        <FormSetup {...meta}/>
    </FormContextBureau>
};
