import { capitalizeFirstLetter } from "@/libraries/utils";
import BasicDetailsOverlay, {
  EditBasicDetailsButton,
} from "@/components/admin/products/edit-product/BasicDetailsOverlay";
import PosterOverlay, {
  EditPosterButton,
} from "@/components/admin/products/edit-product/PosterOverlay";
import ImagesOverlay, {
  EditImagesButton,
} from "@/components/admin/products/edit-product/ImagesOverlay";
import SettingsOverlay, {
  EditSettingsButton,
} from "@/components/admin/products/edit-product/SettingsOverlay";
import Link from "next/link";
import SizeChartOverlay, {
  EditSizesButton,
} from "@/components/admin/products/edit-product/SizeChartOverlay";
import ColorsOverlay, {
  EditColorsButton,
} from "@/components/admin/products/edit-product/ColorsOverlay";
import {
  ProductDescription,
  ProductDescriptionButton,
} from "@/components/admin/products/edit-product/ProductDescription";
import styles from "./description.module.css";

async function getData(id: string) {
  const response = await fetch(
    `http://localhost:3000/api/admin/products/${id}`,
    {
      cache: "no-cache",
    }
  );

  return response.json();
}

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const data = await getData(params.id);

  const productData = data.product as ProductProps | undefined;
  if (!productData) {
    return <div>Data not available</div>;
  }

  const {
    name,
    price,
    slug,
    id,
    poster,
    images,
    sizes,
    colors,
    status,
    visibility,
    description,
  } = productData;

  return (
    <>
      <header className="flex flex-col gap-[14px] pl-4 py-2 border-l-2 border-[#dfe2e7]">
        <Link
          href={`/${slug}-${params.id}`}
          className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
        >
          See this product on the public website
        </Link>
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
          <div>
            <p className="max-w-xl text-sm">
              Important for SEO: a name that includes target keywords in the
              first four words, a short URL with three or four keywords, and
              prices that help your business grow while making customers feel
              they're getting a good deal.
            </p>
            <div className="mt-5 w-[40rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
              <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
                <h3 className="heading-size-h3">Basic details</h3>
                <EditBasicDetailsButton />
              </div>
              <div className="mt-4 px-5 h-full w-full">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-size-h3">Name</h3>
                  </div>
                  <div>
                    {name ? (
                      <input
                        className="w-full h-9 border rounded-lg flex items-center px-3"
                        defaultValue={name}
                      />
                    ) : (
                      <div className="italic text-ghost-gray">None</div>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-size-h3">Slug</h3>
                  </div>
                  <div>
                    {slug ? (
                      <div className="w-full h-9 border rounded-lg flex items-center overflow-hidden">
                        <div className="h-full flex items-center px-3 border-r text-sm text-gray">
                          https://cherlygood.com/
                        </div>
                        <input
                          type="text"
                          className="w-full h-full px-3"
                          defaultValue={`${slug}-${id}`}
                        />
                      </div>
                    ) : (
                      <div className="italic text-ghost-gray">None</div>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-size-h3">Price</h3>
                  </div>
                  <div>
                    {price ? (
                      <input
                        className="w-64 h-9 border rounded-lg flex items-center px-3"
                        defaultValue={price}
                      />
                    ) : (
                      <div className="italic text-ghost-gray">None</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="max-w-xl text-sm">
              This is a visual magnet. It pulls in people with its power to
              captivate and make them feel things. Create a poster that not only
              catches the eye but holds it - and stirs people's imagination.
            </p>
            <div className="mt-5 w-[25rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
              <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
                <h3 className="heading-size-h3">Poster</h3>
                <EditPosterButton />
              </div>
              <div className="mt-5 px-5 h-full w-full">
                {!poster ? (
                  <p className="italic text-ghost-gray">None</p>
                ) : (
                  <div className="w-[222px] h-[296px] flex items-center justify-center rounded-lg relative overflow-hidden bg-gray2">
                    <img src={poster} alt={name} width={222} height={296} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="max-w-xl text-sm">
              Visuals that show off your product, helping people see its
              features and quality. They grab attention and let customers
              imagine owning it.
            </p>
            <div className="mt-5 w-[40rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
              <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
                <h3 className="heading-size-h3">Images</h3>
                <EditImagesButton />
              </div>
              <div className="mt-5 px-5 flex gap-2 flex-wrap">
                {!images?.length ? (
                  <p className="italic text-ghost-gray">None</p>
                ) : (
                  images.map((image, index) => (
                    <div
                      key={index}
                      className="w-[120px] h-[160px] flex items-center justify-center rounded-lg relative overflow-hidden bg-gray2"
                    >
                      {image && (
                        <img src={image} alt={name} width={120} height={160} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="max-w-xl text-sm">
              Products that come in different sizes make it easy for people to
              find what they're looking for. And with lots of colors available,
              everyone can show off their style and personality.
            </p>
            <div className="mt-5 w-[40rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
              <div className="pl-5 py-2 h-max">
                <h3 className="heading-size-h3 h-9 flex items-center">
                  Variants
                </h3>
              </div>
              <div className="px-5 h-full w-full flex flex-col gap-5">
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
                    <h3 className="heading-size-h3">Sizes</h3>
                    <EditSizesButton />
                  </div>
                  <div className="p-5 flex flex-wrap max-w-[350px] gap-2">
                    {sizes?.entry_labels.length ? (
                      sizes.entry_labels.map((size, index) => (
                        <div
                          key={index}
                          className="bg-gray2 rounded-full h-[27px] pb-[1px] px-4 select-none w-max max-w-lg"
                        >
                          {size.name}
                        </div>
                      ))
                    ) : (
                      <p className="italic text-ghost-gray">None</p>
                    )}
                  </div>
                </div>
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
                    <h3 className="heading-size-h3">Colors</h3>
                    <EditColorsButton />
                  </div>
                  <div className="p-5 w-[432px] flex gap-2 flex-wrap">
                    {!colors?.length ? (
                      <p className="italic text-ghost-gray">None</p>
                    ) : (
                      colors.map(({ name, image }, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="w-[90px] h-[90px] flex items-center justify-center relative overflow-hidden bg-gray2">
                            {image && (
                              <img
                                src={image}
                                alt={name}
                                width={90}
                                height={90}
                              />
                            )}
                          </div>
                          <div className="h-8 heading-size-h3 flex items-center justify-center">
                            {name}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="max-w-xl text-sm">
              Tell your product's story! Describe the features and benefits that
              make customers love it. Highlight what makes it unique and how it
              solves problems or improves lives. Keep it clear and concise,
              using descriptive language to engage the reader.
            </p>
            <div className="mt-5 w-[40rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
              <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
                <h3 className="heading-size-h3">Product description</h3>
                <ProductDescriptionButton />
              </div>
              <div className="mt-4 px-5 h-full w-full">
                {description ? (
                  <div className="h-full w-[560px] p-4 rounded-2xl bg-gray">
                    <div
                      id="product-description"
                      className={`${styles.description} line-clamp-5`}
                      dangerouslySetInnerHTML={{ __html: description || "" }}
                    />
                  </div>
                ) : (
                  <p className="italic text-ghost-gray">None</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="max-w-xl text-sm">
              Choose whether your product is a work-in-progress (draft) or ready
              to be seen (published), and decide if you want shoppers to see it
              (visible) or keep it private (hidden).
            </p>
            <div className="mt-5 w-[25rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
              <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
                <h3 className="heading-size-h3">Settings</h3>
                <EditSettingsButton />
              </div>
              <div className="mt-5 px-5 h-full w-full flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-size-h3">Status</h3>
                  </div>
                  <div>
                    <p
                      className={`${
                        status.toLowerCase() === "published"
                          ? "bg-green text-green"
                          : "bg-brown text-brown"
                      } bg-opacity-10 rounded-full text-sm h-[27px] pr-2 pl-2 flex items-center justify-center select-none w-max max-w-lg`}
                    >
                      {capitalizeFirstLetter(status.toLowerCase())}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-size-h3">Visibility</h3>
                  </div>
                  <div>
                    <p
                      className={`${
                        visibility.toLowerCase() === "visible"
                          ? "bg-gold text-gold"
                          : "bg-gray4 text-gray4"
                      } bg-opacity-10 rounded-full text-sm h-[27px] pr-2 pl-2 flex items-center justify-center select-none w-max max-w-lg`}
                    >
                      {capitalizeFirstLetter(visibility.toLowerCase())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BasicDetailsOverlay productId={params.id} data={{ name, price, slug }} />
      <PosterOverlay
        productId={params.id}
        productPoster={poster}
        productName={name}
      />
      <ImagesOverlay productId={id} productImages={images} productName={name} />
      <SizeChartOverlay data={{ productId: id, chart: sizes }} />
      <ColorsOverlay data={{ productId: id, colors }} />
      <SettingsOverlay productId={id} settings={{ status, visibility }} />
      <ProductDescription productId={id} description={description} />
    </>
  );
}
