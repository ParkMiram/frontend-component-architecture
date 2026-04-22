import { Navigate, Route, Routes } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { useEffect } from "react";

import ErrorModal from "@/components/ErrorModal.tsx";
import NotifyModal from "@/components/NotifyModal.tsx";
import SuccessModal from "@/components/SuccessModal.tsx";
import Layout from "@/pages/Layout.tsx";
import Dashboard from "@/pages/dashboard/Dashboard.tsx";
import UserList from "@/pages/user/userList/UserList.tsx";
import UserGroup from "@/pages/user/userList/UserGroup.tsx";
import OldUserDetail from "@/pages/user/userList/OldUserDetail.tsx";
import UserGroupDetail from "@/pages/user/userGroup/UserGroupDetail.tsx";
import Login from "@/pages/login/Login.tsx";
import { authAtom } from "@/recoil/atoms/auth.ts";
import { setAuthInfo } from "@/recoil/authStore.ts";
import ExpiredModal from "@/components/ExpiredModal.tsx";
import Work from "@/pages/work/Work.tsx";
import Program from "@/pages/program/Program.tsx";
import Script from "@/pages/profile/Script.tsx";
import Machine from "@/pages/machine/Machine.tsx";
import Session from "@/pages/session/Session.tsx";
import Profile from "@/pages/profile/Profile.tsx";
import Extra from "@/pages/profile/Extra.tsx";

function App() {
  const authLoadable = useRecoilValueLoadable(authAtom);

  const RedirectOrLogin = () => {
    const persist = sessionStorage.getItem("recoil-persist");

    if (persist) {
      const parsed = JSON.parse(persist);
      const token = parsed?.authAtom.token;

      return token ? <Navigate replace to="/home" /> : <Login />;
    } else return <Login />;
  };

  useEffect(() => {
    if (authLoadable.state === "hasValue") {
      setAuthInfo(authLoadable.contents);
    }
  }, [authLoadable.contents, authLoadable.state]);

  return (
    <>
      <Routes>
        <Route element={<RedirectOrLogin />} path={"/"} />
        <Route element={<Layout />}>
          <Route element={<Dashboard />} path="/home" />
          {/* user */}
          <Route element={<UserList />} path="/user/list" />
          <Route element={<UserGroup />} path="/user/group" />
          <Route element={<OldUserDetail />} path="/user/list/:userId" />
          <Route element={<UserGroupDetail />} path="/user/group/:groupId" />
          {/* work */}
          <Route element={<Work />} path="/work" />
          {/* program */}
          <Route element={<Program />} path="/pgm" />
          {/* profile-script */}
          <Route element={<Profile />} path="/contents/profile" />
          <Route element={<Script />} path="/contents/script" />
          <Route element={<Extra />} path="/contents/extra" />
          {/* machine */}
          <Route element={<Machine />} path="/machine" />
          {/*session*/}
          <Route element={<Session />} path="/session" />
        </Route>
      </Routes>

      {/* NOTE: 로그인 연장에 사용 */}
      <ExpiredModal />

      {/* NOTE: 사용X (현재 KMS를 사용 중인 사용자 관리에서만 사용 중) */}
      <ErrorModal />
      <NotifyModal />
      <SuccessModal />
    </>
  );
}

export default App;
