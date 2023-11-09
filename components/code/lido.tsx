import { VmComponent } from '@/components/vm/VmComponent';

export function Lido(props: any) {
  return (
    <div
      className={props.className + ' relative w-max h-max bos'}
    >
      <VmComponent src="achildhoodhero.near/widget/lido.stake.bos" props={props.componentProps} />
    </div>
  );
}
