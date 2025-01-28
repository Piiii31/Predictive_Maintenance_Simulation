"use client";
import React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@nextui-org/spinner";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface DriveData {
  capacity_bytes: number;
  dates: string;
  floor: number;
  model: string;
  serial_number: string;
  status: "Anomalous" | "Normal";
}

interface ModelFetchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelection: (year: string, quarter: string) => void;
  onDataFetched: (data: DriveData[]) => void;
  isUpload?: boolean;
}

interface LoggerEntry {
  timestamp: string;
  year: string;
  quarter: string;
  actionType: "upload" | "fetch";
}

export default function ModelFetch({ 
  isOpen, 
  onClose, 
  onSelection, 
  onDataFetched,
  isUpload = false
}: ModelFetchProps) {
  const [selectedYear, setSelectedYear] = React.useState(isUpload ? "9999" : "");
  const [selectedQuarter, setSelectedQuarter] = React.useState(isUpload ? "QX" : "");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);
  const hasLoadedSavedData = React.useRef(false);

  const loadingMessages = [
    "Crunching the numbers...",
    "Scanning drive health metrics...",
    "This might take a moment ☕",
    "Perfect time to grab a coffee!",
    "Analyzing storage patterns...",
    "Almost there..."
  ];

  const updateOperationLog = (action: "upload" | "fetch") => {
    const newEntry: LoggerEntry = {
      timestamp: new Date().toISOString(),
      year: selectedYear || "9999",
      quarter: selectedQuarter || "QX",
      actionType: action
    };

    const existingLogs: LoggerEntry[] = JSON.parse(localStorage.getItem('logger') || '[]');
    const updatedLogs = [newEntry, ...existingLogs].slice(0, 50); // Keep last 50 entries
    localStorage.setItem('logger', JSON.stringify(updatedLogs));
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "loading") {
      interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status]);

  React.useEffect(() => {
    if (!isOpen || hasLoadedSavedData.current || isUpload) return;
    
    const savedData = localStorage.getItem('driveData');
    if (savedData) {
      onDataFetched(JSON.parse(savedData));
      onClose();
      hasLoadedSavedData.current = true;
    }
  }, [isOpen, onDataFetched, onClose, isUpload]);

  const handleSubmit = async () => {
    try {
      setStatus("loading");
      const year = selectedYear || "9999";
      const quarter = selectedQuarter || "QX";
      
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year,
          quarter,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data: DriveData[] = await response.json();
      setStatus("success");
      
      // Update operation log
      updateOperationLog(isUpload ? "upload" : "fetch");
      
      // Store data and close modal
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSelection(year, quarter);
      onDataFetched(data);
      onClose();
      localStorage.setItem('driveData', JSON.stringify(data));
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus("error");
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Modal 
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      hideCloseButton
      isKeyboardDismissDisabled={status === "loading"}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {status === "success" ? (
              <CheckCircle2 className="text-success" size={20} />
            ) : status === "error" ? (
              <AlertCircle className="text-danger" size={20} />
            ) : null}
            {status === "loading" ? "Processing Data" : 
             isUpload ? "Upload Data" : "Select Time Period"}
          </div>
        </ModalHeader>
        <ModalBody>
          {status === "loading" ? (
            <div className="flex flex-col items-center justify-center h-32 gap-4">
              <Spinner 
                classNames={{ 
                  circle1: "border-b-white",
                  wrapper: "w-12 h-12"
                }} 
                color="primary" 
              />
              <p className="text-center text-foreground-500 italic">
                {loadingMessages[loadingMessageIndex]}
              </p>
            </div>
          ) : (
            <>
              <Select
                label="Year"
                className="mb-4"
                selectedKeys={[selectedYear]}
                isDisabled={isUpload || status !== "idle"}
                onSelectionChange={(keys) => setSelectedYear(Array.from(keys).join(""))}
              >
                {["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"].map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </Select>

              <Select
                label="Quarter"
                className="mb-4"
                selectedKeys={[selectedQuarter]}
                isDisabled={isUpload || status !== "idle"}
                onSelectionChange={(keys) => setSelectedQuarter(Array.from(keys).join(""))}
              >
                {["Q1", "Q2", "Q3", "Q4"].map(quarter => (
                  <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                ))}
              </Select>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            color={
              status === "success" ? "success" : 
              status === "error" ? "danger" : "primary"
            }
            onPress={handleSubmit}
            fullWidth
            isDisabled={status === "loading"}
            startContent={
              status === "loading" ? (
                <Spinner 
                  classNames={{ circle1: "border-b-white" }} 
                  color="current" 
                  size="sm" 
                />
              ) : status === "success" ? (
                <CheckCircle2 size={18} />
              ) : status === "error" ? (
                <AlertCircle size={18} />
              ) : null
            }
          >
            {status === "loading" ? (
              "Processing..."
            ) : status === "success" ? (
              "Success!"
            ) : status === "error" ? (
              "Error - Try Again"
            ) : isUpload ? (
              "Upload"
            ) : (
              "Submit"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}