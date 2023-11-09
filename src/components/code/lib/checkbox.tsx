import { Checkbox as CheckboxChackra } from "@chakra-ui/react";

export const checkboxMeta = {
  name: 'ui-checkbox',
  importName: 'Checkbox',
  displayName: '[UI] Checkbox',
  importPath: '@/components/code',
  props: {
    size: {
      type: "choice",
      options: ["xl", "sm", "md", "lg"],
    },
    value: {
      type: "string",
    },
    spacing: {
      type: "string",
      defaultValue: "0.5rem",
    },
    isChecked: {
      type: "boolean",
    },
    isIndeterminate: {
      type: "boolean",
    },
    isDisabled: {
      type: "boolean",
    },
    isRequired: {
      type: "boolean",
    },
    isInvalid: {
      type: "boolean",
    },
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Checkbox",
      },
    },
  },
}

export const Checkbox = CheckboxChackra
