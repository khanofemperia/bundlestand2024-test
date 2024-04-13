"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useEffect, FormEvent } from "react";
import EditProductAction from "@/actions/edit-product";
import Spinner from "@/elements/Spinners/white";
import { HiArrowLeft } from "react-icons/hi2";
import Image from "next/image";
import clsx from "clsx";
import AlertMessage from "@/components/AlertMessage";
import { UpdateOfferAction } from "@/actions/offers";
import { capitalizeFirstLetter } from "@/libraries/utils";

export function EditBasicDetailsButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editProduct.name,
    overlayName: state.pages.editProduct.overlays.basicDetails.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 grid place-items-center rounded-full ease-in-out hover:bg-gray2 hover:ease-out"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export default function BasicDetailsOverlay({
  offerData,
}: {
  offerData: OfferProps;
}) {
  const VISIBLE = "VISIBLE";
  const HIDDEN = "HIDDEN";

  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [basicDetails, setBasicDetails] = useState({
    price: offerData.price,
    sale_price: offerData.sale_price,
    poster: offerData.poster,
  });
  const [visibility, setVisibility] = useState(
    offerData.visibility.toUpperCase()
  );

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editProduct.name,
      overlayName: state.pages.editProduct.overlays.basicDetails.name,
      isOverlayVisible: state.pages.editProduct.overlays.basicDetails.isVisible,
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

  const handleBasicDetailsInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setBasicDetails((prevBasicDetails) => ({
      ...prevBasicDetails,
      [name]: value,
    }));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    let result;

    try {
      result = await UpdateOfferAction({
        offerId: offerData.id,
        poster: basicDetails.poster,
        price: basicDetails.price,
        sale_price: basicDetails.sale_price,
        visibility: capitalizeFirstLetter(visibility.toLowerCase()),
      });
    } catch (error) {
      console.error("Error changing product index:", error);
    } finally {
      setLoading(false);

      if (result && result.status.code === 200) {
        setAlertMessage(result.status.message);
        setShowAlert(true);
      } else if (result?.status.message) {
        setAlertMessage(result.status.message);
        setShowAlert(true);
      }
    }
  };

  const handleToggle = () => {
    const newVisibility =
      visibility.toUpperCase() === VISIBLE ? HIDDEN : VISIBLE;
    setVisibility(newVisibility);
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[500px] h-max bg-white mx-auto shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSave}>
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => hideOverlay({ pageName, overlayName })}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Edit basic details
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue min-w-[72px] h-9 px-3 rounded-full flex items-center justify-center ease-in-out hover:bg-blue2 hover:ease-out"
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
                <div className="w-full py-2 px-3 rounded-lg bg-gray2 relative flex justify-between">
                  <p className="text-sm font-semibold">
                    Show special offer in product details
                  </p>
                  <div
                    onClick={handleToggle}
                    className={clsx(
                      "w-10 h-5 rounded-full relative cursor-pointer ease-in-out duration-200",
                      {
                        "bg-white border": visibility === HIDDEN,
                        "bg-blue border border-blue": visibility === VISIBLE,
                      }
                    )}
                  >
                    <div
                      className={clsx(
                        "w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute top-1/2 transform -translate-y-1/2",
                        {
                          "left-[5px] bg-black": visibility === HIDDEN,
                          "left-[23px] bg-white": visibility === VISIBLE,
                        }
                      )}
                    ></div>
                  </div>
                </div>
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
                      value={basicDetails.price}
                      onChange={handleBasicDetailsInputChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-semibold text-sm"
                      htmlFor="sale_price"
                    >
                      Sale price
                    </label>
                    <input
                      className="w-full h-9 border px-3 rounded-md outline-none focus:border-blue"
                      type="text"
                      name="sale_price"
                      placeholder="16.99"
                      value={basicDetails.sale_price}
                      onChange={handleBasicDetailsInputChange}
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
                      {basicDetails.poster && (
                        <Image
                          src={basicDetails.poster}
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
                      value={basicDetails.poster}
                      onChange={handleBasicDetailsInputChange}
                    />
                  </div>
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
