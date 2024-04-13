"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuickviewStore } from "@/zustand/website/quickviewStore";
import ProductImages from "../ProductImages";
import SpecialOffer from "../SpecialOffer";
import { HiXMark } from "react-icons/hi2";
import ProductOptions from "../Product/ProductOptions";
import styles from "./description.module.css";

type ColorProps = {
  name: string;
  image: string;
};

type QuickviewButtonProps = {
  product: {
    id: string;
    name: string;
    price: string;
    poster: string;
    images: string[] | null;
    description: string | null;
    colors: ColorProps[] | null;
    sizes: SizeChartProps | null;
    slug: string;
  };
};

export function QuickviewButton({ product }: QuickviewButtonProps) {
  const { showOverlay } = useQuickviewStore();
  const setSelectedProduct = useQuickviewStore(
    (state) => state.setSelectedProduct
  );

  const handleClick = async () => {
    try {
      const response = await fetch(`/api/carts/products/${product.id}`);
      const { isInCart, productInCart } = await response.json();

      setSelectedProduct(product, isInCart, productInCart);
      showOverlay();
    } catch (error) {
      console.error("Error checking cart:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute right-[10px] bottom-[10px] outline-none border-none rounded-full w-[50px] h-8 flex items-center justify-center before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:border before:border-black before:rounded-full hover:before:scale-105"
    >
      <Image
        src="/cart_plus.svg"
        alt="Add to cart"
        width={25}
        height={25}
        priority={true}
      />
    </button>
  );
}

export default function Quickview() {
  const { hideOverlay } = useQuickviewStore();

  const { isQuickviewOpen } = useQuickviewStore((state) => ({
    isQuickviewOpen: state.isVisible,
  }));

  const { isInCart, productInCart, selectedProduct, setSelectedProduct } =
    useQuickviewStore((state) => ({
      selectedProduct: state.selectedProduct,
      setSelectedProduct: state.setSelectedProduct,
      isInCart: state.isInCart,
      productInCart: state.productInCart,
    }));

  useEffect(() => {
    if (isQuickviewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isQuickviewOpen]);

  const isVisible = isQuickviewOpen && selectedProduct;

  return (
    isVisible && (
      <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="w-max max-h-[554px] py-5 absolute top-16 bottom-16 bg-white mx-auto shadow rounded-14px">
          <div className="px-10 flex flex-row custom-scrollbar max-h-[554px] h-full overflow-x-hidden overflow-y-visible">
            <div className="w-[582px]">
              <ProductImages
                images={selectedProduct.images}
                poster={selectedProduct.poster}
                name={selectedProduct.name}
              />
              {selectedProduct.description && (
                <div className="w-full mt-[22px] p-5 rounded-[24px] bg-gray text-xl">
                  <div
                    id="product-description"
                    className={styles.description}
                    dangerouslySetInnerHTML={{
                      __html: selectedProduct.description || "",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="w-[394px] mt-[18px] ml-5 flex flex-col gap-8">
              <p className="mt-[-6px]">{selectedProduct.name}</p>
              <ProductOptions
                cartInfo={{
                  isInCart,
                  productInCart,
                }}
                productInfo={{
                  id: selectedProduct.id,
                  price: selectedProduct.price,
                  colors: selectedProduct.colors,
                  sizeChart: selectedProduct.sizes,
                }}
              />
              <SpecialOffer />
            </div>
          </div>
          <button
            onClick={hideOverlay}
            className="h-9 w-9 rounded-full absolute right-3 top-2 flex items-center justify-center ease-in-out hover:duration-300 hover:bg-gray2 hover:ease-out"
            type="button"
          >
            <HiXMark size={24} />
          </button>
        </div>
      </div>
    )
  );
}
