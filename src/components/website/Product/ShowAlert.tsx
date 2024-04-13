"use client";

import AlertMessage from "@/components/AlertMessage";
import { useAlertStore } from "@/zustand/website/alertStore";
import { useEffect } from "react";

export default function ShowAlert() {
  const { hideAlert } = useAlertStore();

  const { message, isVisible } = useAlertStore((state) => ({
    message: state.alertMessage,
    isVisible: state.isVisible,
  }));

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <AlertMessage message={message} hideAlertMessage={hideAlert} />
      )}
    </>
  );
}
