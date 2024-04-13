import Image from "next/image";
import ProductImages from "../../ProductImages";
import SpecialOffer from "../../SpecialOffer";
import ProductOptions from "../ProductOptions";
import ShowAlert from "../ShowAlert";
import { cookies } from "next/headers";
import config from "@/libraries/config";
import styles from "./description.module.css";
import SpecialOfferOverlay from "../../SpecialOfferOverlay";

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
              {description && (
                <div className="w-full mt-[22px] p-5 rounded-[24px] bg-gray text-xl">
                  <div
                    id="product-description"
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: description || "" }}
                  />
                </div>
              )}
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
            <div className="w-[394px] mt-[18px] ml-5 flex flex-col gap-8">
              <p className="mt-[-6px]">{name}</p>
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
              <SpecialOffer />
            </div>
          </div>
          <section>
            <h1 className="font-bold text-[22px] mb-8">More for you</h1>
            <div className="w-max max-w-full pb-16 flex flex-wrap justify-start gap-3">
              <div className="w-[210px] mb-4">
                <div className="w-max h-[210px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/f3/08/94/f308948a380b345a20e1e935a96f914f.jpg"
                    alt={""}
                    width={210}
                    height={210}
                    priority={true}
                  />
                </div>
                <div className="mt-[0.375rem] text-[0.938rem] leading-5 line-clamp-1">
                  Women's Low Waist Button Bodycon Mini Cargo Denim Skirt with
                  Pocket
                </div>
                <div className="flex items-center mt-[6px]">
                  <div className="flex items-end gap-2 h-5 w-full">
                    <p className="[font-family:'Segoe_UI'] text-sm h-[21px] line-through text-gray">
                      ${price}
                    </p>
                  </div>
                  <button className="bg-[#e4e6eb] outline-none border-none w-16 h-8 rounded-full flex items-center justify-center">
                    <Image
                      src="/cart_plus.svg"
                      alt="Add to cart"
                      width={23}
                      height={23}
                    />
                  </button>
                </div>
              </div>
              <div className="w-[210px] mb-4">
                <div className="w-full h-[210px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/564x/f8/78/af/f878af550530db82830c6f6efac82bdc.jpg"
                    alt={""}
                    width={210}
                    height={210}
                    priority={true}
                  />
                </div>
                <div className="mt-[0.375rem] text-[0.938rem] leading-5 line-clamp-1">
                  Skirts for Women Regular and Plus Size Skirt with Pockets
                  Below The Knee Length Ruched Flowy Midi Skirt
                </div>
                <div className="flex items-center mt-[6px]">
                  <div className="flex items-end gap-2 h-5 w-full">
                    <p className="[font-family:'Segoe_UI'] text-sm h-[21px] line-through text-gray">
                      ${price}
                    </p>
                  </div>
                  <button className="bg-[#e4e6eb] outline-none border-none w-16 h-8 rounded-full flex items-center justify-center">
                    <Image
                      src="/cart_plus.svg"
                      alt="Add to cart"
                      width={23}
                      height={23}
                      priority={true}
                    />
                  </button>
                </div>
              </div>
              <div className="w-[210px] mb-4">
                <div className="w-full h-[210px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/da/34/51/da34519682690f44fd937ef503c3e1b8.jpg"
                    alt={""}
                    width={1000}
                    height={1000}
                    priority={true}
                  />
                </div>
                <div className="mt-[0.375rem] text-[0.938rem] leading-5 line-clamp-1">
                  High Waisted Pleated Tennis Skirt with Pockets Athletic Golf
                  Skorts for Women Casual Workout Built-in Shorts
                </div>
                <div className="flex items-center mt-[6px]">
                  <div className="flex items-end gap-2 h-5 w-full">
                    <p className="[font-family:'Segoe_UI'] text-sm h-[21px] line-through text-gray">
                      ${price}
                    </p>
                  </div>
                  <button className="bg-[#e4e6eb] outline-none border-none w-16 h-8 rounded-full flex items-center justify-center">
                    <Image
                      src="/cart_plus.svg"
                      alt="Add to cart"
                      width={23}
                      height={23}
                      priority={true}
                    />
                  </button>
                </div>
              </div>
              <div className="w-[210px] mb-4">
                <div className="w-full h-[210px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/564x/44/14/c7/4414c747115090f0a9cbbc662a4fbbb5.jpg"
                    alt={""}
                    width={1000}
                    height={1000}
                    priority={true}
                  />
                </div>
                <div className="mt-[0.375rem] text-[0.938rem] leading-5 line-clamp-1">
                  Faux Mini Elastic High Waist Plus Size Pencil Aline Bodycon
                  Vegan Stretch Elegant Skirts S-XXL
                </div>
                <div className="flex items-center mt-[6px]">
                  <div className="flex items-end gap-2 h-5 w-full">
                    <p className="[font-family:'Segoe_UI'] text-sm h-[21px] line-through text-gray">
                      ${price}
                    </p>
                  </div>
                  <button className="bg-[#e4e6eb] outline-none border-none w-16 h-8 rounded-full flex items-center justify-center">
                    <Image
                      src="/cart_plus.svg"
                      alt="Add to cart"
                      width={23}
                      height={23}
                      priority={true}
                    />
                  </button>
                </div>
              </div>
              <div className="w-[210px] mb-4">
                <div className="w-full h-[210px] rounded-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/98/5c/70/985c70075d20d46c7251e124de4bab10.jpg"
                    alt={""}
                    width={1000}
                    height={1000}
                    priority={true}
                  />
                </div>
                <div className="mt-[0.375rem] text-[0.938rem] leading-5 line-clamp-1">
                  Floral Print Midi Skirt Casual High Elastic Waist Zipper
                  Vintage Long Boho Skirts for Women
                </div>
                <div className="flex items-center mt-[6px]">
                  <div className="flex items-end gap-2 h-5 w-full">
                    <p className="[font-family:'Segoe_UI'] text-sm h-[21px] line-through text-gray">
                      ${price}
                    </p>
                  </div>
                  <button className="bg-[#e4e6eb] outline-none border-none w-16 h-8 rounded-full flex items-center justify-center">
                    <Image
                      src="/cart_plus.svg"
                      alt="Add to cart"
                      width={23}
                      height={23}
                      priority={true}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <ShowAlert />
      <SpecialOfferOverlay />
    </>
  );
}
