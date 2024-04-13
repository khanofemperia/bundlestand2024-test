"use client";

import { useDropdownMenuStore } from "@/zustand/admin/dropdownMenuStore";
import { useEffect } from "react";
import { FaCaretDown } from "react-icons/fa6";

export default function DropdownMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dropdownVisible, setDropdown } = useDropdownMenuStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Check if the click is outside the dropdown
      if (dropdownVisible && !target.closest(".dropdown-container")) {
        setDropdown(false); // Close the dropdown
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownVisible, setDropdown]);

  const toggleDropdown = () => {
    setDropdown(!dropdownVisible);
  };

  return (
    <>
      <div>
        <div className="w-32 outline-none relative dropdown-container">
          <button
            onClick={toggleDropdown}
            type="button"
            className="w-max flex gap-[2px]"
          >
            <p className="text-blue text-sm font-semibold cursor-pointer hover:underline">
              View page actions
            </p>
            <FaCaretDown className="mt-[3px] fill-blue" size={14} />
          </button>
          <div
            className={`${
              dropdownVisible ? "block" : "hidden"
            } shadow-custom3 rounded-md w-max pl-3 pr-10 overflow-hidden absolute top-6 z-10 bg-white`}
          >
            <div className="flex flex-col gap-[14px] pt-[10px] pb-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
