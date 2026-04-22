import { useState } from "react";
import "../../styles/main.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { addToast, Button, useDisclosure } from "@heroui/react";

import { useRecoilRootReset } from "../../providers/RecoilRootWithReset";

import { LogoutModal } from "./modal/LogoutModal";

import { logout } from "@/recoil/atoms/auth.ts";
import BaseModal from "@/organisms/BaseModal.tsx";

interface AccountInfoProps {
  isSideMenuExpanded?: boolean;
}

const AccountInfo = ({ isSideMenuExpanded }: AccountInfoProps) => {
  // var
  const navigate = useNavigate();
  const resetRecoilRoot = useRecoilRootReset();

  // loading
  const [loading, setLoading] = useState(false);
  // modal
  const [modal, setModal] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // fn
  const handleLogout = async () => {
    try {
      setLoading(true);
      const result = await logout();

      setLoading(false);
      if (result?.header?.rtnCode === "000000") {
        onClose();
        sessionStorage.removeItem("recoil-persist");
        sessionStorage.removeItem("expiredDismissed");
        resetRecoilRoot(); // 메모리 전부 공장초기화
        navigate("/");
      } else {
        setLoading(false);
        onClose();
        addToast({
          title: `Error Code: ${result.header.rtnCode}`,
          description: result.header.rtnMessage,
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }
    } catch (err: any) {
      setLoading(false);
      onClose();
      addToast({
        title: `Error`,
        description: err,
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  // modal open
  const openLogoutModal = () => {
    setModal("logout");
    onOpen();
  };

  // modal config
  const logoutModalConfig = LogoutModal({
    success: handleLogout,
    loading: loading,
  });

  return (
    <div className="account-button-container">
      <Button className="account-button" color="default" variant="light">
        <FontAwesomeIcon icon={faCircleUser} />
        {isSideMenuExpanded && <span>계정 정보</span>}
      </Button>
      <Button
        className="account-button"
        color="danger"
        variant="light"
        onPress={openLogoutModal}
      >
        <FontAwesomeIcon icon={faPowerOff} />
        {isSideMenuExpanded && <span>로그아웃</span>}
      </Button>
      {modal && (
        <BaseModal
          key={modal}
          config={logoutModalConfig}
          isOpen={isOpen}
          onOpenChange={(open) => {
            onOpenChange();
            if (!open) setModal(null);
          }}
        />
      )}
    </div>
  );
};

export default AccountInfo;
