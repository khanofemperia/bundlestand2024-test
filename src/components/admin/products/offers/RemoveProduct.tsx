"use client";

import { useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft, HiOutlineXMark } from "react-icons/hi2";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import AlertMessage from "@/components/AlertMessage";
import { useOfferStore } from "@/zustand/admin/offerStore";
import { RemoveProductAction } from "@/actions/offers";

type OfferProductProps = {
  id: string;
  index: number;
  poster: string;
  name: string;
  price: string;
};

export function RemoveProductButton({
  offerId,
  productId,
}: {
  offerId: string;
  productId: string;
}) {
  const { showOverlay, hideOverlay } = useOverlayStore();
  const setSelectedProduct = useOfferStore((state) => state.setSelectedProduct);

  const { pageName, overlayName, offerProductsOverlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editOffer.name,
      overlayName: state.pages.editOffer.overlays.removeProduct.name,
      isOverlayVisible: state.pages.editOffer.overlays.removeProduct.isVisible,
      offerProductsOverlayName:
        state.pages.editOffer.overlays.offerProducts.name,
    })
  );

  const handleClick = () => {
    setSelectedProduct({ offerId, productId });
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: offerProductsOverlayName });
  };

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 rounded-full grid place-items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
    >
      <HiOutlineXMark className="stroke-text-gray" size={22} />
    </button>
  );
}

export default function RemoveProductOverlay({
  handleUpdatedProducts,
}: {
  handleUpdatedProducts: (items: OfferProductProps[]) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const { selectedProduct } = useOfferStore((state) => ({
    selectedProduct: state.selectedProduct,
  }));

  const { pageName, isOverlayVisible, overlayName, offerProductsOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.editOffer.name,
      overlayName: state.pages.editOffer.overlays.removeProduct.name,
      isOverlayVisible: state.pages.editOffer.overlays.removeProduct.isVisible,
      offerProductsOverlayName:
        state.pages.editOffer.overlays.offerProducts.name,
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

  const onHideOverlay = () => {
    hideOverlay({ pageName, overlayName });
    showOverlay({ pageName, overlayName: offerProductsOverlayName });
    setLoading(false);
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const handleRemoveConfirmation = async () => {
    setLoading(true);
    let result;

    try {
      result = await RemoveProductAction({
        offerId: selectedProduct.offerId,
        productId: selectedProduct.productId,
      });
    } catch (error) {
      console.error("Error removing product:", error);
    } finally {
      onHideOverlay();

      if (result && result.status.code === 200) {
        handleUpdatedProducts(result.updatedProducts);
        setAlertMessage(result.status.message);
        setShowAlert(true);
      } else if (result?.status.message) {
        setAlertMessage(result.status.message);
        setShowAlert(true);
      }
    }
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
              <div className="w-80 heading-size-h3">
                Sure you wanna do this? The product won't be in the offer
                anymore.
              </div>
              <button
                onClick={handleRemoveConfirmation}
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
