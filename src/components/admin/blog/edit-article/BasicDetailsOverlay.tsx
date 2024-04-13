"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useEffect, FormEvent } from "react";
import EditArticleAction from "@/actions/edit-article";
import Spinner from "@/elements/Spinners/white";
import { HiArrowLeft } from "react-icons/hi2";

export function EditBasicDetailsButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editArticle.name,
    overlayName: state.pages.editArticle.overlays.basicDetails.name,
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

export default function BasicDetailsOverlay({
  articleId,
  data,
}: {
  articleId: string;
  data: { title: string; meta_description: string; slug: string };
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [basicDetails, setBasicDetails] = useState({
    title: data.title,
    meta_description: data.meta_description,
    slug: data.slug,
  });

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editArticle.name,
      overlayName: state.pages.editArticle.overlays.basicDetails.name,
      isOverlayVisible: state.pages.editArticle.overlays.basicDetails.isVisible,
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

  const handleBasicDetailsInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setBasicDetails((prevBasicDetails) => ({
      ...prevBasicDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      await EditArticleAction({ id: articleId, ...basicDetails });
    } catch (error) {
      console.error("Error updating basic details:", error);
    } finally {
      setLoading(false);
      hideOverlay({ pageName, overlayName });
    }
  };

  return (
    isOverlayVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-black z-20 bg-opacity-40 backdrop-blur-sm">
        <div className="w-[500px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Edit basic details
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
                <label className="flex gap-[2px]" htmlFor="title">
                  <span className="heading-size-h3">Title</span>
                  <span className="text-red text-xl leading-3 h-max flex">
                    *
                  </span>
                </label>
                <input
                  className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                  type="text"
                  name="title"
                  value={basicDetails.title}
                  onChange={handleBasicDetailsInputChange}
                  required
                />
              </div>
              <div>
                <label className="flex gap-[2px]" htmlFor="slug">
                  <span className="heading-size-h3">Slug</span>
                  <span className="text-red text-xl leading-3 h-max flex">
                    *
                  </span>
                </label>
                <input
                  className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                  type="text"
                  name="slug"
                  value={basicDetails.slug}
                  onChange={handleBasicDetailsInputChange}
                  required
                />
              </div>
              <div>
                <label
                  className="flex gap-[2px] heading-size-h3"
                  htmlFor="meta_description"
                >
                  Meta description
                </label>
                <textarea
                  className="w-full h-36 resize-none border rounded-md outline-none mt-4 px-3 py-1 focus:border-blue"
                  name="meta_description"
                  value={basicDetails.meta_description}
                  onChange={handleBasicDetailsInputChange}
                ></textarea>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
