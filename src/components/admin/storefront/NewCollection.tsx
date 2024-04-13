"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { FormEvent, useState, useEffect } from "react";
import clsx from "clsx";
import Spinner from "@/elements/Spinners/white";
import { HiArrowLeft, HiMiniChevronDown } from "react-icons/hi2";
import { CiImageOn } from "react-icons/ci";
import AlertMessage from "@/components/AlertMessage";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate, titleCase } from "@/libraries/utils";
import Image from "next/image";
import { CreateCollectionAction } from "@/actions/collections";

type RequestDataProps = {
  title: string;
  slug: string;
  campaign_duration: {
    start_date: string;
    end_date: string;
  };
  collection_type: string;
  image?: string;
};

export function NewCollectionButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.storefront.name,
    overlayName: state.pages.storefront.overlays.newCollection.name,
  }));

  const openOverlay = () => {
    setDropdown(false);
    showOverlay({ pageName, overlayName });
  };

  return (
    <button
      className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
      onClick={openOverlay}
    >
      Create a new collection
    </button>
  );
}

export function NewCollectionOverlay() {
  const FEATURED_COLLECTION = "FEATURED_COLLECTION";
  const PROMOTIONAL_BANNER = "PROMOTIONAL_BANNER";

  const today = new Date();

  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [collectionDropdown, setCollectionDropdown] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] =
    useState(FEATURED_COLLECTION);
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from today
  );

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.storefront.name,
      overlayName: state.pages.storefront.overlays.newCollection.name,
      isOverlayVisible: state.pages.storefront.overlays.newCollection.isVisible,
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

  const isValidDateRange =
    startDate &&
    endDate &&
    startDate.toISOString().split("T")[0] < endDate.toISOString().split("T")[0];

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isValidDateRange) {
      setAlertMessage("Start date must be before end date");
      setShowAlert(true);
    } else {
      setLoading(true);

      const campaignDuration = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };

      try {
        const requestData: RequestDataProps = {
          title,
          slug,
          campaign_duration: campaignDuration,
          collection_type: selectedCollection,
        };

        if (selectedCollection !== FEATURED_COLLECTION) {
          requestData.image = image;
        }

        const result = await CreateCollectionAction(requestData);
        setAlertMessage(result.status.message);
        setShowAlert(true);
      } catch (error) {
        console.error(error);
      } finally {
        onHideOverlay();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Check if the click is outside the collection dropdown
      if (
        collectionDropdown &&
        !target.closest(".collection-dropdown-container")
      ) {
        setCollectionDropdown(false); // Close the collection dropdown
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [collectionDropdown]);

  const toggleCollectionDropdown = () => {
    setCollectionDropdown((prevState) => !prevState);
  };

  const handleCollectionSelect = (collection: string) => {
    setSelectedCollection(collection);
    setCollectionDropdown(false);
  };

  const onHideOverlay = () => {
    setLoading(false);
    hideOverlay({ pageName, overlayName });
    setSelectedCollection(FEATURED_COLLECTION);
    setTitle("");
    setSlug("");
    setImage("");
    setStartDate(today);
    setEndDate(
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from today
    );
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const collections = [FEATURED_COLLECTION, PROMOTIONAL_BANNER];

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[800px] bg-white mx-auto shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  onClick={() => hideOverlay({ pageName, overlayName })}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Create a new collection
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
                  <div className="flex gap-[2px]">
                    <span className="heading-size-h3">Collection</span>
                  </div>
                  <div className="mt-4 w-[230px] relative collection-dropdown-container">
                    <button
                      onClick={toggleCollectionDropdown}
                      type="button"
                      className="bg-gray2 w-full h-[38px] px-3 rounded-md flex items-center justify-between gap-[3px] ease-in-out hover:bg-gray3 hover:duration-300 hover:ease-out"
                    >
                      {selectedCollection === FEATURED_COLLECTION
                        ? "Featured Collection"
                        : selectedCollection === PROMOTIONAL_BANNER
                        ? "Promotional Banner"
                        : ""}
                      <HiMiniChevronDown
                        className="-ml-1 -mr-[6px]  mt-[2px] fill-text-gray"
                        size={22}
                      />
                    </button>
                    <div
                      className={`${
                        collectionDropdown ? "block" : "hidden"
                      } shadow-custom3 rounded-md w-full overflow-hidden absolute top-[37px] z-10 mt-1 bg-white`}
                    >
                      {collections.map((collection, index) => (
                        <div key={index} className="border-b p-1">
                          <div
                            onClick={() =>
                              handleCollectionSelect(titleCase(collection))
                            }
                            className="cursor-pointer h-[29px] w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                          >
                            <div className="flex gap-1 items-center justify-center cursor-pointer">
                              {collection === FEATURED_COLLECTION
                                ? "Featured Collection"
                                : collection === PROMOTIONAL_BANNER
                                ? "Promotional Banner"
                                : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedCollection === PROMOTIONAL_BANNER && (
                  <div>
                    <label className="flex gap-[2px]" htmlFor="image">
                      <span className="font-semibold text-sm">Image</span>
                    </label>
                    <div className="w-full h-[310px] flex items-center justify-center overflow-hidden border rounded-t-[7px] mt-4">
                      {!image ? (
                        <CiImageOn className="fill-[#e4e4e4]" size={150} />
                      ) : (
                        <Image
                          src={image}
                          alt={title}
                          width={766}
                          height={308}
                          priority={true}
                        />
                      )}
                    </div>
                    <input
                      className="w-full h-9 border border-t-0 rounded-b-md outline-none text-sm font-semibold px-3"
                      type="text"
                      name="image"
                      placeholder="Image url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div>
                  <div className="flex gap-[2px]">
                    <span className="font-semibold text-sm">
                      Campaign duration
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <div
                      className={`w-[230px] max-w-[230px] flex gap-3 items-center border rounded-md overflow-hidden px-3 ${clsx(
                        {
                          "border-red": !isValidDateRange,
                        }
                      )}`}
                    >
                      <span className="flex font-semibold text-sm text-gray mt-[2px]">
                        Start
                      </span>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="w-full h-9 outline-none"
                        required
                      />
                    </div>
                    <div
                      className={`w-[230px] max-w-[230px] flex gap-3 items-center border rounded-md overflow-hidden px-3 ${clsx(
                        {
                          "border-red": !isValidDateRange,
                        }
                      )}`}
                    >
                      <span className="flex font-semibold text-sm text-gray mt-[2px]">
                        End
                      </span>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="w-full h-9 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex gap-[2px]" htmlFor="title">
                    <span className="font-semibold text-sm">Title</span>
                  </label>
                  <input
                    className="w-[472px] h-9 border rounded-md outline-none mt-4 px-3"
                    type="text"
                    name="title"
                    placeholder={`Belle Jolie Lipstick - She "marks" her man with her lips`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="flex gap-[2px]" htmlFor="slug">
                    <span className="font-semibold text-sm">Slug</span>
                  </label>
                  <input
                    className="w-[472px] h-9 border rounded-md outline-none mt-4 px-3"
                    type="text"
                    name="slug"
                    placeholder="belle-jolie-lipstick-mark-your-man"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
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
