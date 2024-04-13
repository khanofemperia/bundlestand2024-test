"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft } from "react-icons/hi2";
import AlertMessage from "@/components/AlertMessage";
import Spinner from "@/elements/Spinners/white";
import { useChangeProductIndexStore } from "@/zustand/admin/changeProductIndexStore";
import { ChangeProductIndexAction } from "@/actions/collections";
import { PiArrowsClockwiseBold } from "react-icons/pi";

type CollectionProductsProps = {
  id: string;
  index: number;
  name: string;
  price: string;
  poster: string;
  slug: string;
  visibility: string;
};

type ChangeProductIndexOverlayProps = {
  handleUpdatedProducts: (items: CollectionProductsProps[]) => void;
};

export function ChangeProductIndexButton({
  collectionId,
  productId,
  name,
  index,
}: {
  collectionId: string;
  productId: string;
  name: string;
  index: number;
}) {
  const { showOverlay, hideOverlay } = useOverlayStore();
  const setSelectedCollectionProduct = useChangeProductIndexStore(
    (state) => state.setSelectedCollectionProduct
  );

  const { pageName, overlayName, collectionProductsOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.editCollection.name,
      overlayName: state.pages.editCollection.overlays.changeProductIndex.name,
      collectionProductsOverlayName:
        state.pages.editCollection.overlays.collectionProducts.name,
    }));

  const handleClick = () => {
    setSelectedCollectionProduct({
      index: String(index),
      collectionId,
      productId,
      name,
    });
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: collectionProductsOverlayName });
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

export default function ChangeProductIndexOverlay({
  handleUpdatedProducts,
}: ChangeProductIndexOverlayProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const { selectedCollectionProduct, setSelectedCollectionProduct } =
    useChangeProductIndexStore((state) => ({
      selectedCollectionProduct: state.selectedCollectionProduct,
      setSelectedCollectionProduct: state.setSelectedCollectionProduct,
    }));

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    collectionProductsOverlayName,
  } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.changeProductIndex.name,
    isOverlayVisible:
      state.pages.editCollection.overlays.changeProductIndex.isVisible,
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
      const response = await fetch(
        `/api/admin/collections/${selectedCollectionProduct.collectionId}`
      );
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
      const indexString = formData.get("index") as string;
      const index = parseInt(indexString);

      if (isNaN(index)) {
        setAlertMessage("Invalid index. Please enter a valid number.");
        setShowAlert(true);
        setLoading(false);
        return;
      }

      const result = await ChangeProductIndexAction({
        collectionId: selectedCollectionProduct.collectionId,
        product: {
          id: selectedCollectionProduct.productId,
          index,
        },
      });

      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error changing product index:", error);
    } finally {
      const updatedProducts = await fetchUpdatedCollection();
      handleUpdatedProducts(updatedProducts);
      onHideOverlay();
      setLoading(false);
    }
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = event.target.value;

    setSelectedCollectionProduct({
      ...selectedCollectionProduct,
      index: newIndex,
    });
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
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  onClick={onHideOverlay}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Reposition this article up/down
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
                <div className="mb-4">
                  <div className="w-full bg-gray border-l-4 rounded-tr-xl rounded-br-xl mt-4 py-5 px-4">
                    {selectedCollectionProduct.name}
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
                    value={selectedCollectionProduct.index}
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
