"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useState, useEffect } from "react";
import { HiArrowLeft, HiOutlineXMark } from "react-icons/hi2";
import { MdOutlineEdit } from "react-icons/md";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import EditProductAction from "@/actions/edit-product";
import AlertMessage from "@/components/AlertMessage";

export function EditColorsButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editProduct.name,
    overlayName: state.pages.editProduct.overlays.colors.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 grid place-items-center rounded-full transition duration-300 ease-in-out hover:bg-gray2"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

type ColorProps = {
  name: string;
  image: string;
};

export default function ColorsOverlay({
  data,
}: {
  data: { productId: string; colors: ColorProps[] | null };
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [colors, setColors] = useState<ColorProps[]>([...(data.colors || [])]);
  const [newColor, setNewColor] = useState<ColorProps>({ name: "", image: "" });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editProduct.name,
      overlayName: state.pages.editProduct.overlays.colors.name,
      isOverlayVisible: state.pages.editProduct.overlays.colors.isVisible,
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
      const filteredColors = colors.filter(({ name, image }) => name && image);
      await EditProductAction({ id: data.productId, colors: filteredColors });
      setColors(filteredColors);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      hideOverlay({ pageName, overlayName });
    }
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const addColor = () => {
    setColors((prevColors) => [...prevColors, { ...newColor }]);
    setNewColor({ name: "", image: "" });
  };

  const removeColor = (index: number) => {
    setColors((prevColors) => prevColors.filter((_, i) => i !== index));
  };

  const handleColorChange = (index: number, field: string, value: string) => {
    setColors((prevColors) =>
      prevColors.map((color, i) =>
        i === index ? { ...color, [field]: value } : color
      )
    );
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[500px] h-max pb-10 bg-white mx-auto shadow rounded-14px">
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">Edit colors</span>
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
            <div className="flex flex-col gap-4 w-max mt-12 px-4">
              <h3 className="heading-size-h3">Colors</h3>
              <button
                onClick={addColor}
                className="px-3 h-9 w-max bg-gray2 rounded-full transition duration-300 ease-in-out hover:bg-gray3"
              >
                Add New
              </button>
              {colors.length > 0 && (
                <div className="w-[382px] flex gap-2 flex-wrap">
                  {colors.map(({ name, image }, index) => (
                    <div
                      key={index}
                      className="w-[122px] rounded-lg relative overflow-hidden border"
                    >
                      <div className="h-[120px] w-full overflow-hidden relative">
                        <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-white">
                          {image && (
                            <img
                              src={image}
                              alt={name}
                              width="120"
                              height="120"
                            />
                          )}
                        </div>
                        <button
                          onClick={() => removeColor(index)}
                          className="absolute right-2 top-2 w-[23px] h-[23px] border border-white rounded-full flex items-center justify-center bg-red shadow-custom2"
                        >
                          <HiOutlineXMark className="stroke-white" size={17} />
                        </button>
                      </div>
                      <div className="h-9 w-full border-t overflow-hidden">
                        <input
                          placeholder="Color name"
                          className="h-full w-full border-none outline-none text-sm font-semibold px-2"
                          type="text"
                          value={name}
                          onChange={(e) =>
                            handleColorChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="h-9 w-full border-t overflow-hidden">
                        <input
                          placeholder="Image url"
                          className="h-full w-full border-none outline-none text-sm px-2"
                          type="text"
                          value={image}
                          onChange={(e) =>
                            handleColorChange(index, "image", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showAlert && (
        <AlertMessage
          message={alertMessage}
          hideAlertMessage={hideAlertMessage}
        />
      )}
    </>
  );
}
