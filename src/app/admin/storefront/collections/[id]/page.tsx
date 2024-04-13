import { capitalizeFirstLetter } from "@/libraries/utils";
import { HiMiniChevronRight } from "react-icons/hi2";
import { BsInfoCircle } from "react-icons/bs";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { EditBasicDetailsButton } from "@/components/admin/storefront/edit-collection/BasicDetailsOverlay";
import SettingsOverlay, {
  EditSettingsButton,
} from "@/components/admin/storefront/edit-collection/SettingsOverlay";
import BasicDetailsOverlay from "@/components/admin/storefront/edit-collection/BasicDetailsOverlay";
import CampaignDurationOverlay, {
  CampaignDurationButton,
} from "@/components/admin/storefront/edit-collection/CampaignDurationOverlay";
import {
  CollectionProductsButton,
  CollectionProductsOverlay,
} from "@/components/admin/storefront/edit-collection/CollectionProductsOverlay";
import HeroImageOverlay, {
  EditHeroImageButton,
} from "@/components/admin/storefront/edit-collection/HeroImageOverlay";
import BannerImageOverlay, {
  EditBannerImageButton,
} from "@/components/admin/storefront/edit-collection/BannerImageOverlay";

type CollectionProductsProps = {
  id: string;
  index: number;
  name: string;
  price: string;
  poster: string;
  slug: string;
  visibility: string;
};

type CollectionProps = {
  id: string;
  index: number;
  title: string;
  slug: string;
  campaign_duration: {
    start_date: string;
    end_date: string;
  };
  collection_type: string;
  image?: string;
  products: CollectionProductsProps[];
  status: string;
  visibility: string;
  date_created: string;
  last_updated: string;
};

async function getData(id: string) {
  const response = await fetch(
    `http://localhost:3000/api/admin/collections/${id}`,
    {
      cache: "no-cache",
    }
  );

  return response.json();
}

