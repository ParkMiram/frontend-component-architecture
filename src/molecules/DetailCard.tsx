import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import BlankColumn from "@/utils/BlankColumn.tsx";
import { DetailHeaderInterface } from "@/types/interface/HeaderInterface.ts";

export const InfoCard = ({
  title,
  icon,
  headers,
  keys,
  data,
  width = "w-full",
  children,
}: {
  title: string;
  icon: IconProp;
  headers: DetailHeaderInterface[];
  keys: string[];
  data: any;
  width?: string;
  children?: React.ReactNode;
}) => {
  const selectedHeaders = headers
    .filter((h) => keys.includes(h.keyName))
    .filter((h) => h.isDisplay);

  return (
    <Card className={width}>
      <CardHeader className="info-header">
        <div className="title">
          <FontAwesomeIcon className="mr-1" icon={icon} />
          {title}
        </div>
        {children}
      </CardHeader>
      <Divider />
      <CardBody className="overflow-visible [&>div]:flex-1 [&>div>div]:flex-1">
        <Table hideHeader>
          <TableHeader>
            <TableColumn>key</TableColumn>
            <TableColumn>value</TableColumn>
          </TableHeader>

          <TableBody>
            {selectedHeaders.map((header) => {
              const rawValue = data[header.keyName];
              const displayValue = header.formatter
                ? header.formatter(rawValue)
                : rawValue;

              return (
                <TableRow key={header.keyName}>
                  <TableCell className="cell-header whitespace-pre-line">
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
      </CardBody>
    </Card>
  );
};

export const TableCard = ({
  title,
  icon,
  headers,
  keys,
  data,
}: {
  title: string;
  icon: IconProp;
  headers: DetailHeaderInterface[];
  keys: string[];
  data: any;
}) => {
  const selectedHeaders = headers
    .filter((h) => keys.includes(h.keyName))
    .filter((h) => h.isDisplay);

  return (
    <Card className="w-full">
      <CardHeader className="info-header">
        <div className="title">
          <FontAwesomeIcon className="mr-1" icon={icon} />
          {title}
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="overflow-visible">
        <Table
          classNames={{
            wrapper: "p-0 shadow-none",
            td: "border-b border-slate-100 border-r last:border-r-0 border-t",
            th: "border-r border-slate-200 last:border-r-0",
          }}
        >
          <TableHeader>
            {selectedHeaders.map((header) => (
              <TableColumn key={header.keyName} className="text-center">
                {header.name}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            <TableRow key="summary">
              {selectedHeaders.map((header) => {
                const rawValue = data[header.keyName];
                const displayValue = header.formatter
                  ? header.formatter(rawValue)
                  : rawValue;

                return (
                  <TableCell key={header.keyName} className="text-right">
                    <BlankColumn value={displayValue ?? ""} />
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
