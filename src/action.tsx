// export const control = ({ studioOps }) => (
//   // A form that adds a new tab with the given key
//   const [value, setValue] = React.useState();

//   console.log('fooo')

//   return (
//     <div>
//       <input
//         type="text"
//         value={value}
//         onChange={e => setValue(e.target.value)}
//         placeholder="Tab Key"
//       />

//       <button onClick={() => {
//         studioOps.appendToSlot(
//           {
//             type: "component",
//             name: "TabPanel",
//             props: {
//               tabKey: value
//             }
//           },
//           "children"
//         );
//       }}>Create new tab</button>
//     </div>
//   )
// )
