'use client'


import React, { useState, useMemo, useEffect } from "react";
import { HardDrive, Search, Info } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Input } from "@nextui-org/input";

interface DriveData {
  serial_number: string;
  model: string;
  capacity_bytes: number;
  dates: string;
  status: string;
  floor?: number;
}

const CompactDriveView = () => {
  const [loading, setLoading] = useState(false);
  const [drives, setDrives] = useState<DriveData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrive, setSelectedDrive] = useState<DriveData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('driveData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setDrives(parsedData);
    }
  }, []);

  // Group drives by floor
  const floors = useMemo(() => {
    const groupedDrives = drives.reduce((acc, drive) => {
      const floor = drive.floor || 1; // Default to floor 1 if no floor is specified
      if (!acc[floor]) {
        acc[floor] = [];
      }
      acc[floor].push(drive);
      return acc;
    }, {} as Record<number, DriveData[]>);

    return Object.entries(groupedDrives).map(([floor, drives]) => ({
      name: `Floor ${floor}`,
      id: `floor${floor}`,
      drives,
    }));
  }, [drives]);

  // Filter drives based on search query
  const filteredFloors = useMemo(() => {
    return floors.map((floor) => ({
      ...floor,
      drives: floor.drives.filter((drive) =>
        drive.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }));
  }, [floors, searchQuery]);

  const formatCapacity = (bytes: number): string => {
    const terabytes = bytes / 1099511627776;
    return `${terabytes.toFixed(2)} TB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full mx-auto px-4">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-semibold">Drive Overview</h1>
        <Input
          className="max-w-xs"
          placeholder="Search by Serial Number..."
          value={searchQuery}
          startContent={<Search className="text-default-400 w-4 h-4" />}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Divider className="my-6" />

      <Tabs selectedIndex={activeTab} onChange={setActiveTab}>
        {filteredFloors.map((floor, index) => (
          <Tab key={index} title={floor.name}>
            <div className="p-4">
              <h2 className="text-xl font-medium mb-4">{floor.name} Drives</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {floor.drives.map((drive, driveIndex) => (
                  <Card
                    key={`${floor.id}-${driveIndex}`}
                    className="hover:shadow-lg transition-shadow rounded-lg"
                  >
                    <div className="p-6 text-center">
                      <div className="relative mb-4">
                        <HardDrive
                          className={`w-12 h-12 mx-auto ${
                            drive.status === 'Anomalous' ? "text-danger" : "text-primary"
                          }`}
                        />
                        {drive.status === 'Anomalous' && (
                          <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            !
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate mb-2">
                        {drive.serial_number}
                      </p>
                      <Button
                        color="primary"
                        variant="bordered"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedDrive(drive);
                          setIsModalOpen(true);
                        }}
                      >
                        <Info className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="2xl">
        <ModalContent>
          {selectedDrive && (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <HardDrive
                  className={selectedDrive.status === 'Anomalous' ? "text-danger" : "text-primary"}
                />
                Drive Details
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-500">Serial Number</p>
                    <p className="font-medium">{selectedDrive.serial_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Model</p>
                    <p className="font-medium">{selectedDrive.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Capacity</p>
                    <p className="font-medium">
                      {formatCapacity(selectedDrive.capacity_bytes)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Dates</p>
                    <p className="font-medium">{selectedDrive.dates}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedDrive.status === 'Anomalous'
                          ? "bg-danger-100 text-danger-700"
                          : "bg-success-100 text-success-700"
                      }`}
                    >
                      {selectedDrive.status}
                    </span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CompactDriveView;