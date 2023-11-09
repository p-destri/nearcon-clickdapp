import { Button as ButtonChakra } from "@chakra-ui/react";

export const buttonMeta = {
  name: 'ui-button',
  importName: 'Button',
  displayName: '[UI] Button',
  importPath: '@/components/code',
  props: {
    size: {
      type: "choice",
      options: ["xl", "sm", "md", "lg"],
    },
    variant: {
      type: "choice",
      options: ["ghost", "outline", "solid", "link", "unstyled"],
      defaultValue: "solid",
    },
    colorScheme: {
      type: "choice",
      options: [
        "whiteAlpha",
        "blackAlpha",
        "gray",
        "red",
        "orange",
        "yellow",
        "green",
        "teal",
        "blue",
        "cyan",
        "purple",
        "pink",
        "linkedin",
        "facebook",
        "messenger",
        "whatsapp",
        "twitter",
        "telegram",
      ],
    },
    iconSpacing: "number",
    isActive: {
      type: "boolean",
    },
    isDisabled: {
      type: "boolean",
    },
    isLoading: {
      type: "boolean",
    },
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Button",
      },
    },
  },
  defaultStyles: {
    'color': '#fff',
    'width': '100%',
    'height': '51px',
    'display': 'flex',
    'max-width': '100%',
    'font-size': '18px',
    'font-weight': '500',
    'text-align': 'left',
    'padding-top': '4px',
    'object-fit': 'cover',
    'background': '#1B6DFF',
    'padding-bottom': '4px',
    'font-family': 'Poppins',
    'flex-direction': 'row',
    'border-radius': '12px',
  }
}

export const Button = ButtonChakra
