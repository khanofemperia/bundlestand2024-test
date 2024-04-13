"use client";

import Image from "next/image";
import { HiMiniChevronRight, HiXMark } from "react-icons/hi2";
import { useOverlayStore } from "@/zustand/website/overlayStore";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

type SelectedColorProps = {
  productId: number;
  colorName: string;
};

type SelectedSizeProps = {
  productId: number;
  sizeName: string;
  measurements: { [key: string]: any };
};

type HoveredSizeProps = {
  productId: number;
  hoveredSizeIndex: number;
  hoveredSizeMeasurements: { [key: string]: any };
};

export function SpecialOfferButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.post.name,
    overlayName: state.pages.post.overlays.specialOffer.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      type="button"
      className="w-full h-14 rounded-full shadow-custom2 bg-red text-white text-xl font-extrabold [text-shadow:#707070_0px_1px_0px] leading-[26px] [word-spacing:2px] [letter-spacing:-1px]"
    >
      YES, LET'S UPGRADE
    </button>
  );
}

export default function SpecialOfferOverlay() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<SelectedSizeProps[]>([]);
  const [hoveredSize, setHoveredSize] = useState<HoveredSizeProps | null>(null);
  const [selectedColors, setSelectedColors] = useState<SelectedColorProps[]>(
    []
  );

  const products = getData();

  const { hideOverlay } = useOverlayStore();

  const { pageName, overlayName, isOverlayVisible } = useOverlayStore(
    (state) => ({
      pageName: state.pages.post.name,
      overlayName: state.pages.post.overlays.specialOffer.name,
      isOverlayVisible: state.pages.post.overlays.specialOffer.isVisible,
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

  const extractFilteredColumns = (
    productId: number,
    measurements: { [key: string]: any }
  ) => {
    const product = products.find((product) => product.id === productId);

    if (!product || !product.size_chart) {
      console.error("Product data or size chart is missing.");
      return;
    }

    const specialOffer = product.size_chart;

    const filteredMeasurements: { [key: string]: any } = {};
    Object.keys(measurements).forEach((key) => {
      if (specialOffer.columns.some((col) => col.name === key)) {
        filteredMeasurements[key] = measurements[key];
      }
    });

    const sortedMeasurements: { [key: string]: any } = {};
    specialOffer.columns.forEach((col) => {
      if (filteredMeasurements[col.name]) {
        sortedMeasurements[col.name] = filteredMeasurements[col.name];
      }
    });

    const filteredColumns = Object.fromEntries(
      Object.entries(sortedMeasurements).filter(
        ([columnName]) =>
          columnName !== "Size" &&
          !["US", "EU", "UK", "NZ", "AU", "DE"].includes(columnName)
      )
    );

    return filteredColumns;
  };

  const updateHoveredSizeMeasurements = (
    productId: number,
    productIndex: number,
    measurements: { [key: string]: any }
  ) => {
    const filteredColumns = extractFilteredColumns(productId, measurements);
    if (!filteredColumns) return;

    setHoveredSize({
      productId,
      hoveredSizeIndex: productIndex,
      hoveredSizeMeasurements: filteredColumns,
    });
  };

  const isProductSelected = (productId: number) => {
    return (
      selectedColors.some((color) => color.productId === productId) &&
      selectedSizes.some((size) => size.productId === productId)
    );
  };

  const areOptionsSelected = () => {
    const currentProductId = products[currentProductIndex]?.id;
    const selectedColorForCurrentProduct = selectedColors.find(
      (color) => color.productId === currentProductId
    );

    return (
      selectedColorForCurrentProduct &&
      selectedSizes.some((size) => size.productId === currentProductId)
    );
  };

  const handleColorSelection = (colorName: string, productId: number) => {
    const newColor = {
      colorName,
      productId,
    };

    setSelectedColors((prevColors: SelectedColorProps[]) => {
      const existingIndex = prevColors.findIndex(
        (color) => color.productId === productId
      );

      if (existingIndex !== -1) {
        // Update existing color for the product
        return [
          ...prevColors.slice(0, existingIndex),
          newColor,
          ...prevColors.slice(existingIndex + 1),
        ];
      } else {
        // Add new color for the product
        return [...prevColors, newColor];
      }
    });

    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        productId,
      ]);
    }
  };

  const handleSizeSelection = (
    productId: number,
    sizeName: string,
    measurements: { [key: string]: any }
  ) => {
    const newSize = {
      productId,
      sizeName,
      measurements,
    };

    setSelectedSizes((prevSizes: SelectedSizeProps[]) => {
      const existingIndex = prevSizes.findIndex(
        (size) => size.productId === productId
      );

      if (existingIndex !== -1) {
        // Update existing size for the product
        return [
          ...prevSizes.slice(0, existingIndex),
          newSize,
          ...prevSizes.slice(existingIndex + 1),
        ];
      } else {
        // Add new size for the product
        return [...prevSizes, newSize];
      }
    });

    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        productId,
      ]);
    }
  };

  useEffect(() => {
    if (areOptionsSelected()) {
      setCurrentProductIndex((prevIndex) => prevIndex + 1);
    }
  }, [selectedColors, selectedSizes]);

  return (
    isOverlayVisible && (
      <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
        <div
          className={`bg-asfalt-dark bg-gray w-[1000px] max-h-[580px] py-5 overflow-hidden absolute top-16 bottom-16 mx-auto shadow rounded-14px`}
        >
          <div className="h-max w-max mx-auto mb-2 px-3 flex items-center gap-2">
            {products.map(({ id }, index) => (
              <span
                key={index}
                className={`w-9 h-9 rounded-full font-semibold flex items-center justify-center cursor-context-menu ${
                  isProductSelected(id)
                    ? "bg-black text-white"
                    : "border border-[#b4b4b4] text-gray"
                }`}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <div className="flex flex-col h-full gap-4">
            <div className="px-10 flex flex-row custom-scrollbar max-h-[400px] h-full overflow-x-hidden overflow-y-visible">
              <div className="w-[736px] h-max mx-auto flex flex-wrap gap-2">
                {products.map(
                  ({ id, name, poster, colors, size_chart }, index) => (
                    <div
                      key={index}
                      className={`w-[240px] h-max rounded-[18px] bg-white ${clsx(
                        {
                          "border border-black": isProductSelected(id),
                          border: !isProductSelected(id),
                        }
                      )}`}
                    >
                      <div className="p-2">
                        <div className="w-[222px] h-[222px] flex items-center justify-center overflow-hidden rounded-xl">
                          <Image
                            src={poster}
                            alt={name}
                            width={222}
                            height={222}
                          />
                        </div>
                      </div>
                      <div className="px-2 pt-2 pb-4 flex flex-col gap-3">
                        <div>
                          {colors && (
                            <div className="flex flex-wrap gap-2">
                              {colors.map(({ name, image }, index) => (
                                <div
                                  onClick={() => handleColorSelection(name, id)}
                                  key={index}
                                  className={`cursor-pointer relative w-[40px] h-[40px] flex items-center justify-center ${
                                    selectedColors.some(
                                      (color) =>
                                        color.colorName === name &&
                                        color.productId === id
                                    ) &&
                                    "before:content-[''] before:h-12 before:w-12 before:absolute before:rounded-[6px] before:border before:border-blue"
                                  }
                              `}
                                >
                                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-gray border rounded">
                                    <Image
                                      src={image}
                                      alt={name}
                                      width={40}
                                      height={40}
                                      priority
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="w-[285px] flex flex-wrap gap-[5px]">
                            {size_chart.entry_labels.map((size, index) => (
                              <div
                                onMouseEnter={() =>
                                  updateHoveredSizeMeasurements(
                                    id,
                                    index,
                                    size_chart.sizes[index].measurements
                                  )
                                }
                                onMouseLeave={() => setHoveredSize(null)}
                                key={index}
                                className="relative"
                              >
                                <div
                                  onClick={() =>
                                    handleSizeSelection(
                                      id,
                                      size.name,
                                      size_chart.sizes[index].measurements
                                    )
                                  }
                                  className={`font-medium border rounded-full relative px-4 h-7 flex items-center justify-center cursor-pointer hover:border-black ${
                                    selectedSizes.some(
                                      (item) =>
                                        item.sizeName === size.name &&
                                        item.productId === id
                                    ) &&
                                    "border-white bg-gray hover:border-white before:border before:border-blue before:content-[''] before:h-9 before:w-[calc(100%_+_10px)] before:absolute before:rounded-full"
                                  }`}
                                >
                                  {size.name}
                                </div>
                                {hoveredSize?.hoveredSizeIndex === index &&
                                  hoveredSize.productId === id && (
                                    <div className="w-[200px] h-max rounded z-10 absolute bottom-10 -left-2 p-4 bg-white shadow-[rgba(150,150,150,0.25)_0px_0.0625em_0.0625em,rgba(0,0,0,0.25)_0px_0.125em_0.5em,rgba(255,255,255,0.1)_0px_0px_0px_1px_inset] before:content-[''] before:h-3 before:w-3 before:bg-white before:border-b before:border-r before:absolute before:bottom-[-7px] before:left-6 before:[transform:rotate(45deg)]">
                                      <h3 className="font-semibold text-sm mb-2">
                                        Product measurements
                                      </h3>
                                      {size_chart.sizes[index].measurements && (
                                        <ul className="text-sm flex flex-col gap-1">
                                          {Object.entries(
                                            hoveredSize.hoveredSizeMeasurements
                                          ).map(([measurement, value]) => (
                                            <li
                                              key={measurement}
                                              className="text-nowrap"
                                            >
                                              <span className="text-sm text-gray">
                                                {measurement}:{" "}
                                              </span>
                                              <span className="text-sm font-semibold">{`${
                                                (value as { in: string }).in
                                              }in`}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                          {selectedSizes
                            .filter((item) => item.productId === id)
                            .map((selectedSize, index) => {
                              const filteredColumns = extractFilteredColumns(
                                selectedSize.productId,
                                selectedSize.measurements
                              );
                              if (!filteredColumns) return;

                              return (
                                <div
                                  key={index}
                                  className="bg-gray px-3 py-2 mt-2 rounded relative cursor-pointer"
                                >
                                  <div className="flex flex-wrap gap-2">
                                    <ul className="text-sm flex flex-col gap-1 flex-wrap w-full">
                                      {Object.entries(filteredColumns).map(
                                        ([measurement, value]) => (
                                          <li
                                            key={measurement}
                                            className="text-nowrap"
                                          >
                                            <span className="text-sm text-gray">
                                              {measurement}:{" "}
                                            </span>
                                            <span className="text-sm font-semibold">{`${
                                              (value as { in: string }).in
                                            }in`}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                  <HiMiniChevronRight
                                    size={24}
                                    className="absolute top-[6px] right-[4px] fill-neutral-400"
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="w-full h-[202px] pb-6 flex flex-col items-center gap-[3px]">
              <div>
                <span className="text-xl">$410 value, </span>
                <span className="text-green font-medium text-xl">
                  today it's yours for $37
                </span>
              </div>
              <button
                onClick={() => {
                  console.log(selectedColors);
                  console.log(selectedSizes);
                }}
                className="w-max h-14 rounded-full px-20 mt-1 shadow-custom2 bg-red text-white text-xl font-extrabold [text-shadow:#707070_0px_1px_0px] leading-[26px] [word-spacing:2px] [letter-spacing:-1px]"
              >
                CLAIM THIS LIMITED OFFER NOW
              </button>
            </div>
          </div>
          <button
            onClick={() => hideOverlay({ pageName, overlayName })}
            className="h-9 w-9 rounded-full absolute right-3 top-2 flex items-center justify-center transition duration-300 ease-in-out hover:bg-[#dddddd]"
            type="button"
          >
            <HiXMark size={24} />
          </button>
        </div>
      </div>
    )
  );
}

function getData() {
  return [
    {
      id: 1,
      name: "",
      poster:
        "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
      colors: [
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/937ba0c5d35cd12349f15638b5ded847.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Peach",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Blue",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/c6b32ccc6d0a2375c14f519363829f17.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Green",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/3df067cb48072b2e6c56b88d56bf2733.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Purple",
        },
        // {
        //   image:
        //     "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/033cf8a8400f2f0de5f7cf0917cc0cad.jpg?imageView2/2/w/800/q/70/format/webp",
        //   name: "Red",
        // },
      ],
      size_chart: {
        columns: [
          { index: 1, name: "Size" },
          { index: 2, name: "US" },
          { index: 3, name: "Bust size" },
          { index: 4, name: "Length" },
        ],
        entry_labels: [
          { index: 1, name: "S" },
          { index: 2, name: "M" },
          { index: 3, name: "L" },
          { index: 4, name: "XL" },
        ],
        sizes: [
          {
            measurements: {
              "Bust size": { cm: "108.2", in: "42.6" },
              Length: { cm: "68.1", in: "26.8" },
              US: { cm: "4", in: "4" },
            },
            size: "S",
          },
          {
            measurements: {
              "Bust size": { cm: "112", in: "44.1" },
              Length: { cm: "69.1", in: "27.2" },
              US: { cm: "6", in: "6" },
            },
            size: "M",
          },
          {
            measurements: {
              "Bust size": { cm: "118.1", in: "46.5" },
              Length: { cm: "70.6", in: "27.8" },
              US: { cm: "8/10", in: "8/10" },
            },
            size: "L",
          },
          {
            measurements: {
              "Bust size": { cm: "124.2", in: "48.9" },
              Length: { cm: "72.1", in: "28.4" },
              US: { cm: "12", in: "12" },
            },
            size: "XL",
          },
        ],
      },
    },
    {
      id: 2,
      name: "",
      poster:
        "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
      colors: [
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/937ba0c5d35cd12349f15638b5ded847.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Peach",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Blue",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/c6b32ccc6d0a2375c14f519363829f17.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Green",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/3df067cb48072b2e6c56b88d56bf2733.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Purple",
        },
        // {
        //   image:
        //     "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/033cf8a8400f2f0de5f7cf0917cc0cad.jpg?imageView2/2/w/800/q/70/format/webp",
        //   name: "Red",
        // },
      ],
      size_chart: {
        columns: [
          { index: 1, name: "Size" },
          { index: 2, name: "US" },
          { index: 3, name: "Bust size" },
          { index: 4, name: "Length" },
        ],
        entry_labels: [
          { index: 1, name: "S" },
          { index: 2, name: "M" },
          { index: 3, name: "L" },
          { index: 4, name: "XL" },
        ],
        sizes: [
          {
            measurements: {
              "Bust size": { cm: "108.2", in: "42.6" },
              Length: { cm: "68.1", in: "26.8" },
              US: { cm: "4", in: "4" },
            },
            size: "S",
          },
          {
            measurements: {
              "Bust size": { cm: "112", in: "44.1" },
              Length: { cm: "69.1", in: "27.2" },
              US: { cm: "6", in: "6" },
            },
            size: "M",
          },
          {
            measurements: {
              "Bust size": { cm: "118.1", in: "46.5" },
              Length: { cm: "70.6", in: "27.8" },
              US: { cm: "8/10", in: "8/10" },
            },
            size: "L",
          },
          {
            measurements: {
              "Bust size": { cm: "124.2", in: "48.9" },
              Length: { cm: "72.1", in: "28.4" },
              US: { cm: "12", in: "12" },
            },
            size: "XL",
          },
        ],
      },
    },
    {
      id: 3,
      name: "",
      poster:
        "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
      colors: [
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/937ba0c5d35cd12349f15638b5ded847.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Peach",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Blue",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/c6b32ccc6d0a2375c14f519363829f17.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Green",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/3df067cb48072b2e6c56b88d56bf2733.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Purple",
        },
        // {
        //   image:
        //     "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/033cf8a8400f2f0de5f7cf0917cc0cad.jpg?imageView2/2/w/800/q/70/format/webp",
        //   name: "Red",
        // },
      ],
      size_chart: {
        columns: [
          { index: 1, name: "Size" },
          { index: 2, name: "US" },
          { index: 3, name: "Bust size" },
          { index: 4, name: "Length" },
        ],
        entry_labels: [
          { index: 1, name: "S" },
          { index: 2, name: "M" },
          { index: 3, name: "L" },
          { index: 4, name: "XL" },
        ],
        sizes: [
          {
            measurements: {
              "Bust size": { cm: "108.2", in: "42.6" },
              Length: { cm: "68.1", in: "26.8" },
              US: { cm: "4", in: "4" },
            },
            size: "S",
          },
          {
            measurements: {
              "Bust size": { cm: "112", in: "44.1" },
              Length: { cm: "69.1", in: "27.2" },
              US: { cm: "6", in: "6" },
            },
            size: "M",
          },
          {
            measurements: {
              "Bust size": { cm: "118.1", in: "46.5" },
              Length: { cm: "70.6", in: "27.8" },
              US: { cm: "8/10", in: "8/10" },
            },
            size: "L",
          },
          {
            measurements: {
              "Bust size": { cm: "124.2", in: "48.9" },
              Length: { cm: "72.1", in: "28.4" },
              US: { cm: "12", in: "12" },
            },
            size: "XL",
          },
        ],
      },
    },
    {
      id: 4,
      name: "",
      poster:
        "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
      colors: [
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/937ba0c5d35cd12349f15638b5ded847.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Peach",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Blue",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/c6b32ccc6d0a2375c14f519363829f17.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Green",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/3df067cb48072b2e6c56b88d56bf2733.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Purple",
        },
        // {
        //   image:
        //     "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/033cf8a8400f2f0de5f7cf0917cc0cad.jpg?imageView2/2/w/800/q/70/format/webp",
        //   name: "Red",
        // },
      ],
      size_chart: {
        columns: [
          { index: 1, name: "Size" },
          { index: 2, name: "US" },
          { index: 3, name: "Bust size" },
          { index: 4, name: "Length" },
        ],
        entry_labels: [
          { index: 1, name: "S" },
          { index: 2, name: "M" },
          { index: 3, name: "L" },
          { index: 4, name: "XL" },
        ],
        sizes: [
          {
            measurements: {
              "Bust size": { cm: "108.2", in: "42.6" },
              Length: { cm: "68.1", in: "26.8" },
              US: { cm: "4", in: "4" },
            },
            size: "S",
          },
          {
            measurements: {
              "Bust size": { cm: "112", in: "44.1" },
              Length: { cm: "69.1", in: "27.2" },
              US: { cm: "6", in: "6" },
            },
            size: "M",
          },
          {
            measurements: {
              "Bust size": { cm: "118.1", in: "46.5" },
              Length: { cm: "70.6", in: "27.8" },
              US: { cm: "8/10", in: "8/10" },
            },
            size: "L",
          },
          {
            measurements: {
              "Bust size": { cm: "124.2", in: "48.9" },
              Length: { cm: "72.1", in: "28.4" },
              US: { cm: "12", in: "12" },
            },
            size: "XL",
          },
        ],
      },
    },
    {
      id: 5,
      name: "",
      poster:
        "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
      colors: [
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/937ba0c5d35cd12349f15638b5ded847.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Peach",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/26b6a540c5db7b422a75cf55c7707882.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Blue",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/c6b32ccc6d0a2375c14f519363829f17.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Green",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/3df067cb48072b2e6c56b88d56bf2733.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Purple",
        },
        {
          image:
            "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/033cf8a8400f2f0de5f7cf0917cc0cad.jpg?imageView2/2/w/800/q/70/format/webp",
          name: "Red",
        },
      ],
      size_chart: {
        columns: [
          { index: 1, name: "Size" },
          { index: 2, name: "US" },
          { index: 3, name: "Bust size" },
          { index: 4, name: "Length" },
        ],
        entry_labels: [
          { index: 1, name: "S" },
          { index: 2, name: "M" },
          { index: 3, name: "L" },
          { index: 4, name: "XL" },
        ],
        sizes: [
          {
            measurements: {
              "Bust size": { cm: "108.2", in: "42.6" },
              Length: { cm: "68.1", in: "26.8" },
              US: { cm: "4", in: "4" },
            },
            size: "S",
          },
          {
            measurements: {
              "Bust size": { cm: "112", in: "44.1" },
              Length: { cm: "69.1", in: "27.2" },
              US: { cm: "6", in: "6" },
            },
            size: "M",
          },
          {
            measurements: {
              "Bust size": { cm: "118.1", in: "46.5" },
              Length: { cm: "70.6", in: "27.8" },
              US: { cm: "8/10", in: "8/10" },
            },
            size: "L",
          },
          {
            measurements: {
              "Bust size": { cm: "124.2", in: "48.9" },
              Length: { cm: "72.1", in: "28.4" },
              US: { cm: "12", in: "12" },
            },
            size: "XL",
          },
        ],
      },
    },
  ];
}
