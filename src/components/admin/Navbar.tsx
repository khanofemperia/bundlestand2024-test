"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", url: "/admin" },
    { name: "Storefront", url: "/admin/storefront" },
    { name: "Products", url: "/admin/products" },
    { name: "Orders", url: "/admin/orders" },
    { name: "Blog", url: "/admin/blog" },
    { name: "Newsletter", url: "/admin/newsletter" },
  ];

  const isTabActive = ({ url }: { url: string }) => {
    return pathname === url;
  };

  return (
    <nav className="shadow-custom2 z-10 w-max h-11 fixed top-0 bg-[#333] rounded-bl-lg rounded-br-lg flex items-center gap-5 px-3 text-[#bbb]">
      {tabs.map((tab, index) => (
        <Link
          className={`${clsx({
            "text-white": isTabActive(tab),
          })} !text-[17px] ease-in-out hover:text-white hover:duration-200`}
          href={tab.url}
          key={index}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
