import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { ModalConfig } from "../../../../types/interface/ModalInterface";
import { ModalPropsType } from "../../../../types/type/ModalType";
import {
  fetchUserPasswordReset,
  userPasswordResetAtom,
} from "../../../../recoil/atoms/user";
import {
  useErrorModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";

const UserPasswordResetForm: React.FC<ModalPropsType> = ({
  onSuccess,
  row,
  handleModal,
}) => {
  // recoil
  const { error } = useRecoilValue(userPasswordResetAtom);

  // var
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const result = await fetchUserPasswordReset({
        userId: row.userId,
      });

      if (result.header.rtnCode === "000000") {
        openSuccess({
          message: "초기화되었습니다.",
          url: "사용자 비밀번호 초기화",
        });
        onSuccess?.();
      } else {
        openError({
          code: result.header.rtnCode,
          message: result.header.rtnMessage,
          url: "사용자 비밀번호 초기화",
        });
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "사용자 비밀번호 초기화",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="user-reset-form"
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
            {row.userId}의 비밀번호를 초기화하시겠습니까?
          </p>
        </li>
      </ul>
    </form>
  );
};

export const UserPasswordResetModal = (
  onSuccess: () => void,
  row: any,
  setIsChangePasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "사용자 비밀번호 초기화",
  content: (
    <UserPasswordResetForm
      handleModal={setIsChangePasswordModalOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "초기화",
  formId: "user-reset-form",
});
