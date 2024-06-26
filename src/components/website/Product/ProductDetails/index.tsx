import Image from "next/image";
import ProductImages from "../../ProductImages";
import SpecialOffer from "../../SpecialOffer";
import ProductOptions from "../ProductOptions";
import ShowAlert from "../ShowAlert";
import { cookies } from "next/headers";
import config from "@/libraries/config";
import upsellStyles from "./upsell.module.css";
import SpecialOfferOverlay from "../../SpecialOfferOverlay";
import Link from "next/link";
import ProductCard from "../../Storefront/ProductCard";
import { QuickviewButton } from "../../Storefront/Quickview";
import { HiOutlineStar } from "react-icons/hi2";
import { HiChevronRight } from "react-icons/hi";

type ProductInCartProps = {
  id: string;
  color: string;
  size: string;
};

async function getCart() {
  const deviceIdentifier = cookies().get("device_identifier")?.value;

  if (!deviceIdentifier) return null;

  try {
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

export default async function Product({ data }: { data: ProductProps }) {
  const { id, name, price, colors, sizes, poster, description } = data;

  const existingCart = await getCart();
  const isInCart = existingCart?.products.some(
    (product: any) => product.id === id
  );

  let productInCart;

  if (isInCart) {
    productInCart = existingCart.products.find(
      (p: ProductInCartProps) => p.id === id
    );
  }

  return (
    <>
      <div className="w-[1024px] px-[14px] mx-auto flex items-end flex-col justify-end">
        <div className="relative w-full">
          <div className="flex flex-row pt-5 mb-20 w-max">
            <div className="w-[582px]">
              <ProductImages images={data.images} poster={poster} name={name} />
              {/* {description && (
                <div className="w-full mt-[22px] p-5 rounded-[24px] bg-gray text-xl">
                  <div
                    id="product-description"
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: description || "" }}
                  />
                </div>
              )} */}
              {/* <div className="w-full mt-[22px] p-5 rounded-[24px] bg-gray text-xl">
                <div>
                  <p>
                    <strong>
                      Watching your little one take their first wobbly steps is
                      a moment you'll cherish forever.
                    </strong>{" "}
                    Make sure they feel comfortable and supported with our
                    specially designed baby shoes.
                  </p>
                </div>
                <div>
                  <br />
                </div>
                <div>
                  <p>
                    <strong>
                      No more worrying about outgrowing shoes in a blink!
                    </strong>{" "}
                    Our innovative <strong>Grow-with-Me Design</strong> features
                    a soft, flexible sole that adapts to your baby's growing
                    feet, saving you time and money.
                  </p>
                </div>
                <div>
                  <br />
                </div>
                <div>
                  <p>
                    <strong>
                      Imagine the feeling of soft socks on your own feet -
                      that's what our shoes feel like!
                    </strong>{" "}
                    They're gentle on your baby's delicate toes and provide just
                    the right amount of support for their wobbly ankles,
                    promoting healthy foot development.
                  </p>
                </div>
                <div>
                  <br />
                </div>
                <div>
                  <p>
                    <strong>Embrace the joy of those first steps.</strong>{" "}
                    Choose comfort and support for your precious little one.
                  </p>
                </div>
              </div> */}
            </div>
            <div className="w-[394px] mt-[18px] ml-5 flex flex-col">
              <p className="mt-[-6px] text-sm text-gray">
                High Waisted Running Shorts
              </p>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex gap-[1px]">
                  <HiOutlineStar
                    className="stroke-[#fbbe1f] fill-yellow-400"
                    size={20}
                  />
                  <HiOutlineStar
                    className="stroke-[#fbbe1f] fill-yellow-400"
                    size={20}
                  />
                  <HiOutlineStar
                    className="stroke-[#fbbe1f] fill-yellow-400"
                    size={20}
                  />
                  <HiOutlineStar
                    className="stroke-[#fbbe1f] fill-yellow-400"
                    size={20}
                  />
                  <HiOutlineStar
                    className="stroke-[#fbbe1f] fill-yellow-400"
                    size={20}
                  />
                </div>
                <div className="text-[#008a00] font-medium">
                  18,640+ Happy Customers
                </div>
              </div>
              <div className="pt-5 pb-7 flex flex-col gap-3">
                <p className="text-lg">
                  <strong className="font-bold text-lg">
                    Struggling with uncomfortable shorts during workouts?
                  </strong>{" "}
                  Say no more, our shorts guarantee{" "}
                  <strong>
                    <em className="text-lg">comfort and style</em>
                  </strong>{" "}
                  for every activity!
                </p>
                <ul className="text-sm list-inside list-image-checkmark *:leading-[26px]">
                  <li>Quick-dry fabric for cool comfort.</li>
                  <li>Double layer design for better movement.</li>
                  <li>Zipper pocket to secure your phone.</li>
                  <li>Ideal for running, gym, and casual wear.</li>
                </ul>
              </div>
              <div className="mb-8">
                <button className="h-8 border px-4 rounded-full flex items-center justify-center gap-1">
                  <span className="text-sm font-medium">
                    Select Size, Color, & Material
                  </span>
                  <HiChevronRight size={20} />
                </button>
                {/* <button className="h-8 bg-[#e0e0e0] px-4 rounded-full flex items-center justify-center gap-1">
                  <span className="text-sm font-medium">
                    Select Size, Color, & Material
                  </span>
                  <HiChevronRight size={20} />
                </button> */}
              </div>
              {/* <div className="flex flex-col gap-8">
                <ProductOptions
                  cartInfo={{
                    isInCart,
                    productInCart,
                  }}
                  productInfo={{
                    id,
                    price,
                    colors,
                    sizeChart: sizes,
                  }}
                />
              </div> */}
              <div
                className={`${upsellStyles.custom_border} py-4 px-10 w-max rounded-md`}
              >
                <div className="w-full">
                  <div>
                    <h2 className="font-black text-center text-[21px] text-red leading-6 [letter-spacing:-1px] [word-spacing:2px] [text-shadow:#707070_0px_1px_0px] w-[248px] mx-auto">
                      UPGRADE MY ORDER
                    </h2>
                    <div className="mt-1 text-center font-medium text-lg *:text-lg text-gray">
                      <span className="font-bold text-[#008a00]">$37.99</span>{" "}
                      (Save 58% - was{" "}
                      <span className="line-through font-medium text-gray">
                        $89.99
                      </span>
                      )
                    </div>
                    {/* <div className="mt-1 text-center">
                      Today it's yours for <strong>$37.99</strong> (was{" "}
                      <span className="line-through">$89.99</span>)
                    </div> */}
                  </div>
                  <div className="mt-2 h-[240px] aspect-square mx-auto overflow-hidden">
                    <Image
                      // src="https://i.pinimg.com/564x/ab/d7/1b/abd71b557fc77916f1570da50c0325a8.jpg"
                      src="https://i.pinimg.com/564x/4e/49/59/4e49591bcdc390aec8673e12d57a0f90.jpg"
                      alt="Upgrade my order"
                      width={240}
                      height={240}
                      priority
                    />
                  </div>
                </div>
              </div>
              {/* <SpecialOffer /> */}
            </div>
          </div>
          {/* <div className="mb-20">
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
                    className="w-[332px] h-[402px] rounded-2xl select-none relative ease-in-out hover:ease-out hover:duration-300 hover:before:content-[''] hover:before:absolute hover:before:top-0 hover:before:bottom-0 hover:before:left-0 hover:before:right-0 hover:before:rounded-2xl hover:before:shadow-custom3"
                  >
                    <Link
                      href={`/${slug}-${id}`}
                      target="_blank"
                      className="w-[312px] h-[312px] cursor-pointer z-[1] absolute top-[10px] left-[10px] right-[10px] bg-gray rounded-xl flex items-center justify-center overflow-hidden"
                    >
                      <Image
                        src={poster}
                        alt={name}
                        width={312}
                        height={312}
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
          </div> */}
        </div>
      </div>
      <ShowAlert />
      <SpecialOfferOverlay />
    </>
  );
}
