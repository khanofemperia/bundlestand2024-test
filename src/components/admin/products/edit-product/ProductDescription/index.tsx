"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useState, useEffect } from "react";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import { HiArrowLeft } from "react-icons/hi2";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import "./styles.css";
import EditProductAction from "@/actions/edit-product";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";
import { MdOutlineEdit } from "react-icons/md";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export function ProductDescriptionButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editProduct.name,
    overlayName: state.pages.editProduct.overlays.description.name,
  }));

  const openOverlay = () => {
    setDropdown(false);
    showOverlay({ pageName, overlayName });
  };

  return (
    <button
      onClick={openOverlay}
      className="w-9 h-9 grid place-items-center rounded-full transition duration-300 ease-in-out hover:bg-gray2"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export function ProductDescription({
  productId,
  description,
}: {
  productId: string;
  description: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [editorContent, setEditorContent] = useState("");

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editProduct.name,
      overlayName: state.pages.editProduct.overlays.description.name,
      isOverlayVisible: state.pages.editProduct.overlays.description.isVisible,
    })
  );

  useEffect(() => {
    if (isOverlayVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOverlayVisible]);

  const saveChanges = async () => {
    setLoading(true);
    try {
      await EditProductAction({
        id: productId,
        description: editorContent,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      hideOverlay({ pageName, overlayName });
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const toggleEditor = (mode: string) => {
    setIsReadOnly(mode === "reading");

    const editor = document.querySelector(".sun-editor");

    if (editor) {
      editor.classList.toggle("editing-mode", mode === "editing");
    }
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center pb-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[686px] h-max pb-10 bg-white mx-auto mt-20 shadow rounded-14px">
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Write the product description
                </span>
              </button>
              <button
                onClick={saveChanges}
                className={`min-w-[72px] h-9 px-3 rounded-full bg-blue transition duration-300 ease-in-out ${clsx(
                  {
                    "hover:bg-blue2": !loading,
                    "bg-opacity-40": loading,
                    "hover:bg-blue": loading,
                    "hover:bg-opacity-40": loading,
                  }
                )}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex gap-1 items-center justify-center w-full h-full">
                    <Spinner />
                    <p className="text-white">Saving</p>
                  </div>
                ) : (
                  <p className="text-white">Save</p>
                )}
              </button>
            </div>
            <div className="editor-container pt-12 pb-4 px-4">
              <div className="flex items-center w-max mb-[6px] rounded-full">
                <button
                  onClick={() => toggleEditor("reading")}
                  className={`border-l border-y h-[25px] px-2 pr-[6px] text-sm font-bold text-gray flex items-center justify-center rounded-tl-full rounded-bl-full ${clsx(
                    {
                      "bg-[#e7e7e7] cursor-context-menu": isReadOnly,
                    }
                  )}`}
                >
                  Read-only
                </button>
                <div
                  className={`h-[25px] w-[1px] ${
                    isReadOnly ? "bg-[#c3c3c3]" : "bg-blue"
                  }`}
                ></div>
                <button
                  onClick={() => toggleEditor("editing")}
                  className={`border-r border-y h-[25px] pr-2 pl-[6px] text-sm font-bold flex items-center justify-center rounded-tr-full rounded-br-full ${clsx(
                    {
                      "bg-blue text-blue border-blue bg-opacity-15 cursor-context-menu":
                        !isReadOnly,
                      "text-gray border border-l-0": isReadOnly,
                    }
                  )}`}
                >
                  Editing mode
                </button>
              </div>
              <SunEditor
                placeholder="Start typing..."
                setDefaultStyle="font-family: 'Segoe UI'; font-size: 1.063rem; line-height: 1.625rem;"
                hideToolbar={isReadOnly}
                disable={isReadOnly}
                onChange={handleEditorChange}
                setContents={description || ""}
                setOptions={{
                  resizingBar: false,
                  showPathLabel: false,
                  buttonList: [
                    ["undo", "redo"],
                    ["formatBlock"],
                    ["bold", "underline", "italic", "strike", "removeFormat"],
                    ["outdent", "indent", "list"],
                    ["link", "image"],
                  ],
                  formats: ["p", "h2", "h3"],
                  icons: {
                    undo: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="26" width="26" xmlns="http://www.w3.org/2000/svg"><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"></path></svg>`,
                    redo: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="26" width="26" xmlns="http://www.w3.org/2000/svg"><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"></path></svg>`,
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
