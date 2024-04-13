"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft } from "react-icons/hi2";
import AlertMessage from "@/components/AlertMessage";
import Spinner from "@/elements/Spinners/white";
import { useOfferStore } from "@/zustand/admin/offerStore";
import { ChangeProductIndexAction } from "@/actions/offers";
import { PiArrowsClockwiseBold } from "react-icons/pi";

type OfferProductProps = {
  id: string;
  index: number;
  poster: string;
  name: string;
  price: string;
};

export function ChangeProductIndexButton({
  offerId,
  productId,
  productName,
  productIndex,
}: {
  offerId: string;
  productId: string;
  productName?: string;
  productIndex?: string;
}) {
  const { showOverlay, hideOverlay } = useOverlayStore();
  const setSelectedProduct = useOfferStore((state) => state.setSelectedProduct);

  const { pageName, overlayName, offerProductsOverlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editOffer.name,
      overlayName: state.pages.editOffer.overlays.changeProductIndex.name,
      isOverlayVisible:
        state.pages.editOffer.overlays.changeProductIndex.isVisible,
      offerProductsOverlayName:
        state.pages.editOffer.overlays.offerProducts.name,
    })
  );

  const handleClick = () => {
    setSelectedProduct({ offerId, productId, productName, productIndex });
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: offerProductsOverlayName });
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
}: {
  handleUpdatedProducts: (items: OfferProductProps[]) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const { selectedProduct, setSelectedProduct } = useOfferStore((state) => ({
    selectedProduct: state.selectedProduct,
    setSelectedProduct: state.setSelectedProduct,
  }));

  const { pageName, isOverlayVisible, overlayName, offerProductsOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.editOffer.name,
      overlayName: state.pages.editOffer.overlays.changeProductIndex.name,
      isOverlayVisible:
        state.pages.editOffer.overlays.changeProductIndex.isVisible,
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    let result;

    try {
      result = await ChangeProductIndexAction({
        offerId: selectedProduct.offerId,
        productId: selectedProduct.productId,
        productIndex: Number(selectedProduct.productIndex),
      });
    } catch (error) {
      console.error("Error changing product index:", error);
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

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = event.target.value;
    setSelectedProduct({ ...selectedProduct, productIndex: newIndex });
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
                    Reposition product up/down
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
                  <div className="text-sm font-semibold">Name</div>
                  <div className="w-max max-w-full min-h-[27px] bg-gray2 rounded-lg mt-4 px-2">
                    {selectedProduct.productName}
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
                    value={selectedProduct.productIndex}
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
