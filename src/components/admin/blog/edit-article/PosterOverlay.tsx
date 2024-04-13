"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import EditArticleAction from "@/actions/edit-article";
import { HiArrowLeft } from "react-icons/hi2";

export function EditPosterButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editArticle.name,
    overlayName: state.pages.editArticle.overlays.poster.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 mt-2 grid place-items-center rounded-full ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export default function PosterOverlay({
  articleId,
  articlePoster,
  articleTitle,
}: {
  articleId: string;
  articlePoster: string;
  articleTitle: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [poster, setPoster] = useState(articlePoster);

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editArticle.name,
      overlayName: state.pages.editArticle.overlays.poster.name,
      isOverlayVisible: state.pages.editArticle.overlays.poster.isVisible,
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

  const saveChanges = async () => {
    setLoading(true);

    try {
      await EditArticleAction({ id: articleId, poster });
    } catch (error) {
      console.error("Error updating poster:", error);
    } finally {
      setLoading(false);
      hideOverlay({ pageName, overlayName });
    }
  };

  return (
    isOverlayVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
        <div className="w-[500px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
          <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
            <button
              onClick={() => hideOverlay({ pageName, overlayName })}
              className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
            >
              <HiArrowLeft size={20} className="fill-blue" />
              <span className="heading-size-h3 text-blue">Change poster</span>
            </button>
            <button
              onClick={saveChanges}
              className={`min-w-[72px] h-9 px-3 rounded-full bg-blue ease-in-out hover:duration-300 hover:ease-out ${clsx(
                {
                  "hover:bg-blue2": !loading,
                  "bg-opacity-40": loading,
                  "hover:bg-blue": loading,
                  "hover:bg-opacity-40": loading,
                }
              )}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex gap-1 items-center justify-center w-full h-full">
                  <Spinner />
                  <p className="text-white">Saving</p>
                </div>
              ) : (
                <p className="text-white">Save</p>
              )}
            </button>
          </div>
          <div className="pt-12 pb-10 px-4 flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              {
                <div className="w-[14rem] rounded-lg relative overflow-hidden border">
                  <div className="w-[222px] h-[296px] flex items-center justify-center overflow-hidden relative">
                    {poster && (
                      <img
                        src={poster}
                        alt={articleTitle}
                        width={222}
                        height={296}
                      />
                    )}
                  </div>
                  <div className="h-9 w-full border-t overflow-hidden">
                    <input
                      type="text"
                      placeholder="Poster url"
                      className="h-full w-full border-none outline-none text-sm font-semibold px-2"
                      value={poster}
                      onChange={(event) => setPoster(event.target.value)}
                    />
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  );
}
