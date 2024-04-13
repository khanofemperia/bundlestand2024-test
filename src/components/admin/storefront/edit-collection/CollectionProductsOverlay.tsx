"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft, HiMiniChevronDown } from "react-icons/hi2";
import clsx from "clsx";
import { capitalizeFirstLetter } from "@/libraries/utils";
import { useEffect, useState } from "react";
import AddCollectionProductsOverlay, {
  AddCollectionProductsButton,
} from "./AddCollectionProducts";
import ChangeProductIndexOverlay, {
  ChangeProductIndexButton,
} from "./ChangeProductIndex";
import RemoveCollectionProductsOverlay, {
  RemoveCollectionProductsButton,
} from "./RemoveCollectionProducts";
import Image from "next/image";

type CollectionProductsProps = {
  id: string;
  index: number;
  name: string;
  price: string;
  poster: string;
  slug: string;
  visibility: string;
};

export function CollectionProductsButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.collectionProducts.name,
  }));

  return (
    <button
      title="See more products"
      onClick={() => showOverlay({ pageName, overlayName })}
      className="text-sm absolute top-0 left-1/2 [transform:translateX(-50%)] outline-none border-none rounded-full w-28 h-10 flex items-center justify-center before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:border before:border-black before:rounded-full hover:before:scale-105"
    >
      See more
    </button>
  );
}

