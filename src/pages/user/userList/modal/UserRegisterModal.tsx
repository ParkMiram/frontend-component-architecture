import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa1, fa2, fa3, fa4 } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";
import { addToast } from "@heroui/react";
import { DateValue } from "@react-types/datepicker";

import {
  LabeledInput,
  LabeledInputWithButton,
  LabeledSelect,
} from "@/molecules/StyledForm.tsx";
import {
  fetchRegisterUser,
  fetchUserInfoCheckResult,
  registerUserAtom,
} from "@/recoil/atoms/user.ts";
import { PeriodPicker } from "@/molecules/PeriodPicker.tsx";
import { useErrorModal } from "@/hooks/useCustomModal.ts";
import { persistAtomWithStorage } from "@/utils/recoilPersistEffect.ts";
import { SelectType } from "@/types/type/LayoutForm.ts";

const UserRegisterForm = ({ success }: { success: () => void }) => {
  // recoil
  const { error } = useRecoilValue(registerUserAtom);

  // var
  const { openError } = useErrorModal();
  const regUserId = persistAtomWithStorage?.authAtom.userInfo.userId;

  // select
  const [twoFactor, setTwoFactor] = useState<SelectType>({
    value: "",
    label: "",
  });
  const [period, setPeriod] = useState<SelectType>({ value: "", label: "" });
  const [startDate, setStartDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  // select options
  const selectTwoFactorOptions = [
    { label: "PUF USB", value: "puf_usb" },
    { label: "email OTP", value: "email_otp" },
  ];
  const selectPeriodOptions = [
    { label: "사용 제한 없음", value: "null" },
    { label: "90일", value: "90" },
    { label: "60일", value: "60" },
    { label: "30일", value: "30" },
    { label: "7일", value: "7" },
    { label: "1일", value: "1" },
    { label: "직접 입력", value: "manual" },
  ];

  // value
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // validate
  const [isIdValid, setIsIdValid] = useState<boolean | null>(null); // id
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null); // 이름
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null); // 비밀번호
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState<
    boolean | null
  >(null); // 비밀번호 확인
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null); // email
  const [isPeriodValid, setIsPeriodValid] = useState<boolean | null>(null); // 사용 기간 (직접 입력)

  console.log(isPeriodValid);
  // duplicate check
  const [isCheckingId, setIsCheckingId] = useState<boolean | null>(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState<boolean | null>(false);
  // last checking value
  const [lastCheckedId, setLastCheckedId] = useState<string>("");
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string>("");

  // fn
  // duplicate check
  const fetchValidate = async ({
    name,
    value,
  }: {
    name?: string;
    value: string;
  }) => {
    if (name === "account") {
      if (!isIdValid) return;
      setIsCheckingId(null); // 확인 중
      try {
        const result = await fetchUserInfoCheckResult({ userId: value });

        if (result.body.userIdExist === false) {
          setIsCheckingId(true);
          setLastCheckedId(value);
        } else {
          addToast({
            title: "사용 중인 계정입니다.",
            color: "warning",
            timeout: 3000,
          });
          setIsCheckingId(false);
        }
      } catch (err: any) {
        openError({
          message: err,
        });
      }
    } else if (name === "email") {
      if (!isEmailValid) return;
      setIsCheckingEmail(null); // 확인 중
      try {
        const result = await fetchUserInfoCheckResult({ email: value });

        if (result.body.emailExist === false) {
          setIsCheckingEmail(true);
          setLastCheckedEmail(value);
        } else {
          addToast({
            title: "사용 중인 email 입니다.",
            color: "warning",
            timeout: 3000,
          });
          setIsCheckingEmail(false);
        }
      } catch (err: any) {
        openError({
          message: err,
        });
      }
    }
  };

  // 입력값이 바뀌면 확인 상태 초기화
  useEffect(() => {
    if (lastCheckedId && id !== lastCheckedId) {
      setIsCheckingId(false);
    }
    if (lastCheckedEmail && email !== lastCheckedEmail) {
      setIsCheckingEmail(false);
    }
  }, [email, id, lastCheckedEmail, lastCheckedId]);

  // validate
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;

    // ID
    if (name === "account") {
      setIsIdValid(/^[A-Za-z0-9_-]{5,15}$/.test(value.trim()));
    }
    // 이름
    else if (name === "name") {
      setIsNameValid(/^[A-Za-z0-9가-힣]{1,100}$/.test(value.trim()));
    }
    // 비밀번호
    else if (name === "password") {
      const hasAllKinds =
        /[A-Za-z]/.test(value) && // 영문 1개 이상
        /\d/.test(value) && // 숫자 1개 이상
        /[!@#$%^&*()_+\[\]:;\/\-=]/.test(value); // 지정 특수문자 1개 이상
      const onlyAllowedAndLengthOK =
        /^[\]A-Za-z0-9!@#$%^&*()_+[:;\/=-]{8,16}$/.test(value); // 길이 8~16 & 허용 문자만
      const noAscendingTriplet = !/(012|123|234|345|456|567|678|789)/.test(
        value,
      ); // 연속 오름차순 3자리 금지

      setIsPasswordValid(
        hasAllKinds && onlyAllowedAndLengthOK && noAscendingTriplet,
      );
    }
    // 비밀번호 확인
    else if (name === "passwordConfirm") {
      setIsPasswordConfirmValid(password === value);
    }
    // email
    else if (name === "email") {
      setIsEmailValid(
        /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(
          value.trim(),
        ),
      );
    }
  };

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!isCheckingId) {
      addToast({
        title: "사용자 계정 중복 확인을 해주세요.",
        color: "danger",
        timeout: 3000,
      });

      return;
    }

    if (!isCheckingEmail) {
      addToast({
        title: "이메일 중복 확인을 해주세요.",
        color: "danger",
        timeout: 3000,
      });

      return;
    }

    try {
      const result = await fetchRegisterUser({
        userId: id,
        password: password,
        level: "USER",
        name: name,
        twoFactor: twoFactor.value,
        email: email,
        object: description,
        usagePeriod: period.value !== "manual" ? period.value : null,
        startDate: null,
        // period.value === ""
        //   ? null
        //   : period.value === "manual"
        //     ? `${startDate?.year}${pad2(startDate?.month)}${pad2(startDate?.day)} 00:00:00`
        //     : format(new Date(), "yyyyMMdd 00:00:00"),
        endDate: null,
        // period.value === ""
        //   ? null
        //   : period.value === "manual"
        //     ? `${endDate?.year}${pad2(endDate?.month)}${pad2(endDate?.day)} 23:59:59`
        //     : format(
        //         add(new Date(), { days: parseInt(period.value, 10) }),
        //         "yyyyMMdd 23:59:59",
        //       ),
        regUserId: regUserId,
      });

      if (result.header.rtnCode === "000000") {
        success();
        addToast({
          title: "등록되었습니다.",
          color: "success",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        openError({
          code: result.header.rtnCode,
          message: result.header.rtnMessage,
          url: "사용자 등록",
        });
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "사용자 등록",
      });
    }
  };

  useEffect(() => {}, [error]);

  return (
    <form id="user-register-form" onSubmit={handleSubmit}>
      <ul className="modal-form">
        <li>
          <LabeledInputWithButton
            buttonStyle={isCheckingId ? "success" : "default"}
            buttonText={
              isCheckingId === false
                ? "중복 확인"
                : isCheckingId === null
                  ? "확인 중"
                  : "확인 완료"
            }
            disabled={isIdValid === null || !isIdValid || isCheckingId === true}
            errorMessage={
              isIdValid === false ? "사용자 계정 형식이 올바르지 않습니다." : ""
            }
            handleButton={fetchValidate}
            isInvalid={isIdValid === false ? true : undefined}
            label="사용자 계정"
            name="account"
            required={true}
            setValue={setId}
            tooltip={
              <div className="notes-box">
                <p className="notes-sub-title">사용자 계정 규칙</p>
                <div className="notes">
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa1} />
                    </span>
                    영문(대소문자 구분 없음), 숫자와 특수문자(_또는-)의 조합
                  </p>
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa2} />
                    </span>
                    최소 5자 이상, 15자 이하
                  </p>
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa3} />
                    </span>
                    한글과 공백은 입력이 불가능
                  </p>
                </div>
              </div>
            }
            value={id}
            onBlur={handleBlur}
          />
        </li>
        <li>
          <LabeledInput
            errorMessage={
              isNameValid === false ? "이름 형식이 올바르지 않습니다." : ""
            }
            isInvalid={isNameValid === false ? true : undefined}
            label="이름"
            name="name"
            required={true}
            setValue={setName}
            tooltip={
              <div className="notes-box">
                <p className="notes-sub-title">이름 규칙</p>
                <div className="notes">
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa1} />
                    </span>
                    한글, 영문(대소문자 구분 없음), 숫자의 조합
                  </p>
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa2} />
                    </span>
                    최소 1자 이상, 100자 이하
                  </p>
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa3} />
                    </span>
                    특수기호와 공백은 입력이 불가능
                  </p>
                </div>
              </div>
            }
            value={name}
            onBlur={handleBlur}
          />
        </li>
        <li>
          <LabeledInput
            errorMessage={
              isPasswordValid === false
                ? "비밀번호 형식이 올바르지 않습니다."
                : ""
            }
            isInvalid={isPasswordValid === false ? true : undefined}
            label="비밀번호"
            name="password"
            required={true}
            setValue={setPassword}
            tooltip={
              <div className="notes-box">
                <p className="notes-sub-title">비밀번호 규칙</p>
                <div className="notes">
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa1} />
                    </span>
                    영문, 숫자, 특수문자를 모두 포함한 최소 8자, 최대 16자 조합
                  </p>
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa2} />
                    </span>
                    영문 : 대/소문자 구분 없음
                  </p>
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa3} />
                    </span>
                    숫자 : 연속된 오름차순 3자리 숫자 안됨 (예: 123, 234, 456)
                  </p>
                  <p>
                    <span className="number">
                      <FontAwesomeIcon icon={fa4} />
                    </span>
                    특수문자 : !@#$%^&*()_+[]:;\/-=
                  </p>
                </div>
              </div>
            }
            type="password"
            value={password}
            onBlur={handleBlur}
          />
        </li>
        <li>
          <LabeledInput
            errorMessage={
              isPasswordConfirmValid === false ? "일치하지 않습니다." : ""
            }
            isInvalid={isPasswordConfirmValid === false ? true : undefined}
            label="비밀번호 확인"
            name="passwordConfirm"
            required={true}
            setValue={setPasswordConfirm}
            type="password"
            value={passwordConfirm}
            onBlur={handleBlur}
          />
        </li>
        <li>
          <LabeledSelect
            label="2차 인증 수단"
            options={selectTwoFactorOptions}
            required={true}
            select={twoFactor}
            setSelect={setTwoFactor}
          />
        </li>
        <li>
          <LabeledSelect
            label="사용 기간"
            options={selectPeriodOptions}
            required={false}
            select={period}
            setSelect={setPeriod}
          />
        </li>
        {period.value === "manual" && (
          <li>
            <PeriodPicker
              endDate={endDate}
              setEndDate={setEndDate}
              setIsPeriodValid={setIsPeriodValid}
              setStartDate={setStartDate}
              startDate={startDate}
            />
          </li>
        )}
        <li>
          <LabeledInputWithButton
            buttonStyle={isCheckingEmail ? "success" : "default"}
            buttonText={
              isCheckingEmail === false
                ? "중복 확인"
                : isCheckingEmail === null
                  ? "확인 중"
                  : "확인 완료"
            }
            disabled={
              isEmailValid === null || !isEmailValid || isCheckingEmail === true
            }
            errorMessage={
              isEmailValid === false
                ? "이메일 주소 형식이 올바르지 않습니다."
                : ""
            }
            handleButton={fetchValidate}
            isInvalid={isEmailValid === false ? true : undefined}
            label="email"
            name="email"
            required={true}
            setValue={setEmail}
            value={email}
            onBlur={handleBlur}
          />
        </li>
        <li>
          <LabeledInput
            label="목적"
            max={20}
            name="description"
            required={false}
            setValue={setDescription}
            tooltip={"최대 20자 입력 가능"}
            value={description}
          />
        </li>
      </ul>
    </form>
  );
};

export const UserRegisterModal = ({ success }: { success: () => void }) => ({
  title: "사용자 등록",
  content: <UserRegisterForm success={success} />,
  confirmButton: "등록",
  formId: "user-register-form",
});
