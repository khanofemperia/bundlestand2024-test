"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft } from "react-icons/hi2";
import AlertMessage from "@/components/AlertMessage";
import Spinner from "@/elements/Spinners/white";
import { PiArrowsClockwiseBold } from "react-icons/pi";
import { useChangeCollectionIndexStore } from "@/zustand/admin/changeCollectionIndexStore";
import { ChangeCollectionIndexAction } from "@/actions/collections";

export function ChangeCollectionIndexButton({
  id,
  index,
  title,
}: {
  id: string;
  index: string;
  title: string;
}) {
  const { showOverlay } = useOverlayStore();
  const setSelectedCollection = useChangeCollectionIndexStore(
    (state) => state.setSelectedCollection
  );

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.storefront.name,
    overlayName: state.pages.storefront.overlays.changeCollectionIndex.name,
    isOverlayVisible:
      state.pages.storefront.overlays.changeCollectionIndex.isVisible,
  }));

  const handleClick = () => {
    setSelectedCollection({ id, index, title });
    showOverlay({ pageName, overlayName });
  };

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 rounded-full grid place-items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
    >
      <PiArrowsClockwiseBold size={18} />
    </button>
  );
}

export default function ChangeCollectionIndexOverlay() {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const { selectedCollection, setSelectedCollection } =
    useChangeCollectionIndexStore((state) => ({
      selectedCollection: state.selectedCollection,
      setSelectedCollection: state.setSelectedCollection,
    }));

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.storefront.name,
      overlayName: state.pages.storefront.overlays.changeCollectionIndex.name,
      isOverlayVisible:
        state.pages.storefront.overlays.changeCollectionIndex.isVisible,
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

  const onHideOverlay = () => {
    hideOverlay({ pageName, overlayName });
    setLoading(false);
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await ChangeCollectionIndexAction({
        id: selectedCollection.id,
        index: Number(selectedCollection.index),
      });

      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error changing collection index:", error);
    } finally {
      onHideOverlay();
    }
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = event.target.value;
    setSelectedCollection({ ...selectedCollection, index: newIndex });
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[400px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  onClick={onHideOverlay}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Reposition this collection up/down
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue min-w-[72px] h-9 px-3 rounded-full flex items-center justify-center ease-in-out hover:bg-blue2 hover:duration-300 hover:ease-out"
                >
                  {loading ? (
                    <div className="flex gap-1 items-center justify-center w-full h-full">
                      <Spinner />
                      <span className="text-white">Saving</span>
                    </div>
                  ) : (
                    <span className="text-white">Save</span>
                  )}
                </button>
              </div>
              <div className="pt-12 pb-10 px-4 flex flex-col gap-4">
                <div>
                  <div className="text-sm font-semibold">Title</div>
                  <div className="w-max max-w-full min-h-[27px] bg-gray2 rounded-lg mt-4 px-2">
                    {selectedCollection.title}
                  </div>
                </div>
                <div>
                  <label className="heading-size-h3" htmlFor="index">
                    Index position
                  </label>
                  <input
                    className="w-full h-9 border rounded-md mt-4 px-3 focus:border-blue"
                    type="text"
                    name="index"
                    value={selectedCollection.index}
                    onChange={handleIndexChange}
                    required
                  />
                </div>
              </div>
            </form>
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
