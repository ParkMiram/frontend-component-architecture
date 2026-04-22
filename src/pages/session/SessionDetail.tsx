import { useRecoilValue } from "recoil";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { fetchSessionDetailInfoSelector } from "@/recoil/atoms/session.ts";
import BlankColumn from "@/utils/BlankColumn.tsx";
import { sessionDetailHeader } from "@/columnHeaders/sessionHeader.tsx";

const SessionDetailContent = ({ id }: { id: string }) => {
  // recoil
  const sessionDetail = useRecoilValue(fetchSessionDetailInfoSelector(id));

  if (!sessionDetail) return null;

  return (
    <>
      <Table hideHeader removeWrapper aria-label="Detail Table">
        <TableHeader>
          <TableColumn>key</TableColumn>
          <TableColumn>value</TableColumn>
        </TableHeader>

        <TableBody>
          {sessionDetailHeader
            .filter((header) => header.isDisplay)
            .map((header) => {
              const rawValue = sessionDetail[header.keyName];
              const displayValue = header.formatter
                ? header.formatter(rawValue)
                : rawValue;

              return (
                <TableRow key={header.keyName}>
                  <TableCell className="font-semibold text-gray-500 w-[150px]">
                    {header.name}
                  </TableCell>
                  <TableCell>
                    <BlankColumn value={displayValue ?? ""} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export const SessionDetail = ({ id }: { id: string }) => {
  return {
    title: `세션 상세 [${id}]`,
    content: <SessionDetailContent id={id} />,
  };
};
