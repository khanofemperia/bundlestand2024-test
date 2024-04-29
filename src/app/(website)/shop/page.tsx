import Quickview, {
  QuickviewButton,
} from "@/components/website/Storefront/Quickview";
import ProductCard from "@/components/website/Storefront/ProductCard";
import config from "@/libraries/config";
import Image from "next/image";
import Link from "next/link";
import Categories from "@/components/website/Storefront/Categories";

async function getCollections() {
  const MINIMUM_PRODUCTS_FOR_FEATURED_COLLECTION = 3;
  const FEATURED_COLLECTION = "FEATURED_COLLECTION";

  try {
    const response = await fetch(`${config.BASE_URL}api/collections`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch collections. Status: ${response.status}`
      );
    }

    const allCollections = await response.json();

    const updatedCollections = allCollections
      .map((collection: CollectionProps) => {
        if (
          collection.collection_type === FEATURED_COLLECTION &&
          collection.products.length < MINIMUM_PRODUCTS_FOR_FEATURED_COLLECTION
        ) {
          return null;
        }
        return collection;
      })
      .filter(Boolean);

    return updatedCollections;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

async function getCategories() {
  const response = await fetch(`${config.BASE_URL}api/product-categories`, {
    cache: "no-store",
  });

  return response.json();
}

async function getPageHero() {
  const response = await fetch(`${config.BASE_URL}api/page-hero`, {
    cache: "no-store",
  });

  return response.json();
}

async function getRecommendedProducts() {
  const response = await fetch(`${config.BASE_URL}api/recommended/`, {
    cache: "no-store",
  });

  return response.json();
}

export default async function Shop() {
  const FEATURED_COLLECTION = "FEATURED_COLLECTION";
  const PROMOTIONAL_BANNER = "PROMOTIONAL_BANNER";

  const categories: CategoryProps[] = await getCategories();
  const pageHero = await getPageHero();
  const collections: CollectionProps[] = await getCollections();
  const recommendedProducts: ProductProps[] = await getRecommendedProducts();

  return (
    <>
      <div className="mt-11">
        {Object.keys(pageHero).length > 0 && (
          <Link
            href={pageHero.url}
            className="w-full h-max relative mx-auto flex items-center justify-center overflow-hidden bg-gray"
          >
            <Image
              src={pageHero.image}
              alt={pageHero.title}
              title={pageHero.title}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
              width={1348}
              height={400}
            />
          </Link>
        )}
        <div className="w-[1014px] mx-auto mb-52 pt-10">
          <Categories categories={categories} />
          <div className="flex flex-col gap-16">
            {collections.map(
              ({
                id,
                slug,
                index,
                collection_type,
                title,
                image,
                products,
              }) => {
                if (collection_type === FEATURED_COLLECTION) {
                  return (
                    <div key={index}>
                      <div className="w-full mb-5 px-[10px] flex items-center gap-2">
                        <h2 className="text-[22px] font-semibold">{title}</h2>
                        <a
                          className="underline mt-[2px] text-sm"
                          href={`/shop/collections/${slug}-${id}`}
                        >
                          See more
                        </a>
                      </div>
                      <div className="flex w-full h-max">
                        {products
                          .slice(0, 3)
                          .map(
                            (
                              {
                                id,
                                name,
                                poster,
                                price,
                                slug,
                                images,
                                description,
                                colors,
                                sizes,
                              }: ProductProps,
                              index
                            ) => (
                              <div
                                key={index}
                                className="w-[338px] h-[402px] rounded-2xl select-none relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3"
                              >
                                <Link
                                  href={`/${slug}-${id}`}
                                  target="_blank"
                                  className="w-[318px] h-[318px] cursor-pointer z-[1] absolute top-[10px] left-[10px] right-[10px] bg-gray rounded-xl flex items-center justify-center overflow-hidden"
                                >
                                  <Image
                                    src={poster}
                                    alt={name}
                                    width={318}
                                    height={318}
                                    priority={true}
                                  />
                                </Link>
                                <ProductCard
                                  id={id}
                                  name={name}
                                  slug={slug}
                                  price={price}
                                />
                                <QuickviewButton
                                  product={{
                                    id,
                                    name,
                                    price,
                                    poster,
                                    images,
                                    description,
                                    colors,
                                    sizes,
                                    slug,
                                  }}
                                />
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  );
                }

                if (collection_type === PROMOTIONAL_BANNER) {
                  return (
                    <Link href={`/shop/collections/${slug}-${id}`} key={index}>
                      <div className="w-full h-max rounded-2xl p-[10px] relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3">
                        <div className="w-full min-h-[400px] h-[400px] flex items-center justify-center rounded-xl overflow-hidden bg-gray">
                          <Image
                            src={image || ""}
                            alt={title}
                            width={994}
                            height={400}
                            priority={true}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                }

                return "";
              }
            )}
          </div>
          <div className="mt-16">
            <div className="w-full mb-5 px-[10px] flex items-center gap-2">
              <h2 className="text-[22px] font-semibold">Shop now</h2>
            </div>
            <div className="w-full flex flex-wrap">
              {recommendedProducts.map(
                (
                  {
                    id,
                    name,
                    poster,
                    price,
                    slug,
                    images,
                    description,
                    colors,
                    sizes,
                  },
                  index
                ) => (
                  <div
                    key={index}
                    className="w-[338px] h-[402px] rounded-2xl select-none relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3"
                  >
                    <Link
                      href={`/${slug}-${id}`}
                      target="_blank"
                      className="w-[318px] h-[318px] cursor-pointer z-[1] absolute top-[10px] left-[10px] right-[10px] bg-gray rounded-xl flex items-center justify-center overflow-hidden"
                    >
                      <Image
                        src={poster}
                        alt={name}
                        width={318}
                        height={318}
                        priority={true}
                      />
                    </Link>
                    <ProductCard
                      id={id}
                      name={name}
                      slug={slug}
                      price={price}
                    />
                    <QuickviewButton
                      product={{
                        id,
                        name,
                        price,
                        poster,
                        images,
                        description,
                        colors,
                        sizes,
                        slug,
                      }}
                    />
                  </div>
                )
              )}
            </div>
            <a
              className="before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:border before:border-black before:rounded-full hover:before:scale-105 relative mx-auto mt-6 rounded-full h-12 w-max px-14 flex items-center justify-center"
              href="#"
            >
              See more
            </a>
          </div>
        </div>
      </div>
      <Quickview />
    </>
  );
}
