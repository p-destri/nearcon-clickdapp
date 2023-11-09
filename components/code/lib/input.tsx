import { Input as InputChakra } from "@chakra-ui/react";

export const inputMeta = {
  name: 'ui-input',
  importName: 'Input',
  displayName: '[UI] Input',
  importPath: '@/components/code',
  props: {
    size: {
      type: "choice",
      options: ["xl", "sm", "md", "lg"],
    },
    variant: {
      type: "choice",
      options: ["outline", "filled", "flushed", "unstyled"],
    },
    isDisabled: {
      type: "boolean",
    },
    isInvalid: {
      type: "boolean",
    },
    isReadOnly: {
      type: "boolean",
    },
    isRequired: {
      type: "boolean",
    },
    errorBorderColor: {
      type: "string",
      defaultValue: "red.500",
    },
    focusBorderColor: {
      type: "string",
      defaultValue: "blue.500",
    },
  },
  defaultStyles: {
    'width': '100%',
    'font-size': '18px',
    'margin-top': '16px',
    'font-weight': '500',
    'object-fit': 'cover',
    'border-width': '1px',
    'border-radius': '8px',
    'padding': '18px 16px',
    'margin-bottom': '19px',
    'font-family': 'Poppins',
    'background': '#FFFFFF00',
    'border-color': '#606466',
  }
}

export const Input = InputChakra
