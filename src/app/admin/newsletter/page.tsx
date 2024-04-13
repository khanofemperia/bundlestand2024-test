// "use client";

// import he from "he";
// import Link from "next/link";
// import { FaPen, FaUpRightFromSquare } from "react-icons/fa6";
// import dynamic from "next/dynamic";
// import "suneditor/dist/css/suneditor.min.css";
// import { useRef, useState } from "react";
// import { MdOutlineClose } from "react-icons/md";
// import SunEditorCore from "suneditor/src/lib/core";

// const SunEditor = dynamic(() => import("suneditor-react"), {
//   ssr: false,
// });

// function ColumnEditor({
//   onContentChange,
//   removeColumn,
// }: {
//   onContentChange: (content: string) => void;
//   removeColumn: () => void;
// }) {
//   const editor = useRef<SunEditorCore>();
//   const [isReadonly, setReadOnly] = useState(true);

//   const toggleReadOnly = () => {
//     setReadOnly((prev) => !prev);
//   };

//   return (
//     <div className="column">
//       <div className="flex items-center justify-between">
//         <button
//           className={`${
//             isReadonly
//               ? "bg-theme-newsletter-template-background-purple"
//               : "bg-[#06a25a] text-white"
//           } rounded-full h-auto px-3 pt-[4px] pb-[3px] mb-[6px]`}
//           onClick={toggleReadOnly}
//         >
//           {isReadonly ? "Read Only" : "Editing"}
//         </button>
//         <button
//           onClick={removeColumn}
//           className="bg-neutral-800 bg-opacity-70 text-white w-9 h-9 rounded-full"
//         >
//           <MdOutlineClose size={26} />
//         </button>
//       </div>
//       <SunEditor
//         onChange={(content) => {
//           onContentChange(content);
//         }}
//         name="newsletter-template-column-editor"
//         setOptions={{
//           buttonList: [
//             ["undo", "redo"],
//             ["bold", "italic", "underline", "align", "image"],
//           ],
//         }}
//         defaultValue="Here's our default value."
//         setDefaultStyle="font-family: Verdana; font-size: 17px;"
//         autoFocus={true}
//         disable={isReadonly}
//         getSunEditorInstance={(sunEditor: SunEditorCore) => {
//           editor.current = sunEditor;
//         }}
//       />
//     </div>
//   );
// }

// export default function Newsletter() {
//   const [columnContents, setColumnContents] = useState<string[]>([]);
//   const [columns, setColumns] = useState<React.ReactNode[]>([]);

//   const removeColumn = (index: number) => {
//     setColumns((prevColumns) => {
//       const updatedColumns = [...prevColumns];
//       updatedColumns.splice(index, 1);
//       return updatedColumns;
//     });

//     setColumnContents((prevContents) => {
//       const updatedContents = [...prevContents];
//       updatedContents.splice(index, 1);
//       return updatedContents;
//     });
//   };

//   const addNewColumn = () => {
//     const newColumn = (
//       <ColumnEditor
//         key={columns.length}
//         removeColumn={() => removeColumn(columns.length)}
//         onContentChange={(content: string) => {
//           setColumnContents((prevContents) => {
//             const updatedContents = [...prevContents];
//             updatedContents[columns.length] = content;
//             return updatedContents;
//           });
//         }}
//       />
//     );

//     setColumns([...columns, newColumn]);
//   };

//   const sendEmail = () => {
//     const options = {
//       method: "POST",
//     };

//     fetch("/api/send-email", options)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error("Fetch error:", error);
//       });
//   };

