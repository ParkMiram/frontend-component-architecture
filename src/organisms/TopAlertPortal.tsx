import { useEffect } from "react";
import { Alert } from "@heroui/react";
import { createPortal } from "react-dom";

import { TopAlertType } from "@/types/type/AlertType.ts";

const TopAlertPortal = ({
  open,
  color = "default",
  title,
  onClose,
  duration = 3000,
}: TopAlertType) => {
  useEffect(() => {
    if (!open || duration === null) return;
    const id = window.setTimeout(onClose, duration);

    return () => window.clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="
        fixed left-1/2 top-4 -translate-x-1/2
        z-[99999]
        w-[min(720px,calc(100%-32px))]
        pointer-events-none
      "
    >
      <div
        className={`
          pointer-events-auto
          ${open ? "animate-slide-down" : "animate-slide-up"}
        `}
      >
        <Alert
          isClosable
          isVisible
          color={color}
          title={title}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body,
  );
};

export default TopAlertPortal;
