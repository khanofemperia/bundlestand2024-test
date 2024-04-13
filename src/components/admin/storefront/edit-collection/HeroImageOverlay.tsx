"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useEffect, FormEvent } from "react";
import AlertMessage from "@/components/AlertMessage";
import { UpdateCollectionAction } from "@/actions/collections";
import Spinner from "@/elements/Spinners/white";
import { HiArrowLeft } from "react-icons/hi2";
import Image from "next/image";
import { CiImageOn } from "react-icons/ci";

export function EditHeroImageButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.heroImage.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 mt-2 grid place-items-center rounded-full ease-in-out hover:bg-gray2 hover:ease-out"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export default function HeroImageOverlay({
  collectionId,
  data,
}: {
  collectionId: string;
  data: { title: string; heroImage: string | undefined };
}) {
  const HIDDEN = "HIDDEN";
  const VISIBLE = "VISIBLE";

  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [image, setImage] = useState(data.heroImage);

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editCollection.name,
      overlayName: state.pages.editCollection.overlays.heroImage.name,
      isOverlayVisible: state.pages.editCollection.overlays.heroImage.isVisible,
    })
  );

  useEffect(() => {
    if (isOverlayVisible) {
      document.body.style.overflow = HIDDEN;
    } else {
      document.body.style.overflow = VISIBLE;
    }

    return () => {
      document.body.style.overflow = VISIBLE;
    };
  }, [isOverlayVisible]);

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await UpdateCollectionAction({
        collectionId,
        image,
      });
      setAlertMessage(result.status.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating hero image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOverlayVisible && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-black z-20 bg-opacity-40 backdrop-blur-sm">
          <div className="w-[800px] bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
                <button
                  onClick={() => hideOverlay({ pageName, overlayName })}
                  className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
                >
                  <HiArrowLeft size={20} className="fill-blue" />
                  <span className="heading-size-h3 text-blue">
                    Change page hero
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue min-w-[72px] h-9 px-3 rounded-full flex items-center justify-center ease-in-out hover:bg-blue2 hover:ease-out"
                >
                  {loading ? (
                    <div className="flex gap-1 items-center justify-center w-full h-full">
                      <Spinner />
                      <span className="text-white">Saving</span>
                    </div>
                  ) : (
                    <span className="text-white">Save</span>
                  )}
                </button>
              </div>
              <div className="pt-12 pb-10 px-4 flex flex-col gap-4">
                <div>
                  <label className="flex gap-[2px]" htmlFor="image">
                    <span className="font-semibold text-sm">Image</span>
                  </label>
                  <div className="w-full h-[230px] flex items-center justify-center overflow-hidden border rounded-t-[7px] mt-4">
                    {!image ? (
                      <CiImageOn className="fill-[#e4e4e4]" size={150} />
                    ) : (
                      <Image
                        src={image}
                        alt={data.title}
                        width={766}
                        height={228}
                        priority={true}
                      />
                    )}
                  </div>
                  <input
                    className="w-full h-9 border border-t-0 rounded-b-md outline-none text-sm font-semibold px-3"
                    type="text"
                    name="image"
                    placeholder="Image url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        {showAlert && (
          <AlertMessage
            message={alertMessage}
            hideAlertMessage={hideAlertMessage}
          />
        )}
      </>
    )
  );
}
