"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useSlideshowStore } from "@/zustand/admin/slideshowStore";
import NextImage from "next/image";
import { useEffect, useState, useRef } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

export function ClickableImageMask({ id }: { id: string }) {
  const { showOverlay } = useOverlayStore();
  const setSelectedHomepageArticle = useSlideshowStore(
    (state) => state.setSelectedArticle
  );

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.home.name,
    overlayName: state.pages.home.overlays.articleImageSlideshow.name,
  }));

  const handleClick = () => {
    setSelectedHomepageArticle({ id });
    showOverlay({ pageName, overlayName });
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-full z-10 cursor-pointer absolute top-0 bottom-0 left-0 right-0 bg-opacity-0 bg-[#000] ease-in-out hover:bg-opacity-20 hover:duration-300 hover:ease-out"
    ></div>
  );
}

export function ArticleImageSlideshow() {
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPrevButtonRef = useRef<HTMLButtonElement | null>(null);
  const scrollNextButtonRef = useRef<HTMLButtonElement | null>(null);

  const { hideOverlay } = useOverlayStore();

  const { pageName, overlayName, isOverlayVisible } = useOverlayStore(
    (state) => ({
      pageName: state.pages.home.name,
      overlayName: state.pages.home.overlays.articleImageSlideshow.name,
      isOverlayVisible:
        state.pages.home.overlays.articleImageSlideshow.isVisible,
    })
  );

  useEffect(() => {
    const calculateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const calculatedHeight = windowHeight - 80;
      setContainerHeight(calculatedHeight);
    };

    // Calculate container height on initial load
    calculateContainerHeight();

    // Recalculate container height if the window is resized
    const handleResize = () => {
      calculateContainerHeight();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      const aspectRatio = width / height;
      const calculatedWidth = containerHeight * aspectRatio;
      setOriginalWidth(calculatedWidth);
      setOriginalHeight(containerHeight);
    };

    img.src =
      "https://i.pinimg.com/564x/05/de/66/05de66467a23279e4e1f1883d8d764d3.jpg";
  }, [containerHeight]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const overlay = overlayRef.current;
      const prevButton = scrollPrevButtonRef.current;
      const nextButton = scrollNextButtonRef.current;
      const imageContainer = imageContainerRef.current;

      if (
        !(
          target === prevButton ||
          prevButton?.contains(target) ||
          target === nextButton ||
          nextButton?.contains(target) ||
          target === imageContainer ||
          imageContainer?.contains(target)
        ) &&
        overlay?.contains(target)
      ) {
        hideOverlay({ pageName, overlayName });
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    isOverlayVisible && (
      <div
        ref={overlayRef}
        className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-md z-20"
      >
        {containerHeight && (
          <div style={{ height: containerHeight }} className="w-full relative">
            <div ref={imageContainerRef} className="w-max h-full flex mx-auto">
              <NextImage
                src={
                  "https://i.pinimg.com/564x/05/de/66/05de66467a23279e4e1f1883d8d764d3.jpg"
                }
                alt={"title"}
                width={originalWidth}
                height={originalHeight}
                priority
              />
            </div>
            <div className="w-max mt-6 mx-auto flex items-center gap-4">
              <div className="w-[10px] h-[10px] shadow rounded-full bg-[#2e2e2e]"></div>
              <div className="w-[10px] h-[10px] shadow rounded-full bg-white"></div>
              <div className="w-[10px] h-[10px] shadow rounded-full bg-[#2e2e2e]"></div>
              <div className="w-[10px] h-[10px] shadow rounded-full bg-[#2e2e2e]"></div>
              <div className="w-[10px] h-[10px] shadow rounded-full bg-[#2e2e2e]"></div>
            </div>
            <button
              ref={scrollPrevButtonRef}
              className="w-9 h-9 pr-[3px] bg-[#4d4d4d] text-white rounded-full flex items-center justify-center absolute top-1/2 left-5 transform -translate-y-1/2 ease-in-out hover:duration-300 hover:ease-out hover:bg-[#2e2e2e]"
            >
              <HiOutlineChevronLeft size={26} />
            </button>
            <button
              ref={scrollNextButtonRef}
              className="w-9 h-9 pl-[3px] bg-[#4d4d4d] text-white rounded-full flex items-center justify-center absolute top-1/2 right-5 transform -translate-y-1/2 ease-in-out hover:duration-300 hover:ease-out hover:bg-[#2e2e2e]"
            >
              <HiOutlineChevronRight size={26} />
            </button>
          </div>
        )}
      </div>
    )
  );
}
