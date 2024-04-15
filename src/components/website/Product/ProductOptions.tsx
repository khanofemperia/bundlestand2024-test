"use client";

import Image from "next/image";
import ViewCartButton from "../ViewCartButton";
import { HiMiniChevronRight, HiXMark } from "react-icons/hi2";
import { useOverlayStore } from "@/zustand/website/overlayStore";
import { productInternationalSizes } from "@/libraries/utils";
import { AddToCartAction } from "@/actions/add-to-cart";
import { formatNumberWithCommas } from "@/libraries/utils";
import { useAlertStore } from "@/zustand/website/alertStore";
import { useEffect, useState, useTransition } from "react";
import SpinnerWhite from "@/elements/Spinners/white";

type ColorProps = {
  name: string;
  image: string;
};

type ProductColorsProps = {
  colors: ColorProps[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
};

type ProductSizeChartProps = {
  sizeChart: SizeChartProps;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
};

type SizeChartTableProps = {
  sizeChart: SizeChartProps;
  unit: "in" | "cm";
};

function ProductColors({
  colors,
  selectedColor,
  setSelectedColor,
}: ProductColorsProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {colors.map(({ name, image }, index) => (
          <div
            onClick={() => setSelectedColor(name)}
            key={index}
            className={`cursor-pointer relative w-[40px] h-[40px] flex items-center justify-center ${
              selectedColor === name &&
              "before:content-[''] before:h-12 before:w-12 before:absolute before:rounded-[6px] before:border before:border-blue"
            }`}
          >
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-gray border rounded">
              <Image src={image} alt={name} width={40} height={40} priority />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductSizeChart({
  sizeChart,
  selectedSize,
  setSelectedSize,
}: ProductSizeChartProps) {
  const [hoveredSizeIndex, setHoveredSizeIndex] = useState<number | null>(null);

  const { showOverlay } = useOverlayStore();
  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.post.name,
    overlayName: state.pages.post.overlays.productSizeChart.name,
    isOverlayVisible: state.pages.post.overlays.productSizeChart.isVisible,
  }));

  return (
    <div>
      <div className="w-[285px] flex flex-wrap gap-[5px]">
        {sizeChart.entry_labels.map((size, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredSizeIndex(index)}
            onMouseLeave={() => setHoveredSizeIndex(null)}
          >
            <div
              onClick={() => setSelectedSize(size.name)}
              className={`font-medium border rounded-full relative px-4 h-7 flex items-center justify-center cursor-pointer hover:border-black ${
                selectedSize === size.name &&
                "border-white hover:border-white before:border before:border-blue before:content-[''] before:h-9 before:w-[calc(100%_+_10px)] before:absolute before:rounded-full"
              }`}
            >
              {size.name}
            </div>
            {hoveredSizeIndex === index && (
              <div className="w-max h-max rounded absolute bottom-[42px] -left-2 p-4 bg-white shadow-[rgba(150,150,150,0.25)_0px_0.0625em_0.0625em,rgba(0,0,0,0.25)_0px_0.125em_0.5em,rgba(255,255,255,0.1)_0px_0px_0px_1px_inset] before:content-[''] before:h-3 before:w-3 before:bg-white before:border-b before:border-r before:absolute before:bottom-[-7px] before:left-6 before:[transform:rotate(45deg)]">
                <h3 className="font-semibold text-sm mb-2">
                  Product measurements
                </h3>
                {sizeChart.sizes[index].measurements && (
                  <ul className="text-sm flex flex-col gap-1">
                    {sizeChart.columns
                      .filter(
                        (column) =>
                          // Exclude "Size" column and specified measurements
                          column.name !== "Size" &&
                          !["US", "EU", "UK", "NZ", "AU", "DE"].includes(
                            column.name
                          )
                      )
                      .sort((a, b) => a.index - b.index)
                      .map((column) => (
                        <li key={column.name} className="text-nowrap">
                          <span className="text-sm text-gray">{`${column.name}: `}</span>
                          <span className="text-sm font-semibold">
                            {`${
                              sizeChart.sizes[index].measurements[column.name]
                                ?.in
                            }in`}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedSize && (
        <div
          onClick={() => showOverlay({ pageName, overlayName })}
          className="bg-gray px-3 py-2 mt-2 rounded relative cursor-pointer"
        >
          <div>
            {sizeChart.entry_labels.find((label) => label.name === selectedSize)
              ?.index !== undefined &&
              sizeChart.sizes[
                sizeChart.entry_labels.find(
                  (label) => label.name === selectedSize
                )!.index - 1
              ].measurements && (
                <ul className="text-sm max-w-[300px] flex flex-wrap gap-x-2 gap-y-1">
                  {sizeChart.columns
                    .filter(
                      (column) =>
                        // Exclude "Size" column and specified measurements
                        column.name !== "Size" &&
                        !["US", "EU", "UK", "NZ", "AU", "DE"].includes(
                          column.name
                        )
                    )
                    .sort((a, b) => a.index - b.index)
                    .map((column) => (
                      <li key={column.name} className="text-nowrap">
                        <span className="text-sm text-gray">{`${column.name}: `}</span>
                        <span className="text-sm font-semibold">
                          {`${
                            sizeChart.sizes[
                              sizeChart.entry_labels.find(
                                (label) => label.name === selectedSize
                              )!.index - 1
                            ].measurements[column.name]?.in
                          }in`}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
          </div>
          <HiMiniChevronRight
            size={24}
            className="absolute top-[6px] right-[4px] fill-neutral-400"
          />
        </div>
      )}
    </div>
  );
}

function SizeChartTable({ sizeChart, unit }: SizeChartTableProps) {
  return (
    <div className="border border-neutral-200 w-max rounded overflow-hidden">
      <table className="w-max bg-white">
        <thead className="h-10 border-b border-neutral-200">
          <tr>
            {sizeChart.columns.map((column, index) => (
              <th
                key={index}
                className={`font-semibold leading-5 text-[15px] text-nowrap px-5 ${
                  index === sizeChart.columns.length - 1
                    ? ""
                    : "border-r border-neutral-200"
                } ${index === 0 ? "sticky left-0 bg-gray" : ""}`}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizeChart.sizes.map((entry, entryIndex) => (
            <tr
              key={entryIndex}
              className={`h-10 ${
                entryIndex === sizeChart.sizes.length - 1
                  ? ""
                  : " border-b border-neutral-200"
              }`}
            >
              <td className="font-semibold leading-5 text-[15px] text-center border-r border-neutral-200 w-[100px] sticky left-0 bg-gray">
                {entry.size}
              </td>
              {sizeChart.columns.slice(1).map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  className={`text-center w-[100px] ${
                    columnIndex === sizeChart.columns.length - 2
                      ? ""
                      : " border-r border-neutral-200"
                  }`}
                >
                  {unit === "in"
                    ? entry.measurements[
                        column.name as keyof typeof entry.measurements
                      ]?.in
                    : entry.measurements[
                        column.name as keyof typeof entry.measurements
                      ]?.cm}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductOptions({
  cartInfo,
  productInfo,
}: {
  cartInfo: {
    isInCart: boolean;
    productInCart: {
      id: string;
      color: string;
      size: string;
    } | null;
  };
  productInfo: {
    id: string;
    price: string;
    colors: ColorProps[] | null;
    sizeChart: SizeChartProps | null;
  };
}) {
  const [selectedColor, setSelectedColor] = useState(
    cartInfo.productInCart?.color ?? ""
  );
  const [selectedSize, setSelectedSize] = useState(
    cartInfo.productInCart?.size ?? ""
  );
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<
    { success: boolean; message: string } | undefined
  >(undefined);

  const { showAlert } = useAlertStore();
  const { hideOverlay } = useOverlayStore();

  const { pageName, overlayName, isOverlayVisible } = useOverlayStore(
    (state) => ({
      pageName: state.pages.post.name,
      overlayName: state.pages.post.overlays.productSizeChart.name,
      isOverlayVisible: state.pages.post.overlays.productSizeChart.isVisible,
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

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      return showAlert(!selectedColor ? "Select a color" : "Select a size");
    }

    startTransition(async () => {
      const result = await AddToCartAction({
        id: productInfo.id,
        color: selectedColor,
        size: selectedSize,
      });

      setResponse(result);
    });
  };

  useEffect(() => {
    if (response) {
      if (response.success === false) {
        showAlert("Error, refresh and try again");
      } else {
        console.log(cartInfo.isInCart);
        console.log(response.success);
        showAlert(response.message);
      }
    }
  }, [response]);

  return (
    <>
      {productInfo.colors &&
        productInfo.colors?.length > 0 &&
        productInfo.sizeChart &&
        productInfo.sizeChart.entry_labels?.length > 0 && (
          <div className="flex flex-col gap-5">
            <ProductColors
              colors={productInfo.colors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
            <ProductSizeChart
              sizeChart={productInfo.sizeChart}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>
        )}
      {productInfo.colors &&
        productInfo.colors?.length > 0 &&
        !productInfo.sizeChart && (
          <ProductColors
            colors={productInfo.colors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        )}
      {productInfo.colors?.length === 0 &&
        productInfo.sizeChart &&
        productInfo.sizeChart.entry_labels?.length > 0 && (
          <ProductSizeChart
            sizeChart={productInfo.sizeChart}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        )}
      {isOverlayVisible && productInfo.sizeChart && (
        <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-max max-h-[554px] py-5 absolute top-16 bottom-16 bg-white mx-auto shadow rounded-14px overflow-hidden">
            <button
              onClick={() => hideOverlay({ pageName, overlayName })}
              className="h-9 w-9 rounded-full absolute right-3 top-2 flex items-center justify-center ease-in-out hover:duration-300 hover:bg-gray2 hover:ease-out"
              type="button"
            >
              <HiXMark size={24} />
            </button>
            <div className="px-7 flex flex-row custom-scrollbar max-h-[554px] h-full overflow-x-hidden overflow-y-visible">
              <div>
                <h2 className="font-semibold mb-1">Product measurements</h2>
                <p className="text-sm text-gray max-w-[500px] w-full">
                  Look for words like 'fitted,' 'loose,' and 'baggy' in the
                  product description to better understand how this style will
                  fit you.
                </p>
                <div className="flex flex-col gap-6 pb-16 mt-6">
                  <div>
                    <h3 className="font-semibold text-sm mb-4">Inches</h3>
                    <SizeChartTable
                      sizeChart={productInfo.sizeChart}
                      unit="in"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-4">Centimeters</h3>
                    <SizeChartTable
                      sizeChart={productInfo.sizeChart}
                      unit="cm"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-4">
                      International size conversions
                    </h3>
                    <div className="border border-neutral-200 w-[512px] rounded overflow-y-hidden overflow-x-visible [scrollbar-width:none]">
                      <table className="w-max bg-white">
                        <thead className="h-10 border-b border-neutral-200">
                          <tr>
                            {Object.keys(productInternationalSizes).map(
                              (sizeType, index) => (
                                <th
                                  key={index}
                                  className={`font-semibold leading-5 text-[15px] text-nowrap px-5 ${
                                    index ===
                                    Object.keys(productInternationalSizes)
                                      .length -
                                      1
                                      ? ""
                                      : "border-r border-neutral-200"
                                  } ${
                                    index === 0 ? "sticky left-0 bg-gray" : ""
                                  }`}
                                >
                                  {sizeType}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {productInternationalSizes.Size.map(
                            (_, sizeIndex) => (
                              <tr
                                key={sizeIndex}
                                className={`h-10 ${
                                  sizeIndex !==
                                  productInternationalSizes.Size.length - 1
                                    ? "border-b border-neutral-200"
                                    : ""
                                }`}
                              >
                                {Object.keys(productInternationalSizes).map(
                                  (sizeType, index) => (
                                    <td
                                      key={index}
                                      className={`text-center px-5 w-[100px] ${
                                        index === 0
                                          ? "sticky left-0 bg-gray border-r border-neutral-200 font-semibold leading-5 text-[15px]"
                                          : index ===
                                            Object.keys(
                                              productInternationalSizes
                                            ).length -
                                              1
                                          ? ""
                                          : "border-r border-neutral-200"
                                      }`}
                                    >
                                      {
                                        (
                                          productInternationalSizes as Record<
                                            string,
                                            string[]
                                          >
                                        )[sizeType][sizeIndex]
                                      }
                                    </td>
                                  )
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {cartInfo.isInCart || response?.success ? (
        <ViewCartButton />
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            type="button"
            className={`rounded-full flex items-center justify-center px-3 h-12 min-h-12 w-[320px] relative font-semibold text-white bg-[#484848] ease-in-out hover:duration-300 hover:ease-out hover:bg-black ${
              isPending ? "cursor-context-menu opacity-50" : ""
            }`}
            disabled={isPending}
          >
            {isPending ? (
              <SpinnerWhite size={28} />
            ) : (
              `Add to Cart - $${formatNumberWithCommas(productInfo.price)}`
            )}
          </button>
        </div>
      )}
    </>
  );
}
