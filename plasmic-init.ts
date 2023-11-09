import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";

import {
  // Components
  Img,
  Card,
  // Lido,
  Text,
  Input,
  // Tester,
  Button,
  Borrow,
  Payoff,
  Manage,
  Balance,
  Checkbox,
  GenericBOS,
  IndexerView,
  IndexerList,
  Web3Connect,

  // Components Meta
  imgMeta,
  web3Meta,
  cardMeta,
  textMeta,
  inputMeta,
  buttonMeta,
  manageMeta,
  borrowMeta,
  payoffMeta,
  balanceMeta,
  checkboxMeta,
  indexerViewMeta,
  IndexerListMeta,

  // Gmx,
  // ZKEVM,
  // CustomProp,
  // CodeComponent,
} from '@/components/code'

export const PLASMIC = initPlasmicLoader({
    projects: [
      {
        id: process.env.PLASMIC_ID as string,
        token: process.env.PLASMIC_TOKEN as string
      }
    ],
    preview: process.env.NODE_ENV === 'development',
})

// Register UI
PLASMIC.registerComponent(Img, imgMeta)
PLASMIC.registerComponent(Card, cardMeta)
PLASMIC.registerComponent(Text, textMeta)
PLASMIC.registerComponent(Input, inputMeta)
PLASMIC.registerComponent(Button, buttonMeta)
PLASMIC.registerComponent(Balance, balanceMeta)
PLASMIC.registerComponent(Checkbox, checkboxMeta)

// Register Liquity components
PLASMIC.registerComponent(Borrow, borrowMeta)
PLASMIC.registerComponent(Manage, manageMeta)
PLASMIC.registerComponent(Payoff, payoffMeta)
PLASMIC.registerComponent(Web3Connect, web3Meta)

PLASMIC.registerComponent(IndexerView, indexerViewMeta)
PLASMIC.registerComponent(IndexerList, IndexerListMeta)

// PLASMIC.registerComponent(Tester, {
//   props: {},
//   name: 'bos-tester',
//   importName: 'Tester',
//   displayName: '[BOS] Tester',
//   importPath: '@/components/code',
// });

PLASMIC.registerComponent(GenericBOS, {
  name: 'bos-generic',
  displayName: '[BOS] Generic',
  props: {
      src: 'string',
      meta: {
          type: 'object',
          fields: {
            title: 'string',
            description: 'string',
          }
      },
      componentProps: 'object',
  }
});

// PLASMIC.registerComponent(Gmx, {
//   props: {},
//   name: 'bos-gmx',
//   displayName: '[BOS] Gmx',
// })

// PLASMIC.registerComponent(Lido, {
//   props: {},
//   name: 'bos-lido',
//   displayName: '[BOS] Lido',
// })

// PLASMIC.registerComponent(ZKEVM, {
//   props: {},
//   name: 'bos-zk-evm',
//   displayName: '[BOS] ZK-EVM',
// })

// // Registration
// PLASMIC.registerComponent(CodeComponent, {
//   name: 'CodeComponent',
//   props: {
//     //
//     value: {
//       type: "slot",
//       defaultValue: [
//         //
//       ]
//     }
//   },
//   actions: [
//     {
//       type: 'button-action',
//       label: 'Append new element',
//       onClick: ({ studioOps }) => {
//         console.log('studioops', studioOps)
//         studioOps.appendToSlot(
//           {
//             type: 'img',
//             src: '',
//             styles: {
//               maxWidth: '100%'
//             }
//           },
//           'value'
//         );
//       }
//     }
//   ]
// });
