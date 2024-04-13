import Link from "next/link";
import { capitalizeFirstLetter } from "@/libraries/utils";

export function AdminHeaderOutlineLink({
  href,
  title,
  text1,
}: {
  href: string;
  title: string;
  text1: string;
}) {
  return (
    <Link
      href={href}
      className="border border-[#d6d6d6] w-[140px] h-[100px] relative rounded-lg ease-in-out hover:bg-gray3 hover:duration-300 hover:ease-out hover:border-gray3"
      title={title}
    >
      <div className="absolute bottom-4 left-3 text-left">
        {capitalizeFirstLetter(text1)}
      </div>
    </Link>
  );
}

export function AdminHeaderSecondaryLink({
  href,
  title,
  text1,
}: {
  href: string;
  title: string;
  text1: string;
}) {
  return (
    <Link
      href={href}
      className="border border-gray2 bg-gray2 w-[140px] h-[100px] relative rounded-lg ease-in-out hover:border-gray3 hover:bg-gray3 hover:duration-300 hover:ease-out"
      title={title}
    >
      <div className="absolute bottom-4 left-3 text-left">
        {capitalizeFirstLetter(text1)}
      </div>
    </Link>
  );
}
