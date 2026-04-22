import React, { useEffect, useState } from "react";
import "../styles/main.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsProgress,
  faChalkboard,
  faCircleChevronDown,
  faCircleChevronUp,
  faComputer,
  faDownLeftAndUpRightToCenter,
  faFileCode,
  faKey,
  faMinus,
  faSquareBinary,
  faUpRightAndDownLeftFromCenter,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "../atoms/Button";
import { MenuItem } from "../types/type/LayoutForm";
import Countdown from "../molecules/Countdown";

import AccountInfo from "./account/AccountInfo";

const SideMenu: React.FC = () => {
  // var
  const location = useLocation();
  const navigator = useNavigate();
  // state
  const [isSideMenuExpanded, setIsSideMenuExpanded] = useState<boolean>(true);
  const [openMenu, setOpenMenu] = useState<Record<string, boolean>>(() => ({
    user: location.pathname.startsWith("/user"),
    contents: location.pathname.startsWith("/contents"),
  }));
  // menu Items
  const sidebarContents: MenuItem[] = [
    { name: "대시보드", path: "/home", icon: faChalkboard, alt: "dashboard" },
    {
      name: "사용자 관리",
      path: "/user",
      icon: faUserGear,
      alt: "user",
      subMenu: [
        { name: "사용자 목록", path: "/list", icon: faMinus, alt: "userList" },
        {
          name: "사용자 그룹",
          path: "/group",
          icon: faMinus,
          alt: "userGroup",
        },
      ],
    },
    { name: "작업(WORK)", path: "/work", icon: faBarsProgress, alt: "work" },
    { name: "프로그램(PGM)", path: "/pgm", icon: faSquareBinary, alt: "pgm" },
    {
      name: "프로파일",
      path: "/contents",
      icon: faFileCode,
      alt: "contents",
      subMenu: [
        { name: "프로파일", path: "/profile", icon: faMinus, alt: "profile" },
        { name: "스크립트", path: "/script", icon: faMinus, alt: "script" },
        { name: "기타 정보", path: "/extra", icon: faMinus, alt: "extra" },
      ],
    },
    { name: "발급장비", path: "/machine", icon: faComputer, alt: "machine" },
    { name: "세션", path: "/session", icon: faKey, alt: "session" },
  ];

  // fn
  const toggleSideMenu = () => {
    setIsSideMenuExpanded(!isSideMenuExpanded);
  };
  const toggleMenuGroup = (key: string) => {
    setOpenMenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    setOpenMenu({
      user: location.pathname.startsWith("/user"),
      contents: location.pathname.startsWith("/contents"),
    });
  }, []);

  return (
    <div
      className={`menu-container ${!isSideMenuExpanded && "collapsed"} rounded-large`}
    >
      <div className="menu-logo">
        <Link to="/home">
          {isSideMenuExpanded ? (
            <img alt="ictk" src="/ICTK_logo_blue_H.png" width={"100px"} />
          ) : (
            <img alt="ictk" src="/ictk-sm-logo.png" width={"25px"} />
          )}
        </Link>
      </div>
      <Button
        color="#1b2d52"
        height="35px"
        width="35px"
        onClick={toggleSideMenu}
      >
        {isSideMenuExpanded ? (
          <FontAwesomeIcon
            className="menu-size-control"
            icon={faDownLeftAndUpRightToCenter}
          />
        ) : (
          <FontAwesomeIcon
            className="menu-size-control"
            icon={faUpRightAndDownLeftFromCenter}
          />
        )}
      </Button>
      <ul className="menu-list">
        {sidebarContents?.map((item) =>
          !item.subMenu ? (
            <Link key={item.alt} to={item.path}>
              <li
                className={`menu-item ${location?.pathname?.startsWith(item.path) && "active"}`}
              >
                <FontAwesomeIcon icon={item.icon} />
                {isSideMenuExpanded && (
                  <span className="menu-text">{item.name}</span>
                )}
              </li>
            </Link>
          ) : (
            <React.Fragment key={item.alt}>
              {(() => {
                const isOpen = openMenu[item.alt as string];
                const isActive = location?.pathname?.startsWith(item.path);

                return (
                  <>
                    <div
                      key={item.alt}
                      className={`menu-item-group ${isOpen ? "open" : ""} ${isActive ? "active" : ""}`}
                      onClick={() =>
                        isSideMenuExpanded
                          ? toggleMenuGroup(item.alt)
                          : navigator(item.path + item.subMenu?.[0]?.path)
                      }
                    >
                      <div>
                        <FontAwesomeIcon icon={item.icon} />
                        {isSideMenuExpanded && (
                          <span className="menu-text">{item.name}</span>
                        )}
                      </div>
                      {isSideMenuExpanded &&
                        (isOpen ? (
                          <FontAwesomeIcon
                            className="up"
                            icon={faCircleChevronUp}
                          />
                        ) : (
                          <FontAwesomeIcon
                            className="down"
                            icon={faCircleChevronDown}
                          />
                        ))}
                    </div>
                    {isSideMenuExpanded && isOpen && (
                      <ul className="menu-sub-list">
                        {item.subMenu?.map((subItem) => (
                          <div
                            key={subItem.alt}
                            className="menu-item-sub-title"
                          >
                            <span>
                              <FontAwesomeIcon icon={subItem.icon} />
                            </span>
                            <Link to={item.path + subItem.path}>
                              <li
                                className={`menu-item-sub ${location?.pathname?.startsWith(item.path + subItem.path) && "active"}`}
                              >
                                {subItem.name}
                              </li>
                            </Link>
                          </div>
                        ))}
                      </ul>
                    )}
                  </>
                );
              })()}
            </React.Fragment>
          ),
        )}
      </ul>
      <Countdown isSideMenuExpanded={isSideMenuExpanded} />
      <AccountInfo isSideMenuExpanded={isSideMenuExpanded} />
    </div>
  );
};

export default SideMenu;
