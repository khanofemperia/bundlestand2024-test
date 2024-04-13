"use client";

export default function ProductCard({
  id,
  name,
  slug,
  price,
}: {
  id: string;
  name: string;
  slug: string;
  price: string;
}) {
  const handleClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={() => handleClick(`/${slug}-${id}`)}
      className="w-full h-full relative cursor-pointer"
    >
      <div className="absolute left-[10px] right-[10px] bottom-[10px]">
        <div className="text-[0.938rem] leading-5 line-clamp-1">{name}</div>
        <div className="flex items-center justify-start w-full h-8 mt-[6px]">
          <div className="flex items-center gap-2 w-max h-5">
            <p className="font-semibold text-lg text-black">${price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
