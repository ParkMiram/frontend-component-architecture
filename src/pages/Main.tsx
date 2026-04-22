import React from "react";
// style
import "../styles/main.scss";

type MainContentProps = { children: React.ReactNode };

const Main: React.FC<MainContentProps> = ({
  children,
}: MainContentProps): React.JSX.Element => {
  return <div className="main-container">{children}</div>;
};

export default Main;
