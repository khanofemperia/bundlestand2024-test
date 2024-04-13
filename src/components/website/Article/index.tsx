import { FaFacebook, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { HiLink } from "react-icons/hi";
import styles from "./article.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Article({ data }: { data: ArticleProps }) {
  const { title, meta_description, poster, content } = data;

  return (
    <>
      <div className="w-[920px] mx-auto pl-[100px]">
        <div className="w-[820px] mt-[90px] mb-20">
          <div className="flex gap-5 w-full">
            <div className="relative min-w-[420px] w-[420px] h-[574px] shadow-custom3 bg-gray2 rounded-2xl overflow-hidden">
              <div className="w-full h-[560px] overflow-hidden">
                <Image
                  src={poster}
                  alt={title}
                  width={420}
                  height={560}
                  priority
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 h-[60px] border-t border-[#202020] bg-[rgba(235,235,235,0.4)] backdrop-blur-md"></div>
            </div>
            <div>
              <form className="flex flex-col gap-2 w-48 -mt-[2px]">
                <label
                  htmlFor="subscription"
                  className="text-[15px] font-bold leading-5 pb-[6px]"
                >
                  Get the week's best marketing content
                </label>
                <input
                  type="text"
                  name="subscription"
                  className="w-full h-12 px-3 pb-[2px] border rounded"
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="submit"
                  className="w-full h-12 font-bold pb-[2px] text-blue bg-blue bg-opacity-10 rounded"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <article className="mt-8 w-[620px]">
            <h1 className="mb-2 max-w-full font-bold text-[1.8em] leading-[44px]">
              {title}
            </h1>
            <div className="mb-8 text-xl">{meta_description}</div>
            <div className="flex gap-1 mb-[50px]">
              <Link
                href="/"
                className="h-7 w-7 rounded-full flex items-center justify-center"
              >
                <FaFacebook
                  size={22}
                  className="fill-[#888] ease-in-out hover:duration-300 hover:ease-out hover:fill-[#222]"
                />
              </Link>
              <Link
                href="/"
                className="h-7 w-7 rounded-full flex items-center justify-center"
              >
                <FaXTwitter
                  size={20}
                  className="fill-[#888] ease-in-out hover:duration-300 hover:ease-out hover:fill-[#222]"
                />
              </Link>
              <Link
                href="/"
                className="h-7 w-7 rounded-full flex items-center justify-center"
              >
                <FaRegEnvelope
                  size={22}
                  className="fill-[#888] ease-in-out hover:duration-300 hover:ease-out hover:fill-[#222]"
                />
              </Link>
              <Link
                href="/"
                className="h-7 w-7 rounded-full flex items-center justify-center"
              >
                <HiLink
                  size={22}
                  className="fill-[#888] ease-in-out hover:duration-300 hover:ease-out hover:fill-[#222]"
                />
              </Link>
            </div>
            <div
              id="article-content"
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
        <div className="w-[820px] mb-40">
          <div className="text-2xl font-bold mb-8">Latest</div>
          <div className="w-full columns-3 flex-wrap">
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                The Hollywood Strikes Stopped AI From Taking Your Job. But for
                How Long?
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                The 16 Best Books of 2023
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                How to Use OpenAI's ChatGPT to Create Your Own Custom GPT
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                Microsoft's AI Chatbot Replies to Election Questions With
                Conspiracies, Fake Scandals, and Lies
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                Women Buy More Cars, So Why Are the Designs So Macho?
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                The 121 Best After-Christmas Sales Happening at Amazon —
                Starting at $7
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                100+ After-Christmas Sales You Need to See Today, Sourced by Our
                Shopping Experts
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
            <div className="w-[262px] mb-6 break-inside-avoid">
              <div className="mb-3 font-semibold">
                Mary Lou Retton Celebrates First Christmas Since Health Scare
                with Photo of Her Four Daughters
              </div>
              <div className="w-full h-[349px] bg-gray2 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg"
                  alt=""
                  width={262}
                  height={349}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
