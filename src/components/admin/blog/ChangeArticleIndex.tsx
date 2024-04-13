"use client";

import { FormEvent, useEffect, useState } from "react";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useBlogStore } from "@/zustand/admin/blogStore";
import { HiArrowLeft } from "react-icons/hi2";
import AlertMessage from "@/components/AlertMessage";
import Spinner from "@/elements/Spinners/white";
import { PiArrowsClockwiseBold } from "react-icons/pi";

type HomepageArticlesProps = {
  id: string;
  index: number;
  title: string;
  visibility: string;
};

type AddHomepageArticlesOverlayProps = {
  handleUpdatedArticles: (items: HomepageArticlesProps[]) => void;
};

export function ChangeArticleIndexButton({
  id,
  title,
  index,
}: {
  id: string;
  title: string;
  index: string;
}) {
  const { showOverlay, hideOverlay } = useOverlayStore();
  const setSelectedHomepageArticle = useBlogStore(
    (state) => state.setSelectedHomepageArticle
  );

  const { pageName, overlayName, arrangeHomepageArticlesOverlayName } =
    useOverlayStore((state) => ({
      pageName: state.pages.blog.name,
      overlayName: state.pages.blog.overlays.changeArticleIndex.name,
      arrangeHomepageArticlesOverlayName:
        state.pages.blog.overlays.arrangeHomepageArticles.name,
    }));

  const handleClick = () => {
    setSelectedHomepageArticle({ id, index, title });
    showOverlay({ pageName, overlayName });
    hideOverlay({ pageName, overlayName: arrangeHomepageArticlesOverlayName });
  };

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 rounded-full grid place-items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
    >
      <PiArrowsClockwiseBold size={18} />
    </button>
  );
}

export default function ChangeArticleIndexOverlay({
  handleUpdatedArticles,
}: AddHomepageArticlesOverlayProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { hideOverlay, showOverlay } = useOverlayStore();

  const { selectedHomepageArticle, setSelectedHomepageArticle } = useBlogStore(
    (state) => ({
      selectedHomepageArticle: state.selectedHomepageArticle,
      setSelectedHomepageArticle: state.setSelectedHomepageArticle,
    })
  );

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    arrangeHomepageArticlesOverlayName,
  } = useOverlayStore((state) => ({
    pageName: state.pages.blog.name,
    overlayName: state.pages.blog.overlays.changeArticleIndex.name,
    isOverlayVisible: state.pages.blog.overlays.changeArticleIndex.isVisible,
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
    const url = "/api/admin/homepage-articles";

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedHomepageArticle.id,
          index: formData.get("index") as string,
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (isNaN(parseInt(String(selectedHomepageArticle.index)))) {
      setAlertMessage("Invalid index. Please enter a valid number.");
      setShowAlert(true);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      await postData(formData);
    } catch (error) {
      console.error("An error occured:", error);
    } finally {
      onHideOverlay();
    }
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = event.target.value;
    setSelectedHomepageArticle({ ...selectedHomepageArticle, index: newIndex });
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[400px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  onClick={onHideOverlay}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Reposition this article up/down
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
                  <label className="heading-size-h3" htmlFor="index">
                    Title
                  </label>
                  <p className="w-max max-w-full min-h-[27px] bg-gray2 rounded-lg mt-4 px-2">
                    {selectedHomepageArticle.title}
                  </p>
                </div>
                <div>
                  <label className="heading-size-h3" htmlFor="index">
                    Index position
                  </label>
                  <input
                    className="w-full h-9 border rounded-md mt-4 px-3 focus:border-blue"
                    type="text"
                    name="index"
                    value={selectedHomepageArticle.index}
                    onChange={handleIndexChange}
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
