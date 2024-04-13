"use client";

import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { useState, useEffect, FormEvent } from "react";
import { MdOutlineEdit } from "react-icons/md";
import Spinner from "@/elements/Spinners/white";
import clsx from "clsx";
import { HiArrowLeft } from "react-icons/hi2";
import AlertMessage from "@/components/AlertMessage";
import { formatDate } from "@/libraries/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UpdateCollectionAction } from "@/actions/collections";

export function CampaignDurationButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editCollection.name,
    overlayName: state.pages.editCollection.overlays.campaignDuration.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 mt-2 grid place-items-center rounded-full ease-in-out hover:bg-gray2 hover:duration-300 hover:ease-out"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

export default function CampaignDurationOverlay({
  collectionId,
  campaignDuration,
}: {
  collectionId: string;
  campaignDuration: { start_date: string; end_date: string };
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(campaignDuration.start_date)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(campaignDuration.end_date)
  );

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editCollection.name,
      overlayName: state.pages.editCollection.overlays.campaignDuration.name,
      isOverlayVisible:
        state.pages.editCollection.overlays.campaignDuration.isVisible,
    })
  );

  useEffect(() => {
    if (isOverlayVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOverlayVisible]);

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const isValidDateRange =
    startDate &&
    endDate &&
    startDate.toISOString().split("T")[0] < endDate.toISOString().split("T")[0];

  const saveChanges = async (event: FormEvent) => {
    event.preventDefault();

    if (!isValidDateRange) {
      setAlertMessage("Start date must be before end date");
      setShowAlert(true);
    } else {
      setLoading(true);

      const campaignDuration = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };

      try {
        const result = await UpdateCollectionAction({
          collectionId,
          campaignDuration,
        });
        setAlertMessage(result.status.message);
        setShowAlert(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    isOverlayVisible && (
      <>
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-blur-sm z-20">
          <div className="w-[500px] bg-white mx-auto mt-20 shadow rounded-14px">
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Change campaign duration
                </span>
              </button>
              <button
                onClick={saveChanges}
                className={`min-w-[72px] h-9 px-3 rounded-full bg-blue ease-in-out hover:duration-300 hover:ease-out ${clsx(
                  {
                    "hover:bg-blue2": !loading,
                    "bg-opacity-40": loading,
                    "hover:bg-blue": loading,
                    "hover:bg-opacity-40": loading,
                  }
                )}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex gap-1 items-center justify-center w-full h-full">
                    <Spinner />
                    <p className="text-white">Saving</p>
                  </div>
                ) : (
                  <p className="text-white">Save</p>
                )}
              </button>
            </div>
            <div className="pt-12 pb-10 px-4 flex flex-col gap-[18px]">
              <div>
                <div className="flex gap-[2px]">
                  <span className="font-semibold text-sm">
                    Campaign duration
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3 mt-4">
                  <div
                    className={`w-full flex gap-3 items-center border rounded-md overflow-hidden px-3 ${clsx(
                      {
                        "border-red": !isValidDateRange,
                      }
                    )}`}
                  >
                    <span className="flex font-semibold text-sm text-gray mt-[2px]">
                      Start
                    </span>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="w-[410px] h-9 outline-none"
                      required
                    />
                  </div>
                  <div
                    className={`w-full flex gap-3 items-center border rounded-md overflow-hidden px-3 ${clsx(
                      {
                        "border-red": !isValidDateRange,
                      }
                    )}`}
                  >
                    <span className="flex font-semibold text-sm text-gray mt-[2px]">
                      End
                    </span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      className="w-[418px] h-9 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
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
