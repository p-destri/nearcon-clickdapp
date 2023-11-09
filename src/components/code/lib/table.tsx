import {
  Tr as TrChakra,
  Th as ThChakra,
  Td as TdChakra,
  Table as TableChakra,
  Tbody as TbodyChakra,
  Thead as TheadChakra
} from "@chakra-ui/react";

export const tableMeta: any = {
  name: 'ui-table',
  importName: 'Table',
  displayName: '[UI] Table',
  importPath: '@/components/code',
  props: {
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
      defaultValue: "gray",
    },
    size: {
      type: "choice",
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
    variant: {
      type: "choice",
      options: ["simple", "striped", "unstyled"],
      defaultValue: "simple",
    },
    children: {
      type: "slot",
    },
  },
};

export const Table = TableChakra

export const theadMeta: any = {
  name: 'ui-table-head',
  importName: 'Thead',
  displayName: '[UI] Table Thead',
  importPath: '@/components/code',
  props: {
    children: {
      type: "slot",
    },
  },
};

export const Thead = TheadChakra

export const tbodyMeta: any = {
  name: 'ui-table-body',
  importName: 'Tbody',
  displayName: '[UI] Table Body',
  importPath: '@/components/code',
  props: {
    children: {
      type: "slot",
    },
  },
};

export const Tbody = TbodyChakra

export const trMeta: any = {
  name: 'ui-table-tr',
  importName: 'Tr',
  displayName: '[UI] Table Tr',
  importPath: '@/components/code',
  props: {
    children: {
      type: "slot",
    },
  },
};

export const Tr = TrChakra

export const tdMeta: any = {
  name: 'ui-table-td',
  importName: 'Td',
  displayName: '[UI] Table Td',
  importPath: '@/components/code',
  props: {
    isNumeric: "boolean",
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Table Cell",
      },
    },
  },
};

export const Td = TdChakra

export const thMeta: any = {
  name: 'ui-table-th',
  importName: 'Th',
  displayName: '[UI] Table Th',
  importPath: '@/components/code',
  props: {
    isNumeric: "boolean",
    children: {
      type: "slot",
      defaultValue: {
        type: "text",
        value: "Table Cell",
      },
    },
  },
};

export const Th = ThChakra
