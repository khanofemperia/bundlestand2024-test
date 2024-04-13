import config from "@/libraries/config";
import Quickview, {
  QuickviewButton,
} from "@/components/website/Storefront/Quickview";
import ProductCard from "@/components/website/Storefront/ProductCard";
import Image from "next/image";
import Link from "next/link";
import Categories from "@/components/website/Storefront/Categories";

function isValidSlug(input: string): boolean {
  const regex = /^[a-zA-Z0-9-]+-\d{5}$/;
  return regex.test(input);
}

async function getData(slug: string) {
  try {
    const id = slug.split("-").pop();
    const response = await fetch(`${config.BASE_URL}api/collections/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch collection");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

export default async function Collections({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  if (!isValidSlug(params.slug)) {
    console.log("URL slug is invalid");
    return <div>404 - Not found</div>;
  }

  const data = await getData(params.slug);
  const collection = data.collection;

  return (
    <div className="w-[1014px] mx-auto mt-11 py-16">
      <div className="w-full mb-5 px-[10px] flex items-center gap-2">
        <h2 className="text-[22px] font-semibold">{collection.title}</h2>
      </div>
      <div className="flex flex-wrap w-full">
        {collection.products.map(
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
            index: number
          ) => (
            <div
              key={index}
              className="min-w-[338px] w-[338px] h-[402px] rounded-2xl select-none relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3"
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
              <ProductCard id={id} name={name} slug={slug} price={price} />
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
