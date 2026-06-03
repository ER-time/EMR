// import Proptypes from 'prop-types'
// import { useState } from "react";
// import { FormControl } from "react-bootstrap";
// import { BsEye, BsFillEyeSlashFill } from "react-icons/bs";
// import styled from "styled-components";

// const StyledInputWithIcon = styled(FormControl)`
//   background: ${(props) => props.background || "#ffffff"};
//   border-radius: ${(props) => props.borderRadius};
//   border: none !important;
//   border-color: ${(props) => props.bordercolor || "#D3CBBB"};
//   min-width: ${(props) => props.minWidth};
//   font-size: ${(props) => props.fontSize};
//   color: ${(props) => props.color};
//   line-height: ${(props) => props.lineHeight};
//   width: ${(props) => props.width};
//   height: ${(props) => props.height};
//   font-weight: ${(props) => props.fontWeight};
//   padding: ${(props) => props.padding};

//   :focus {
//     box-shadow: none;
//   }

//   ::placeholder {
//     font-size: ${(props) => props.placeholderTextSize}!important;
//     color: ${(props) => props.placeHolderColor}!important;
//   }
// `;

// const StyledInputContainer = styled.div`
//   border: ${(props) => props.border};
//   border-radius: ${(props) => props.borderRadius};
// `;

// export default function InputWithIcon({ ...props }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const inputType = (props.type === "password" && showPassword) ? "text" : props.type;

//   const handleTogglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <StyledInputContainer
//       className={`d-flex align-items-center position-relative ${props.inputRef || ""}`}
//       border={props.border}
//       borderRadius={props.borderRadius}
//       {...props}
//     >
//       {props.iconDir === "left" && props.type !== "password" && (
//         <div className="cursor-pointer ml-2">{props.icon}</div>
//       )}


//       <StyledInputWithIcon
//         {...props}
//         type={inputType}
//         ref={props.inputRef}
//         onKeyDown={props.onKeyDown}
//         value={props.value}
//         onChange={props.onChange}
//         placeholder={props.placeholder}
//         name={props.name}

//       />
//       {props.iconDir === "right" && props.type !== "password" && (
//         <div className="cursor-pointer mr-2">{props.icon}</div>
//       )}

//       {props.type === "password" &&
//         (showPassword ? (
//           <BsFillEyeSlashFill
//             className="cursor-pointer mx-2 position-absolute end-0"
//             size={20}
//             color='#B3B3B3'
//             onClick={handleTogglePassword}
//           />
//         ) : (
//           <BsEye
//             className="cursor-pointer mx-2 position-absolute end-0"
//             size={20}
//             color='#B3B3B3'
//             onClick={handleTogglePassword}
//           />
//         ))}
//     </StyledInputContainer>
//   );
// };

// InputWithIcon.propTypes = {
//   type: Proptypes.string,
//   border: Proptypes.string,
//   borderRadius: Proptypes.string,
//   position: Proptypes.string,
//   iconDir: Proptypes.string,
//   icon: Proptypes.node,
//   inputRef: Proptypes.oneOfType([
//     Proptypes.object,
//     Proptypes.func
//   ]),
//   onKeyDown: Proptypes.oneOfType([
//     Proptypes.func,
//     Proptypes.object
//   ]),
//   value: Proptypes.string,
//   onChange: Proptypes.func,
//   placeholder: Proptypes.string,
//   name: Proptypes.string,
// };

// InputWithIcon.defaultProps = {
//   type: 'password',
//   border: "1px solid #B0B0B0 !important",
//   borderRadius: "7px !important",
//   position: "absolute",
//   iconDir: "right",
//   icon: null,
//   inputRef: () => { },
//   onKeyDown: null,
//   value: null,
//   onChange: () => { },
//   placeholder: "Icon Input",
//   name: ""
// };
