import React, { useState } from "react";
import { addToast, Input } from "@heroui/react";

import { useErrorModal } from "@/hooks/useCustomModal.ts";
import { fetchRemoveUser } from "@/recoil/atoms/user.ts";
import { persistAtomWithStorage } from "@/utils/recoilPersistEffect.ts";

const UserRemoveForm = ({
  row,
  success,
}: {
  row: any;
  success: () => void;
}) => {
  // var
  const { openError } = useErrorModal();
  const currentUserId = persistAtomWithStorage?.authAtom.userInfo.userId;

  // value
  const [password, setPassword] = useState<string>("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (password !== "") {
      try {
        const result = await fetchRemoveUser({
          regUserId: currentUserId,
          userId: row.userId.props.id,
          userName: row.name,
          level: row.level,
          updateDate: row.updateDate,
          password: password,
        });

        if (result.header.rtnCode === "000000") {
          success();
          addToast({
            title: "삭제되었습니다.",
            color: "success",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
          });
        } else {
          addToast({
            title: `Error Code: ${result.header.rtnCode}`,
            description: result.header.rtnMessage,
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
          });
        }
      } catch (err: any) {
        console.log(err);
        openError({
          message: err,
        });
      }
    }
  };

  return (
    <form id="user-remove-form" onSubmit={handleSubmit}>
      <div className="modal-form">
        <p className="confirm-question">해당 사용자 계정을 삭제하시겠습니까?</p>
        <Input
          required
          description="삭제하려면 계정 비밀번호를 입력해 주세요."
          label="비밀번호"
          labelPlacement="inside"
          type="password"
          value={password}
          onValueChange={setPassword}
        />
      </div>
    </form>
  );
};

export const UserRemoveModal = (
  _handleRemoveModalSuccess: () => void,
  {
    row,
    success,
  }: {
    row: any;
    success: () => void;
  },
) => ({
  title: "사용자 삭제",
  content: <UserRemoveForm row={row} success={success} />,
  confirmButton: "삭제",
  formId: "user-remove-form",
});
