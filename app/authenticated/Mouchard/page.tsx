'use client'
import React from "react";
import { Database } from "lucide-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";

const issues = [
  { date: "2025-01-14 09:30", floor: 1, cluster: "A1", driveId: "D123", status: "Failed" },
  { date: "2025-01-14 10:00", floor: 2, cluster: "B2", driveId: "D456", status: "Recovered" },
  { date: "2025-01-14 10:45", floor: 3, cluster: "C3", driveId: "D789", status: "Under Maintenance" },
  { date: "2025-01-14 11:15", floor: 4, cluster: "D4", driveId: "D012", status: "Failed" },
  { date: "2025-01-14 11:45", floor: 5, cluster: "E5", driveId: "D345", status: "Recovered" },
  { date: "2025-01-14 12:00", floor: 1, cluster: "A2", driveId: "D678", status: "Failed" },
  { date: "2025-01-14 12:30", floor: 2, cluster: "B1", driveId: "D890", status: "Under Maintenance" },
  { date: "2025-01-14 13:00", floor: 3, cluster: "C2", driveId: "D234", status: "Recovered" },
  { date: "2025-01-14 13:30", floor: 4, cluster: "D3", driveId: "D567", status: "Failed" },
  { date: "2025-01-14 14:00", floor: 5, cluster: "E4", driveId: "D890", status: "Under Maintenance" },
  { date: "2025-01-14 14:30", floor: 1, cluster: "A3", driveId: "D345", status: "Failed" },
  { date: "2025-01-14 15:00", floor: 2, cluster: "B3", driveId: "D678", status: "Recovered" },
  { date: "2025-01-14 15:30", floor: 3, cluster: "C1", driveId: "D901", status: "Under Maintenance" },
  { date: "2025-01-14 16:00", floor: 4, cluster: "D2", driveId: "D123", status: "Failed" },
  { date: "2025-01-14 16:30", floor: 5, cluster: "E1", driveId: "D456", status: "Recovered" },
];

const DataCenterIssues = () => {
  return (
    <section className="p-4">
      <Card className="bg-default-100">
        <CardHeader className="flex items-center gap-2">
          <Database size={20} />
          <h2 className="text-lg font-semibold">Data Center Issues</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Data Center Issues">
            <TableHeader>
              <TableColumn>Date</TableColumn>
              <TableColumn>Floor</TableColumn>
              <TableColumn>Cluster</TableColumn>
              <TableColumn>Drive ID</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody items={issues}>
              {(issue) => (
                <TableRow key={`${issue.date}-${issue.driveId}`}>
                  <TableCell>{issue.date}</TableCell>
                  <TableCell>{issue.floor}</TableCell>
                  <TableCell>{issue.cluster}</TableCell>
                  <TableCell>{issue.driveId}</TableCell>
                  <TableCell>
                    <Chip
                      variant="flat"
                      color={
                        issue.status === "Failed"
                          ? "danger"
                          : issue.status === "Recovered"
                          ? "success"
                          : "warning"
                      }
                    >
                      {issue.status}
                    </Chip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </section>
  );
};

export default DataCenterIssues;
