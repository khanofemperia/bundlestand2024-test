"use client";

import { LuFilter } from "react-icons/lu";
import { HiArrowUp } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import { MdOutlineEdit } from "react-icons/md";
import { TbCopy } from "react-icons/tb";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { capitalizeFirstLetter } from "@/libraries/utils";
import AlertMessage from "@/components/AlertMessage";

type OffersTableProps = { offers: OfferProps[] };

export default function OffersTable({ offers }: OffersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageJumpValue, setPageJumpValue] = useState("1");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const pagination = (
    data: OfferProps[],
    currentPage: number,
    rowsPerPage: number
  ) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedArray = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return {
      paginatedArray,
      totalPages,
    };
  };

  const rowsPerPage = 2;
  const { paginatedArray: tableData, totalPages } = pagination(
    offers,
    currentPage,
    rowsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      const value = Math.max(prevPage - 1, 1);
      setPageJumpValue(String(value));

      return value;
    });
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => {
      const value = Math.min(prevPage + 1, totalPages);
      setPageJumpValue(String(value));

      return value;
    });
  };

  const jumpToPage = () => {
    const page = parseInt(pageJumpValue, 10);

    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      jumpToPage();
    }
  };

  const jumpToLastPage = () => {
    setPageJumpValue(String(totalPages));
    setCurrentPage(totalPages);
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setAlertMessage("Copied ID to clipboard");
        setShowAlert(true);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <>
      <section>
        <div className="bg-white mt-14 w-full pb-[10px] overflow-hidden rounded-14px shadow">
          <div className="flex items-center justify-between w-full h-12 px-6">
            <h2 className="heading-size-h2">
              {offers.length === 1 ? "1 offer" : `${offers.length} offers`}
            </h2>
            <div className="flex gap-1">
              <button className="bg-gray2 w-max h-9 px-3 rounded-full flex items-center justify-center gap-[2px] ease-in-out hover:bg-gray3 hover:duration-300 hover:ease-out">
                <HiArrowUp size={18} />
                <span>Sort</span>
              </button>
              <button className="bg-gray2 w-max h-9 px-3 rounded-full flex items-center justify-center gap-1 ease-in-out hover:bg-gray3 hover:duration-300 hover:ease-out">
                <LuFilter size={17} />
                <span>Filter</span>
              </button>
            </div>
          </div>
          <div className="border-b overflow-x-auto overflow-y-hidden">
            <table className="border-collapse">
              <thead>
                <tr className="bg-gray2 flex">
                  <th className="w-[120px] h-9 flex items-center pl-[25px] border-r">
                    <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                      Poster
                    </h3>
                  </th>
                  <th className="w-[180px] h-9 flex items-center pl-[6px] border-r">
                    <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                      Price
                    </h3>
                  </th>
                  <th className="w-[180px] h-9 flex items-center pl-[6px] border-r">
                    <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                      Products
                    </h3>
                  </th>
                  <th className="w-[360px] h-9 flex items-center pl-[6px] border-r">
                    <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                      Visibility
                    </h3>
                  </th>
                  <th className="w-[120px] h-9"></th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td className="text-center italic py-6">No content yet</td>
                  </tr>
                ) : (
                  tableData.map(
                    (
                      { id, poster, price, sale_price, visibility, products },
                      index
                    ) => {
                      const isLastItem = index === tableData.length - 1;
                      const isSingleRow = tableData.length === 1;

                      const rowClasses = `
                        flex h-max
                        ${isLastItem || isSingleRow ? "" : "border-b"}
                      `;

                      return (
                        <tr key={id} className={rowClasses}>
                          <td className="w-[120px] border-r py-2 pl-[25px]">
                            <div className="w-[80px] h-[107px] overflow-hidden flex items-center justify-center">
                              {poster && (
                                <Image
                                  src={poster}
                                  alt=""
                                  width={80}
                                  height={107}
                                  priority={true}
                                />
                              )}
                            </div>
                          </td>
                          <td className="w-[180px] border-r flex items-center gap-[6px] pl-2">
                            <p className="text-sm font-medium">${sale_price}</p>
                            <p className="text-sm text-gray line-through">
                              ${price}
                            </p>
                          </td>
                          <td className="w-[180px] border-r flex items-center pl-2">
                            <p className="text-sm">{products.length}</p>
                          </td>
                          <td className="w-[180px] border-r flex items-center pl-2">
                            <p
                              className={`
                            ${clsx({
                              "bg-gold text-gold":
                                visibility.toLowerCase() === "visible",
                              "bg-gray4 text-gray4":
                                visibility.toLowerCase() === "hidden",
                            })} bg-opacity-10 w-max text-sm h-[26px] px-2 rounded-full flex items-center justify-center
                          `}
                            >
                              {capitalizeFirstLetter(visibility)}
                            </p>
                          </td>
                          <td className="w-[120px] flex items-center justify-center gap-1">
                            <Link
                              href={`/admin/products/offers/${id}`}
                              className="w-8 h-8 rounded-full grid place-items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                            >
                              <MdOutlineEdit size={18} />
                            </Link>
                            <Link
                              href={`/${id}`}
                              className="w-8 h-8 rounded-full grid place-items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                            >
                              <HiArrowUpRight size={18} />
                            </Link>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
        {offers.length > rowsPerPage && (
          <div className="mt-12">
            <div className="w-max mx-auto flex gap-1 h-9">
              <button
                onClick={handlePrevious}
                className="w-9 h-9 flex items-center justify-center rounded-full ease-in-out bg-gray2 hover:bg-gray3 hover:duration-300 hover:ease-out"
              >
                <HiOutlineChevronLeft size={22} />
              </button>
              <input
                value={pageJumpValue}
                onChange={(e) => setPageJumpValue(e.target.value)}
                onKeyDown={handleEnterKey}
                className="min-w-[36px] max-w-[36px] h-9 px-1 text-center border cursor-text outline-none rounded-full bg-white"
                type="text"
              />
              <div className="flex items-center justify-center px-1 cursor-context-menu">
                of
              </div>
              <button
                onClick={jumpToLastPage}
                className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer bg-gray2 hover:bg-gray3 hover:duration-30"
              >
                {totalPages}
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center rounded-full ease-in-out bg-gray2 hover:bg-gray3 hover:duration-300 hover:ease-out"
              >
                <HiOutlineChevronRight size={22} />
              </button>
            </div>
          </div>
        )}
      </section>
      {showAlert && (
        <AlertMessage
          message={alertMessage}
          hideAlertMessage={hideAlertMessage}
        />
      )}
    </>
  );
}
