import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import config from "@/libraries/config";
import Search from "./Search";

async function getCart() {
  try {
    const deviceIdentifier = cookies().get("device_identifier")?.value;

    const response = await fetch(
      `${config.BASE_URL}/api/carts/${deviceIdentifier}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (Object.keys(data).length === 0) return null;

    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export default async function Navbar() {
  const cart = await getCart();

  return (
    <div className="z-20 w-full h-[68px] border-b fixed top-0 bg-white flex items-center gap-5 px-3">
      <div className="w-[1024px] h-full rounded-[4px] mx-auto flex items-center">
        <div className="w-full h-full relative flex items-center">
          <Link
            href="/"
            className="h-max flex items-center justify-center absolute left-0"
          >
            <Image
              src="/cherlygood_wordmark.svg"
              alt="Cherly Good"
              width={160}
              height={40}
              priority={true}
            />
          </Link>
          <Search />
          <Link
            href="/cart"
            className="absolute right-0 h-12 w-12 rounded-full flex items-center justify-center ease-in-out transition duration-300 hover:bg-[#f0f4f9]"
          >
            <PiShoppingCartSimpleBold size={26} />
            {cart && (
              <span className="absolute top-[4px] -right-[2px] min-w-5 w-max h-5 px-1 rounded-full text-sm font-semibold flex items-center justify-center text-white bg-red">
                {cart.products.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
