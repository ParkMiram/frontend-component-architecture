import { TabButton } from "../atoms/Button";
import { TabContainerProps } from "../types/interface/PageInterface";

export const TabContainer = ({
  tabs,
  selectedTab,
  setSelectedTab,
  style,
  children,
}: TabContainerProps) => {
  return (
    <>
      <div className="tab-container" style={style}>
        {tabs.map((tab: any, index: number) => {
          return (
            <TabButton
              key={index}
              className={`tab-button ${selectedTab === tab.value ? "selected" : ""}`}
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => {
                event.preventDefault();
                setSelectedTab(tab.value);
              }}
            >
              {tab.label}
            </TabButton>
          );
        })}
      </div>
      {children}
    </>
  );
};
