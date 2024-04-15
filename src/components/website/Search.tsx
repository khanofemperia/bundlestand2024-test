"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineSearch } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";

export default function Search() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!searchRef.current || !(event.target instanceof Node)) {
        return;
      }

      const targetNode = searchRef.current as Node;

      if (!targetNode.contains(event.target)) {
        setIsSearchVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchButtonClick = () => {
    setIsSearchVisible((prevState) => !prevState);
  };

  return (
    <>
      <div className="w-[580px] h-12 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        {isSearchVisible ? (
          <div
            ref={searchRef}
            className="w-full rounded-xl overflow-hidden ease-in-out transition duration-200 bg-white shadow-custom3"
          >
            <div className="w-full h-[52px] border-b flex items-center px-4 gap-4">
              <div className="flex items-center justify-center">
                <HiOutlineSearch size={18} />
              </div>
              <div className="h-full w-full">
                <input
                  className="w-full h-full"
                  type="text"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="w-full h-[300px]"></div>
          </div>
        ) : (
          <Link
            href="/shop"
            className="flex items-center gap-[10px] px-5 w-full h-full rounded-full ease-in-out transition duration-200 bg-[#f0f4f9] hover:bg-[#e9eff6]"
          >
            <Image
              src="/waving_hand.webp"
              alt="Cherly Good"
              width="28"
              height="28"
              priority={true}
            />
            <span className="font-medium text-gray">
              What's up! Click here to browse the store
            </span>
          </Link>
        )}
      </div>
      {!isSearchVisible && (
        <button
          onClick={handleSearchButtonClick}
          className="h-12 w-12 rounded-full absolute top-1/2 -translate-y-1/2 right-[52px] flex items-center justify-center ease-in-out transition duration-300 hover:bg-[#f0f4f9]"
        >
          <HiOutlineSearch size={26} />
        </button>
      )}
    </>
  );
}
