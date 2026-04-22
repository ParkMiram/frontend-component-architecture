import { useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { faAt, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsb } from "@fortawesome/free-brands-svg-icons";

import { Refreshable } from "@/types/type/refresh.ts";
import { FetchUserInfoParams } from "@/types/type/PageType.ts";
import { fetchUserInfo, userInfoAtom } from "@/recoil/atoms/user.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";
import BlankColumn from "@/utils/BlankColumn.tsx";
import { StatusChip } from "@/atoms/Chips.tsx";
import { allDateFormat } from "@/utils/dateFormat.ts";
import { HeaderInfo } from "@/types/type/TableType.ts";
import { useParamsRefetch } from "@/hooks/useParamRefetch.ts";

const UserContent = ({ id }: { id: string }) => {
  // recoil
  const setUserInfo = useSetRecoilState(userInfoAtom);

  // info
  // const account = JSON.parse(localStorage.getItem("recoil-persist") as string)
  //   ?.authAtom.userInfo.userId;

  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState<any[]>([]);

  // init
  const [params, setParams] = useState<Refreshable<FetchUserInfoParams>>({
    isHeaderInfo: true,
    userId: id,
  });
  // refresh
  const refresh = useParamsRefetch(setParams);

  console.log(refresh);

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserInfo,
    fetchList: fetchUserInfo,
    setHeaderInfos,
    setList,
  });

  // format - list
  // const formatList = (list: any[]) => {
  //   return list.map((item) => ({
  //     ...item,
  //     key: String(item.userId),
  //     status: <StatusChip value={item.status} />,
  //   }));
  // };

  return (
    <>
      <Table hideHeader removeWrapper aria-label="Detail Table">
        <TableHeader>
          <TableColumn>key</TableColumn>
          <TableColumn>value</TableColumn>
        </TableHeader>

        <TableBody>
          {headerInfos
            .filter((header: HeaderInfo) => header.isDisplay)
            .map((header: HeaderInfo) => {
              const value = list[0][header.keyName];

              const rawValue =
                header.keyName === "status" ? (
                  <StatusChip value={list[0]} />
                ) : header.keyName === "updateDate" ||
                  header.keyName === "regDate" ? (
                  allDateFormat(value as string)
                ) : header.keyName === "mfaOption" ? (
                  value === "PUF-USB" ? (
                    <>
                      <FontAwesomeIcon icon={faUsb} />
                      <span>{value}</span>
                    </>
                  ) : value === "Email-Otp" ? (
                    <>
                      <FontAwesomeIcon icon={faAt} />
                      <span>{value}</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMinus} />
                      <span>{value}</span>
                    </>
                  )
                ) : (
                  value
                );

              return (
                <TableRow key={header.keyName}>
                  <TableCell className="font-semibold text-gray-500 w-[150px]">
                    {header.name}
                  </TableCell>
                  <TableCell>
                    <BlankColumn value={rawValue ?? ""} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export const UserDetail = ({ id }: { id: string }) => {
  return {
    title: `사용자 정보 [${id}]`,
    content: <UserContent id={id} />,
  };
};
