import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@heroui/react";

import { authAtom } from "../recoil/atoms/auth";
import { authErrorState } from "../recoil/atoms/sessionState";
import { useExpiredModal } from "../hooks/useCustomModal";

// 두자릿수
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

interface expandedProps {
  isSideMenuExpanded?: boolean;
}

const Countdown = ({ isSideMenuExpanded }: expandedProps) => {
  // recoil
  const auth = useRecoilValue(authAtom);
  const setAuthError = useSetRecoilState(authErrorState);

  // var
  const { openExpired, closeExpired } = useExpiredModal();
  const navigate = useNavigate();

  // count
  const expiredCount = Math.max(0, Number(auth?.token?.expiredCount ?? 0));
  const timeOver = Math.max(0, auth?.timeOver ?? 0);
  const [remaining, setRemaining] = useState(expiredCount * 1000);

  // modal
  const [isOpen, setIsOpen] = useState(false);

  // time
  const { hours, minutes, seconds } = useMemo(() => {
    const total = Math.max(0, remaining);
    const h = Math.floor(total / 3600000);
    const m = Math.floor((total % 3600000) / 60000);
    const s = Math.floor((total % 60000) / 1000);

    return { hours: h, minutes: m, seconds: s };
  }, [remaining]);

  // fn
  // 시간 연장
  const handleExtension = () => {
    openExpired({
      expiredDismissed: false,
    });
  };

  // useEffect
  useEffect(() => {
    const tick = () => {
      const rem = (timeOver ?? 0) - Date.now() + 1000;

      if (rem <= 0) {
        setRemaining(0);
        setAuthError(true);

        return;
      }
      setRemaining(rem);

      if (rem <= 150000) {
        if (rem >= 120000) {
          if (!sessionStorage.getItem("expiredDismissed")) {
            setIsOpen(true);
            const mins = Math.floor((rem % 3600000) / 60000);
            const secs = Math.floor((rem % 60000) / 1000);

            openExpired({
              time: `${pad2(mins)} : ${pad2(secs)}`,
              expiredDismissed: true,
            });
          }
        } else {
          if (isOpen) {
            closeExpired();
            setIsOpen(false);
          }
        }
      }
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [
    auth.timeOver,
    setAuthError,
    openExpired,
    closeExpired,
    timeOver,
    isOpen,
    navigate,
  ]);

  return (
    <div className="remaining-time">
      <p>
        {pad2(hours)}
        <span>{isSideMenuExpanded ? ":" : ""}</span>
        {pad2(minutes)}
        <span>{isSideMenuExpanded ? ":" : ""}</span>
        {pad2(seconds)}
      </p>
      <Button className="extension" onPress={handleExtension}>
        {isSideMenuExpanded ? (
          "시간 연장"
        ) : (
          <FontAwesomeIcon icon={faClockRotateLeft} />
        )}
      </Button>
    </div>
  );
};

export default Countdown;
