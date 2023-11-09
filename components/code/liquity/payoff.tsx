import React from 'react';
import { VmComponent } from '@/components/vm/VmComponent';
import { useVMContext } from '@/vm-context';

export const payoffMeta: any = {
  name: 'bos-liquity-payoff',
  displayName: '[Liquity] Payoff',
  importPath: '@/components/code',
  importName: 'Payoff',
  defaultStyles: {
    padding: '16px',
    display: 'flex',
    'min-width': '300px',
    flexDirection: 'column',
    'border-radius': '12px',
    background: 'linear-gradient(0deg,#202428D1 0%,#202428 100%)',
  },
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
    button: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-button',
          type: "component",
        }
      ]
    },
  },
};

export function Payoff(props: any) {
  const context = useVMContext()

  const renderPlasmicElement = (element: any, values: any) => {
    return React.cloneElement(props[element], values)
  }

  return (
    <VmComponent
      src="1mateus.testnet/widget/payoff"
      props={{
        ...context,
        renderPlasmicElement,
        plasmicRootClassName: props.className,
      }}
    />
  );
}