export default async function EditCollection({
  params,
}: {
  params: { id: string };
}) {
  const CAMPAIGN_STATUS_ENDED = "Ended";
  const CAMPAIGN_STATUS_UPCOMING = "Upcoming";
  const CAMPAIGN_STATUS_ACTIVE = "Active";
  const PAGE_HERO = "PAGE_HERO";
  const PROMOTIONAL_BANNER = "PROMOTIONAL_BANNER";
  const FEATURED_COLLECTION = "FEATURED_COLLECTION";
  const PUBLISHED = "PUBLISHED";
  const VISIBLE = "VISIBLE";
  const HIDDEN = "HIDDEN";
  const DRAFT = "DRAFT";

  const data = await getData(params.id);

  const collectionData = data.collection as CollectionProps | undefined;
  if (!collectionData) {
    console.log("Data not available");
    // Handle the absence of data here if needed
    return <div>Data not available</div>; // Return or handle the absence of data
  }

  const products = collectionData.products as CollectionProductsProps[];

  const {
    title,
    slug,
    campaign_duration,
    collection_type,
    status,
    visibility,
  } = collectionData;

  const heroImage =
    collection_type === PAGE_HERO ? collectionData.image : undefined;
  const bannerImage =
    collection_type === PROMOTIONAL_BANNER ? collectionData.image : undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getCampaignStatus = (startDate: string, endDate: string): string => {
    const currentDate = new Date();
    const campaignStartDate = new Date(startDate);
    const campaignEndDate = new Date(endDate);

    campaignStartDate.setUTCHours(0, 0, 0, 0);
    campaignEndDate.setUTCHours(0, 0, 0, 0);

    if (currentDate.getTime() > campaignEndDate.getTime()) {
      return CAMPAIGN_STATUS_ENDED;
    } else if (currentDate.getTime() < campaignStartDate.getTime()) {
      return CAMPAIGN_STATUS_UPCOMING;
    } else {
      return CAMPAIGN_STATUS_ACTIVE;
    }
  };

  return (
    <>
      <header className="flex flex-col gap-[14px]">
        <div className="mb-1 cursor-context-menu rounded-md px-2 h-6 w-max flex items-center gap-1 bg-gray2">
          <span className="text-sm font-semibold text-gray">Storefront</span>
          <HiMiniChevronRight className="fill-text-gray" size={14} />
          <span className="text-sm font-semibold text-gray">Collections</span>
          <HiMiniChevronRight className="fill-text-gray" size={14} />
          <span className="text-black font-semibold text-sm">
            Edit (#26341)
          </span>
        </div>
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
      <section>
        <div className="mt-9 flex flex-col gap-9">
          {heroImage && (
            <div>
              <h2 className="heading-size-h2">Page hero</h2>
              <div className="mt-5 w-[40rem] pb-5 px-5 rounded-lg shadow bg-white relative">
                <div className="flex justify-between items-start absolute right-2">
                  <EditHeroImageButton />
                </div>
                <div className="pt-[1.125rem] h-full w-full flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="heading-size-h3">Image</h3>
                    </div>
                    <div className="mt-2 flex w-[560px] h-max overflow-hidden rounded-[4px] bg-gray">
                      <Image
                        src={heroImage}
                        alt={title}
                        width={560}
                        height={166}
                        priority={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {bannerImage && (
            <div>
              <h2 className="heading-size-h2">Banner</h2>
              <div className="mt-5 w-[40rem] pb-5 px-5 rounded-lg shadow bg-white relative">
                <div className="flex justify-between items-start absolute right-2">
                  <EditBannerImageButton />
                </div>
                <div className="pt-[1.125rem] h-full w-full flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="heading-size-h3">Image</h3>
                    </div>
                    <div className="mt-2 flex w-[560px] h-max overflow-hidden rounded-[4px] bg-gray">
                      <Image
                        src={bannerImage}
                        alt={title}
                        width={560}
                        height={166}
                        priority={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <h2 className="heading-size-h2">Campaign duration</h2>
            <div className="mt-5 w-[25rem] pb-5 px-5 rounded-lg shadow bg-white relative">
              <div className="flex justify-between items-start absolute right-2">
                <CampaignDurationButton />
              </div>
              <div className="pt-[1.125rem] h-full w-full">
                <div className="w-[220px] flex flex-col relative">
                  <div className="flex gap-1 mb-5">
                    <BsInfoCircle size={16} className="fill-gold" />
                    <span className="select-none italic text-xs text-gold">
                      {getCampaignStatus(
                        campaign_duration.start_date,
                        campaign_duration.end_date
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      <h3 className="font-semibold text-sm leading-6 text-gray">
                        Start
                      </h3>
                      <p
                        className={`font-semibold w-max h-[26px] text-sm px-2 rounded-full flex items-center justify-center bg-opacity-15 ${clsx(
                          {
                            "text-green bg-green":
                              getCampaignStatus(
                                campaign_duration.start_date,
                                campaign_duration.end_date
                              ) === CAMPAIGN_STATUS_ACTIVE,
                            "text-gray bg-gray4":
                              getCampaignStatus(
                                campaign_duration.start_date,
                                campaign_duration.end_date
                              ) === CAMPAIGN_STATUS_ENDED ||
                              getCampaignStatus(
                                campaign_duration.start_date,
                                campaign_duration.end_date
                              ) === CAMPAIGN_STATUS_UPCOMING,
                          }
                        )}`}
                      >
                        {formatDate(campaign_duration.start_date)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <h3 className="font-semibold text-sm leading-6  text-gray">
                        End
                      </h3>
                      <p
                        className={`font-semibold w-max h-[26px] text-sm px-2 rounded-full flex items-center justify-center bg-opacity-15 ${clsx(
                          {
                            "text-red bg-red":
                              getCampaignStatus(
                                campaign_duration.start_date,
                                campaign_duration.end_date
                              ) === CAMPAIGN_STATUS_ENDED,
                            "text-gray bg-gray4":
                              getCampaignStatus(
                                campaign_duration.start_date,
                                campaign_duration.end_date
                              ) === CAMPAIGN_STATUS_ACTIVE ||
                              getCampaignStatus(
                                campaign_duration.start_date,
                                campaign_duration.end_date
                              ) === CAMPAIGN_STATUS_UPCOMING,
                          }
                        )}`}
                      >
                        {formatDate(campaign_duration.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="heading-size-h2">Basic details</h2>
            <div className="mt-5 w-[40rem] pb-5 px-5 rounded-lg shadow bg-white relative">
              <div className="flex justify-between items-start absolute right-2">
                <EditBasicDetailsButton />
              </div>
              <div className="pt-[1.125rem] h-full w-full flex flex-col gap-6">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3">Collection type</h3>
                  </div>
                  <div className="mt-2 flex">
                    {collection_type ? (
                      <p className="bg-gray2 px-2 rounded-md">
                        {collection_type === FEATURED_COLLECTION
                          ? "Featured Collection"
                          : collection_type === PROMOTIONAL_BANNER
                          ? "Promotional Banner"
                          : ""}
                      </p>
                    ) : (
                      <p className="italic text-ghost-gray">None</p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3">Title</h3>
                  </div>
                  <div className="mt-2 flex">
                    {title ? (
                      <p className="bg-gray2 px-2 rounded-md">{title}</p>
                    ) : (
                      <p className="italic text-ghost-gray">None</p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3">Slug</h3>
                  </div>
                  <div className="mt-2 flex">
                    {slug ? (
                      <p className="bg-gray2 px-2 rounded-md text-gray">
                        /bundlestand.com/...
                        <span className="text-black">/{slug}</span>
                      </p>
                    ) : (
                      <p className="italic text-ghost-gray">None</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="heading-size-h2">Settings</h2>
            <div className="mt-5 w-[25rem] pb-5 px-5 rounded-lg shadow bg-white relative">
              <div className="flex justify-between items-start absolute right-2">
                <EditSettingsButton />
              </div>
              <div className="pt-[1.125rem] h-full w-max">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3">Status</h3>
                  </div>
                  <div className="mt-2">
                    <p
                      className={`font-semibold w-max text-sm h-[26px] px-2 rounded-full flex items-center justify-center bg-opacity-15 ${clsx(
                        {
                          "text-green bg-green":
                            status.toUpperCase() === PUBLISHED,
                          "text-brown bg-brown": status.toUpperCase() === DRAFT,
                        }
                      )}`}
                    >
                      {capitalizeFirstLetter(status.toLowerCase())}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3">Visibility</h3>
                  </div>
                  <div className="mt-2">
                    <p
                      className={`font-semibold w-max text-sm h-[26px] px-2 rounded-full flex items-center justify-center bg-opacity-15 ${clsx(
                        {
                          "text-gold bg-gold":
                            visibility.toUpperCase() === VISIBLE,
                          "text-gray bg-gray4":
                            visibility.toUpperCase() === HIDDEN,
                        }
                      )}`}
                    >
                      {capitalizeFirstLetter(visibility.toLowerCase())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="heading-size-h2">Products</h2>
            <div className="mt-5 p-5 w-[40rem] rounded-lg shadow bg-white relative">
              <div className="w-full mx-auto pb-2 rounded-lg overflow-hidden [box-shadow:rgb(122,122,122,18%)_0px_3px_2px_0px,_rgb(0,0,0,20%)_0px_0px_1px_1px]">
                <table className="border-collapse">
                  <thead className="border-b bg-gray2">
                    <tr className="h-9 text-left">
                      <th className="min-w-[97px] w-[97px] pl-3 border-r"></th>
                      <th className="w-full pl-3 border-r">
                        <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                          Name
                        </h3>
                      </th>
                      <th className="min-w-[180px] w-[180px] pl-3">
                        <h3 className="heading-size-h3 whitespace-nowrap text-gray">
                          Price
                        </h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(({ index, poster, name, price }) => (
                      <tr key={index} className="border-b h-[124px] text-left">
                        <td className="min-w-[97px] w-[97px] border-r p-2">
                          <div className="w-[80px] h-[107px] bg-gray2 overflow-hidden flex items-center justify-center">
                            {poster && (
                              <Image
                                src={poster}
                                alt={name}
                                width={80}
                                height={80}
                                priority={true}
                              />
                            )}
                          </div>
                        </td>
                        <td className="w-full pl-3 pr-2 pt-[2px] border-r">
                          <p className="line-clamp-1">{name}</p>
                        </td>
                        <td className="min-w-[180px] w-[180px] pl-3">
                          <div className="w-max flex items-center justify-center gap-2">
                            <p className="text-sm">${price}</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 relative flex items-start w-full h-10">
                <h3 className="text-sm font-semibold italic text-center text-gray">
                  5 of 92 products
                </h3>
                <CollectionProductsButton />
              </div>
            </div>
          </div>
        </div>
      </section>
      <HeroImageOverlay collectionId={params.id} data={{ heroImage, title }} />
      <BannerImageOverlay
        collectionId={params.id}
        data={{ bannerImage, title }}
      />
      <BasicDetailsOverlay collectionId={params.id} data={{ title, slug }} />
      <SettingsOverlay
        collectionId={params.id}
        settings={{ status, visibility }}
      />
      <CampaignDurationOverlay
        collectionId={params.id}
        campaignDuration={campaign_duration}
      />
      <CollectionProductsOverlay
        data={{ collectionId: params.id, products: products }}
      />
    </>
  );
}
