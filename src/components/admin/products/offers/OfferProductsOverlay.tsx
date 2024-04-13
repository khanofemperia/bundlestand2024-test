"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft, HiMiniPlus } from "react-icons/hi2";
import { useEffect, useState } from "react";
import Image from "next/image";
import ChangeProductIndexOverlay, {
  ChangeProductIndexButton,
} from "./ChangeProductIndex";
import RemoveProductOverlay, { RemoveProductButton } from "./RemoveProduct";
import AlertMessage from "@/components/AlertMessage";
import { AddProductAction } from "@/actions/offers";
import SpinnerGray from "@/elements/Spinners/gray";
import clsx from "clsx";

type OfferProductProps = {
  id: string;
  index: number;
  poster: string;
  name: string;
  price: string;
};

export function OfferProductsButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editOffer.name,
    overlayName: state.pages.editOffer.overlays.offerProducts.name,
  }));

  return (
    <button
      title="See more products"
      onClick={() => showOverlay({ pageName, overlayName })}
      className="text-sm absolute top-0 left-1/2 [transform:translateX(-50%)] outline-none border-none rounded-full w-28 h-10 flex items-center justify-center before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:border before:border-black before:rounded-full before:transition before:duration-100 before:ease-in-out hover:before:scale-105"
    >
      See more
    </button>
  );
}

export function OfferProductsOverlay({
  data,
}: {
  data: { offerId: string; products: OfferProductProps[] };
}) {
  const [visibilityDropdown, setVisibilityDropdown] = useState<boolean>(false);
  const [selectedVisibility, setSelectedVisibility] = useState("hidden");
  const [products, setProducts] = useState<OfferProductProps[]>(data.products);
  const [newProductId, setNewProductId] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

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
  }, [visibilityDropdown]);

  const { hideOverlay } = useOverlayStore();

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    isAddCollectionProductsVisible,
    isRemoveCollectionProductsVisible,
    isChangeProductIndexVisible,
  } = useOverlayStore((state) => ({
    pageName: state.pages.editOffer.name,
    overlayName: state.pages.editOffer.overlays.offerProducts.name,
    isOverlayVisible: state.pages.editOffer.overlays.offerProducts.isVisible,
    isAddCollectionProductsVisible:
      state.pages.editCollection.overlays.addCollectionProducts.isVisible,
    isRemoveCollectionProductsVisible:
      state.pages.editCollection.overlays.removeCollectionProducts.isVisible,
    isChangeProductIndexVisible:
      state.pages.editCollection.overlays.changeProductIndex.isVisible,
  }));

  useEffect(() => {
    if (
      isAddCollectionProductsVisible ||
      isRemoveCollectionProductsVisible ||
      isChangeProductIndexVisible ||
      isOverlayVisible
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [
    isAddCollectionProductsVisible,
    isRemoveCollectionProductsVisible,
    isChangeProductIndexVisible,
    isOverlayVisible,
  ]);

  const handleUpdatedProducts = (items: OfferProductProps[]) => {
    setProducts([...items]);
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const addProduct = async () => {
    if (!newProductId.trim()) {
      setAlertMessage("Enter product ID");
      setShowAlert(true);
    } else {
      setLoading(true);
      let result;

      try {
        result = await AddProductAction({
          offerId: data.offerId,
          productId: newProductId,
        });
      } catch (error) {
        console.error("Error changing product index:", error);
      } finally {
        setLoading(false);

        if (result && result.status.code === 200) {
          handleUpdatedProducts(result.updatedProducts);
          setAlertMessage(result.status.message);
          setShowAlert(true);
        } else if (result?.status.message) {
          setAlertMessage(result.status.message);
          setShowAlert(true);
        }
      }
    }
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[840px] h-max px-4 py-4 pt-[14px] bg-white mx-auto mt-20 shadow rounded-14px">
            <button
              onClick={() => hideOverlay({ pageName, overlayName })}
              className="mb-8 flex items-center gap-1 cursor-pointer text-blue hover:underline"
            >
              <HiArrowLeft size={20} className="fill-blue" />
              <span className="heading-size-h3 text-blue">
                Arrange, add, or remove products
              </span>
            </button>
            <div className="w-full mb-2 flex justify-end">
              <div className="rounded-full w-[300px] h-12 overflow-hidden bg-gray border border-neutral-200 flex items-center gap-1 pr-2">
                <input
                  className="w-full h-full pl-5 bg-transparent"
                  type="text"
                  placeholder="Paste product ID (12345)"
                  onChange={(event) => setNewProductId(event.target.value)}
                  disabled={loading}
                />
                <button
                  onClick={addProduct}
                  disabled={loading}
                  className={`min-w-8 w-8 h-8 rounded-full flex items-center justify-center transition duration-300 ease-in-out ${clsx(
                    {
                      "hover:bg-gray2": !loading,
                    }
                  )}`}
                >
                  {!loading ? <HiMiniPlus size={26} /> : <SpinnerGray />}
                </button>
              </div>
            </div>
            <div className="w-full mx-auto pb-2 rounded-lg overflow-hidden [box-shadow:rgb(122,122,122,18%)_0px_3px_2px_0px,_rgb(0,0,0,20%)_0px_0px_1px_1px]">
              <table className="border-collapse">
                <thead className="border-b bg-gray2">
                  <tr className="h-9 text-left">
                    <th className="min-w-[50px] w-[50px] pl-3 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        #
                      </h3>
                    </th>
                    <th className="min-w-[97px] w-[97px] pl-3 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        Poster
                      </h3>
                    </th>
                    <th className="w-full pl-3 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        Name
                      </h3>
                    </th>
                    <th className="min-w-[180px] w-[180px] pl-3 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        Price
                      </h3>
                    </th>
                    <th className="min-w-[120px] w-[120px] pl-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map(({ id, index, poster, name, price }) => (
                      <tr key={index} className="border-b h-[124px] text-left">
                        <td className="min-w-[50px] w-[50px] pl-3 border-r">
                          <p className="text-sm font-semibold text-gray">
                            {index}
                          </p>
                        </td>
                        <td className="min-w-[97px] w-[97px] border-r p-2">
                          <div className="w-[80px] h-[106px] bg-gray2 overflow-hidden flex items-center justify-center">
                            {name && (
                              <Image
                                src={poster}
                                alt={name}
                                width={80}
                                height={80}
                                priority={true}
                              />
                            )}
                          </div>
                        </td>
                        <td className="w-full pl-3 pr-2 pt-[2px] border-r">
                          <p className="line-clamp-2">{name}</p>
                        </td>
                        <td className="min-w-[180px] w-[180px] pl-3 border-r">
                          <div className="w-max flex items-center justify-center gap-2">
                            <p className="text-sm">${price}</p>
                          </div>
                        </td>
                        <td className="min-w-[120px] w-[120px]">
                          <div className="flex items-center justify-center gap-2">
                            <ChangeProductIndexButton
                              offerId={data.offerId}
                              productId={id}
                              productIndex={String(index)}
                              productName={name}
                            />
                            <RemoveProductButton
                              offerId={data.offerId}
                              productId={id}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b h-9 text-left">
                      <td colSpan={6} className="text-center italic py-5">
                        No results
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <ChangeProductIndexOverlay
        handleUpdatedProducts={handleUpdatedProducts}
      />
      <RemoveProductOverlay handleUpdatedProducts={handleUpdatedProducts} />
      {showAlert && (
        <AlertMessage
          message={alertMessage}
          hideAlertMessage={hideAlertMessage}
        />
      )}
    </>
  );
}
