import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { ModalConfig } from "../../../../types/interface/ModalInterface";
import { ModalPropsType } from "../../../../types/type/ModalType";
import {
  fetchUserStatusChange,
  userStatusChangeAtom,
} from "../../../../recoil/atoms/user";
import {
  useErrorModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";
import { UserStatusBadge } from "../../../../atoms/Badge";

const UserChangeStatusForm: React.FC<ModalPropsType> = ({
  onSuccess,
  row,
  handleModal,
}) => {
  // recoil
  const { error } = useRecoilValue(userStatusChangeAtom);

  // var
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();

  const item = { status: row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" };

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const result = await fetchUserStatusChange({
        userId: row.userId,
        targetStatus: row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      });

      if (result.header.rtnCode === "000000") {
        openSuccess({
          message: "변경되었습니다.",
          url: "사용자 상태 변경",
        });
        onSuccess?.();
      } else {
        openError({
          code: result.header.rtnCode,
          message: result.header.rtnMessage,
          url: "사용자 상태 변경",
        });
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "사용자 상태 변경",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="user-status-form"
      onKeyDown={(e) => {
        if ((e as any).isComposing) return;
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onSubmit={handleSubmit}
    >
      <ul className="modal-form">
        <li>
          <p className="confirm-question">
            {row.userId}의 상태를
            <UserStatusBadge status={item.status} />
            {/*<span className="highlight">{row.status === "ACTIVE" ? "비활성화" : "활성화"}</span>*/}
            하시겠습니까?
          </p>
        </li>
      </ul>
    </form>
  );
};

export const UserChangeStatusModal = (
  onSuccess: () => void,
  row: any,
  setIsChangeStatusModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "사용자 상태 변경",
  content: (
    <UserChangeStatusForm
      handleModal={setIsChangeStatusModalOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "변경",
  formId: "user-status-form",
});
