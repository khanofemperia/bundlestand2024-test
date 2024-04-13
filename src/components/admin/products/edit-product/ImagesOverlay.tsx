"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { MdOutlineEdit } from "react-icons/md";
import { HiArrowLeft, HiOutlineXMark } from "react-icons/hi2";
import { useState, useEffect } from "react";
import EditProductAction from "@/actions/edit-product";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";

export function EditImagesButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editProduct.name,
    overlayName: state.pages.editProduct.overlays.images.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 grid place-items-center rounded-full transition duration-300 ease-in-out bg-gray2"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export default function ImagesOverlay({
  productId,
  productImages,
  productName,
}: {
  productId: string;
  productImages: string[] | null;
  productName: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState([...(productImages || [])]);

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editProduct.name,
      overlayName: state.pages.editProduct.overlays.images.name,
      isOverlayVisible: state.pages.editProduct.overlays.images.isVisible,
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
      const filteredImages = images.filter((image) => image !== "");

      await EditProductAction({ id: productId, images: filteredImages });

      setImages(filteredImages);
    } catch (error) {
      console.error("Error updating poster:", error);
    } finally {
      setLoading(false);
      hideOverlay({ pageName, overlayName });
    }
  };

  const addImage = () => {
    const newEmptyImageBox = "";
    const updatedImages = [...images, newEmptyImageBox];
    setImages(updatedImages);
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = event.target;

    const updatedImageList = [...images];
    updatedImageList[index] = value;

    setImages(updatedImageList);
  };

  return (
    isOverlayVisible && (
      <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="w-[500px] h-max bg-white mx-auto mt-20 shadow rounded-14px">
          <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
            <button
              onClick={() => hideOverlay({ pageName, overlayName })}
              className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
            >
              <HiArrowLeft size={20} className="fill-blue" />
              <span className="heading-size-h3 text-blue">
                Add or remove images
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
          <div className="pt-12 pb-10 px-4 flex flex-col gap-4">
            <button
              onClick={addImage}
              className="bg-gray2 w-[100px] border-b h-7 rounded-full grid place-items-center transition duration-300 ease-in-out hover:bg-gray3"
              type="button"
            >
              <p>Add image</p>
            </button>
            <div className="flex gap-2 flex-wrap">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="w-[122px] rounded-lg relative overflow-hidden border"
                >
                  <div className="h-[160px] w-full overflow-hidden relative">
                    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
                      {image && (
                        <img
                          src={image}
                          alt={productName}
                          width={120}
                          height={160}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="h-9 w-9 rounded-full grid place-items-center bg-black absolute top-2 right-2 transition duration-300 ease-in-out hover:bg-[rgb(75_75_75)]"
                    >
                      <HiOutlineXMark className="stroke-white" size={22} />
                    </button>
                  </div>
                  <div className="h-9 w-full border-t overflow-hidden">
                    <input
                      type="text"
                      placeholder="Image url"
                      className="h-full w-full border-none outline-none text-sm font-semibold px-2"
                      value={images[index] || ""}
                      onChange={(event) => handleImageInputChange(event, index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
