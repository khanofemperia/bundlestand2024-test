import {
  ArticleImageSlideshow,
  ClickableImageMask,
} from "@/components/website/ArticleImageSlideshow";
import Image from "next/image";
import Link from "next/link";

// async function getArticles(): Promise<ArticleProps[]> {
//   const response = await fetch(`${config.BASE_URL}api/articles`, {
//     cache: "no-store",
//   });

//   const responseData = await response.json();

//   if (!Array.isArray(responseData)) {
//     throw new Error("Invalid response format");
//   }

//   return responseData as ArticleProps[];
// }

export default async function Home() {
  const articles = [
    {
      content: null,
      slug: "silver-carpet-premiere-beyonce-renaissance-film",
      poster:
        "https://i.pinimg.com/564x/17/a0/0a/17a00a69083e29cecb9a126a06778ff1.jpg",
      id: "51746",
      meta_description:
        'It was a star-studded night on the red — or, silver — carpet on Saturday night for the world premiere of "Renaissance: A Film By Beyoncé."',
      images: [
        "https://i.pinimg.com/564x/b2/a7/bd/b2a7bd79160d07e0b83c1d41aa2410f9.jpg",
        "https://i.pinimg.com/564x/43/bb/6a/43bb6aadecc10fd2394f07f7194ee3d4.jpg",
        "https://i.pinimg.com/564x/8c/c3/da/8cc3dabd879fcc57bf4cd10781f040b4.jpg",
        "https://i.pinimg.com/564x/a7/7b/cf/a77bcf09e65855d08f1172020ae969ac.jpg",
        "https://i.pinimg.com/564x/05/de/66/05de66467a23279e4e1f1883d8d764d3.jpg",
        "https://i.pinimg.com/564x/86/a9/dd/86a9dde7a62e849932abf4b350c25956.jpg",
        "https://i.pinimg.com/564x/a2/fc/78/a2fc7876c35e0020e26cc0a550c6cf96.jpg",
      ],
      title:
        "On the Silver Carpet for the Premiere of Beyoncé's 'Renaissance' Film",
      date_created: "2023-12-19 08:01:47",
      status: "Published",
      visibility: "Visible",
      last_updated: "2023-12-21 15:41:29",
      index: 1,
    },
    {
      content: null,
      slug: "demo-2",
      title: "Demo 2",
      status: "Published",
      id: "67922",
      last_updated: "2023-12-21 10:11:03",
      images: [],
      date_created: "2023-12-19 08:02:14",
      visibility: "Visible",
      meta_description: null,
      poster:
        "https://i.pinimg.com/564x/b2/a7/bd/b2a7bd79160d07e0b83c1d41aa2410f9.jpg",
      index: 2,
    },
  ];

  return (
    <>
      <div className="mt-[90px] mb-40 w-[850px] mx-auto">
        {articles.map(
          ({ id, title, poster, meta_description, slug }, index) => {
            let classNames = "w-full border-b pb-5 px-5 flex gap-5";
            if (index !== 0) {
              classNames += " pt-10";
            }

            return (
              <div key={index} className={classNames}>
                <div className="w-[420px] h-[560px] rounded-14px overflow-hidden relative">
                  <Image
                    src={poster}
                    alt={title}
                    width={420}
                    height={560}
                    priority
                  />
                  <ClickableImageMask id={"76587"} />
                </div>
                <div className="w-72 h-full">
                  <div>
                    <Link
                      href={`/${slug}-${id}`}
                      className="font-semibold text-xl hover:underline"
                    >
                      {title}
                    </Link>
                    <p className="mt-2 text-gray text-sm">{meta_description}</p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
      <ArticleImageSlideshow />
    </>
  );
}