export function CollectionProductsOverlay({
  data,
}: {
  data: { collectionId: string; products: CollectionProductsProps[] };
}) {
  const [visibilityDropdown, setVisibilityDropdown] = useState<boolean>(false);
  const [selectedVisibility, setSelectedVisibility] = useState("hidden");
  const [products, setProducts] = useState<CollectionProductsProps[]>(
    data.products
  );
  const [hasMatchingProducts, setHasMatchingProducts] = useState<boolean>(true);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>(
    {
      visible: 0,
      hidden: 0,
    }
  );

  const calculateProductCounts = (items: CollectionProductsProps[]) => {
    const visibilityCounts: { [key: string]: number } = {
      visible: 0,
      hidden: 0,
    };

    items.forEach((product) => {
      const visibility = product.visibility.toLowerCase();
      visibilityCounts[visibility]++;
    });

    setProductCounts(visibilityCounts);
  };

  useEffect(() => {
    const updateVisibilityFlag = (products: CollectionProductsProps[]) => {
      const matchingProducts = products.filter(
        (product: CollectionProductsProps) =>
          product.visibility.toLowerCase() === selectedVisibility.toLowerCase()
      );

      const hasMatchingProducts = matchingProducts.length > 0;
      setHasMatchingProducts(hasMatchingProducts);

      calculateProductCounts(products);
    };

    // Check if there are products matching the default visibility
    updateVisibilityFlag(products);
  }, [selectedVisibility]);

  const handleUpdatedProducts = (items: CollectionProductsProps[]) => {
    // Update the products state
    setProducts([...items]);

    // Recalculate the counts based on the updated products
    calculateProductCounts(items);

    // Check if there are products matching the selected visibility
    const matchingProducts = items.filter(
      (product) =>
        product.visibility.toLowerCase() === selectedVisibility.toLowerCase()
    );

    // Set the flag based on whether there are matching products
    const hasMatchingProducts = matchingProducts.length > 0;
    setHasMatchingProducts(hasMatchingProducts);
  };

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
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.collectionProducts.name,
    isOverlayVisible:
      state.pages.editCollection.overlays.collectionProducts.isVisible,
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

  const toggleVisibilityDropdown = () => {
    setVisibilityDropdown((prevState) => !prevState);
  };

  const updateVisibilityFlag = (visibility: string) => {
    // Check if there are products matching the selected visibility
    const matchingProducts = products.filter(
      (product) => product.visibility.toLowerCase() === visibility.toLowerCase()
    );

    const hasMatchingProducts = matchingProducts.length > 0;
    setHasMatchingProducts(hasMatchingProducts);
  };

  const handleVisibilitySelect = (visibility: string) => {
    setSelectedVisibility(visibility.toLowerCase());
    setVisibilityDropdown(false);
    updateVisibilityFlag(visibility);
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[840px] px-4 py-4 pt-[14px] bg-white mx-auto mt-20 shadow rounded-14px">
            <button
              onClick={() => hideOverlay({ pageName, overlayName })}
              className="mb-8 flex items-center gap-1 cursor-pointer text-blue hover:underline"
            >
              <HiArrowLeft size={20} className="fill-blue" />
              <span className="heading-size-h3 text-blue">
                Arrange, add, or remove collection products
              </span>
            </button>
            <div className="flex justify-end gap-1 mb-[5px]">
              <div className="relative visibility-dropdown-container">
                <button
                  onClick={toggleVisibilityDropdown}
                  className="bg-gray2 w-max h-9 px-3 rounded-full flex items-center justify-center gap-[3px] ease-in-out hover:bg-gray3 hover:duration-300 hover:ease-out"
                >
                  <span>{capitalizeFirstLetter(selectedVisibility)}</span>
                  <HiMiniChevronDown
                    className="-ml-1 -mr-[6px]  mt-[2px]"
                    size={22}
                  />
                </button>
                <div
                  className={`${
                    visibilityDropdown ? "block" : "hidden"
                  } shadow-custom3 rounded-md w-32 overflow-hidden absolute top-[35px] z-10 mt-1 bg-white`}
                >
                  <div className="border-b p-1">
                    <div
                      onClick={() => handleVisibilitySelect("Visible")}
                      className="cursor-pointer h-[29px] w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                    >
                      <div className="flex gap-1 items-center justify-center text-gray cursor-pointer">
                        <span>Visible</span>
                        <span className="w-max h-5 px-1 rounded min-w-[20px] bg-gold flex items-center justify-center text-white heading-size-h3">
                          {productCounts.visible}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-b p-1">
                    <div
                      onClick={() => handleVisibilitySelect("Hidden")}
                      className="cursor-pointer h-[29px] w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                    >
                      <div className="flex gap-1 items-center justify-center text-gray cursor-pointer">
                        <span>Hidden</span>
                        <span className="w-max h-5 px-1 rounded min-w-[20px] bg-gray4 flex items-center justify-center text-white heading-size-h3">
                          {productCounts.hidden}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AddCollectionProductsButton />
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
                    <th className="min-w-[120px] w-[120px] pl-3 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        Visibility
                      </h3>
                    </th>
                    <th className="min-w-[120px] w-[120px] pl-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {hasMatchingProducts ? (
                    products
                      .filter(
                        (product) =>
                          product.visibility.toLowerCase() ===
                          selectedVisibility.toLowerCase()
                      )
                      .map(({ id, index, poster, name, price, visibility }) => (
                        <tr
                          key={index}
                          className="border-b h-[124px] text-left"
                        >
                          <td className="min-w-[50px] w-[50px] pl-3 border-r">
                            <p className="text-sm font-semibold text-gray">
                              {index}
                            </p>
                          </td>
                          <td className="min-w-[97px] w-[97px] border-r p-2">
                            <div className="w-[80px] h-[107px] bg-gray2 overflow-hidden flex items-center justify-center">
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
                          <td className="min-w-[120px] w-[120px] pl-3 border-r">
                            <p
                              className={`font-semibold w-max text-sm h-[26px] px-2 rounded-full flex items-center justify-center bg-opacity-15 ${clsx(
                                {
                                  "text-gold bg-gold":
                                    visibility.toLowerCase() === "visible",
                                  "text-gray bg-gray4":
                                    visibility.toLowerCase() === "hidden",
                                }
                              )}`}
                            >
                              {capitalizeFirstLetter(visibility)}
                            </p>
                          </td>
                          <td className="min-w-[120px] w-[120px]">
                            <div className="flex items-center justify-center gap-2">
                              <ChangeProductIndexButton
                                collectionId={data.collectionId}
                                productId={id}
                                index={index}
                                name={name}
                              />
                              <RemoveCollectionProductsButton
                                id={id}
                                name={name}
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
      <AddCollectionProductsOverlay
        collectionId={data.collectionId}
        handleUpdatedProducts={handleUpdatedProducts}
      />
      <RemoveCollectionProductsOverlay
        collectionId={data.collectionId}
        handleUpdatedProducts={handleUpdatedProducts}
      />
      <ChangeProductIndexOverlay
        handleUpdatedProducts={handleUpdatedProducts}
      />
    </>
  );
}
