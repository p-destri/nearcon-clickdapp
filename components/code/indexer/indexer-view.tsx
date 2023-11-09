import React from 'react';
import { VmComponent } from '@/components/vm/VmComponent';
import { useVMContext } from '@/vm-context';

export const indexerViewMeta = {
  name: 'bos-indexer-view',
  displayName: '[BOS] Indexer View',
  importPath: '@/components/code',
  importName: 'IndexerView',
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

export function IndexerView (props: any) {
  const context = useVMContext()

  const renderPlasmicElement = (element: any, values: any) => {
    return React.cloneElement(props[element], values)
  }

  return (
    <VmComponent
      src="1mateus.testnet/widget/indexer-view"
      props={{
        ...context,
        renderPlasmicElement,
        plasmicRootClassName: props.className,
        registry: "dev-queryapi.dataplatform.near",
        endpoint: "https://queryapi-hasura-graphql-mainnet-vcqilefdcq-ew.a.run.app",
      }}
    />
  );
}
