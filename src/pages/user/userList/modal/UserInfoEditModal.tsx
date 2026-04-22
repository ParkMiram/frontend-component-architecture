import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { DateValue } from "@react-types/datepicker";

import { ModalConfig } from "@/types/interface/ModalInterface.ts";
import { ModalPropsType } from "@/types/type/ModalType.ts";
import {
  fetchUserInfoCheckResult,
  fetchUserInfoEdit,
  userInfoEditAtom,
} from "@/recoil/atoms/user.ts";
import {
  LabeledInput,
  LabeledInputWithButton,
} from "@/molecules/StyledForm.tsx";
import { PeriodPicker } from "@/molecules/PeriodPicker.tsx";
import {
  useErrorModal,
  useNotifyModal,
  useSuccessModal,
} from "@/hooks/useCustomModal.ts";

const UserInfoEditForm: React.FC<ModalPropsType> = ({
  onSuccess,
  row,
  handleModal,
}) => {
  // recoil
  const { error } = useRecoilValue(userInfoEditAtom);

  // var
  const { openNotify } = useNotifyModal();
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();

  // validate
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null); // email
  const [isPeriodValid, setIsPeriodValid] = useState<boolean | null>(null); // 사용 기간
  // duplicate check
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean | null>(false);
  // last checking value
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string>(row.email);
  // const [rowStartDate, rowEndDate] = row?.period?.split(" - ") ?? [null, null];

  // value
  const [startDate, setStartDate] = useState<DateValue | null>();
  // rowStartDate ? dayjs(rowStartDate, "YYYY/MM/DD") : null,
  const [endDate, setEndDate] = useState<DateValue | null>();
  // rowEndDate ? dayjs(rowEndDate, "YYYY/MM/DD") : null,
  const [email, setEmail] = useState<string>(row.email);
  const [description, setDescription] = useState<string>(row.object);

  // fn
  // duplicate check
  const fetchValidate = async ({ value }: { value: string }) => {
    if (!isEmailValid) return;
    setIsCheckingEmail(null); // 확인 중
    try {
      const result = await fetchUserInfoCheckResult({ email: value });

      if (result.body.emailExist === false) {
        setIsCheckingEmail(true);
        setLastCheckedEmail(value);
      } else {
        openNotify({
          url: "사용자 정보 변경",
          message: "사용 중인 email입니다.",
        });
        setIsCheckingEmail(false);
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "사용자 정보 변경",
      });
    }
  };

  // 입력값이 바뀌면 확인 상태 초기화
  useEffect(() => {
    if (lastCheckedEmail && email !== lastCheckedEmail) {
      setIsCheckingEmail(false);
    }
  }, [email, lastCheckedEmail]);

  // validate
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsEmailValid(
      /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(
        e.currentTarget.value.trim(),
      ),
    );
  };

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // 제출 가능 여부 검증
    const canSubmit =
      !!isEmailValid &&
      isCheckingEmail === true &&
      email === lastCheckedEmail &&
      (isPeriodValid === true || isPeriodValid === null);

    if (email !== row.email && !canSubmit) {
      openNotify({
        url: "사용자 정보 변경",
        message: "이메일 중복 확인을 완료해 주세요.",
      });

      return;
    } else if (startDate && endDate && startDate > endDate) {
      openNotify({
        url: "사용자 정보 변경",
        message: "시작일은 종료일보다 이전이어야 합니다.",
      });

      return;
    } else if ((startDate && !endDate) || (!startDate && endDate)) {
      if (!startDate) {
        openNotify({
          url: "사용자 정보 변경",
          message: "시작 일자를 선택해 주세요.",
        });
      } else {
        openNotify({
          url: "사용자 정보 변경",
          message: "종료 일자를 선택해 주세요.",
        });
      }

      return;
    }

    // const changeStartDate = startDate ? startDate.format("YYYY.MM.DD") : null;
    // const changeEndDate = endDate ? endDate.format("YYYY.MM.DD") : null;

    try {
      if (
        email !== row.email ||
        description !== row.object
        // changeStartDate !== rowStartDate ||
        // changeEndDate !== rowEndDate
      ) {
        const result = await fetchUserInfoEdit({
          userId: row.userId,
          startDate: null,
          endDate: null,
          // startDate: startDate ? startDate.format("YYYYMMDD 00:00:00") : null,
          // endDate: endDate ? endDate.format("YYYYMMDD 23:59:59") : null,
          email: email,
          object: description,
        });

        if (result.header.rtnCode === "000000") {
          openSuccess({
            url: "정보 수정",
            message: "변경되었습니다.",
          });
          onSuccess?.();
        } else {
          openError({
            code: result.header.rtnCode,
            message: result.header.rtnMessage,
            url: "정보 수정",
          });
        }
      } else {
        openNotify({
          url: "정보 수정",
          message: "변경된 내용이 없습니다.",
        });
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "정보 수정",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="user-edit-form"
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
            disabled={true}
            label="사용자 계정"
            required={false}
            value={row.userId}
          />
        </li>
        <li>
          <PeriodPicker
            endDate={endDate ?? null}
            label="사용 기간"
            setEndDate={setEndDate}
            setIsPeriodValid={setIsPeriodValid}
            setStartDate={setStartDate}
            startDate={startDate ?? null}
          />
        </li>
        <li>
          <LabeledInputWithButton
            buttonStyle={isCheckingEmail === true ? "success" : "default"}
            buttonText={
              isCheckingEmail === false
                ? "중복 확인"
                : isCheckingEmail === null
                  ? "확인 중"
                  : "확인 완료"
            }
            disabled={
              isEmailValid === null ||
              !isEmailValid ||
              isCheckingEmail === true ||
              email === row.email
            }
            handleButton={fetchValidate}
            label="email"
            message={isEmailValid === false ? "유효하지 않습니다." : ""}
            required={false}
            setValue={setEmail}
            value={email}
            onBlur={handleBlur}
          />
        </li>
        <li>
          <LabeledInput
            label="목적"
            max={20}
            placeholder="최대 20자"
            required={false}
            setValue={setDescription}
            value={description}
          />
        </li>
      </ul>
    </form>
  );
};

export const UserInfoEditModal = (
  onSuccess: () => void,
  row: any,
  setIsEditUserOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "사용자 정보 변경",
  content: (
    <UserInfoEditForm
      handleModal={setIsEditUserOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "변경",
  formId: "user-edit-form",
});
