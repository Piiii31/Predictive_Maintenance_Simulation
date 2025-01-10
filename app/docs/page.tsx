"use client";

import React, { useState, useMemo } from "react";
import { HardDrive, Search, Info } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Input } from "@nextui-org/input";

interface DriveData {
  id: string;
  serial_number: string;
  model: string;
  capacity_bytes: number;
  failure: boolean;
  datacenter: string;
  cluster_id: string;
  vault_id: string;
  pod_id: string;
  pod_slot_num: number;
  is_legacy_format: boolean;
  date: string;
  floor?: string; // Make floor optional
}

const CompactDriveView = () => {
  const numberOfFloors = 4; // Set the number of floors here
  const minDrivesPerFloor = 1; // Minimum drives on any floor
  const maxDrivesPerFloor = 5; // Maximum drives on any floor

  // Generate initial floors only once
  const generateFloors = () =>
    Array.from({ length: numberOfFloors }, (_, floorIndex) => ({
      name: `Floor ${floorIndex + 1}`,
      drives: Array.from(
        {
          length: Math.floor(
            Math.random() * (maxDrivesPerFloor - minDrivesPerFloor + 1) +
              minDrivesPerFloor
          ),
        },
        (_, driveIndex) => ({
          id: `Drive-${floorIndex + 1}-${driveIndex + 1}`,
          serial_number: `SN-${floorIndex + 1}-${driveIndex + 1}`,
          model: `Model-${floorIndex + 1}`,
          capacity_bytes: 12000138625024,
          failure: Math.random() < 0.5, // Random failure status
          datacenter: `DC-${floorIndex + 1}`,
          cluster_id: `CLU-${floorIndex + 1}`,
          vault_id: `V-${floorIndex + 1}`,
          pod_id: `P-${floorIndex + 1}-${driveIndex + 1}`,
          pod_slot_num: driveIndex + 1,
          is_legacy_format: Math.random() > 0.5,
          date: "2024-01-06",
        })
      ),
    }));

  const [floors, setFloors] = useState(generateFloors); // Store floors in state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrive, setSelectedDrive] = useState<DriveData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const filteredFloors = useMemo(() => {
    return floors.map((floor) => ({
      ...floor,
      drives: floor.drives.filter((drive) =>
        drive.cluster_id.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder="Search by Cluster ID..."
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
                {floor.drives.map((drive) => (
                  <Card
                    key={drive.id}
                    className="hover:shadow-lg transition-shadow rounded-lg"
                  >
                    <div className="p-6 text-center">
                      <div className="relative mb-4">
                        <HardDrive
                          className={`w-12 h-12 mx-auto ${
                            drive.failure ? "text-danger" : "text-primary"
                          }`}
                        />
                        {drive.failure && (
                          <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            !
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate mb-2">
                        {drive.cluster_id}
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
                  className={selectedDrive.failure ? "text-danger" : "text-primary"}
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
                    <p className="text-sm text-default-500">Cluster ID</p>
                    <p className="font-medium">{selectedDrive.cluster_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Installation Date</p>
                    <p className="font-medium">{formatDate(selectedDrive.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Failure Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedDrive.failure
                          ? "bg-danger-100 text-danger-700"
                          : "bg-success-100 text-success-700"
                      }`}
                    >
                      {selectedDrive.failure ? "Failed" : "Healthy"}
                    </span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() => setIsModalOpen(false)}
                >
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