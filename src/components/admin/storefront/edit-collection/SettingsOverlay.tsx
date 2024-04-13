"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import { UpdateCollectionAction } from "@/actions/collections";
import { capitalizeFirstLetter } from "@/libraries/utils";
import { HiArrowLeft, HiMiniChevronDown } from "react-icons/hi2";
import AlertMessage from "@/components/AlertMessage";

export function EditSettingsButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.settings.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 mt-2 grid place-items-center rounded-full ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export default function SettingsOverlay({
  collectionId,
  settings,
}: {
  collectionId: string;
  settings: { status: string; visibility: string };
}) {
  const PUBLISHED = "PUBLISHED";
  const VISIBLE = "VISIBLE";
  const HIDDEN = "HIDDEN";
  const DRAFT = "DRAFT";

  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [statusDropdown, setStatusDropdown] = useState<boolean>(false);
  const [visibilityDropdown, setVisibilityDropdown] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState(settings.status);
  const [selectedVisibility, setSelectedVisibility] = useState(
    settings.visibility
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element; // Asserting the type to Element

      // Check if the click is outside the status dropdown
      if (statusDropdown && !target.closest(".status-dropdown-container")) {
        setStatusDropdown(false); // Close the status dropdown
      }

      // Check if the click is outside the visibility dropdown
      if (
        visibilityDropdown &&
        !target.closest(".visibility-dropdown-container")
      ) {
        setVisibilityDropdown(false); // Close the visibility dropdown
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [statusDropdown, visibilityDropdown]);

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editCollection.name,
      overlayName: state.pages.editCollection.overlays.settings.name,
      isOverlayVisible: state.pages.editCollection.overlays.settings.isVisible,
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

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const saveChanges = async () => {
    setLoading(true);

    try {
      const result = await UpdateCollectionAction({
        collectionId,
        status: selectedStatus,
        visibility: selectedVisibility,
      });
      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatusDropdown = () => {
    setVisibilityDropdown(false);
    setStatusDropdown((prevState) => !prevState);
  };

  const toggleVisibilityDropdown = () => {
    setStatusDropdown(false);
    setVisibilityDropdown((prevState) => !prevState);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setStatusDropdown(false);
  };

  const handleVisibilitySelect = (visibility: string) => {
    setSelectedVisibility(visibility);
    setVisibilityDropdown(false);
  };

  return (
    isOverlayVisible && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[500px] bg-white mx-auto mt-20 shadow rounded-14px">
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">Edit settings</span>
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
            <div className="pt-12 pb-10 px-4 flex flex-col gap-[18px]">
              <div>
                <div className="heading-size-h3">Status</div>
                <div className="w-32 h-9 outline-none mt-4 relative status-dropdown-container">
                  <button
                    onClick={toggleStatusDropdown}
                    type="button"
                    className="bg-gray2 w-max h-full rounded-full flex items-center justify-between text-left pl-3 pr-[6px] ease-in-out hover:duration-300 hover:ease-out hover:bg-gray3"
                  >
                    <p className="mr-2">
                      {capitalizeFirstLetter(selectedStatus.toLowerCase())}
                    </p>
                    <HiMiniChevronDown className="mt-[2px]" size={22} />
                  </button>
                  <div
                    className={`${
                      statusDropdown ? "block" : "hidden"
                    } shadow-custom3 rounded-md w-full overflow-hidden absolute top-9 z-10 mt-1 bg-white`}
                  >
                    <div className="border-b p-1">
                      <div
                        onClick={() => handleStatusSelect(DRAFT)}
                        className="cursor-pointer h-8 w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                      >
                        <p className="text-gray">Draft</p>
                      </div>
                    </div>
                    <div className="p-1">
                      <div
                        onClick={() => handleStatusSelect(PUBLISHED)}
                        className="cursor-pointer h-8 w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                      >
                        <p className="text-gray">Published</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="heading-size-h3">Visibility</div>
                <div className="w-32 h-9 outline-none mt-4 relative visibility-dropdown-container">
                  <button
                    onClick={toggleVisibilityDropdown}
                    type="button"
                    className="bg-gray2 w-max h-full rounded-full flex items-center justify-between text-left pl-3 pr-[6px] ease-in-out hover:duration-300 hover:ease-out hover:bg-gray3"
                  >
                    <p className="mr-2">
                      {capitalizeFirstLetter(selectedVisibility.toLowerCase())}
                    </p>
                    <HiMiniChevronDown className="mt-[2px]" size={22} />
                  </button>
                  <div
                    className={`${
                      visibilityDropdown ? "block" : "hidden"
                    } shadow-custom3 rounded-md w-full overflow-hidden absolute top-9 z-10 mt-1 bg-white`}
                  >
                    <div className="border-b p-1">
                      <div
                        onClick={() => handleVisibilitySelect(HIDDEN)}
                        className="cursor-pointer h-8 w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                      >
                        <p className="text-gray">Hidden</p>
                      </div>
                    </div>
                    <div className="p-1">
                      <div
                        onClick={() => handleVisibilitySelect(VISIBLE)}
                        className="cursor-pointer h-8 w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                      >
                        <p className="text-gray">Visible</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showAlert && (
          <AlertMessage
            message={alertMessage}
            hideAlertMessage={hideAlertMessage}
          />
        )}
      </>
    )
  );
}
