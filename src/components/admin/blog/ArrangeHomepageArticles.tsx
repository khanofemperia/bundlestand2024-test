"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { HiArrowLeft } from "react-icons/hi2";
import { HiMiniChevronDown } from "react-icons/hi2";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { capitalizeFirstLetter } from "@/libraries/utils";
import ChangeArticleIndexOverlay, {
  ChangeArticleIndexButton,
} from "./ChangeArticleIndex";
import AddHomepageArticlesOverlay, {
  AddHomepageArticlesButton,
} from "./AddHomepageArticles";
import RemoveHomepageArticlesOverlay, {
  RemoveHomepageArticleButton,
} from "./RemoveHomepageArticles";
import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";

type HomepageArticlesProps = {
  id: string;
  index: number;
  title: string;
  visibility: string;
};

export function ArrangeHomepageArticlesButton() {
  const { showOverlay } = useOverlayStore();
  const { setDropdown } = useDropdownMenuStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.blog.name,
    overlayName: state.pages.blog.overlays.arrangeHomepageArticles.name,
  }));

  const openOverlay = () => {
    setDropdown(false);
    showOverlay({ pageName, overlayName });
  };

  return (
    <button
      className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
      title="Create a new article"
      onClick={openOverlay}
    >
      Arrange, add, or remove homepage articles
    </button>
  );
}

