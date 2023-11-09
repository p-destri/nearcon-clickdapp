import { VmComponent } from '@/components/vm/VmComponent';

export const web3Meta: any = {
  name: 'bos-web3connect',
  importName: 'Web3Connect',
  importPath: '@/components/code',
  displayName: '[BOS] Web3Connect',
  props: {
    size: {
      type: "choice",
      options: ["xl", "sm", "md", "lg"],
    },
    variant: {
      type: "choice",
      options: ["ghost", "outline", "solid", "link", "unstyled"],
      defaultValue: "solid",
    },
    colorScheme: {
      type: "choice",
      options: [
        "whiteAlpha",
        "blackAlpha",
        "gray",
        "red",
        "orange",
        "yellow",
        "green",
        "teal",
        "blue",
        "cyan",
        "purple",
        "pink",
        "linkedin",
        "facebook",
        "messenger",
        "whatsapp",
        "twitter",
        "telegram",
      ],
    },
    iconSpacing: "number",
    isActive: {
      type: "boolean",
    },
    isDisabled: {
      type: "boolean",
    },
    isLoading: {
      type: "boolean",
    },
    connectingLabel: {
      type: "string",
      defaultValue: "Connecting...",
    },
    disconnectLabel: {
      type: "string",
      defaultValue: "Disconnect",
    },
    connectLabel: {
      type: "string",
      defaultValue: "Connect",
    },
  },
};

export function Web3Connect(props: any) {
  return (
    <div>
      <VmComponent
        src="1mateus.testnet/widget/web3connect"
        props={{...props}}
      />
    </div>
  );
}
