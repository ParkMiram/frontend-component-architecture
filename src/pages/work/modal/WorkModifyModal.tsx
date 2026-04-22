import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { parseDateTime } from "@internationalized/date";
import { addToast } from "@heroui/react";

import { LabeledInput, LabeledSelect } from "@/molecules/StyledForm.tsx";
import { SelectType } from "@/types/type/LayoutForm.ts";
import {
  fetchWorkDetailInfoSelector,
  useUpdateWorkDetailInfo,
} from "@/recoil/atoms/work.ts";

const WorkModifyForm = ({
  id,
  setMdfLoading,
  setIsDirty,
  success,
}: {
  id: string;
  setMdfLoading: (v: boolean) => void;
  setIsDirty: (v: boolean) => void;
  success: () => void;
}) => {
  // recoil
  const workDetail = useRecoilValue(fetchWorkDetailInfoSelector(id));
  const updateWorkDetailInfo = useUpdateWorkDetailInfo();

  // state
  const [workNo, setWorkNo] = useState<string>(workDetail.work_no);
  const [tagName, setTagName] = useState<string>(workDetail.tag_name);
  const [customer, setCustomer] = useState<string>(workDetail.customer);
  const [deviceName, setDeviceName] = useState<string>(workDetail.device_name);
  const [orderNo, setOrderNo] = useState<string>(workDetail.order_no);
  const [pjiUid, setPjiUid] = useState<string>(workDetail.pji_uid);
  const [mcnUid, setMcnUid] = useState<string>(workDetail.mcn_uid);
  const [snrUid, setSnrUid] = useState<string>(workDetail.snr_uid);
  const [targetSize, setTargetSize] = useState<number>(
    workDetail.target_size ?? 0,
  );
  const [completedSize, setCompletedSize] = useState<number>(
    workDetail.completed_size ?? 0,
  );
  const [failedSize, setFailedSize] = useState<number>(
    workDetail.failed_size ?? 0,
  );
  const [checkSize, setCheckSize] = useState<number>(
    workDetail.check_size ?? 0,
  );
  const [dueDate, setDueDate] = useState(parseDateTime(workDetail.due_date));
  const [description, setDescription] = useState<string>(
    workDetail.description,
  );
  const [isLock, setIsLock] = useState<SelectType>(
    workDetail.is_lock
      ? { value: "Y", label: "Y" }
      : { value: "N", label: "N" },
  );
  const [status, setStatus] = useState<SelectType>({
    value: workDetail.status,
    label: workDetail.status,
  });
  // const [param, setParam] = useState<string>(workDetail.param);
  const [paramExt, setParamExt] = useState<string>(workDetail.param_ext);
  // const [detailMsg, setDetailMsg] = useState<string>(workDetail.detail_msg);
  const [result, setResult] = useState<SelectType>({
    value: workDetail.result,
    label: workDetail.result,
  });
  const [workStartTime, setWorkStartTime] = useState(
    parseDateTime(workDetail.work_start_time),
  );
  const [comment, setComment] = useState<string>(workDetail.comment);

  // 잠금 여부 options
  const isLockOptions = [
    { value: "Y", label: "Y" },
    { value: "N", label: "N" },
  ];

  // 상태 options
  const statusOptions = [
    { value: "FINISHED", label: "종료" },
    { value: "RUNNING", label: "발급 중" },
    { value: "ON_STOP", label: "중지" },
  ];

  // 작업 결과 options
  const resultOptions = [
    { value: "OK", label: "OK" },
    { value: "ON_WORKING", label: "ON_WORKING" },
  ];

  // 초기값
  const initialSnapshot = useRef<string>("");

  useEffect(() => {
    if (!workDetail) return;

    initialSnapshot.current = JSON.stringify({
      workNo: workDetail.work_no,
      tagName: workDetail.tag_name,
      customer: workDetail.customer,
      deviceName: workDetail.device_name,
      orderNo: workDetail.order_no,
      pjiUid: workDetail.pji_uid,
      mcnUid: workDetail.mcn_uid,
      snrUid: workDetail.snr_uid,
      targetSize: workDetail.target_size ?? 0,
      completedSize: workDetail.completed_size ?? 0,
      failedSize: workDetail.failed_size ?? 0,
      checkSize: workDetail.check_size ?? 0,
      dueDate: workDetail.due_date,
      description: workDetail.description,
      isLock: workDetail.is_lock,
      status: workDetail.status,
      paramExt: workDetail.param_ext,
      result: workDetail.result,
      workStartTime: workDetail.work_start_time,
      comment: workDetail.comment,
    });
  }, [workDetail]);

  // 변경 내역 확인
  useEffect(() => {
    if (!initialSnapshot.current) return;

    const currentSnapshot = JSON.stringify({
      workNo,
      tagName,
      customer,
      deviceName,
      orderNo,
      pjiUid,
      mcnUid,
      snrUid,
      targetSize,
      completedSize,
      failedSize,
      checkSize,
      dueDate: dueDate?.toString(),
      description,
      isLock: isLock.value === "Y",
      status: status.value,
      paramExt,
      result: result.value,
      workStartTime: workStartTime?.toString(),
      comment,
    });

    setIsDirty(initialSnapshot.current !== currentSnapshot);
  }, [
    workNo,
    tagName,
    customer,
    deviceName,
    orderNo,
    pjiUid,
    mcnUid,
    snrUid,
    targetSize,
    completedSize,
    failedSize,
    checkSize,
    dueDate,
    description,
    isLock,
    status,
    paramExt,
    result,
    workStartTime,
    comment,
  ]);

  // 수정
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const body = {
      work_no: workNo,
      tag_name: tagName,
      customer,
      device_name: deviceName,
      order_no: orderNo,
      pji_uid: pjiUid,
      mcn_uid: mcnUid,
      snr_uid: snrUid,
      target_size: targetSize,
      completed_size: completedSize,
      failed_size: failedSize,
      check_size: checkSize,
      due_date: dueDate?.toString(),
      description,
      is_lock: isLock.value,
      status: status.value,
      param: workDetail.param ?? "",
      param_ext: paramExt,
      detail_msg: workDetail.detail_msg ?? "",
      result: result.value,
      work_start_time: workStartTime?.toString(),
      comment,
    };

    setMdfLoading(true);

    try {
      await updateWorkDetailInfo(id, body);
      success();
      addToast({
        title: "수정되었습니다.",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error: any) {
      addToast({
        title: `Error`,
        description: `Error Message: ${error.message}`,
        color: "danger",
      });
    } finally {
      setMdfLoading(false);
    }
  };

  return (
    <form id="work-modify-form" onSubmit={handleSubmit}>
      <ul className="modal-form">
        <li>
          <LabeledInput
            label="작업 번호"
            name="workNo"
            required={true}
            setValue={setWorkNo}
            value={workNo}
          />
        </li>
        <li>
          <LabeledInput
            label="태그명"
            name="tagName"
            required={false}
            setValue={setTagName}
            value={tagName}
          />
        </li>
        <li>
          <LabeledInput
            label="고객사 담당자"
            name="customer"
            required={false}
            setValue={setCustomer}
            value={customer}
          />
        </li>
        <li>
          <LabeledInput
            label="장치명"
            name="deviceName"
            required={false}
            setValue={setDeviceName}
            value={deviceName}
          />
        </li>
        <li>
          <LabeledInput
            label="주문 번호"
            name="orderNo"
            required={false}
            setValue={setOrderNo}
            value={orderNo}
          />
        </li>
        <li>
          <LabeledInput
            label="프로젝트 항목 식별자"
            name="pjiUid"
            required={false}
            setValue={setPjiUid}
            value={pjiUid}
          />
        </li>
        <li>
          <LabeledInput
            label="장비 식별자"
            name="mcnUid"
            required={false}
            setValue={setMcnUid}
            value={mcnUid}
          />
        </li>
        <li>
          <LabeledInput
            label="시리얼 식별자"
            name="snrUid"
            required={false}
            setValue={setSnrUid}
            value={snrUid}
          />
        </li>
        <li>
          <LabeledInput
            label="목표 수량"
            name="targetSize"
            required={false}
            setValue={setTargetSize}
            useNumber={true}
            value={targetSize}
          />
        </li>
        <li>
          <LabeledInput
            label="완료 수량"
            name="completedSize"
            required={false}
            setValue={setCompletedSize}
            useNumber={true}
            value={completedSize}
          />
        </li>
        <li>
          <LabeledInput
            label="실패 수량"
            name="failedSize"
            required={false}
            setValue={setFailedSize}
            useNumber={true}
            value={failedSize}
          />
        </li>
        <li>
          <LabeledInput
            label="확인 수량"
            name="checkSize"
            required={false}
            setValue={setCheckSize}
            useNumber={true}
            value={checkSize}
          />
        </li>
        <li>
          <LabeledInput
            label="마감 기한"
            name="dueDate"
            required={false}
            setValue={setDueDate}
            useDatePicker={true}
            value={dueDate}
          />
        </li>
        <li>
          <LabeledInput
            label="상세 설명"
            name="description"
            required={false}
            setValue={setDescription}
            value={description}
          />
        </li>
        <li>
          <LabeledSelect
            label="잠금 여부"
            options={isLockOptions}
            required={false}
            select={isLock}
            setSelect={setIsLock}
          />
        </li>
        <li>
          <LabeledSelect
            label="상태"
            options={statusOptions}
            required={true}
            select={status}
            setSelect={setStatus}
          />
        </li>
        <li>
          <LabeledInput
            label="확장 파라미터"
            name="paramExt"
            required={false}
            setValue={setParamExt}
            value={paramExt}
          />
        </li>
        <li>
          <LabeledSelect
            label="작업 결과"
            options={resultOptions}
            required={true}
            select={result}
            setSelect={setResult}
          />
        </li>
        <li>
          <LabeledInput
            label="작업 시작 시간"
            name="workStartTime"
            required={false}
            setValue={setWorkStartTime}
            useDatePicker={true}
            value={workStartTime}
          />
        </li>
        <li>
          <LabeledInput
            label="주석"
            name="comment"
            required={false}
            setValue={setComment}
            value={comment}
          />
        </li>
      </ul>
    </form>
  );
};

export const WorkModifyModal = ({
  id,
  success,
}: {
  id: string;
  success: () => void;
}) => {
  // loading
  const [mdfLoading, setMdfLoading] = useState<boolean>(false);
  // 변경 사항
  const [isDirty, setIsDirty] = useState<boolean>(false);

  return {
    title: `작업 [${id}] 수정`,
    content: (
      <WorkModifyForm
        id={id}
        setIsDirty={setIsDirty}
        setMdfLoading={setMdfLoading}
        success={success}
      />
    ),
    confirmButton: "수정",
    formId: "work-modify-form",
    loading: mdfLoading,
    disabled: !isDirty,
    onRequestClose: () => {
      if (!isDirty) return true;
    },
    closePopover: {
      title: "변경된 내역이 있습니다.",
      description: "닫으시겠습니까?",
    },
  };
};
