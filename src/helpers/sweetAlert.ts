// @ts-nocheck
import Swal from "sweetalert2";

export const confirm = async (
  title: string,
  text: string | null = null,
  confirmText: string | null = null,
  type = "question"
) => {
  const classMap = {
    success: "md-success",
    error: "md-danger",
    warning: "md-warning",
    info: "md-info",
    question: "md-primary"
  };
  const result = await Swal.fire({
    title,
    text: text || "",
    type,
    showCancelButton: true,
    confirmButtonClass: "md-button " + classMap[type],
    cancelButtonClass: "md-button ",
    confirmButtonText: confirmText || "确定",
    cancelButtonText: "取消",
    buttonsStyling: false
  });
  return result.value;
};

export const promptSelect = async (
  title: string,
  text: string,
  inputOptions: Record<string, string>,
  confirmText: string | null,
  type = "question"
) => {
  const classMap = {
    success: "md-success",
    error: "md-danger",
    warning: "md-warning",
    info: "md-info",
    question: "md-primary"
  };
  const result = await Swal.fire({
    title,
    text,
    type,
    input: "select",
    inputOptions,
    showCancelButton: true,
    confirmButtonClass: "md-button " + classMap[type],
    cancelButtonClass: "md-button ",
    confirmButtonText: confirmText || "确定",
    cancelButtonText: "取消",
    buttonsStyling: false
  });
  return result.value;
};

export const promptInput = async (
  title: string,
  text: string | null = null,
  confirmText: string | null = null,
  type = "question",
  inputType = "text",
  defaultValue: any = undefined,
  inputValidator: (value: any) => string | falsy = undefined
) => {
  const classMap = {
    success: "md-success",
    error: "md-danger",
    warning: "md-warning",
    info: "md-info",
    question: "md-primary"
  };
  const result = await Swal.fire({
    title,
    text,
    type,
    input: inputType,
    inputValue: defaultValue,
    inputValidator,
    showCancelButton: true,
    confirmButtonClass: "md-button " + classMap[type],
    cancelButtonClass: "md-button ",
    confirmButtonText: confirmText || "确定",
    cancelButtonText: "取消",
    buttonsStyling: false
  });
  return result.value;
};
