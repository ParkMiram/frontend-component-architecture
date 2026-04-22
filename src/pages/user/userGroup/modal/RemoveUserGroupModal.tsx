import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { ModalConfig } from "../../../../types/interface/ModalInterface";
import { ModalPropsType } from "../../../../types/type/ModalType";
import {
  fetchRemoveUserGroup,
  removeUserGroupAtom,
} from "../../../../recoil/atoms/userGroup";
import { InputField } from "../../../../atoms/InputField";
import {
  useErrorModal,
  useNotifyModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";
import { persistAtomWithStorage } from "../../../../utils/recoilPersistEffect";

const RemoveUserGroupForm: React.FC<ModalPropsType> = ({
  onSuccess,
  handleModal,
  row,
}) => {
  // recoil
  const { error } = useRecoilValue(removeUserGroupAtom);
  const regUserId = persistAtomWithStorage?.authAtom.userInfo.userId;

  // var
  const { openError } = useErrorModal();
  const { openNotify } = useNotifyModal();
  const { openSuccess } = useSuccessModal();

  // value
  const [password, setPassword] = useState<string>("");

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (password !== "") {
      try {
        const result = await fetchRemoveUserGroup({
          groupSeq: row.groupSeq,
          groupId: row.groupId,
          regUserId: regUserId,
          password: password,
        });

        if (result.header.rtnCode === "000000") {
          openSuccess({
            message: "삭제되었습니다.",
            url: "사용자 그룹 삭제",
          });
          onSuccess?.();
        } else {
          openError({
            code: result.header.rtnCode,
            message: result.header.rtnMessage,
            url: "사용자 그룹 삭제",
          });
        }
      } catch (err: any) {
        openError({
          message: err,
          url: "사용자 그룹 삭제",
        });
      }
    } else {
      openNotify({
        url: "사용자 삭제",
        message: "비밀번호를 입력해 주세요.",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="remove-user-group-form"
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
            사용자가 속한 그룹을 삭제하시겠습니까?
          </p>
          <InputField
            name="password"
            placeholder="삭제하려면 계정 비밀번호를 입력해 주세요."
            setValue={setPassword}
            type="password"
            value={password}
          />
        </li>
      </ul>
    </form>
  );
};

export const RemoveUserGroupModal = (
  onSuccess: () => void,
  setIsRemoveModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  row: any,
): ModalConfig => ({
  title: "사용자 그룹 삭제",
  content: (
    <RemoveUserGroupForm
      handleModal={setIsRemoveModalOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "삭제",
  formId: "remove-user-group-form",
});
