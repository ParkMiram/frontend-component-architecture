import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";

import {
  deleteUserGroupAtom,
  fetchDeleteUserGroup,
} from "../../../../recoil/atoms/user";
import { ModalPropsType } from "../../../../types/type/ModalType";
import { ModalConfig } from "../../../../types/interface/ModalInterface";
import {
  useErrorModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";

const DeleteUserGroupForm: React.FC<ModalPropsType> = ({
  onSuccess,
  userId,
  row,
  handleModal,
}) => {
  // recoil
  const { error } = useRecoilValue(deleteUserGroupAtom);

  // var
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const result = await fetchDeleteUserGroup({
        userId: userId,
        groupSeq: row.seq,
      });

      if (result.header?.rtnCode === "000000") {
        openSuccess({
          message: "삭제되었습니다.",
          url: "사용자가 속한 그룹 삭제",
        });
        onSuccess?.();
      } else {
        openError({
          code: result.header.rtnCode,
          message: result.header.rtnMessage,
          url: "사용자가 속한 그룹 삭제",
        });
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "사용자가 속한 그룹 삭제",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="delete-user-group-form"
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
        </li>
      </ul>
    </form>
  );
};

const DeleteUserGroupFooter: React.FC = () => {
  return (
    <>
      <div className="footer-container">
        <p className="notes-title">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          그룹 삭제 시 주의사항
        </p>
        <div className="notes-content">
          <div className="notes-box">
            <div className="notes">
              <p>
                해당 그룹과 삭제시 그룹에서 부여한 모든 권한이 모두 삭제됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const DeleteUserGroupModal = (
  onSuccess: () => void,
  userId: string,
  row: any,
  setIsDeleteUserGroupsOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "사용자가 속한 그룹 삭제",
  content: (
    <DeleteUserGroupForm
      handleModal={setIsDeleteUserGroupsOpen}
      row={row}
      userId={userId}
      onSuccess={onSuccess}
    />
  ),
  footer: <DeleteUserGroupFooter />,
  closeButton: "닫기",
  confirmButton: "삭제",
  formId: "delete-user-group-form",
});
