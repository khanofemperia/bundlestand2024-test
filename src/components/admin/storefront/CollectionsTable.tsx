"use client";

import { LuFilter } from "react-icons/lu";
import { HiArrowUp } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import { MdOutlineEdit } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useState } from "react";
import Link from "next/link";
import AlertMessage from "@/components/AlertMessage";
import clsx from "clsx";
import { capitalizeFirstLetter } from "@/libraries/utils";
import { PiArrowsClockwiseBold } from "react-icons/pi";
import ChangeCollectionIndexOverlay, {
  ChangeCollectionIndexButton,
} from "./ChangeCollectionIndex";

type CollectionsTableProps = { collections: CollectionProps[] };

export default function CollectionsTable({
  collections,
}: CollectionsTableProps) {
  const CAMPAIGN_STATUS_ENDED = "Ended";
  const CAMPAIGN_STATUS_UPCOMING = "Upcoming";
  const CAMPAIGN_STATUS_ACTIVE = "Active";
  const FEATURED_COLLECTION = "FEATURED_COLLECTION";
  const PROMOTIONAL_BANNER = "PROMOTIONAL_BANNER";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageJumpValue, setPageJumpValue] = useState("1");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const pagination = (
    data: CollectionProps[],
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
    collections,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getCampaignStatus = (startDate: string, endDate: string): string => {
    const currentDate = new Date();
    const campaignStartDate = new Date(startDate);
    const campaignEndDate = new Date(endDate);

    campaignStartDate.setUTCHours(0, 0, 0, 0);
    campaignEndDate.setUTCHours(0, 0, 0, 0);

    if (currentDate.getTime() > campaignEndDate.getTime()) {
      return CAMPAIGN_STATUS_ENDED;
    } else if (currentDate.getTime() < campaignStartDate.getTime()) {
      return CAMPAIGN_STATUS_UPCOMING;
    } else {
      return CAMPAIGN_STATUS_ACTIVE;
    }
  };

  // const handleUpdatedCollections = () => {};

  return (
    <>
      <section>
        <div className="bg-white mt-14 w-full pb-[10px] overflow-hidden rounded-14px shadow">
          <div className="flex items-center justify-between w-full h-12 px-6">
            <h2 className="heading-size-h2">
              {collections.length === 1
                ? "1 collection"
                : `${collections.length} collections`}
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
          {!tableData.length ? (
            <div className="text-center italic py-6 border-t">No results</div>
          ) : (
            <div className="border-b overflow-x-auto overflow-y-hidden">
              <table className="border-collapse">
                <thead>
                  <tr className="bg-gray2 flex">
                    <th className="w-[50px] h-9 flex items-center pl-[22px] pr-2 border-r">
                      <h3 className="text-sm font-semibold whitespace-nowrap text-gray">
                        #
                      </h3>
                    </th>
                    <th className="w-[220px] h-9 flex items-center pl-[6px] border-r">
                      <h3 className="text-sm font-semibold whitespace-nowrap text-gray">
                        Campaign duration
                      </h3>
                    </th>
                    <th className="w-[460px] h-9 flex items-center pl-[6px] border-r">
                      <h3 className="text-sm font-semibold whitespace-nowrap text-gray">
                        Title
                      </h3>
                    </th>
                    <th className="w-[120px] h-9 flex items-center pl-[6px] border-r">
                      <h3 className="text-sm font-semibold whitespace-nowrap text-gray">
                        Products
                      </h3>
                    </th>
                    <th className="w-[170px] h-9 flex items-center pl-[6px] border-r">
                      <h3 className="text-sm font-semibold whitespace-nowrap text-gray">
                        Type
                      </h3>
                    </th>
                    <th className="w-[120px] h-9 flex items-center pl-[6px] border-r">
                      <h3 className="text-sm font-semibold whitespace-nowrap text-gray">
                        Visibility
                      </h3>
                    </th>
                    <th className="w-[120px] h-9"></th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(
                    ({
                      id,
                      index,
                      title,
                      slug,
                      campaign_duration,
                      collection_type,
                      products,
                      visibility,
                    }) => (
                      <tr key={index} className="flex h-32 border-b">
                        <td className="w-[50px] flex items-center justify-center relative border-r">
                          <p className="font-semibold text-sm text-gray">
                            {index}
                          </p>
                        </td>
                        <td className="w-[220px] border-r flex items-center pl-2 relative">
                          <div className="flex gap-1 absolute top-[3px] left-[3px]">
                            <BsInfoCircle size={16} className="fill-gold" />
                            <span className="select-none italic text-xs text-gold">
                              {getCampaignStatus(
                                campaign_duration.start_date,
                                campaign_duration.end_date
                              )}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                              <h3 className="font-semibold text-sm leading-6 text-gray">
                                Start
                              </h3>
                              <p
                                className={`font-semibold w-max text-sm h-[26px] px-2 rounded-full flex items-center justify-center bg-opacity-15 ${clsx(
                                  {
                                    "text-green bg-green":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ACTIVE,
                                    "text-gray bg-gray4":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ENDED ||
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_UPCOMING,
                                  }
                                )}`}
                              >
                                {formatDate(campaign_duration.start_date)}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <h3 className="font-semibold text-sm leading-6  text-gray">
                                End
                              </h3>
                              <p
                                className={`font-semibold w-max text-sm h-[26px] px-2 rounded-full flex items-center justify-center bg-opacity-15 ${clsx(
                                  {
                                    "text-red bg-red":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ENDED,
                                    "text-gray bg-gray4":
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_ACTIVE ||
                                      getCampaignStatus(
                                        campaign_duration.start_date,
                                        campaign_duration.end_date
                                      ) === CAMPAIGN_STATUS_UPCOMING,
                                  }
                                )}`}
                              >
                                {formatDate(campaign_duration.end_date)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="w-[460px] border-r flex items-center pl-2 pr-16">
                          <p className="line-clamp-2">{title}</p>
                        </td>
                        <td className="w-[120px] border-r flex items-center pl-2">
                          <p className="text-gray text-sm font-semibold">
                            {products.length}
                          </p>
                        </td>
                        <td className="w-[170px] border-r flex items-center pl-2">
                          <p className="text-gray border bg-opacity-15 font-semibold w-max text-sm h-[24px] px-2 rounded-full flex items-center justify-center">
                            {collection_type === FEATURED_COLLECTION
                              ? "Featured Collection"
                              : collection_type === PROMOTIONAL_BANNER
                              ? "Promotional Banner"
                              : ""}
                          </p>
                        </td>
                        <td className="w-[120px] border-r flex items-center pl-2">
                          <p className="text-gray bg-gray4 bg-opacity-15 font-semibold w-max text-sm h-[26px] px-2 rounded-full flex items-center justify-center">
                            {capitalizeFirstLetter(visibility.toLowerCase())}
                          </p>
                        </td>
                        <td className="w-[140px] flex items-center justify-center gap-1">
                          <Link
                            href={`/admin/storefront/collections/${id}`}
                            className="w-8 h-8 rounded-full grid place-items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                          >
                            <MdOutlineEdit size={18} />
                          </Link>
                          <Link
                            href={`/shop/collections/${slug}-${id}`}
                            className="w-8 h-8 rounded-full grid place-items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                          >
                            <HiArrowUpRight size={18} />
                          </Link>
                          <ChangeCollectionIndexButton
                            id={id}
                            index={String(index)}
                            title={title}
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {collections.length > rowsPerPage && (
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
      <ChangeCollectionIndexOverlay />
    </>
  );
}
