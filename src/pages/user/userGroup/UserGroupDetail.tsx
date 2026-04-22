import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import UserGroupUser from "./UserGroupUser";
import UserGroupPolicy from "./UserGroupPolicy";

import { Button } from "@/atoms/Button.tsx";
import { PageContainer } from "@/template/PageContainer.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { TabContainer } from "@/molecules/TabContainer.tsx";

const UserGroupDetail = () => {
  // var
  const { groupId } = useParams<{ groupId: string }>();
  const { state } = useLocation();
  // tab
  const tabs = [
    { label: "사용자", value: "user" },
    { label: "권한", value: "policy" },
  ];
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].value);

  return (
    <PageContainer>
      <div className="detail-header">
        <Button className="back-button">
          <Link to={"/user/group"}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </Button>
        <PageTitle>{groupId}</PageTitle>
      </div>
      <TabContainer
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        style={{ marginTop: "16px" }}
        tabs={tabs}
      >
        {selectedTab === "user" && <UserGroupUser state={state} />}
        {selectedTab === "policy" && <UserGroupPolicy state={state} />}
      </TabContainer>
    </PageContainer>
  );
};

export default UserGroupDetail;
