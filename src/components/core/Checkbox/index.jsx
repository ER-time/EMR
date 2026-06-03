// import Proptypes from 'prop-types'
// import { Form } from "react-bootstrap";
// import { styled } from 'styled-components';

// const StyledCheck = styled(Form)`
//   label{
//     color: #666666;
//     font-size: 14px;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 110%;
//   }
// `

// export default function Checkbox({...props}){
//   return (
//     <StyledCheck>
//       <Form.Check
//         id={props.id}
//         inline={props.inline}
//         label={props.label}
//         value={props.value}
//         name={props.name}
//         type={props.type}
//         onChange={props.onChange}
//         ref={props.inputRef}
//         {...props}
//         />
//       </StyledCheck>
//   );
// };

// Checkbox.propTypes = {
//   label: Proptypes.node,
//   inline: Proptypes.bool,
//   inputRef: Proptypes.oneOfType([
//     Proptypes.object,
//     Proptypes.func,
//   ]),
//   value: Proptypes.oneOfType([
//     Proptypes.string,
//     Proptypes.number,
//     Proptypes.bool
//   ]),
//   name: Proptypes.string,
//   type: Proptypes.string,
//   onChange: Proptypes.func,
//   id: Proptypes.string,
// }

// Checkbox.defaultProps = {
//   label:null,
//   inline: true,
//   inputRef : null ,
//   value:"",
//   name :"",
//   type:"checkbox",
//   onChange: ()=>{},
//   id: '',
// };
