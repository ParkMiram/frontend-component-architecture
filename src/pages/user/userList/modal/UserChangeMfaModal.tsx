import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useRecoilValue } from "recoil";

import { fetchUserMfaChange, userMfaChangeAtom } from "@/recoil/atoms/user.ts";
import { ModalPropsType } from "@/types/type/ModalType.ts";
import { ModalConfig } from "@/types/interface/ModalInterface.ts";
import {
  useErrorModal,
  useNotifyModal,
  useSuccessModal,
} from "@/hooks/useCustomModal.ts";

const UserChangeMfaForm: React.FC<ModalPropsType> = ({
  onSuccess,
  row,
  handleModal,
}) => {
  // recoil
  const { error } = useRecoilValue(userMfaChangeAtom);

  // var
  const { openNotify } = useNotifyModal();
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();

  // state
  const [mfa, setMfa] = useState<string>(
    row.mfaOption === "PUF-USB" ? "puf_usb" : "email_otp",
  );

  // change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMfa(e.target.value);
  };
  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const orgMfa = row.mfaOption === "PUF-USB" ? "puf_usb" : "email_otp";

    if (mfa !== orgMfa) {
      try {
        const result = await fetchUserMfaChange({
          userId: row.userId,
          mfaOtion: mfa, // TODO mfaOption 오타 말하기
        });

        if (result.header.rtnCode === "000000") {
          openSuccess({
            message: "변경되었습니다.",
            url: "2차 인증 변경",
          });
          onSuccess?.();
        } else {
          openError({
            code: result.header.rtnCode,
            message: result.header.rtnMessage,
            url: "2차 인증 변경",
          });
        }
      } catch (err: any) {
        openError({
          message: err,
        });
      }
    } else {
      openNotify({
        url: "2차 인증 변경",
        message: "변경된 내용이 없습니다.",
      });

      return;
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="user-mfa-form"
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
          <p className="confirm-question">2차 인증 수단을 변경하시겠습니까?</p>
          <RadioGroup
            row
            className="radio-group"
            value={mfa}
            onChange={handleChange}
          >
            <FormControlLabel
              control={<Radio />}
              disabled={row.mfaOption === "PUF-USB"}
              label="PUF-USB"
              value="puf_usb"
            />
            <FormControlLabel
              control={<Radio />}
              disabled={row.mfaOption === "Email-Otp"}
              label="Email-OTP"
              value="email_otp"
            />
          </RadioGroup>
        </li>
      </ul>
    </form>
  );
};

const UserChangeMfaFooter = () => {
  return (
    <>
      <div className="footer-container">
        <p className="notes-title">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          PUF-USB 정보
        </p>
        <div className="notes-content">
          <div className="notes-box">
            <div className="notes">
              <p>Email 인증 선택 시 기존 등록된 PUF-USB 정보는 유지됩니다.</p>
              <p>
                PUF-USB 등록 정보는 관리자가 PC-AGENT 관리에서 삭제하면 됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const UserChangeMfaModal = (
  onSuccess: () => void,
  row: any,
  setIsChangeMfaModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "2차 인증 변경",
  content: (
    <UserChangeMfaForm
      handleModal={setIsChangeMfaModalOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  footer: <UserChangeMfaFooter />,
  closeButton: "닫기",
  confirmButton: "변경",
  formId: "user-mfa-form",
});
