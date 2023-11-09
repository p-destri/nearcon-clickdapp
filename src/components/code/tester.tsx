import React from 'react';
import { VmComponent } from '@/components/vm/VmComponent';
import { useVMContext } from '@/vm-context';

export function Tester(props: any) {
  const context = useVMContext()

  return (
    <VmComponent
      src="1mateus.testnet/widget/tester"
      props={{
        ...context,
        plasmicRootClassName: props.className,
      }}
    />
  );
}
