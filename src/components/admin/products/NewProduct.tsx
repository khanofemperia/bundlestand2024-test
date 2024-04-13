"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { FormEvent, useState, useEffect } from "react";
import Spinner from "@/elements/Spinners/white";
import { CreateProductAction } from "@/actions/create-product";
import { HiArrowLeft, HiMiniChevronDown } from "react-icons/hi2";
import { capitalizeFirstLetter } from "@/libraries/utils";
import AlertMessage from "@/components/AlertMessage";
import { useProductCategoryStore } from "@/zustand/admin/productCategoryStore";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";
import config from "@/libraries/config";

export function NewProductButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.products.name,
    overlayName: state.pages.products.overlays.newProduct.name,
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
      Create a new product
    </button>
  );
}

export function NewProductOverlay() {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [categoryDropdown, setCategoryDropdown] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState("Select");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    category: "",
  });

  const { categories, setCategories } = useProductCategoryStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/product-categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.products.name,
      overlayName: state.pages.products.overlays.newProduct.name,
      isOverlayVisible: state.pages.products.overlays.newProduct.isVisible,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Check if the click is outside the category dropdown
      if (categoryDropdown && !target.closest(".category-dropdown-container")) {
        setCategoryDropdown(false); // Close the category dropdown
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [categoryDropdown]);

  const toggleCategoryDropdown = () => {
    setCategoryDropdown((prevState) => !prevState);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category.toLowerCase());
    setCategoryDropdown(false);

    // Save selected category in formData
    setFormData((prevData) => ({
      ...prevData,
      category: capitalizeFirstLetter(category),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!formData.category || formData.category.toLowerCase() === "select") {
      setAlertMessage("Please select a category");
      setShowAlert(true);
    } else {
      setLoading(true);

      try {
        await CreateProductAction(formData);
      } catch (error) {
        console.error(error);
      } finally {
        onHideOverlay();
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onHideOverlay = () => {
    setLoading(false);
    hideOverlay({ pageName, overlayName });
    setSelectedCategory("Select");
    setFormData({
      name: "",
      slug: "",
      price: "",
      category: "",
    });
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <>
      {isOverlayVisible && (
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
                    Create a new product
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
                    <span className="heading-size-h3">Category</span>
                    <span className="text-red text-xl leading-3 h-max flex">
                      *
                    </span>
                  </div>
                  <div className="mt-4 relative category-dropdown-container">
                    <button
                      onClick={toggleCategoryDropdown}
                      type="button"
                      className="bg-gray2 w-full h-[38px] px-3 rounded-md flex items-center justify-between gap-[3px] ease-in-out hover:bg-gray3 hover:duration-300 hover:ease-out"
                    >
                      {selectedCategory.toLowerCase() === "select" ? (
                        <span className="text-gray">
                          {capitalizeFirstLetter(selectedCategory)}
                        </span>
                      ) : (
                        <span>{capitalizeFirstLetter(selectedCategory)}</span>
                      )}
                      <HiMiniChevronDown
                        className="-ml-1 -mr-[6px]  mt-[2px] fill-text-gray"
                        size={22}
                      />
                    </button>
                    <div
                      className={`${
                        categoryDropdown ? "block" : "hidden"
                      } shadow-custom3 rounded-md w-full overflow-hidden absolute top-[37px] z-10 mt-1 bg-white`}
                    >
                      {!categories.length ? (
                        <div className="text-ghost-gray italic px-3 py-2 cursor-context-menu">
                          No categories
                        </div>
                      ) : (
                        categories.map(({ name }, index) => (
                          <div key={index} className="border-b p-1">
                            <div
                              onClick={() =>
                                handleCategorySelect(
                                  capitalizeFirstLetter(name)
                                )
                              }
                              className="cursor-pointer h-[29px] w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                            >
                              <div className="flex gap-1 items-center justify-center text-gray cursor-pointer">
                                {capitalizeFirstLetter(name)}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
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
                    value={formData.name}
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
                    placeholder="denim-mini-skirt"
                    value={formData.slug}
                    onChange={handleInputChange}
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
                    value={formData.price}
                    onChange={handleInputChange}
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
