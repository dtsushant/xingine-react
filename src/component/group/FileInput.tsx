import React from "react";
import { FileInputField, FileInputFieldProps } from "./form/FileInputField";

/**
 * Standalone FileInput component that can be used outside of FormRenderer.
 * This component wraps FileInputField for standalone usage.
 */
export const FileInput: React.FC<FileInputFieldProps> = (props) => {
  return <FileInputField {...props} />;
};

export default FileInput;