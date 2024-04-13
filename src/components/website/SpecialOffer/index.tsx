import Image from "next/image";
import styles from "./styles.module.css";
import { SpecialOfferButton } from "../SpecialOfferOverlay";

export default function SpecialOffer() {
  return (
    <div className="bg-white">
      <div
        className={`${styles.rotatingBorder} w-full pt-4 pb-5 p-6 flex flex-col gap-5`}
      >
        <div className="text-center flex flex-col gap-1 items-center">
          <div className="w-[340px]">
            <p className="text-red text-2xl font-extrabold italic [text-shadow:#707070_0px_1px_0px] leading-[26px] [word-spacing:2px] [letter-spacing:-1px]">
              UPGRADE MY ORDER
            </p>
            <p className="text-red text-2xl font-extrabold italic [text-shadow:#707070_0px_1px_0px] leading-[26px] [word-spacing:2px] [letter-spacing:-1px]">
              WITH THIS BEST-SELLING
            </p>
            <p className="text-red text-2xl font-extrabold italic [text-shadow:#707070_0px_1px_0px] leading-[26px] [word-spacing:2px] [letter-spacing:-1px]">
              COMBO SET
            </p>
          </div>
          <div>
            <span className="font-medium">$410 value, </span>
            <span className="text-green font-semibold">
              today it's yours for $37
            </span>
          </div>
        </div>
        <div className="w-[280px] h-[373px] flex items-center justify-center overflow-hidden rounded-xl bg-white">
          <Image
            src="https://i.pinimg.com/564x/1a/f4/3d/1af43d081da6c708bd4b5667b8e825fc.jpg"
            alt=""
            width={280}
            height={373}
            priority
          />
        </div>
        <SpecialOfferButton />
      </div>
    </div>
  );
}
