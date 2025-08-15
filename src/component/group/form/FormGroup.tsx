import {ObjectFieldProps, renderField} from "./FormGroup.map";
import { Form } from "antd";
import { NamePath } from "antd/es/form/interface";
import {
  generateRules,
  shouldRenderField,
} from "./FormGroup.utils";
import React, { useState, useEffect } from "react";
import {
  FieldInputTypeProperties,
  FieldMeta,
  ObjectListFieldProperties,
} from "xingine";
import { useFormContext } from "./FormContextBureau";

// Props interface for the FormGroup component
export interface FormGroupProps {
  fields: FieldMeta[];
  isSubmitting: boolean;
  parentName?: NamePath;
  callingField?: FieldMeta;
}

// React component that can safely use useFormContext
export const FormGroup: React.FC<FormGroupProps> = ({
  fields,
  isSubmitting,
  parentName = [],
}) => {
  const formContext = useFormContext();

  return (
    <>
      {fields.map((field) => {

        const fullFieldName: NamePath = [...parentName, field.name];
        const combinedProps = {
          ...field.properties,
          isSubmitting,
          parentName,
          label: field.label,
          name: fullFieldName,
        };

          // Object (Nested Form Group)
        if (field.inputType === "object") {
          return renderField("object", {
            ...combinedProps,
            callingField: field
          } as ObjectFieldProps);
        }

        // Object List
        if (field.inputType === "object[]") {
          return (
              <Form.Item
                  key={field.name}
                  label={field.label}
                  required={field.required}
              >
                {renderField("object[]", {
                  ...combinedProps
                } as ObjectListFieldProperties)}
              </Form.Item>
          );
        }

        // Standard Inputs
        return (
            <Form.Item
                key={field.name}
                name={fullFieldName}
                label={field.label}
                rules={generateRules(field, field.properties)}
                initialValue={field.value}
                {...(field.inputType === "checkbox"
                    ? { valuePropName: "checked" }
                    : {})}
            >
              {renderField(field.inputType as keyof FieldInputTypeProperties, combinedProps)}
            </Form.Item>
        );
      })}
    </>
  );
};

// Legacy function wrapper for backward compatibility
export function formGroup(
    fields: FieldMeta[],
    isSubmitting: boolean,
    parentName: NamePath = [],
    callingField?: FieldMeta,
): React.ReactNode {
  return (
    <FormGroup
      fields={fields}
      isSubmitting={isSubmitting}
      parentName={parentName}
      callingField={callingField}
    />
  );
}
