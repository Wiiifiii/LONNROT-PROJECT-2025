// // src/app/components/SideActions.jsx
// "use client";

// import React from "react";
// import { FaListUl, FaInfoCircle, FaBook, FaDownload, FaTimes } from "react-icons/fa";
// import Button from "./Button";
// import Tooltip from "./Tooltip";

// export default function SideActions({ onAdd, onDetails, onBack, onDownload, onClose, showReader }) {
//   return (
//     <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-50">
//       <Tooltip content="Add to Saga lists">
//         <Button
//           icon={GiMagicTrident}
//           onClick={onAdd}
//           className="p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151]"
//         />
//       </Tooltip>
//       <Tooltip content="View details">
//         <Button
//           icon={FaInfoCircle}
//           onClick={onDetails}
//           className="p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151]"
//         />
//       </Tooltip>
//       <Tooltip content="Back to Saga Haven">
//         <Button
//           icon={FaBook}
//           onClick={onBack}
//           className="p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151]"
//         />
//       </Tooltip>
//       {showReader && (
//         <>
//           <Tooltip content="Download PDF">
//             <Button
//               icon={BsFiletypePdf}
//               onClick={onDownload}
//               className="p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151]"
//             />
//           </Tooltip>
//           <Tooltip content="Close reader">
//             <Button
//               icon={FaTimes}
//               onClick={onClose}
//               className="p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151]"
//             />
//           </Tooltip>
//         </>
//       )}
//     </div>
//   );
// }