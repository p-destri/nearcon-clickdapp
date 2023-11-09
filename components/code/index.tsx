export * from './gmx'
export * from './lib'
export * from './lido'
export * from './liquity'
export * from './zk-evm'
export * from './tester'
export * from './generic'
export * from './indexer'
export * from './balance'
export * from './web3connect'

// // A code component that just renders the prop
// export const CodeComponent = (props) => {
//   console.log('fucking props', props)

//   return <div className={props.className}>{props?.value || 'nada'}</div>;
// }

// // A prop control with the value and a button to update it
// export const CustomProp = ({ updateValue, value }) => (
//   <div
//     style={{
//       width: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-between',
//       padding: '0px 10px 0px 10px'
//     }}
//   >
//     <span>Value: {`${value}`}.</span>

//     <button onClick={() => updateValue(!value)} style={{ background: 'lightgray', padding: '0px 5px 0px 5px' }}>
//       Change
//     </button>
//   </div>
// );
