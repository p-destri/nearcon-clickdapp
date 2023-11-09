import React from 'react';
import { VmComponent } from '@/components/vm/VmComponent';
import { useVMContext } from '@/vm-context';

export const IndexerListMeta = {
  name: 'bos-indexer-list',
  displayName: '[BOS] Indexer List',
  importPath: '@/components/code',
  importName: 'IndexerList',
  props: {
    text: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-text',
          type: "component",
        }
      ]
    },
    subtext: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-text',
          type: "component",
        }
      ]
    },
    img: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-img',
          type: "component",
        }
      ]
    },
    card: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-card',
          type: "component",
        }
      ]
    },
  },
}

export function IndexerList (props: any) {
  const context = useVMContext()

  const renderPlasmicElement = (element: any, values: any) => {
    return React.cloneElement(props[element], values)
  }

  return (
    <VmComponent
      src="1mateus.testnet/widget/indexer-list"
      props={{
        ...context,
        renderPlasmicElement,
        plasmicRootClassName: props.className,
        registry: "dev-queryapi.dataplatform.near",
      }}
    />
  );
}
