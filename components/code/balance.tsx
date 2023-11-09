import React from 'react';
import { VmComponent } from '@/components/vm/VmComponent';
import { useVMContext } from '@/vm-context';

export const balanceMeta: any = {
  name: 'bos-balance',
  displayName: '[BOS] Balance',
  importPath: '@/components/code',
  importName: 'Balance',
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
  },
};

export function Balance(props: any) {
  const context = useVMContext()

  const renderPlasmicElement = (element: any, values: any) => {
    return React.cloneElement(props[element], values)
  }

  return (
    <VmComponent
      src="1mateus.testnet/widget/balance"
      props={{
        ...context,
        renderPlasmicElement,
        plasmicRootClassName: props.className,
      }}
    />
  );
}
