import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import React, { ReactNode } from "react";

const BaseDrawer = ({
  isOpen,
  onOpenChange,
  title,
  children,
  leftButton,
  button,
  bodyRef,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children?: ReactNode;
  leftButton?: ReactNode;
  button?: ReactNode;
  bodyRef?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement={"right"}
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader>{title}</DrawerHeader>
            <DrawerBody className="overflow-y-auto whitespace-normal break-words">
              <div ref={bodyRef}>{children}</div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex justify-between w-full">
                <div>{leftButton}</div>
                <div className="flex gap-2">
                  {button}
                  <Button color="default" variant="ghost" onPress={onClose}>
                    확인
                  </Button>
                </div>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default BaseDrawer;
