import Link from "next/link";
import {
  SetupCategoriesButton,
  SetupCategoriesOverlay,
} from "@/components/admin/storefront/SetupCategories";
import {
  ToggleCollectionsButton,
  ToggleCollectionsOverlay,
} from "@/components/admin/storefront/ToggleCollections";
import DropdownMenu from "@/components/admin/DropdownMenu";
import CollectionsTable from "@/components/admin/storefront/CollectionsTable";
import {
  NewCollectionButton,
  NewCollectionOverlay,
} from "@/components/admin/storefront/NewCollection";
import config from "@/libraries/config";
import {
  PageHeroButton,
  PageHeroOverlay,
} from "@/components/admin/storefront/PageHero";

async function getCollections() {
  const response = await fetch(`${config.BASE_URL}api/admin/collections`, {
    cache: "no-store",
  });

  return response.json();
}

async function getCategories() {
  const response = await fetch(
    `${config.BASE_URL}api/admin/product-categories`,
    {
      cache: "no-store",
    }
  );

  return response.json();
}

async function getPageHero() {
  const response = await fetch(`${config.BASE_URL}api/admin/page-hero`, {
    cache: "no-store",
  });

  return response.json();
}

export default async function Storefront() {
  const categories = await getCategories();
  const collections = await getCollections();
  const pageHero = await getPageHero();

  return (
    <>
      <header className="flex flex-col gap-[14px]">
        <DropdownMenu>
          <NewCollectionButton />
          <PageHeroButton />
          <SetupCategoriesButton />
          <ToggleCollectionsButton />
        </DropdownMenu>
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
      <CollectionsTable collections={collections} />
      <NewCollectionOverlay />
      <PageHeroOverlay pageHero={pageHero} />
      <SetupCategoriesOverlay categories={categories} />
      <ToggleCollectionsOverlay />
    </>
  );
}