export function ArrangeHomepageArticlesOverlay() {
  const [visibilityDropdown, setVisibilityDropdown] = useState<boolean>(false);
  const [selectedVisibility, setSelectedVisibility] = useState("visible");
  const [articles, setArticles] = useState<HomepageArticlesProps[]>([]);
  const [hasMatchingArticles, setHasMatchingArticles] = useState<boolean>(true);
  const [articleCounts, setArticleCounts] = useState<{ [key: string]: number }>(
    {
      visible: 0,
      hidden: 0,
      deleted: 0,
    }
  );

  const calculateArticleCounts = (items: HomepageArticlesProps[]) => {
    const visibilityCounts: { [key: string]: number } = {
      visible: 0,
      hidden: 0,
      deleted: 0,
    };

    items.forEach((article) => {
      const visibility = article.visibility.toLowerCase();
      visibilityCounts[visibility]++;
    });

    setArticleCounts(visibilityCounts);
  };

  useEffect(() => {
    const updateVisibilityFlag = (articles: HomepageArticlesProps[]) => {
      const matchingArticles = articles.filter(
        (article: HomepageArticlesProps) =>
          article.visibility.toLowerCase() === selectedVisibility.toLowerCase()
      );

      const hasMatchingArticles = matchingArticles.length > 0;
      setHasMatchingArticles(hasMatchingArticles);

      calculateArticleCounts(articles);
    };

    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/admin/homepage-articles");
        if (response.ok) {
          const data: HomepageArticlesProps[] = await response.json();

          setArticles(data);

          // Check if there are articles matching the default visibility
          updateVisibilityFlag(data);
        } else {
          // Handle errors if needed
          console.log("An error occurred.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchArticles();
  }, [selectedVisibility]);

  const handleUpdatedArticles = (items: HomepageArticlesProps[]) => {
    // Update the articles state
    setArticles([...items]);

    // Recalculate the counts based on the updated articles
    calculateArticleCounts(items);

    // Check if there are articles matching the selected visibility
    const matchingArticles = items.filter(
      (article) =>
        article.visibility.toLowerCase() === selectedVisibility.toLowerCase()
    );

    // Set the flag based on whether there are matching articles
    const hasMatchingArticles = matchingArticles.length > 0;
    setHasMatchingArticles(hasMatchingArticles);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Check if the click is outside the visibility dropdown
      if (
        visibilityDropdown &&
        !target.closest(".visibility-dropdown-container")
      ) {
        setVisibilityDropdown(false); // Close the visibility dropdown
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visibilityDropdown]);

  const { hideOverlay } = useOverlayStore();

  const {
    pageName,
    isOverlayVisible,
    overlayName,
    isAddHomepageArticlesVisible,
  } = useOverlayStore((state) => ({
    pageName: state.pages.blog.name,
    overlayName: state.pages.blog.overlays.arrangeHomepageArticles.name,
    isOverlayVisible:
      state.pages.blog.overlays.arrangeHomepageArticles.isVisible,
    isAddHomepageArticlesVisible:
      state.pages.blog.overlays.addHomepageArticles.isVisible,
  }));

  useEffect(() => {
    if (isAddHomepageArticlesVisible || isOverlayVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOverlayVisible]);

  const toggleVisibilityDropdown = () => {
    setVisibilityDropdown((prevState) => !prevState);
  };

  const updateVisibilityFlag = (visibility: string) => {
    // Check if there are articles matching the selected visibility
    const matchingArticles = articles.filter(
      (article) => article.visibility.toLowerCase() === visibility.toLowerCase()
    );

    const hasMatchingArticles = matchingArticles.length > 0;
    setHasMatchingArticles(hasMatchingArticles);
  };

  const handleVisibilitySelect = (visibility: string) => {
    setSelectedVisibility(visibility.toLowerCase());
    setVisibilityDropdown(false);
    updateVisibilityFlag(visibility);
  };

  return (
    <>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[840px] px-4 py-4 pt-[14px] bg-white mx-auto mt-20 shadow rounded-14px">
            <button
              onClick={() => hideOverlay({ pageName, overlayName })}
              className="mb-8 flex items-center gap-1 cursor-pointer text-blue hover:underline"
            >
              <HiArrowLeft size={20} className="fill-blue" />
              <span className="heading-size-h3 text-blue">
                Arrange, add, or remove homepage articles
              </span>
            </button>
            <div className="flex justify-end gap-1 mb-[5px]">
              <div className="relative visibility-dropdown-container">
                <button
                  onClick={toggleVisibilityDropdown}
                  className="bg-gray2 w-max h-9 px-3 rounded-full flex items-center justify-center gap-[3px] ease-in-out hover:bg-gray3 hover:duration-300 hover:ease-out"
                >
                  <span>{capitalizeFirstLetter(selectedVisibility)}</span>
                  <HiMiniChevronDown
                    className="-ml-1 -mr-[6px]  mt-[2px]"
                    size={22}
                  />
                </button>
                <div
                  className={`${
                    visibilityDropdown ? "block" : "hidden"
                  } shadow-custom3 rounded-md w-32 overflow-hidden absolute top-[35px] z-10 mt-1 bg-white`}
                >
                  <div className="border-b p-1">
                    <div
                      onClick={() => handleVisibilitySelect("Visible")}
                      className="cursor-pointer h-[29px] w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                    >
                      <div className="flex gap-1 items-center justify-center text-gray cursor-pointer">
                        <span>Visible</span>
                        <span className="w-max h-5 px-[4px] rounded min-w-[20px] bg-gold flex items-center justify-center text-white heading-size-h3">
                          {articleCounts.visible}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-b p-1">
                    <div
                      onClick={() => handleVisibilitySelect("Hidden")}
                      className="cursor-pointer h-[29px] w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                    >
                      <div className="flex gap-1 items-center justify-center text-gray cursor-pointer">
                        <span>Hidden</span>
                        <span className="w-max h-5 px-[4px] rounded min-w-[20px] bg-gray4 flex items-center justify-center text-white heading-size-h3">
                          {articleCounts.hidden}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-b p-1">
                    <div
                      onClick={() => handleVisibilitySelect("Deleted")}
                      className="cursor-pointer h-[29px] w-full rounded-[4px] px-[7px] flex items-center ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
                    >
                      <div className="flex gap-1 items-center justify-center text-gray cursor-pointer">
                        <span>Deleted</span>
                        <span className="w-max h-5 px-[4px] rounded min-w-[20px] bg-red flex items-center justify-center text-white heading-size-h3">
                          {articleCounts.deleted}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AddHomepageArticlesButton />
            </div>
            <div className="mx-auto rounded-lg overflow-hidden bg-gray [box-shadow:rgb(122,122,122,18%)_0px_3px_2px_0px,_rgb(0,0,0,20%)_0px_0px_1px_1px]">
              <table className="border-collapse">
                <thead className="border-b bg-gray2">
                  <tr className="h-9 text-left">
                    <th className="w-[120px] pl-3 pr-2 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        #
                      </h3>
                    </th>
                    <th className="w-[120px] pl-3 pr-2 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        ID
                      </h3>
                    </th>
                    <th className="w-[120px] pl-3 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        Visibility
                      </h3>
                    </th>
                    <th className="w-[447px] pl-3 border-r">
                      <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                        Title
                      </h3>
                    </th>
                    <th className="w-[120px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {hasMatchingArticles ? (
                    articles
                      .filter(
                        (article) =>
                          article.visibility.toLowerCase() ===
                          selectedVisibility.toLowerCase()
                      )
                      .map(({ id, index, title, visibility }) => (
                        <tr key={index} className="border-b h-9 text-left">
                          <td className="w-[120px] pl-3 pr-2 pt-[2px] border-r">
                            <p className="text-gray">{index}</p>
                          </td>
                          <td className="w-[120px] pl-3 pr-2 pt-[2px] border-r">
                            <p>{id}</p>
                          </td>
                          <td className="w-[120px] pl-3 border-r">
                            <p
                              className={`
                            ${clsx({
                              "bg-gold": visibility.toLowerCase() === "visible",
                              "bg-gray4": visibility.toLowerCase() === "hidden",
                              "bg-red": visibility.toLowerCase() === "deleted",
                            })} w-max text-sm h-[27px] pt-[2px] px-2 rounded-full flex items-center justify-center text-white
                          `}
                            >
                              {capitalizeFirstLetter(visibility)}
                            </p>
                          </td>
                          <td className="w-[447px] pl-3 border-r">
                            <p className="line-clamp-1">{title}</p>
                          </td>
                          <td className="w-[120px] grid place-items-center">
                            <div className="pt-[5px] flex items-center justify-center gap-2">
                              <ChangeArticleIndexButton
                                id={id}
                                index={String(index)}
                                title={title}
                              />
                              <RemoveHomepageArticleButton id={id} />
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr className="border-b h-9 text-left">
                      <td colSpan={5} className="text-center italic py-5">
                        No results
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <AddHomepageArticlesOverlay
        handleUpdatedArticles={handleUpdatedArticles}
      />
      <RemoveHomepageArticlesOverlay
        handleUpdatedArticles={handleUpdatedArticles}
      />
      <ChangeArticleIndexOverlay
        handleUpdatedArticles={handleUpdatedArticles}
      />
    </>
  );
}
