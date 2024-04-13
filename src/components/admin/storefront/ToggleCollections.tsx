"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { FormEvent, useState, useEffect } from "react";
import Spinner from "@/elements/Spinners/white";
import { CreateProductAction } from "@/actions/create-product";
import { HiArrowLeft } from "react-icons/hi2";
import { capitalizeFirstLetter } from "@/libraries/utils";
import AlertMessage from "@/components/AlertMessage";
import { useProductCategoryStore } from "@/zustand/admin/productCategoryStore";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";

export function ToggleCollectionsButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.storefront.name,
    overlayName: state.pages.storefront.overlays.toggleCollections.name,
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
      Toggle storefront sections
    </button>
  );
}

export function ToggleCollectionsOverlay() {
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
      pageName: state.pages.storefront.name,
      overlayName: state.pages.storefront.overlays.toggleCollections.name,
      isOverlayVisible:
        state.pages.storefront.overlays.toggleCollections.isVisible,
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
          <div className="w-[580px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  onClick={() => hideOverlay({ pageName, overlayName })}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Toggle storefront sections
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue min-w-[72px] h-9 px-3 pb-[2px] rounded-full flex items-center justify-center ease-in-out hover:bg-blue2 hover:duration-300 hover:ease-out"
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
                <div className="w-full rounded-lg border bg-white">
                  <div className="w-full pl-3 pt-3 pb-[14px] border-b relative">
                    <div className="flex flex-col justify-center gap-2">
                      <div className="text-sm font-semibold">Page hero</div>
                      <div className="text-gray text-xs leading-[18px] max-w-[400px]">
                        It's the first thing visitors notice; use visuals that
                        make a strong first impression.
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 w-10 h-5 border rounded-full">
                      <div className="w-[10px] h-[10px] rounded-full absolute left-[5px] [top:50%] [transform:translateY(-50%)] bg-black"></div>
                    </div>
                  </div>
                  <div className="w-full pl-3 pt-3 pb-[14px] border-b relative">
                    <div className="flex flex-col justify-center gap-2">
                      <div className="text-sm font-semibold">Categories</div>
                      <div className="text-gray text-xs leading-[18px] max-w-[450px]">
                        Group similar products so they're easy to find: Dresses,
                        Tops, Bottoms, Outerwear, Shoes, Accessories.
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 w-10 h-5 border rounded-full">
                      <div className="w-[10px] h-[10px] rounded-full absolute left-[5px] [top:50%] [transform:translateY(-50%)] bg-black"></div>
                    </div>
                  </div>
                  <div className="w-full pl-3 pt-3 pb-[14px] relative">
                    <div className="flex flex-col justify-center gap-2">
                      <div className="text-sm font-semibold">Shop now</div>
                      <div className="text-gray text-xs leading-[18px] max-w-[400px]">
                        This is a treasure hunt - a catalog featuring products
                        from all categories. Users scroll and the surprises roll
                        in.
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 w-10 h-5 border rounded-full">
                      <div className="w-[10px] h-[10px] rounded-full absolute left-[5px] [top:50%] [transform:translateY(-50%)] bg-black"></div>
                    </div>
                  </div>
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
