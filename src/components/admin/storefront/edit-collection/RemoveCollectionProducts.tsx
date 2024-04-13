"use client";

import { useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft, HiOutlineXMark } from "react-icons/hi2";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import AlertMessage from "@/components/AlertMessage";
import { useCollectionStore } from "@/zustand/admin/collectionStore";
import { RemoveCollectionProductAction } from "@/actions/collections";

type CollectionProductsProps = {
  id: string;
  index: number;
  name: string;
  price: string;
  poster: string;
  slug: string;
  visibility: string;
};

export function RemoveCollectionProductsButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const { showOverlay, hideOverlay } = useOverlayStore();
  const setSelectedCollectionProduct = useCollectionStore(
    (state) => state.setSelectedCollectionProduct
  );

  const { pageName, overlayName, collectionProductsOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.editCollection.name,
      overlayName:
        state.pages.editCollection.overlays.removeCollectionProducts.name,
      isOverlayVisible:
        state.pages.editCollection.overlays.removeCollectionProducts.isVisible,
      collectionProductsOverlayName:
        state.pages.editCollection.overlays.collectionProducts.name,
    }));

  const handleClick = () => {
    setSelectedCollectionProduct({ id, name });
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: collectionProductsOverlayName });
  };

  return (
    <button
      onClick={handleClick}
      className="w-6 h-6 bg-transparent border border-[#ababab] rounded-full grid place-items-center ease-in-out hover:duration-300 hover:ease-out hover:border-[#909090] hover:text-[#909090]"
    >
      <HiOutlineXMark className="stroke-[#ababab]" size={18} />
    </button>
  );
}

export default function RemoveCollectionProductsOverlay({
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

  const { selectedCollectionProduct } = useCollectionStore((state) => ({
    selectedCollectionProduct: state.selectedCollectionProduct,
  }));

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    collectionProductsOverlayName,
  } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName:
      state.pages.editCollection.overlays.removeCollectionProducts.name,
    isOverlayVisible:
      state.pages.editCollection.overlays.removeCollectionProducts.isVisible,
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

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const result = await RemoveCollectionProductAction({
        collectionId,
        productId: selectedCollectionProduct.id,
      });

      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error removing collection product:", error);
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
            <div className="w-full pt-[14px] px-4">
              <button
                onClick={onHideOverlay}
                className="mb-8 flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Remove product
                </span>
              </button>
            </div>
            <div className="pt-3 pb-10 px-4 flex flex-col gap-2">
              <div className="mb-4">
                <div className="w-full bg-red bg-opacity-10 border-l-4 border-red rounded-tr-xl rounded-br-xl mt-4 py-5 px-4">
                  {selectedCollectionProduct.name}
                </div>
              </div>
              <div className="w-80 heading-size-h3">
                Sure you wanna do this? The product won't be in the collection
                anymore.
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-red w-max h-9 px-3 mt-1 rounded-full flex gap-1 items-center justify-center ease-in-out hover:duration-300 hover:ease-out ${clsx(
                  {
                    "hover:bg-red2": !loading,
                    "bg-opacity-40": loading,
                    "hover:bg-red": loading,
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
