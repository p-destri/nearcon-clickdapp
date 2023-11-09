import { Image } from "@chakra-ui/react";

export const imgMeta = {
  name: 'ui-img',
  importName: 'Img',
  displayName: '[UI] Img',
  importPath: '@/components/code',
  props: {
    src: {
      type: "string",
      defaultValue: "https://upload.wikimedia.org/wikipedia/commons/8/86/Database-icon.svg",
    },
    fallbackSrc: {
      type: "string",
      defaultValue: "https://via.placeholder.com/150",
    },
    alt: {
      type: "string",
      defaultValueHint: "name of the image",
    },
    loading: {
      type: "choice",
      options: ["lazy", "eager"],
    },
  },
}

export const Img = Image
