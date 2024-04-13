import BasicDetailsOverlay, {
  EditBasicDetailsButton,
} from "@/components/admin/products/offers/BasicDetailsOverlay";
import Link from "next/link";
import Image from "next/image";
import {
  OfferProductsButton,
  OfferProductsOverlay,
} from "@/components/admin/products/offers/OfferProductsOverlay";
import clsx from "clsx";

type OfferProductProps = {
  id: string;
  index: number;
  poster: string;
  name: string;
  price: string;
};

async function getData(id: string) {
  const response = await fetch(
    `http://localhost:3000/api/admin/products/offers/${id}`,
    {
      cache: "no-cache",
    }
  );

  return response.json();
}

export default async function EditOffer({
  params,
}: {
  params: { id: string };
}) {
  const data = await getData(params.id);

  const offerData = data.offer as OfferProps | undefined;
  if (!offerData) {
    return <div>No data found</div>;
  }

  const { id, price, sale_price, poster, visibility, products } = offerData;
  const offerProducts = products.sort(
    (a, b) => a.index - b.index
  ) as OfferProductProps[];

  return (
    <>
      <header className="flex flex-col gap-[14px] pl-4 py-2 border-l-2 border-[#dfe2e7]">
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
          <div className="mt-5 w-[40rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
            <div className="flex items-center justify-between border-b pl-5 pr-2 py-2 h-max">
              <h3 className="heading-size-h3">Basic details</h3>
              <EditBasicDetailsButton />
            </div>
            <div className="mt-4 px-5 h-full w-full flex flex-col gap-6">
              <div className="w-full py-2 px-3 rounded-lg bg-gray2 relative flex justify-between">
                <p className="text-sm font-semibold">
                  Show special offer in product details
                </p>
                <div
                  className={clsx(
                    "w-10 h-5 rounded-full relative cursor-context-menu opacity-40 ease-in-out duration-200",
                    {
                      "bg-white border": visibility.toLowerCase() === "hidden",
                      "bg-blue border border-blue":
                        visibility.toLowerCase() === "visible",
                    }
                  )}
                >
                  <div
                    className={clsx(
                      "w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute top-1/2 transform -translate-y-1/2",
                      {
                        "left-[5px] bg-black":
                          visibility.toLowerCase() === "hidden",
                        "left-[23px] bg-white":
                          visibility.toLowerCase() === "visible",
                      }
                    )}
                  ></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-size-h3">Sale price</h3>
                  </div>
                  <div>
                    <input
                      className="w-full h-9 border rounded-lg flex items-center px-3"
                      defaultValue={sale_price}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="heading-size-h3">Price</h3>
                  </div>
                  <div>
                    <input
                      className="w-full h-9 border rounded-lg flex items-center px-3"
                      defaultValue={price}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="heading-size-h3">Poster</h3>
                </div>
                <div className="mt-2 w-[320px] h-[426px] border rounded-lg flex items-center justify-center px-4">
                  {poster && (
                    <Image
                      src={poster}
                      alt="Special offer"
                      width={320}
                      height={426}
                      priority={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 px-5 w-[40rem] rounded-lg pb-5 shadow bg-white relative overflow-hidden">
            <div className="py-2 h-max">
              <h3 className="heading-size-h3 h-9 flex items-center">
                Variants
              </h3>
            </div>
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
                  {offerProducts.map(({ index, poster, name, price }) => (
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
              <OfferProductsButton />
            </div>
          </div>
        </div>
      </section>
      <OfferProductsOverlay data={{ offerId: id, products: offerProducts }} />
      <BasicDetailsOverlay offerData={offerData} />
    </>
  );
}
