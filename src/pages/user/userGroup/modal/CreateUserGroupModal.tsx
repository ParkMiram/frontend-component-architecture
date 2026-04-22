import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa1, fa2 } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";

import { ModalConfig } from "../../../../types/interface/ModalInterface";
import { LabeledInput } from "../../../../molecules/StyledForm";
import {
  createUserGroupAtom,
  fetchCreateUserGroup,
} from "../../../../recoil/atoms/userGroup";
import { ModalPropsType } from "../../../../types/type/ModalType";
import {
  useErrorModal,
  useNotifyModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";

const CreateUserGroupForm: React.FC<ModalPropsType> = ({
  onSuccess,
  handleModal,
}) => {
  // recoil
  const { error } = useRecoilValue(createUserGroupAtom);

  // var
  const { openError } = useErrorModal();
  const { openNotify } = useNotifyModal();
  const { openSuccess } = useSuccessModal();

  // value
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");

  // validate
  const [isGroupNameValid, setIsGroupNameValid] = useState<boolean | null>(
    null,
  ); // 그룹 이름

  // validate: blur
  const handleBlur: (value: string) => void = (value: string) => {
    const forbidden = /[<>&"\\]/;

    if (
      groupName === "" ||
      forbidden.test(value) ||
      value.length < 1 ||
      value.length > 100
    ) {
      setIsGroupNameValid(false);
    } else {
      setIsGroupNameValid(true);
    }
  };

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const canSubmit = !!isGroupNameValid;

    if (groupName === "") {
      openNotify({
        message: "그룹 이름은 필수입니다.",
        url: "사용자 그룹 생성",
      });

      return;
    } else if (!canSubmit) {
      openNotify({
        message: "검증을 완료해 주세요.",
        url: "사용자 그룹 생성",
      });

      return;
    }

    try {
      const result = await fetchCreateUserGroup({
        name: groupName,
        description: groupDescription,
      });

      if (result.header.rtnCode === "000000") {
        openSuccess({
          url: "사용자 그룹 생성",
          message: "생성되었습니다.",
        });
        onSuccess?.();
      } else {
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "사용자 그룹 생성",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="create-user-group-form"
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
          <LabeledInput
            label="그룹 이름"
            message={
              isGroupNameValid === false ? "규칙에 맞춰 입력해 주세요." : ""
            }
            placeholder="최소 1자 이상 100자 이하로 입력해 주세요."
            required={true}
            setValue={setGroupName}
            value={groupName}
            onBlur={(e) => handleBlur(e.target.value)}
          />
        </li>
        <li>
          <LabeledInput
            label="설명"
            required={false}
            setValue={setGroupDescription}
            value={groupDescription}
          />
        </li>
      </ul>
    </form>
  );
};

const CreateUserGroupFooter: React.FC = () => {
  return (
    <>
      <div className="footer-container">
        <div className="notes-content">
          <div className="notes-box">
            <p className="notes-sub-title">- 그룹 이름 규칙</p>
            <div className="notes">
              <p>
                <span className="number">
                  <FontAwesomeIcon icon={fa1} />
                </span>
                1~100자까지 입력이 가능합니다.
              </p>
              <p>
                <span className="number">
                  <FontAwesomeIcon icon={fa2} />
                </span>
                특수문자의 경우 &lt;&gt;&amp;&quot;&#92;를 사용할 수 없습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const CreateUserGroupModal = (
  onSuccess: () => void,
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "사용자 그룹 생성",
  content: (
    <CreateUserGroupForm
      handleModal={setIsCreateModalOpen}
      onSuccess={onSuccess}
    />
  ),
  footer: <CreateUserGroupFooter />,
  closeButton: "닫기",
  confirmButton: "생성",
  formId: "create-user-group-form",
});
