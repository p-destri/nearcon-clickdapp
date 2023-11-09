import { VmComponent } from '@/components/vm/VmComponent';

export function Gmx(props: any) {
  return (
    <div
      className={props.className + ' relative w-max h-max bos'}
    >
      <VmComponent src="markeljan.near/widget/GMX" props={props.componentProps} />
    </div>
  );
}
