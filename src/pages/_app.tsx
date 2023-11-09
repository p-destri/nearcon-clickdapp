import '@/styles/theme.css';
import '@/styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@near-wallet-selector/modal-ui/styles.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useBosLoaderInitializer } from '@/hooks/useBosLoaderInitializer';
import { useHashUrlBackwardsCompatibility } from '@/hooks/useHashUrlBackwardsCompatibility';
import type { NextPageWithLayout } from '@/utils/types';
// import { connect, keyStores, KeyPair, providers } from "near-api-js";
// import { Buffer } from "buffer";


// export const viewFunction = async (
//   nodeUrl: string,
//   contractId: string,
//   methodName: string,
//   args: any = {}
// ) => {
//   const provider = new providers.JsonRpcProvider({ url: nodeUrl });

//   const serializedArgs = Buffer.from(JSON.stringify(args)).toString("base64");

//   const res = (await provider.query({
//     request_type: "call_function",
//     account_id: contractId,
//     method_name: methodName,
//     args_base64: serializedArgs,
//     finality: "optimistic",
//   })) as any;

//   const result = JSON.parse(Buffer.from(res.result).toString());

//   console.log('result', result)
// };

const VmInitializer = dynamic(() => import('../components/vm/VmInitializer'), {
  ssr: false,
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  useBosLoaderInitializer();
  useHashUrlBackwardsCompatibility();

  return (
    <div>
      <VmInitializer />

      <Component {...pageProps} />
    </div>
  );
}
