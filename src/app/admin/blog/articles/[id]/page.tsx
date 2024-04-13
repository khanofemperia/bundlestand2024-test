import { capitalizeFirstLetter } from "@/libraries/utils";
import BasicDetailsOverlay, {
  EditBasicDetailsButton,
} from "@/components/admin/blog/edit-article/BasicDetailsOverlay";
import PosterOverlay, {
  EditPosterButton,
} from "@/components/admin/blog/edit-article/PosterOverlay";
import ImagesOverlay, {
  EditImagesButton,
} from "@/components/admin/blog/edit-article/ImagesOverlay";
import SettingsOverlay, {
  EditSettingsButton,
} from "@/components/admin/blog/edit-article/SettingsOverlay";
import {
  WriteArticle,
  WriteArticleButton,
} from "@/components/admin/blog/edit-article/WriteArticle";
import Link from "next/link";
import DropdownMenu from "@/components/admin/DropdownMenu";
import config from "@/libraries/config";
import { HiMiniChevronRight } from "react-icons/hi2";

async function getData(id: string) {
  const response = await fetch(`${config.BASE_URL}api/admin/articles/${id}`, {
    cache: "no-cache",
  });

  return response.json();
}

export default async function EditArticle({
  params,
}: {
  params: { id: string };
}) {
  const data = await getData(params.id);

  const articleData = data.article as ArticleProps | undefined;
  if (!articleData) {
    console.log("Article data not available");
    // Handle the absence of article data here if needed
    return <div>Article data not available</div>; // Return or handle the absence of data
  }

  const {
    title,
    meta_description,
    content,
    slug,
    id,
    poster,
    images,
    status,
    visibility,
  } = articleData;

  return (
    <>
      <header className="flex flex-col gap-[14px]">
        <div className="mb-1 cursor-context-menu rounded-md px-2 h-6 w-max flex items-center gap-1 bg-gray2">
          <span className="text-sm font-semibold text-gray">Products</span>
          <HiMiniChevronRight className="fill-text-gray" size={14} />
          <span className="text-black font-semibold text-sm">
            Edit (#26341)
          </span>
        </div>
        <DropdownMenu>
          <WriteArticleButton />
          <Link
            href={`/${params.id}/${slug}`}
            className="w-max text-blue text-sm font-semibold cursor-pointer hover:underline"
          >
            See this article on the public website
          </Link>
        </DropdownMenu>
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
        <div>
          <div className="mt-9">
            <h2 className="heading-size-h2">Basic details</h2>
            <p className="max-w-xl text-sm">
              Important for SEO: a title that includes target keywords in the
              first four words, a short URL with three or four keywords, and a
              description that matches what people are looking for.
            </p>
            <div className="mt-5 w-[40rem] pb-5 px-5 rounded-lg shadow bg-white relative">
              <div className="flex justify-between items-start absolute right-2">
                <EditBasicDetailsButton />
              </div>
              <div className="pt-[1.125rem] h-full w-full">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3 max-w-md">Title</h3>
                  </div>
                  <div className="mt-2 flex">
                    {title ? (
                      <p className="w-max bg-gray2 rounded-lg px-2 min-h-[27px] pb-[2px]">
                        {title}
                      </p>
                    ) : (
                      <p className="italic text-ghost-gray">None</p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3 max-w-md">Slug</h3>
                  </div>
                  <div className="mt-2 flex">
                    {slug ? (
                      <p className="w-max bg-gray2 rounded-lg px-2 min-h-[27px] pb-[2px]">
                        /{slug}
                      </p>
                    ) : (
                      <p className="italic text-ghost-gray">None</p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3 max-w-md">
                      Meta description
                    </h3>
                  </div>
                  <div className="mt-2 flex">
                    {meta_description ? (
                      <p className="w-max bg-gray2 rounded-lg px-2 min-h-[27px] pb-[2px]">
                        {meta_description}
                      </p>
                    ) : (
                      <p className="italic text-ghost-gray">None</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-9">
            <h2 className="heading-size-h2">Poster</h2>
            <p className="max-w-xl text-sm">
              This is a visual magnet. It pulls in people with its power to
              captivate and make them feel things. Create a poster that not only
              catches the eye but holds it - and stirs people's imagination.
            </p>
            <div className="mt-5 w-[25rem] pb-5 pl-5 pr-2 rounded-lg shadow bg-white">
              <div className="flex justify-between items-start">
                <h3 className="heading-size-h3 max-w-md mt-[1.125rem]">
                  Image
                </h3>
                <EditPosterButton />
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {!poster ? (
                  <p className="italic text-ghost-gray">None</p>
                ) : (
                  <div className="w-[222px] h-[296px] flex items-center justify-center rounded-lg relative overflow-hidden bg-gray2">
                    <img src={poster} alt={title} width={222} height={296} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-9">
            <h2 className="heading-size-h2">Images</h2>
            <p className="max-w-xl text-sm">
              Visuals that summarize your article. They give a quick preview of
              the main points in your article.
            </p>
            <div className="mt-5 w-[40rem] pb-5 pl-5 pr-2 rounded-lg shadow bg-white">
              <div className="flex justify-between items-start">
                <h3 className="heading-size-h3 max-w-md mt-[1.125rem]">
                  Gallery
                </h3>
                <EditImagesButton />
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {!images.length ? (
                  <p className="italic text-ghost-gray">None</p>
                ) : (
                  images.map((image, index) => (
                    <div
                      key={index}
                      className="w-[7.5rem] h-[10rem] flex items-center justify-center rounded-lg relative overflow-hidden bg-gray2"
                    >
                      {image && (
                        <img src={image} alt={title} width={120} height={160} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mt-9">
            <h2 className="heading-size-h2">Settings</h2>
            <p className="max-w-xl text-sm">
              Choose whether your product is a work-in-progress (draft) or ready
              to be seen (published), and decide if you want shoppers to see it
              (visible) or keep it private (hidden).
            </p>
            <div className="mt-5 w-[25rem] pb-5 px-5 rounded-lg shadow bg-white relative">
              <div className="flex justify-between items-start absolute right-2">
                <EditSettingsButton />
              </div>
              <div className="pt-[1.125rem] h-full w-max">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3 max-w-md">Status</h3>
                  </div>
                  <div className="mt-2">
                    <p
                      className={`${
                        status.toLowerCase() === "published"
                          ? "bg-green"
                          : "bg-brown"
                      } text-white rounded-full h-[27px] pb-[1px] pr-2 pl-2 flex items-center justify-center select-none w-max max-w-lg`}
                    >
                      {capitalizeFirstLetter(status)}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-start">
                    <h3 className="heading-size-h3 max-w-md">Visibility</h3>
                  </div>
                  <div className="mt-2">
                    <p
                      className={`${
                        visibility.toLowerCase() === "visible"
                          ? "bg-gold"
                          : "bg-gray4"
                      } text-white rounded-full h-[27px] pb-[1px] pr-2 pl-2 flex items-center justify-center select-none w-max max-w-lg`}
                    >
                      {capitalizeFirstLetter(visibility)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BasicDetailsOverlay
        articleId={params.id}
        data={{ title, slug, meta_description }}
      />
      <PosterOverlay
        articleId={params.id}
        articlePoster={poster}
        articleTitle={title}
      />
      <ImagesOverlay
        articleId={id}
        articleImages={images}
        articleTitle={title}
      />
      <SettingsOverlay articleId={id} settings={{ status, visibility }} />
      <WriteArticle articleId={id} content={content} />
    </>
  );
}
