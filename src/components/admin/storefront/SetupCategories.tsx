"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft } from "react-icons/hi2";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";
import { useEffect, useState } from "react";
import AlertMessage from "@/components/AlertMessage";
import Image from "next/image";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import UpdateProductCategoriesAction from "@/actions/product-categories";

export function SetupCategoriesButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.storefront.name,
    overlayName: state.pages.storefront.overlays.setupProductCategories.name,
  }));

  const openOverlay = () => {
    setDropdown(false);
    showOverlay({ pageName, overlayName });
  };

  return (
    <button
      className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
      title="Create a new category"
      onClick={openOverlay}
    >
      Set up product categories
    </button>
  );
}

export function SetupCategoriesOverlay({
  categories,
}: {
  categories: CategoryProps[];
}) {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [visibilityStates, setVisibilityStates] = useState(
    categories.map((category) => category.visibility === "VISIBLE")
  );

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.storefront.name,
      overlayName: state.pages.storefront.overlays.setupProductCategories.name,
      isOverlayVisible:
        state.pages.storefront.overlays.setupProductCategories.isVisible,
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
      const updatedCategories = categories.map((category, index) => ({
        id: category.id,
        visibility: visibilityStates[index] ? "VISIBLE" : "HIDDEN",
      }));

      const result = await UpdateProductCategoriesAction(updatedCategories);
      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (index: number) => {
    setVisibilityStates((prev) => {
      const newVisibilityStates = [...prev];
      newVisibilityStates[index] = !newVisibilityStates[index];
      return newVisibilityStates;
    });
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[500px] h-max px-4 pb-4 bg-white mx-auto shadow rounded-14px">
            <div className="w-full h-9 pt-[14px] mb-8 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Set up product categories
                </span>
              </button>
              <button
                onClick={saveChanges}
                className={`min-w-[72px] h-9 px-3 rounded-full bg-blue ease-in-out hover:duration-300 hover:ease-out ${clsx(
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
            <div className="mx-auto rounded-lg overflow-hidden [box-shadow:rgb(122,122,122,18%)_0px_3px_2px_0px,_rgb(0,0,0,20%)_0px_0px_1px_1px]">
              <table className="border-collapse">
                <thead className="border-b bg-gray2">
                  <tr className="h-9 text-left">
                    <th className="min-w-[60px] w-[60px] pl-3 pr-2 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        #
                      </h3>
                    </th>
                    <th className="w-full pl-3">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        Name
                      </h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(({ index, image, name }, categoryIndex) => (
                    <tr key={index} className="border-b h-max text-left">
                      <td className="min-w-[60px] w-[60px] pl-3 pr-2 pt-[2px] border-r">
                        <p className="text-gray text-sm font-semibold">
                          {index}
                        </p>
                      </td>
                      <td className="w-full pl-3">
                        <div className="flex items-center gap-4 py-1 relative">
                          <div className="w-[80px] h-[80px] rounded-full bg-gray2 overflow-hidden flex items-center justify-center shadow-[rgba(0,0,0,0.2)_0px_1px_3px_0px,_rgba(27,31,35,0.15)_0px_0px_0px_1px]">
                            <Image
                              src={`/categories/${image}`}
                              alt={name}
                              width={80}
                              height={80}
                              priority={true}
                            />
                          </div>
                          <p className="text-sm font-semibold">{name}</p>
                          <div
                            onClick={() => toggleVisibility(categoryIndex)}
                            className={`absolute top-3 right-3 w-10 h-5 rounded-full cursor-pointer ease-in-out duration-200 ${clsx(
                              {
                                "bg-white border":
                                  !visibilityStates[categoryIndex],
                                "bg-blue border border-blue":
                                  visibilityStates[categoryIndex],
                              }
                            )}`}
                          >
                            <div
                              className={`w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute [top:50%] [transform:translateY(-50%)] ${clsx(
                                {
                                  "left-[5px] bg-black":
                                    !visibilityStates[categoryIndex],
                                  "left-[23px] bg-white":
                                    visibilityStates[categoryIndex],
                                }
                              )}`}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
