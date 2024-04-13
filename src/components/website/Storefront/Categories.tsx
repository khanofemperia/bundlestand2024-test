"use client";

import { capitalizeFirstLetter } from "@/libraries/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function Categories({
  categories,
}: {
  categories: CategoryProps[];
}) {
  const [distance, setDistance] = useState(0);
  const [isPrevButtonHidden, setIsPrevButtonHidden] = useState(true);
  const [isNextButtonHidden, setIsNextButtonHidden] = useState(false);

  const categoryWidth = 120;
  const gapBetweenCategories = 16;
  const maxCategoriesShown = 7;

  useEffect(() => {
    setIsPrevButtonHidden(distance === 0);

    const maxDistance =
      (categories.length - maxCategoriesShown) *
      (categoryWidth + gapBetweenCategories);
    setIsNextButtonHidden(distance <= -maxDistance);
  }, [distance, categories.length]);

  const handleNext = () => {
    const maxDistance =
      (categories.length - maxCategoriesShown) *
      (categoryWidth + gapBetweenCategories);
    if (distance > -maxDistance) {
      setDistance(distance - (categoryWidth + gapBetweenCategories));
    }
  };

  const handlePrev = () => {
    if (distance < 0) {
      setDistance(
        Math.min(0, distance + (categoryWidth + gapBetweenCategories))
      );
    }
  };

  return (
    <div className="relative w-max">
      <div className="max-w-[938px] overflow-hidden">
        <div
          style={{ transform: `translateX(${distance}px)` }}
          className="w-max flex gap-4 mb-16 p-[1px] transition duration-500 ease-in-out"
        >
          {categories
            .filter((category) => category.visibility === "VISIBLE")
            .map(({ index, name, image }) => (
              <Link
                key={index}
                href={`/shop/categories/${name.toLowerCase()}`}
                className="flex flex-col gap-2 items-center rounded-xl p-[10px] relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3"
              >
                <div className="flex w-[100px] h-[100px] rounded-full shadow-[rgba(0,0,0,0.2)_0px_1px_3px_0px,_rgba(27,31,35,0.15)_0px_0px_0px_1px]">
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    <Image
                      src={`/categories/${image}`}
                      alt={name}
                      width={100}
                      height={100}
                      priority={true}
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {capitalizeFirstLetter(name)}
                </div>
              </Link>
            ))}
        </div>
      </div>
      {!isPrevButtonHidden && (
        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-full absolute -left-3 top-[44px] bg-black bg-opacity-70 flex items-center justify-center transition duration-300 ease-in-out hover:bg-opacity-100"
        >
          <HiChevronLeft className="fill-white mr-[2px]" size={22} />
        </button>
      )}
      {!isNextButtonHidden && (
        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-full absolute -right-3 top-[44px] bg-black bg-opacity-70 flex items-center justify-center transition duration-300 ease-in-out hover:bg-opacity-100"
        >
          <HiChevronRight className="fill-white ml-[2px]" size={22} />
        </button>
      )}
    </div>
  );
}
