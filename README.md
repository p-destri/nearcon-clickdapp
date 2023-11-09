# Clickdapp
The clickdapp is a repository that implements Plasmic App Hosting and Near VM to provides powerful tools to make dapps with Plasmic Studio.

## Plasmic App Host
The Plasmic App Host is a hosting solution for applications built on the Plasmic platform, streamlining the deployment and management of web user interfaces. It acts as a container that encapsulates the application, handling the necessary infrastructure to keep the UI available online without the developer needing to manage servers and maintenance.

## BOS
The BOS is a development platform that provides an environment for the rapid construction and deployment of decentralized applications (dApps). It is centered around on-chain hosted Components, enabling developers to efficiently create interactive user interfaces for smart contracts. With the capability to operate across multiple blockchains, BOS supports a chain-agnostic approach, encouraging code reusability and the composition of dApps, enhancing censorship resistance and security through code transparency and auditability.

## Rendering a BOS Component on Plasmic
Code components in Plasmic allow developers to extend the functionality of the Plasmic no-code editor with custom logic and integrations. Using the functionalities of Plasmic code components, I created a custom component capable of rendering a BOS component, taking advantage of the integration with the NEAR Virtual Machine (VM).

Like this:

```bash
import { VmComponent } from '@/components/vm/VmComponent';

const exampleMeta = {
  name: 'bos-example',
  displayName: '[BOS] Example',
  importPath: '@/components/code',
  importName: 'Example',
}

const Example = (props) => {
  return (
    <VmComponent
      src="example/path/to/bos"
      props={props}
    />
  )
}
```

## BOS Customizable
When you register a code component in Plasmic, the first parameter is the React component function or class that you wish to register for use within the Studio.

The second parameter meta is an object containing metadata about the component. Within the Metadata object, we have the Prop property through which you can specify a lot of metadata about each prop of your code component; this helps Plasmic understand what each prop expects as an argument, so that Plasmic can generate the right UI in the Studio for users to configure these props.

Like this:

```bash
import { VmComponent } from '@/components/vm/VmComponent';

const exampleMeta = {
  name: 'bos-example',
  displayName: '[BOS] Example',
  importPath: '@/components/code',
  importName: 'Example',
  props: {
    name: {
      type: "string",
      defaultValue: "someQuestion",
      description: "The question name this radio group controls",
    },
  },
}

const Example = (props) => {
  return (
    <VmComponent
      src="example/path/to/bos"
      props={props}
    />
  )
}

PLASMIC.registerComponent(Example, exampleMeta)
```

Within the props property of the Metadata object, there is a special property type named "slot" which accepts a value of ReactNode. This functions just like the normal component slots in Plasmic, designated for props that expect React elements to be passed in. This allows for the insertion of any React component or element into the slot, providing a flexible space within the custom component for Plasmic Studio users to embed their own UI elements

Like this:

```bash
const exampleMeta: = {
  name: 'bos-example',
  displayName: '[BOS] Example',
  importPath: '@/components/code',
  importName: 'Example',
  props: {
    input: {
      type: "slot",
      defaultValue: [
        {
          name: 'ui-input',
          type: "component",
        }
      ],
    },
};
```

When using the slot type in a component's props within the Plasmic metadata object, you receive, through the component's props, elements that are controlled by Plasmic. This means you can render these elements anywhere within your React component. Essentially, you can act as a proxy, passing these Plasmic-controlled components down to the BOS component.

## BOS VM Context


## Installation
ClickDapp is powered by [**Plasmic**](https://github.com/plasmicapp/plasmic).

If you have any problems configuring your enviroment, or hosting this app, remember to read the [Plasmic App Hosting Documentation](https://docs.plasmic.app/learn/app-hosting/).

-----------------

#### Steps
1) Clone the repository:
```bash
$ gh repo clone 1Mateus/ethlisbon_poc
$ cd ethlisbon_poc
```

2) Check all packages and copy the .env.example file and edit it with your environment config:
```bash
$ cp .env.example .env
```

3) Install frontend dependencies via PNPM
```bash
$ pnpm install
```

4) Start App Hosting
```bash
$ pnpm dev
```
