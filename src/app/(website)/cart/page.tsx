import { AiOutlineDelete } from "react-icons/ai";
import { HiMiniChevronRight } from "react-icons/hi2";
import style from "./style.module.css";
import { TbLock, TbTruck } from "react-icons/tb";
import { PiShieldCheckBold } from "react-icons/pi";
import Image from "next/image";
import { cookies } from "next/headers";
import config from "@/libraries/config";

type ShoppingCartProps = {
  date_created: { seconds: number; nanoseconds: number };
  device_identifier: string;
  products: {
    id: string;
    name: string;
    price: string;
    poster: string;
    status: string;
    visibility: string;
    color: string;
    size: string;
    slug: string;
  }[];
  last_updated: { seconds: number; nanoseconds: number };
};

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

export default async function Cart() {
  const shoppingCart: ShoppingCartProps = await getCart();

  return (
    <div className="relative mx-auto flex flex-row gap-10 w-[1014px] mt-[68px]">
      <div className="w-[580px] h-max">
        <div className="pt-[40px] font-semibold">Shopping cart</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {shoppingCart.products.map(
            ({ id, poster, name, price, color, size }, index) => (
              <div
                key={index}
                className={`${style.product} w-full h-[200px] p-[10px] flex gap-4 rounded-2xl select-none relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3`}
              >
                <div className="min-w-[180px] w-[180px] h-[180px] rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={poster}
                    alt={name}
                    width={180}
                    height={180}
                    priority={true}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-[0.938rem] leading-5 line-clamp-1 w-60">
                    {name}
                  </div>
                  <div className="h-[30px] w-max px-3 font-medium text-base border rounded-full flex items-center justify-center">
                    <span>
                      {color}/{size}
                    </span>
                    <HiMiniChevronRight className="-mr-2" size={20} />
                  </div>
                  <div className="font-medium text-black">${price}</div>
                </div>
                <button className="w-[30px] h-[30px] rounded-full hidden absolute right-[6px] top-[6px] transition duration-300 ease-in-out hover:bg-gray2">
                  <AiOutlineDelete
                    className="fill-text-gray absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    size={20}
                  />
                </button>
              </div>
            )
          )}
        </div>
      </div>
      <div className="order-last w-[340px] min-w-[340px] sticky top-[68px] pt-[42px] h-max flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-[6px] items-center">
            <TbLock className="stroke-green-600 -ml-[1px]" size={20} />
            <span className="text-sm text-gray">
              Secure Checkout with SSL Encryption
            </span>
          </div>
          <div className="flex gap-[6px] items-center">
            <PiShieldCheckBold className="fill-green-600" size={18} />
            <span className="text-sm text-gray ml-[1px]">
              Safe Payment Methods
            </span>
          </div>
          <div className="flex gap-[6px] items-center">
            <TbTruck className="stroke-green-600" size={20} />
            <span className="text-sm text-gray">Free Shipping</span>
          </div>
        </div>
        <div className="mb-2 flex items-center gap-1">
          <span className="font-medium">Total (5 Items):</span>
          <span className="font-bold text-xl">$108.99</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="h-[20px] rounded-[3px] flex items-center justify-center">
            <Image
              src="/payment-methods/visa.svg"
              alt="Visa"
              width={34}
              height={34}
              priority={true}
            />
          </div>
          <div className="ml-[10px] h-[18px] w-[36px] rounded-[3px] flex items-center justify-center">
            <Image
              className="-ml-[4px]"
              src="/payment-methods/mastercard.svg"
              alt="Mastercard"
              width={38}
              height={38}
              priority={true}
            />
          </div>
          <div className="ml-[5px] h-[20px] overflow-hidden rounded-[3px] flex items-center justify-center">
            <Image
              src="/payment-methods/american-express.png"
              alt="American Express"
              width={60}
              height={20}
              priority={true}
            />
          </div>
          <div className="ml-[10px] h-[20px] rounded-[3px] flex items-center justify-center">
            <Image
              src="/payment-methods/discover.svg"
              alt="Discover"
              width={64}
              height={14}
              priority={true}
            />
          </div>
          <div className="ml-[10px] h-[20px] rounded-[3px] flex items-center justify-center">
            <Image
              src="/payment-methods/diners-club-international.svg"
              alt="Diners Club International"
              width={68}
              height={10}
              priority={true}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button className="w-full h-12 italic font-extrabold text-xl bg-sky-700 text-white rounded-full flex items-center justify-center">
            PayPal
          </button>
          <button className="w-full h-12 bg-black text-white rounded-full flex items-center justify-center">
            Debit or Credit Card
          </button>
        </div>
      </div>
    </div>
  );
}
