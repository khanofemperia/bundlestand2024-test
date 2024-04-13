"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { FormEvent, useState, useEffect } from "react";
import Spinner from "@/elements/Spinners/white";
import { CreateArticleAction } from "@/actions/create-article";
import { HiArrowLeft } from "react-icons/hi2";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";

export function NewArticleButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.blog.name,
    overlayName: state.pages.blog.overlays.newArticle.name,
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
      Create a new article
    </button>
  );
}

export function NewArticleOverlay() {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
  });

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.blog.name,
      overlayName: state.pages.blog.overlays.newArticle.name,
      isOverlayVisible: state.pages.blog.overlays.newArticle.isVisible,
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

  const onHideOverlay = () => {
    setLoading(false);
    hideOverlay({ pageName, overlayName });
    setFormData({
      title: "",
      slug: "",
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      await CreateArticleAction(formData);
    } catch (error) {
      console.error(error);
    } finally {
      onHideOverlay();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    isOverlayVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
        <div className="w-[500px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Create a new article
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
                  value={formData.title}
                  onChange={handleInputChange}
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
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
