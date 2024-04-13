"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft } from "react-icons/hi2";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import AlertMessage from "@/components/AlertMessage";
import config from "@/libraries/config";

type HomepageArticlesProps = {
  id: string;
  index: number;
  title: string;
  visibility: string;
};

type AddHomepageArticlesOverlayProps = {
  handleUpdatedArticles: (items: HomepageArticlesProps[]) => void;
};

export function AddHomepageArticlesButton() {
  const { showOverlay, hideOverlay } = useOverlayStore();

  const { pageName, overlayName, arrangeHomepageArticlesOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.blog.name,
      overlayName: state.pages.blog.overlays.addHomepageArticles.name,
      isOverlayVisible: state.pages.blog.overlays.addHomepageArticles.isVisible,
      arrangeHomepageArticlesOverlayName:
        state.pages.blog.overlays.arrangeHomepageArticles.name,
    }));

  const handleClick = () => {
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: arrangeHomepageArticlesOverlayName });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue w-max h-9 px-3 rounded-full flex items-center justify-center ease-in-out hover:bg-blue2 hover:duration-300 hover:ease-out"
    >
      <span className="text-white">Add article</span>
    </button>
  );
}

export default function AddHomepageArticlesOverlay({
  handleUpdatedArticles,
}: AddHomepageArticlesOverlayProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    arrangeHomepageArticlesOverlayName,
  } = useOverlayStore((state) => ({
    pageName: state.pages.blog.name,
    overlayName: state.pages.blog.overlays.addHomepageArticles.name,
    isOverlayVisible: state.pages.blog.overlays.addHomepageArticles.isVisible,
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

  const postData = async (formData: FormData) => {
    const articleId = formData.get("id") as string;
    const url = "/api/admin/homepage-articles";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: articleId }),
      });

      if (!response.ok) {
        let alertMessage = "";

        if (response.status === 404) {
          alertMessage =
            "The article you're looking for could not be found. Please check the ID and try again.";
        } else if (response.status === 409) {
          alertMessage = "Sorry, this article is already on the homepage.";
        } else if (response.status === 500) {
          alertMessage =
            "Something went wrong on our end. Please try again later.";
        } else {
          alertMessage =
            "We're experiencing technical difficulties. Please try again later.";
        }

        setAlertMessage(alertMessage);
        setShowAlert(true);

        const result = await response.json();
        handleUpdatedArticles(result.data);
      }

      const result = await response.json();
      handleUpdatedArticles(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      await postData(formData);
    } catch (error) {
      console.error("Error adding article to homepage:", error);
    } finally {
      onHideOverlay();
    }
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[400px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="w-full pt-[14px] px-4">
                <button
                  onClick={onHideOverlay}
                  className="mb-8 flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Add an article to the homepage
                  </span>
                </button>
              </div>
              <div className="pt-3 pb-10 px-4 flex flex-col gap-2">
                <input
                  className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                  type="text"
                  name="id"
                  placeholder="Enter article ID"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue text-white w-max h-9 px-3 rounded-full flex gap-1 items-center justify-center ease-in-out hover:duration-300 hover:ease-out ${clsx(
                    {
                      "hover:bg-blue2": !loading,
                      "bg-opacity-40": loading,
                      "hover:bg-blue": loading,
                      "hover:bg-opacity-40": loading,
                    }
                  )}`}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      <span>Confirm</span>
                    </>
                  ) : (
                    <span>Confirm</span>
                  )}
                </button>
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
