interface Field {
  class: String;
  message: String;
  Value: any;
}
export const getErrorFields = (params: any) => {
  let fields: any;

  const paramKeys = Object.keys(params);
  paramKeys.forEach((field: any) => {
    fields = {
      ...fields,
      [field]: { class: "", message: "" },
    };
  });

  return fields;
};
export const setErrorField = (field: Field, errMessage: String) => {
  const message = field?.message
    ? field.message + ", " + errMessage
    : errMessage;

  return { ...field, class: "is-invalid", message };
};
