import "../styles/modal.scss";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDraggable,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { useRef, useState } from "react";

import { ModalType } from "@/types/type/ModalType.ts";

const BaseModal = ({ isOpen, onOpenChange, config }: ModalType) => {
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });
  // popover
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const forceCloseRef = useRef(false);

  if (!config) return null;

  const {
    title,
    content,
    footer,
    closeButton,
    confirmButton,
    formId,
    loading,
    disabled,
    onRequestClose,
    closePopover,
  } = config;

  return (
    <Modal
      ref={targetRef}
      isDismissable={!loading}
      isOpen={isOpen}
      scrollBehavior={"inside"}
      size="lg"
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          if (forceCloseRef.current) {
            forceCloseRef.current = false;
            onOpenChange(nextOpen);

            return;
          }
          if (onRequestClose && !onRequestClose() && closePopover) {
            setIsOpenPopover(true);

            return;
          }
        }
        onOpenChange(nextOpen);
      }}
    >
      <ModalContent>
        {(onClose) => {
          const CloseButton = (
            <Button
              color="default"
              isDisabled={loading}
              variant="light"
              onPress={() => {
                if (closePopover && onRequestClose && !onRequestClose()) {
                  (document.activeElement as HTMLElement)?.blur();
                  setIsOpenPopover(true);

                  return;
                }
                onClose();
              }}
            >
              {closeButton ?? "닫기"}
            </Button>
          );

          const ConfirmButton = (
            <Button
              color={
                formId.includes("del") ||
                formId.includes("remove") ||
                formId.includes("logout")
                  ? "danger"
                  : "primary"
              }
              form={formId}
              isDisabled={(disabled || loading) ?? false}
              isLoading={loading ?? false}
              onPress={() => {
                const form = document.getElementById(formId) as HTMLFormElement;

                form?.requestSubmit();
              }}
            >
              {confirmButton ?? "확인"}
            </Button>
          );

          return (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1">
                {title}
              </ModalHeader>
              <ModalBody>{content}</ModalBody>
              {footer && (
                <ModalFooter className="modal-footer">{footer}</ModalFooter>
              )}
              <ModalFooter>
                {onRequestClose && !onRequestClose() && closePopover ? (
                  <Popover
                    showArrow
                    backdrop={"opaque"}
                    isOpen={isOpenPopover}
                    offset={15}
                    placement={"top"}
                    shouldBlockScroll={false}
                    shouldCloseOnBlur={false}
                    onOpenChange={setIsOpenPopover}
                  >
                    <PopoverTrigger>{CloseButton}</PopoverTrigger>
                    <PopoverContent>
                      <p
                        className={`text-base font-medium m-2 ${closePopover.description && "mb-0"}`}
                      >
                        {closePopover.title}
                      </p>
                      {closePopover.description && (
                        <p className="text-sm text-gray-500 mb-2">
                          {closePopover.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mb-3">
                        <Button
                          color="default"
                          radius="md"
                          size="sm"
                          onPress={() => {
                            forceCloseRef.current = true;
                            setIsOpenPopover(false);

                            requestAnimationFrame(() => {
                              onClose();
                            });
                          }}
                        >
                          닫기
                        </Button>
                        <Button
                          color="default"
                          radius="md"
                          size="sm"
                          variant="light"
                          onPress={() => setIsOpenPopover(false)}
                        >
                          취소
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  CloseButton
                )}
                {ConfirmButton}
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default BaseModal;
