import React from "react";

const LogoutConfirmForm = ({ success }: { success: () => void }) => {
  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    success?.();
  };

  return (
    <form
      id="logout-form"
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
          <p className="confirm-question">로그아웃하시겠습니까?</p>
        </li>
      </ul>
    </form>
  );
};

export const LogoutModal = ({
  success,
  loading,
}: {
  success: () => void;
  loading: boolean;
}) => ({
  title: "로그아웃",
  content: <LogoutConfirmForm success={success} />,
  confirmButton: "로그아웃",
  loading: loading,
  formId: "logout-form",
});
