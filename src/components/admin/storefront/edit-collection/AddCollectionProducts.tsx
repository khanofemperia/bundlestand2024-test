"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft } from "react-icons/hi2";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import AlertMessage from "@/components/AlertMessage";
import { AddCollectionProductAction } from "@/actions/collections";

type CollectionProductsProps = {
  id: string;
  index: number;
  name: string;
  price: string;
  poster: string;
  slug: string;
  visibility: string;
};

export function AddCollectionProductsButton() {
  const { showOverlay, hideOverlay } = useOverlayStore();

  const { pageName, overlayName, collectionProductsOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.editCollection.name,
      overlayName:
        state.pages.editCollection.overlays.addCollectionProducts.name,
      isOverlayVisible:
        state.pages.editCollection.overlays.addCollectionProducts.isVisible,
      collectionProductsOverlayName:
        state.pages.editCollection.overlays.collectionProducts.name,
    }));

  const handleClick = () => {
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: collectionProductsOverlayName });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue w-max h-9 px-3 rounded-full flex items-center justify-center ease-in-out hover:bg-blue2 hover:duration-300 hover:ease-out"
    >
      <span className="text-white">Add product</span>
    </button>
  );
}

export default function AddCollectionProductsOverlay({
  collectionId,
  handleUpdatedProducts,
}: {
  collectionId: string;
  handleUpdatedProducts: (items: CollectionProductsProps[]) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    collectionProductsOverlayName,
  } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.addCollectionProducts.name,
    isOverlayVisible:
      state.pages.editCollection.overlays.addCollectionProducts.isVisible,
    collectionProductsOverlayName:
      state.pages.editCollection.overlays.collectionProducts.name,
  }));

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

  const fetchUpdatedCollection = async () => {
    try {
      const response = await fetch(`/api/admin/collections/${collectionId}`);
      const result = await response.json();

      return result.collection.products;
    } catch (error) {
      console.error(error);
    }
  };

  const onHideOverlay = async () => {
    hideOverlay({ pageName, overlayName });
    showOverlay({ pageName, overlayName: collectionProductsOverlayName });
    setLoading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const productId = formData.get("id") as string;

      const result = await AddCollectionProductAction({
        collectionId,
        productId,
      });

      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error adding collection product:", error);
    } finally {
      const updatedProducts = await fetchUpdatedCollection();
      handleUpdatedProducts(updatedProducts);
      onHideOverlay();
    }
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[400px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="w-full pt-[14px] px-4">
                <button
                  type="button"
                  onClick={onHideOverlay}
                  className="mb-8 flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Add a product to this collection
                  </span>
                </button>
              </div>
              <div className="pt-3 pb-10 px-4 flex flex-col gap-2">
                <input
                  className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                  type="text"
                  name="id"
                  placeholder="Enter product ID"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue w-max h-9 px-3 rounded-full flex gap-1 items-center justify-center ease-in-out hover:duration-300 hover:ease-out ${clsx(
                    {
                      "hover:bg-blue2": !loading,
                      "bg-opacity-40": loading,
                      "hover:bg-blue": loading,
                      "hover:bg-opacity-40": loading,
                    }
                  )}`}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      <span className="text-white">Confirm</span>
                    </>
                  ) : (
                    <span className="text-white">Confirm</span>
                  )}
                </button>
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