//   return (
//     <>
//       <section>
//         <div className="page-heading">
//           <h1 className="theme-h1">Newsletter</h1>
//           <p>Connect with your subsribers</p>
//         </div>
//         <div className="bg-white rounded-2xl mt-8 shadow-theme-box-shadow py-[0.625rem] w-full">
//           <div className="flex justify-between pb-3 px-6 w-full items-center border-b border-solid border-theme-border-color">
//             <h2 className="theme-h2">497 issues</h2>
//             <div className="flex gap-2">
//               <button
//                 className="px-3 bg-theme-blue text-white w-max flex gap-1"
//                 type="button"
//               >
//                 Compose
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto overflow-y-hidden w-full">
//             <table className="border-collapse">
//               <thead className="border-b border-theme-border-color">
//                 <tr className="bg-theme-background-gray h-9">
//                   <th className="max-w-[3.344rem] min-w-[3.344rem] py-0 pr-2 pl-6 border-r border-solid border-theme-border-color">
//                     <div className="flex items-center justify-center bg-white border border-solid border-neutral-950 rounded h-5 w-5"></div>
//                   </th>
//                   <th className="max-w-[607px] min-w-[607px] border-r border-solid border-theme-border-color pl-2">
//                     <p className="text-gray font-semibold text-left whitespace-normal">
//                       Subject
//                     </p>
//                   </th>
//                   <th className="max-w-[180px] min-w-[180px] border-r border-solid border-theme-border-color pl-2">
//                     <p className="text-gray font-semibold text-left whitespace-normal">
//                       Publish date
//                     </p>
//                   </th>
//                   <th className="max-w-[8.188rem] min-w-[8.188rem] border-r-0 pl-2"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b border-solid border-theme-border-color">
//                   <td className="border-r border-solid border-theme-border-color py-0 pr-2 pl-6">
//                     <div className="flex items-center justify-center bg-white border border-solid border-neutral-950 rounded h-5 w-5"></div>
//                   </td>
//                   <td className="border-r border-solid border-theme-border-color h-12 px-2">
//                     <div className="flex">
//                       <p className="font-semibold">A world on edge</p>
//                       &nbsp;
//                       <span className="text-gray">
//                         - Economic leaders warn of mounting risks
//                       </span>
//                     </div>
//                   </td>
//                   <td className="border-r border-solid border-theme-border-color h-12 px-2">
//                     <p>September 8, 2023</p>
//                   </td>
//                   <td className="h-12 px-2">
//                     <div className="w-full flex justify-center items-center gap-6">
//                       <Link href="/">
//                         <FaPen className="text-base text-theme-svg-color hover:text-theme-blue" />
//                       </Link>
//                       <Link href="/">
//                         <FaUpRightFromSquare className="text-base text-theme-svg-color hover:text-theme-blue" />
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>
//       <div className="fixed top-0 bottom-0 left-0 right-0 py-20 bg-neutral-600 bg-opacity-80 overflow-y-visible overflow-x-hidden">
//         <div className="w-max bg-white m-auto p-2 rounded-2xl">
//           <div className="flex gap-5">
//             <button
//               onClick={addNewColumn}
//               className="w-1/2 h-12 bg-orange-300 mb-5 font-bold text-white hover:bg-orange-400 hover:transition-all hover:duration-300"
//             >
//               ADD NEW
//             </button>
//             <button
//               onClick={sendEmail}
//               className="w-1/2 h-12 bg-blue-400 mb-5 font-bold text-white hover:bg-blue-500 hover:transition-all hover:duration-300"
//             >
//               SEND EMAIL
//             </button>
//           </div>
//           <div className="newsletter flex gap-2 flex-col w-[660px] m-auto">
//             {columns}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// "use client";

// export default function Newsletter() {
//   const sendEmail = () => {
//     const options = {
//       method: "POST",
//     };

//     fetch("/api/send-email", options)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//       })
//       .catch((error) => {
//         console.error("Fetch error:", error);
//       });
//   };

//   return (
//     <div>
//       <button
//         onClick={sendEmail}
//         className="bg-slate-700 text-white rounded-lg px-3 py-1"
//       >
//         Send Email
//       </button>
//     </div>
//   );
// }
export default function Newsletter() {
  return <div>Newsletter Page</div>;
}
