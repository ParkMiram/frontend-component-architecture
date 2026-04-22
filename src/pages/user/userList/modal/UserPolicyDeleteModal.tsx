import React from "react";

import { ModalConfig } from "@/types/interface/ModalInterface.ts";
import { ModalPropsType } from "@/types/type/ModalType.ts";
import { fetchUserPolicyDelete } from "@/recoil/atoms/user.ts";
import { useErrorModal, useSuccessModal } from "@/hooks/useCustomModal.ts";

const UserPolicyDeleteForm: React.FC<ModalPropsType> = ({
  onSuccess,
  userId,
  row,
}) => {
  // var
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const result = await fetchUserPolicyDelete({
        userId: userId,
        items: [
          {
            id: row.id,
            linkType: row.linkType,
            policyLink: row.policyLink,
          },
        ],
      });

      if (result.header.rtnCode === "000000") {
        openSuccess({
          message: "삭제되었습니다.",
          url: "사용자에 할당된 권한 삭제",
        });
        onSuccess?.();
      } else {
        openError({
          code: result.header.rtnCode,
          message: result.header.rtnMessage,
          url: "사용자에 할당된 권한 삭제",
        });
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "사용자에 할당된 권한 삭제",
      });
    }
  };

  return (
    <form
      id="user-policy-delete-form"
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
            사용자에 할당된 <span className="id">{row.description}</span>을
            삭제하시겠습니까?
          </p>
        </li>
      </ul>
    </form>
  );
};

export const UserPolicyDeleteModal = (
  onSuccess: () => void,
  userId: string,
  row: any,
  setIsPolicyAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "권한 삭제",
  content: (
    <UserPolicyDeleteForm
      handleModal={setIsPolicyAddModalOpen}
      row={row}
      userId={userId}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "삭제",
  formId: "user-policy-delete-form",
});
