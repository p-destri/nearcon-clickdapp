import { VmComponent } from '@/components/vm/VmComponent';

export function ZKEVM(props: any) {
  return (
    <div
      className={props.className + ' bos'}
    >
      <VmComponent src="mattlock.near/widget/zk-evm-lp" props={props.componentProps} />
    </div>
  );
}
