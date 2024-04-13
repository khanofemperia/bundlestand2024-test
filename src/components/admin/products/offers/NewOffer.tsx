"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useState, useEffect } from "react";
import Spinner from "@/elements/Spinners/white";
import { HiArrowLeft } from "react-icons/hi2";
import AlertMessage from "@/components/AlertMessage";
import Image from "next/image";
import { CreateOfferAction } from "@/actions/offers";

export function NewOfferButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.offers.name,
    overlayName: state.pages.offers.overlays.newOffer.name,
  }));

  const openOverlay = () => {
    showOverlay({ pageName, overlayName });
  };

  return (
    <button
      className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
      onClick={openOverlay}
    >
      Create a new offer
    </button>
  );
}

export function NewOfferOverlay() {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [price, setPrice] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [poster, setPoster] = useState<string>("");

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.offers.name,
      overlayName: state.pages.offers.overlays.newOffer.name,
      isOverlayVisible: state.pages.offers.overlays.newOffer.isVisible,
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

  const onHideOverlay = () => {
    setLoading(false);
    hideOverlay({ pageName, overlayName });
    setPrice("");
    setSalePrice("");
    setPoster("");
  };

  const handleSave = async () => {
    if (!price) {
      setAlertMessage("Enter a price");
      setShowAlert(true);
    } else if (!salePrice) {
      setAlertMessage("Enter a sale price");
      setShowAlert(true);
    } else if (!poster) {
      setAlertMessage("Enter a poster");
      setShowAlert(true);
    } else {
      setLoading(true);

      try {
        await CreateOfferAction({ price, sale_price: salePrice, poster });
      } catch (error) {
        console.error(error);
      } finally {
        onHideOverlay();
      }
    }
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[500px] h-max bg-white mx-auto shadow rounded-14px overflow-hidden">
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Create a new offer
                </span>
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={handleSave}
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
            <div className="pt-12 pb-10 px-4 flex flex-col gap-6">
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm" htmlFor="price">
                    Price
                  </label>
                  <input
                    className="w-full h-9 border px-3 rounded-md outline-none focus:border-blue"
                    type="text"
                    name="price"
                    placeholder="56.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm" htmlFor="sale_price">
                    Sale price
                  </label>
                  <input
                    className="w-full h-9 border px-3 rounded-md outline-none focus:border-blue"
                    type="text"
                    name="sale_price"
                    placeholder="16.99"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold text-sm"
                  htmlFor="offer_sale_price"
                >
                  Poster
                </label>
                <div className="border w-max rounded-md overflow-hidden">
                  <div className="w-[320px] h-[426px] border-b flex items-center justify-center px-4">
                    {poster && (
                      <Image
                        src={poster}
                        alt=""
                        width={320}
                        height={426}
                        priority={true}
                      />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Image url"
                    className="w-full h-8 pb-[2px] outline-none px-2"
                    value={poster}
                    onChange={(e) => setPoster(e.target.value)}
                  />
                </div>
              </div>
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
