"use client";
import React from "react";
import { Server, HardDrive, AlertCircle, BarChart2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Floor } from "@/types";
import { floorData } from "@/config/data";
import FloorOverview from "@/components/FloorOverview";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);





// Define props for the FloorOverview component


export default function Home() {
  const hardDriveStatusData = {
    labels: floorData.map((floor) => `Floor ${floor.floor}`),
    datasets: [
      {
        label: 'Good Drives',
        data: floorData.map((floor) => {
          return floor.clusters.reduce(
            (acc, cluster) =>
              acc + cluster.vaults.reduce((sum, vault) => sum + vault.drives.good, 0),
            0
          );
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Dead Drives',
        data: floorData.map((floor) => {
          return floor.clusters.reduce(
            (acc, cluster) =>
              acc + cluster.vaults.reduce((sum, vault) => sum + vault.drives.dead, 0),
            0
          );
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const datacenterHealthData = {
    labels: ["Good Drives", "Dead Drives"],
    datasets: [
      {
        label: "Datacenter Health",
        data: [
          floorData.reduce(
            (acc, floor) =>
              acc +
              floor.clusters.reduce((sum, cluster) =>
                sum + cluster.vaults.reduce((vaultSum, vault) => vaultSum + vault.drives.good, 0), 0),
            0
          ),
          floorData.reduce(
            (acc, floor) =>
              acc +
              floor.clusters.reduce((sum, cluster) =>
                sum + cluster.vaults.reduce((vaultSum, vault) => vaultSum + vault.drives.dead, 0), 0),
            0
          ),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const recentAlerts = [
    {
      key: "1",
      floor: 1,
      cluster: "Cluster A",
      hardDrive: "Drive 1",
      severity: "Critical",
      message: "High temperature detected",
    },
    {
      key: "2",
      floor: 2,
      cluster: "Cluster C",
      hardDrive: "Drive 3",
      severity: "Warning",
      message: "Read errors increasing",
    },
  ];

  const predictiveInsights = [
    {
      key: "1",
      floor: 1,
      cluster: "Cluster A",
      hardDrive: "Drive 2",
      failureProbability: "45%",
      recommendedAction: "Monitor",
    },
    {
      key: "2",
      floor: 2,
      cluster: "Cluster D",
      hardDrive: "Drive 5",
      failureProbability: "70%",
      recommendedAction: "Replace",
    },
  ];

  return (
    <section className="grid grid-cols-12 gap-4">
      {/* Left Column */}
      <div className="col-span-8 space-y-4 flex-row">
        <div className="flex space-x-4">
        <Card className="bg-default-100 w-full max-w-sm">
          <CardHeader className="flex items-center gap-2">
            <HardDrive size={20} />
            <h2 className="text-lg font-semibold">Hard Drive Health Summary</h2>
          </CardHeader>
          <Divider />
          <CardBody className="h-[200px] ">
            <Bar
              data={hardDriveStatusData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardBody>
        </Card>

        <Card className="bg-default-100 w-full max-w-sm">
          <CardHeader className="flex items-center gap-2">
            <Server size={20} />
            <h2 className="text-lg font-semibold">Datacenter Health Summary</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <Pie data={datacenterHealthData} />
          </CardBody>
        </Card>
        </div>

        <Card className="bg-default-100">
          <CardHeader className="flex items-center gap-2">
            <AlertCircle size={20} />
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Recent Alerts">
              <TableHeader>
                <TableColumn>Floor</TableColumn>
                <TableColumn>Cluster</TableColumn>
                <TableColumn>Hard Drive</TableColumn>
                <TableColumn>Severity</TableColumn>
                <TableColumn>Message</TableColumn>
              </TableHeader>
              <TableBody items={recentAlerts}>
                {(alert) => (
                  <TableRow key={alert.key}>
                    <TableCell>{alert.floor}</TableCell>
                    <TableCell>{alert.cluster}</TableCell>
                    <TableCell>{alert.hardDrive}</TableCell>
                    <TableCell>
                      <Chip variant="flat" color={alert.severity === "Critical" ? "danger" : "warning"}>
                        {alert.severity}
                      </Chip>
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Card className="bg-default-100">
          <CardHeader className="flex items-center gap-2">
            <BarChart2 size={20} />
            <h2 className="text-lg font-semibold">Predictive Insights</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Predictive Insights">
              <TableHeader>
                <TableColumn>Floor</TableColumn>
                <TableColumn>Cluster</TableColumn>
                <TableColumn>Hard Drive</TableColumn>
                <TableColumn>Failure Probability</TableColumn>
                <TableColumn>Recommended Action</TableColumn>
              </TableHeader>
              <TableBody items={predictiveInsights}>
                {(insight) => (
                  <TableRow key={insight.key}>
                    <TableCell>{insight.floor}</TableCell>
                    <TableCell>{insight.cluster}</TableCell>
                    <TableCell>{insight.hardDrive}</TableCell>
                    <TableCell>
                    <Chip variant="flat" color={insight.failureProbability === "Critical" ? "danger" : "warning"}>
                      {insight.failureProbability}
                    </Chip>
                      </TableCell>
                    <TableCell>{insight.recommendedAction}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Right Column */}
      <div className="col-span-4 space-y-4">
  {floorData.map((floor, index) => (
    <FloorOverview key={index} floor={floor} />
  ))}
</div>
    </section>
  );
}
