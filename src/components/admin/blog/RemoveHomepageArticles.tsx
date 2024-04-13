"use client";

import { useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft, HiOutlineXMark } from "react-icons/hi2";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import AlertMessage from "@/components/AlertMessage";
import { useBlogStore } from "@/zustand/admin/blogStore";
import config from "@/libraries/config";

type HomepageArticlesProps = {
  id: string;
  index: number;
  title: string;
  visibility: string;
};

type RemoveHomepageArticlesOverlayProps = {
  handleUpdatedArticles: (items: HomepageArticlesProps[]) => void;
};

export function RemoveHomepageArticleButton({ id }: { id: string }) {
  const { showOverlay, hideOverlay } = useOverlayStore();
  const setSelectedHomepageArticle = useBlogStore(
    (state) => state.setSelectedHomepageArticle
  );

  const { pageName, overlayName, arrangeHomepageArticlesOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.blog.name,
      overlayName: state.pages.blog.overlays.removeHomepageArticles.name,
      isOverlayVisible:
        state.pages.blog.overlays.removeHomepageArticles.isVisible,
      arrangeHomepageArticlesOverlayName:
        state.pages.blog.overlays.arrangeHomepageArticles.name,
    }));

  const handleClick = () => {
    setSelectedHomepageArticle({ id });
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: arrangeHomepageArticlesOverlayName });
  };

  return (
    <button
      onClick={handleClick}
      className="w-6 h-6 bg-transparent border border-[#ababab] rounded-full grid place-items-center ease-in-out hover:duration-300 hover:ease-out hover:border-[#909090] hover:text-[#909090]"
    >
      <HiOutlineXMark className="stroke-[#ababab]" size={18} />
    </button>
  );
}

export default function RemoveHomepageArticlesOverlay({
  handleUpdatedArticles,
}: RemoveHomepageArticlesOverlayProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const { selectedHomepageArticle } = useBlogStore((state) => ({
    selectedHomepageArticle: state.selectedHomepageArticle,
  }));

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    arrangeHomepageArticlesOverlayName,
  } = useOverlayStore((state) => ({
    pageName: state.pages.blog.name,
    overlayName: state.pages.blog.overlays.removeHomepageArticles.name,
    isOverlayVisible:
      state.pages.blog.overlays.removeHomepageArticles.isVisible,
    arrangeHomepageArticlesOverlayName:
      state.pages.blog.overlays.arrangeHomepageArticles.name,
  }));

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

  const onHideOverlay = () => {
    hideOverlay({ pageName, overlayName });
    showOverlay({ pageName, overlayName: arrangeHomepageArticlesOverlayName });
    setLoading(false);
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const postData = async () => {
    const url = "/api/admin/homepage-articles";

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedHomepageArticle.id,
        }),
      });

      const result = await response.json();

      if (result.status !== 200) {
        setAlertMessage(result.message);
        setShowAlert(true);
      }

      handleUpdatedArticles(result.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRemoveConfirmation = async () => {
    setLoading(true);

    try {
      await postData();
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      onHideOverlay();
    }
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[400px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <div className="w-full pt-[14px] px-4">
              <button
                onClick={onHideOverlay}
                className="mb-8 flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Remove this article from the homepage
                </span>
              </button>
            </div>
            <div className="pt-3 pb-10 px-4 flex flex-col gap-2">
              <div className="w-80 heading-size-h3">
                Sure you wanna do this? The article won't be on the homepage
                anymore.
              </div>
              <button
                onClick={handleRemoveConfirmation}
                disabled={loading}
                className={`bg-red w-max h-9 px-3 mt-1 rounded-full flex gap-1 items-center justify-center ease-in-out hover:duration-300 hover:ease-out ${clsx(
                  {
                    "hover:bg-red2": !loading,
                    "bg-opacity-40": loading,
                    "hover:bg-red": loading,
                    "hover:bg-opacity-40": loading,
                  }
                )}`}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span className="text-white">Confirm</span>
                  </>
                ) : (
                  <span className="text-white">Confirm</span>
                )}
              </button>
            </div>
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
