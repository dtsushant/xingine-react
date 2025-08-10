import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { FormInstance} from 'antd';
import { FormActionContext, FormFieldSetterMeta, ActionResult, SerializableAction, runAction, ActionExecutionContext } from 'xingine';

interface FormContextBureauProps {
  form: FormInstance;
  children: React.ReactNode;
  onSubmit?: (data: Record<string, unknown>) => Promise<ActionResult>;
  executionContext?: ActionExecutionContext;
}

const FormContextBureauContext = createContext<FormActionContext | null>(null);

export const FormContextBureau: React.FC<FormContextBureauProps> = ({
  form,
  children,
  onSubmit,
  executionContext
}) => {

    const formActionContext = useMemo<Partial<FormActionContext>>(() => ({
    form:form,
    // Form data management
    setFormData: (data: Record<string, unknown>) => {
      form.setFieldsValue(data);
    },

    getFormData: () => {
      return form.getFieldsValue();
    },

    // Field management
    setFormField: ({ fieldName, value }: FormFieldSetterMeta) => {
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

      fieldsError.forEach(({ name, errors: fieldErrors }) => {
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

    submitForm: async (): Promise<ActionResult> => {
      try {
        const values = await form.validateFields();

        if (onSubmit) {
          return await onSubmit(values);
        }

        return { success: true, result: { submitted: true, data: values } };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Form validation failed'
        };
      }
    }

  }), [form, onSubmit, executionContext]);

  return (
    <FormContextBureauContext.Provider value={formActionContext as FormActionContext}>
        {children}
    </FormContextBureauContext.Provider>
  );
};

export const useFormContext = (): FormActionContext => {
  const context = useContext(FormContextBureauContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormContextBureau');
  }

  return context;
};
