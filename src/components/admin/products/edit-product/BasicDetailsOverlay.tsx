"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useEffect, FormEvent } from "react";
import EditProductAction from "@/actions/edit-product";
import Spinner from "@/elements/Spinners/white";
import { HiArrowLeft } from "react-icons/hi2";
import clsx from "clsx";

export function EditBasicDetailsButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editProduct.name,
    overlayName: state.pages.editProduct.overlays.basicDetails.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 grid place-items-center rounded-full transition duration-300 ease-in-out hover:bg-gray2"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export default function BasicDetailsOverlay({
  productId,
  data,
}: {
  productId: string;
  data: { name: string; price: string; slug: string };
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [basicDetails, setBasicDetails] = useState({
    name: data.name,
    price: data.price,
    slug: data.slug,
  });

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editProduct.name,
      overlayName: state.pages.editProduct.overlays.basicDetails.name,
      isOverlayVisible: state.pages.editProduct.overlays.basicDetails.isVisible,
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
    event: React.ChangeEvent<HTMLInputElement>
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
      await EditProductAction({ id: productId, ...basicDetails });
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
                className={`bg-blue min-w-[72px] h-9 px-3 rounded-full flex items-center justify-center transition duration-300 ease-in-out ${clsx(
                  {
                    "hover:bg-blue2": !loading,
                    "bg-opacity-40": loading,
                    "hover:bg-blue": loading,
                    "hover:bg-opacity-40": loading,
                  }
                )}`}
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
                <label className="flex gap-[2px]" htmlFor="name">
                  <span className="heading-size-h3">Name</span>
                  <span className="text-red text-xl leading-3 h-max flex">
                    *
                  </span>
                </label>
                <input
                  className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                  type="text"
                  name="name"
                  placeholder="Denim Mini Skirt"
                  value={basicDetails.name}
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
                  placeholder="denim-mini-skirt"
                  value={basicDetails.slug}
                  onChange={handleBasicDetailsInputChange}
                  required
                />
              </div>
              <div>
                <label className="flex gap-[2px]" htmlFor="price">
                  <span className="heading-size-h3">Price</span>
                  <span className="text-red text-xl leading-3 h-max flex">
                    *
                  </span>
                </label>
                <input
                  className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                  type="text"
                  name="price"
                  placeholder="36.14"
                  value={basicDetails.price}
                  onChange={handleBasicDetailsInputChange}
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
