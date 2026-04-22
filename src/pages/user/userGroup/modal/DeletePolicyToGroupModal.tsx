import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { ModalConfig } from "../../../../types/interface/ModalInterface";
import { ModalPropsType } from "../../../../types/type/ModalType";
import {
  fetchUserGroupPolicyDelete,
  userGroupPolicyDeleteAtom,
} from "../../../../recoil/atoms/userGroup";
import {
  useErrorModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";
import { persistAtomWithStorage } from "../../../../utils/recoilPersistEffect";

const DeleteUserToGroupForm: React.FC<ModalPropsType> = ({
  onSuccess,
  row,
  handleModal,
}) => {
  // recoil
  const { error } = useRecoilValue(userGroupPolicyDeleteAtom);

  // var
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();
  const regUserId = persistAtomWithStorage?.authAtom.userInfo.userId;

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const items = [
      {
        id: row.id,
        policyLink: null,
        linkType: "GROUP_LINK",
      },
    ];

    try {
      const result = await fetchUserGroupPolicyDelete({
        groupSeq: row.groupSeq,
        items: items,
        regUserId: regUserId,
        totCnt: 1,
      });

      if (result.header.rtnCode === "000000") {
        openSuccess({
          message: "삭제되었습니다.",
          url: "그룹에 할당된 권한 삭제",
        });
        onSuccess?.();
      } else {
        openError({
          code: result.header.rtnCode,
          message: result.header.rtnMessage,
          url: "그룹에 할당된 권한 삭제",
        });
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "그룹에 할당된 권한 삭제",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="delete-policy-group-form"
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
            그룹에 할당된 권한을 삭제하시겠습니까?
          </p>
        </li>
      </ul>
    </form>
  );
};

export const DeletePolicyToGroupModal = (
  onSuccess: () => void,
  row: any,
  setIsDeletePolicyModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "그룹에 할당된 권한 삭제",
  content: (
    <DeleteUserToGroupForm
      handleModal={setIsDeletePolicyModalOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "삭제",
  formId: "delete-policy-group-form",
});
