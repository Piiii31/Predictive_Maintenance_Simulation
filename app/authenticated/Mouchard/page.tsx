'use client';
import React from "react";
import { Database } from "lucide-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";

interface LoggerEntry {
  timestamp: string;
  year: string;
  quarter: string;
  actionType: "upload" | "fetch";
}

const OperationLogger = () => {
  const [operations, setOperations] = React.useState<LoggerEntry[]>([]);

  React.useEffect(() => {
    const loadOperations = () => {
      const savedLogs = localStorage.getItem('logger');
      if (savedLogs) {
        try {
          const parsedLogs: LoggerEntry[] = JSON.parse(savedLogs);
          setOperations(parsedLogs);
        } catch (error) {
          console.error("Error parsing operation logs:", error);
        }
      }
    };

    // Load initial logs
    loadOperations();

    // Add storage listener for cross-tab updates
    const storageListener = (e: StorageEvent) => {
      if (e.key === 'logger') {
        loadOperations();
      }
    };

    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="p-4">
      <Card className="bg-default-100">
        <CardHeader className="flex items-center gap-2">
          <Database size={20} />
          <h2 className="text-lg font-semibold">Operation History</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table 
            aria-label="Operation Logger" 
            className="max-h-[500px] overflow-y-auto"
            removeWrapper
          >
            <TableHeader>
              <TableColumn>TIMESTAMP</TableColumn>
              <TableColumn>YEAR</TableColumn>
              <TableColumn>QUARTER</TableColumn>
              <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No operations recorded yet"}>
              {operations.map((operation) => (
                <TableRow key={`${operation.timestamp}-${operation.actionType}`}>
                  <TableCell className="font-mono text-sm">
                    {formatDate(operation.timestamp)}
                  </TableCell>
                  <TableCell>{operation.year}</TableCell>
                  <TableCell>{operation.quarter}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={operation.actionType === "upload" ? "primary" : "success"}
                      className="uppercase"
                    >
                      {operation.actionType}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </section>
  );
};

export default OperationLogger;