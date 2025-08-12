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

    // Add state for tracking form update time
    const [lastFormUpdateTime, setLastFormUpdateTime] = React.useState<number>(0);

    const formActionContext = useMemo<Partial<FormActionContext>>(() => ({
    form: form,

    // Form update tracking for optimized conditional rendering
    lastFormUpdateTime,
    getLastFormUpdateTime: () => lastFormUpdateTime,

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

    getFormData: () => {
      const data = form.getFieldsValue();
      console.log('Getting form data:', data);
      return data;
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

  }), [form, onSubmit, executionContext, lastFormUpdateTime]); // Added lastFormUpdateTime to dependency array

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
