import Link from "next/link";
import config from "@/libraries/config";
import OffersTable from "@/components/admin/products/offers/OffersTable";
import {
  NewOfferButton,
  NewOfferOverlay,
} from "@/components/admin/products/offers/NewOffer";
import DropdownMenu from "@/components/admin/DropdownMenu";

async function getData(): Promise<OfferProps[]> {
  const response = await fetch(`${config.BASE_URL}api/admin/products/offers`, {
    cache: "no-store",
  });

  const responseData = await response.json();

  if (!Array.isArray(responseData)) {
    throw new Error("Invalid response format");
  }

  return responseData as OfferProps[];
}

export default async function Offers() {
  const offers = await getData();

  return (
    <>
      <header className="flex flex-col gap-[14px]">
        <NewOfferButton />
        <Link
          href="/"
          className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
        >
          Access the public website
        </Link>
        <Link
          href="/logout"
          className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
        >
          Sign out of your administrator account
        </Link>
      </header>
      <OffersTable offers={offers} />
      <NewOfferOverlay />
    </>
  );
}
