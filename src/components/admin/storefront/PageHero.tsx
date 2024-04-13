"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";
import { HiArrowLeft } from "react-icons/hi2";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { UpdatePageHeroAction } from "@/actions/page-hero";
import Spinner from "@/elements/Spinners/white";
import AlertMessage from "@/components/AlertMessage";
import Image from "next/image";
import { CiImageOn } from "react-icons/ci";
import clsx from "clsx";

type PageHeroProps = {
  id: string;
  image: string | null;
  title: string | null;
  url: string | null;
  visibility: string;
};

export function PageHeroButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.storefront.name,
    overlayName: state.pages.storefront.overlays.editPageHero.name,
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
      Edit the page hero
    </button>
  );
}

export function PageHeroOverlay({ pageHero }: { pageHero: PageHeroProps }) {
  const VISIBLE = "VISIBLE";
  const HIDDEN = "HIDDEN";

  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [heroData, setHeroData] = useState({ ...pageHero });

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.storefront.name,
      overlayName: state.pages.storefront.overlays.editPageHero.name,
      isOverlayVisible: state.pages.storefront.overlays.editPageHero.isVisible,
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await UpdatePageHeroAction(heroData);
      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHeroData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleVisibility = () => {
    const newVisibility = heroData.visibility === VISIBLE ? HIDDEN : VISIBLE;
    setHeroData({ ...heroData, visibility: newVisibility });
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center pt-20 pb-32 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[600px] h-max bg-white mx-auto shadow rounded-14px">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  onClick={() => hideOverlay({ pageName, overlayName })}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Edit the page hero
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
                <div className="bg-gray2 rounded-md h-9 flex items-center justify-between px-3">
                  <div className="text-sm font-semibold">
                    Show the page hero on the storefront
                  </div>
                  <div
                    onClick={toggleVisibility}
                    className={`w-10 h-5 rounded-full relative cursor-pointer ease-in-out duration-200 ${clsx(
                      {
                        "bg-white border": heroData.visibility === HIDDEN,
                        "bg-blue border border-blue":
                          heroData.visibility === VISIBLE,
                      }
                    )}`}
                  >
                    <div
                      className={`w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute [top:50%] [transform:translateY(-50%)] ${clsx(
                        {
                          "left-[5px] bg-black": heroData.visibility === HIDDEN,
                          "left-[23px] bg-white":
                            heroData.visibility === VISIBLE,
                        }
                      )}`}
                    ></div>
                  </div>
                </div>
                <div>
                  <label
                    className="flex gap-[2px] font-semibold text-sm"
                    htmlFor="image"
                  >
                    Image
                  </label>
                  <div className="w-full h-[168px] flex items-center justify-center overflow-hidden border rounded-t-[7px] mt-4">
                    {!heroData.image ? (
                      <CiImageOn className="fill-[#e4e4e4]" size={150} />
                    ) : (
                      <Image
                        src={heroData.image}
                        alt={heroData.title || ""}
                        width={766}
                        height={228}
                        priority={true}
                      />
                    )}
                  </div>
                  <input
                    className="w-full h-9 border border-t-0 rounded-b-md outline-none text-sm font-semibold px-3"
                    type="text"
                    name="image"
                    placeholder="Image url"
                    value={heroData.image || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="flex gap-[2px] font-semibold text-sm"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                    type="text"
                    name="title"
                    placeholder={`Belle Jolie Lipstick - She "marks" her man with her lips`}
                    value={heroData.title || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="flex gap-[2px] font-semibold text-sm"
                    htmlFor="url"
                  >
                    URL
                  </label>
                  <input
                    className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                    type="text"
                    name="url"
                    placeholder="belle-jolie-lipstick-mark-your-man"
                    value={heroData.url || ""}
                    onChange={handleInputChange}
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
