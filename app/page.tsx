"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import { Server, HardDrive, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";

import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useTheme } from "next-themes";
import { useStore } from "@/lib/zustand";
import { Select, SelectItem } from "@heroui/select";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DriveData {
  floor: number;
  model: string;
  serial_number: string;
  capacity_bytes: number;
  dates: string;
  status: "Normal" | "Anomalous";
}

export default function Home() {
  const { theme } = useTheme();
  const { 
    selectedPeriod,
    setSelectedPeriod,
    apiResponse,
    setApiResponse,
    hasLoadedSavedData,
    setHasLoadedSavedData,
    loading,
    setLoading
  } = useStore();

  // Theme-aware colors
  const themeColors = useMemo(() => ({
    primary: theme === 'dark' ? '#006FEE' : '#0070F3',
    danger: theme === 'dark' ? '#F31260' : '#FF1A75',
    background: theme === 'dark' ? '#18181b' : '#ffffff'
  }), [theme]);

  // Data loading with error handling
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const storedData = localStorage.getItem("driveData");
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (!Array.isArray(parsedData)) throw new Error('Invalid data format');
        setApiResponse(parsedData);
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
      localStorage.removeItem("driveData");
    } finally {
      setHasLoadedSavedData(true);
      setLoading(false);
    }
  }, [setApiResponse, setHasLoadedSavedData, setLoading]);

  // Initial load and auto-refresh
  useEffect(() => {
    if (!hasLoadedSavedData) loadInitialData();
    
    const interval = setInterval(loadInitialData, 300000);
    return () => clearInterval(interval);
  }, [hasLoadedSavedData, loadInitialData]);

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    if (!selectedPeriod) return apiResponse;
    
    const [year, quarter] = selectedPeriod.split(' - Q');
    return apiResponse.filter((item: DriveData) => {
      const date = new Date(item.dates);
      return (
        date.getFullYear() === parseInt(year) &&
        Math.floor(date.getMonth() / 3) + 1 === parseInt(quarter)
      );
    });
  }, [apiResponse, selectedPeriod]);

  // Process data for visualizations
  const { statusData, healthData, summary } = useMemo(() => {
    const floors = Array.from(new Set(filteredData.map(item => item.floor))).sort((a, b) => a - b);
    const normal = filteredData.filter(item => item.status === "Normal").length;
    const anomalous = filteredData.filter(item => item.status === "Anomalous").length;
    const total = filteredData.length;

    // Model distribution
    const modelCounts = filteredData.reduce((acc: Record<string, number>, item) => {
      acc[item.model] = (acc[item.model] || 0) + 1;
      return acc;
    }, {});
    const topModels = Object.entries(modelCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      statusData: {
        labels: floors.map(floor => `Floor ${floor}`),
        datasets: [
          {
            label: 'Normal Drives',
            data: floors.map(floor => 
              filteredData.filter(item => 
                item.floor === floor && item.status === "Normal"
              ).length
            ),
            backgroundColor: `${themeColors.primary}40`,
            borderColor: themeColors.primary,
            borderWidth: 1,
          },
          {
            label: 'Anomalous Drives',
            data: floors.map(floor => 
              filteredData.filter(item => 
                item.floor === floor && item.status === "Anomalous"
              ).length
            ),
            backgroundColor: `${themeColors.danger}40`,
            borderColor: themeColors.danger,
            borderWidth: 1,
          },
        ],
      },
      healthData: {
        labels: ["Normal", "Anomalous"],
        datasets: [{
          data: [normal, anomalous],
          backgroundColor: [`${themeColors.primary}40`, `${themeColors.danger}40`],
          borderColor: [themeColors.primary, themeColors.danger],
          borderWidth: 1,
        }],
      },
      summary: {
        total,
        normal,
        anomalous,
        topModels,
        anomalyRate: total > 0 ? (anomalous / total * 100) : 0
      }
    };
  }, [filteredData, themeColors]);

  // Generate period options for select
  const periodOptions = useMemo(() => {
    const options = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2020; year--) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        options.push(`${year} - Q${quarter}`);
      }
    }
    return options;
  }, []);

  // Formatting helpers
  const formatCapacity = useCallback((bytes: number): string => {
    return `${(bytes / 10**12).toFixed(1)} TB`;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Loading Drive Data..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Drive Health Monitor</h1>
        <div className="flex gap-4 items-center mb-20">
          
          <Button 
            color="primary" 
            variant="ghost" 
            startContent={<RefreshCw size={18} />}
            onPress={loadInitialData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <section className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-8 space-y-6">
          {/* Health Charts */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4">
              <CardHeader className="pb-2">
                <h3 className="font-semibold">Drive Health by Floor</h3>
              </CardHeader>
              <CardBody className="h-64">
                <Bar
                  data={statusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: { stacked: true },
                      y: { beginAtZero: true }
                    }
                  }}
                />
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="pb-2">
                <h3 className="font-semibold">Health Distribution</h3>
              </CardHeader>
              <CardBody className="h-64">
                <Doughnut
                  data={healthData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </div>

          {/* Anomalous Drives Table */}
          <Card className="p-4">
            <CardHeader className="pb-2">
              <h3 className="font-semibold">Action Required</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table aria-label="Anomalous Drives">
                <TableHeader>
                  <TableColumn>Floor</TableColumn>
                  <TableColumn>Model</TableColumn>
                  <TableColumn>Serial</TableColumn>
                  <TableColumn>Capacity</TableColumn>
                  <TableColumn>Last Check</TableColumn>
                  <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredData
                    .filter(item => item.status === 'Anomalous')
                    .map(item => (
                      <TableRow key={item.serial_number}>
                        <TableCell>{item.floor}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell className="font-mono">{item.serial_number}</TableCell>
                        <TableCell>{formatCapacity(item.capacity_bytes)}</TableCell>
                        <TableCell>{new Date(item.dates).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button size="sm" color="danger" variant="flat">
                            Replace
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-6">
          {/* Model Distribution */}
          <Card className="p-4">
            <CardHeader className="pb-2">
              <h3 className="font-semibold">Top Drive Models</h3>
            </CardHeader>
            <Divider />
            <CardBody className="h-48">
              <Bar
                data={{
                  labels: summary.topModels.map(([model]) => model),
                  datasets: [{
                    label: 'Count',
                    data: summary.topModels.map(([,count]) => count),
                    backgroundColor: themeColors.primary,
                    borderColor: themeColors.primary,
                    borderWidth: 1
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { beginAtZero: true },
                    y: { ticks: { autoSkip: false } }
                  }
                }}
              />
            </CardBody>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-content1">
              <div className="space-y-1">
                <p className="text-sm text-foreground-500">Total Drives</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
            </Card>
            <Card className="p-4 bg-danger-50/35">
              <div className="space-y-1">
                <p className="text-sm text-foreground-600">Anomaly Rate</p>
                <p className="text-2xl font-bold text-danger">
                  {summary.anomalyRate.toFixed(1)}%
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}