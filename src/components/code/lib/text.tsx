import { Text as TextChakra } from "@chakra-ui/react";

export const textMeta = {
  name: 'ui-text',
  importName: 'Text',
  displayName: '[UI] Text',
  importPath: '@/components/code',
  props: {
    children: {
      type: "slot",
      defaultValue: [
        {
          type: "text",
          value: "Some Text",
        },
      ],
    },
  },
  defaultStyles: {
    'color': 'white',
    'font-size': '18px',
    'font-weight': '500'
  }
}

export const Text = TextChakra
