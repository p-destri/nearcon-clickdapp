import React from 'react';
import { VmComponent } from '@/components/vm/VmComponent';
import { useVMContext } from '@/vm-context';

export const manageMeta: any = {
  name: 'bos-liquity-manage',
  displayName: '[Liquity] Manage',
  importPath: '@/components/code',
  importName: 'Manage',
  defaultStyles: {
    padding: '16px',
    display: 'flex',
    'min-width': '520px',
    flexDirection: 'column',
    'border-radius': '12px',
    background: 'linear-gradient(0deg,#202428D1 0%,#202428 100%)',
  },
  props: {
    input: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-input',
          type: "component",
        }
      ]
    },
    textLabel: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-text',
          type: "component",
        }
      ]
    },
    textInfo: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-text',
          type: "component",
        }
      ]
    },
    textValue: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-text',
          type: "component",
        }
      ]
    },
    typeButton: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-button',
          type: "component",
        }
      ]
    },
    tokenButton: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-button',
          type: "component",
        }
      ]
    },
    actionButton: {
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

export function Manage(props: any) {
  const context = useVMContext()

  const renderPlasmicElement = (element: any, values: any) => {
    return React.cloneElement(props[element], values)
  }

  return (
    <VmComponent
      src="1mateus.testnet/widget/manage"
      props={{
        ...context,
        renderPlasmicElement,
        plasmicRootClassName: props.className,
      }}
    />
  );
}
