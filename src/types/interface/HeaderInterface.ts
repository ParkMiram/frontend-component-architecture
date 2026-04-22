import React from "react";

export interface DetailHeaderInterface {
  keyName: string;
  name: string;
  isDisplay: boolean;
  formatter?: (value: any) => React.ReactNode;
}
