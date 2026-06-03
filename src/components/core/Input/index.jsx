"use client";

import { useMemo } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useFormControl } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

function InputField({
  placeholder = "Placeholder",
  id = "",
  type = "text",
  hasHelperText = false,
  helperText = "Helper Text",
  ...props
}) {
  const CUSTOM_STYLES = {
    color: props.color || "#1A1A1A",
    fontSize: props.size || "14px",
    fontStyle: props.style || "normal",
    fontWeight: props.weight || 400,
    lineHeight: props.lineheight || "normal",
    width: props.width || "100%",
  };
  const { InputProps, ...restProps } = props;

  return (
    <>
      <OutlinedInput
        placeholder={placeholder}
        id={id}
        type={type}
        onChange={props.onChange}
        onBlur={props.onBlur}
        inputProps={{
          style: CUSTOM_STYLES,
          ...InputProps,
        }}
        {...restProps}
      />
      {hasHelperText && <MyFormHelperText helperText={helperText} />}
    </>
  );
}

function MyFormHelperText({ helperText }) {
  const { focused } = useFormControl() || {};

  helperText = useMemo(() => {
    if (focused) {
      return "This field is being focused";
    }
    return helperText || "Helper Text Here";
  }, [focused, helperText]);

  return <FormHelperText>{helperText}</FormHelperText>;
}

export default InputField;
