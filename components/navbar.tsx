'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";

import NextLink from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react"; // Import useEffect
import { Home, FolderKanban, CheckSquare, Users, BarChart2, Gift, DollarSign, Settings, Link,Upload } from 'lucide-react';
import ModelFetch from "@/components/ModelFetch";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {  Logo } from "@/components/icons";
import { Button } from "@nextui-org/button";

export const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [modalPurpose, setModalPurpose] = useState<"search" | "upload">("search");

  // Load selected period from localStorage on component mount
  useEffect(() => {
    const savedPeriod = localStorage.getItem("selectedPeriod");
    if (savedPeriod) {
      setSelectedPeriod(savedPeriod);
    }
  }, []);

  const handleOpenModal = (purpose: "search" | "upload") => {
    setModalPurpose(purpose);
    setIsModalOpen(true);
  };

  const handleSelection = (year: string, quarter: string) => {
    const period = `${year} - ${quarter}`;
    setSelectedPeriod(period);
    // Save selected period to localStorage
    localStorage.setItem("selectedPeriod", period);
  };

  const handleDataFetched = (data: any) => {
    // Handle the fetched data here
    console.log("Fetched data:", data);
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="h-screen w-80 p-4 border-r border-default-200">
      <div className="flex flex-col w-full gap-10 space-y-10">
        <NavbarContent className="w-full" justify="center">
          <NavbarBrand className="gap-3">
            <NextLink className="flex justify-start items-center gap-2" href="/">
              <Logo />
              <p className="font-bold text-inherit text-lg">DT MANAGEMENT</p>
            </NextLink>
          </NavbarBrand>
          <ThemeSwitch />
        </NavbarContent>

        <NavbarContent className="w-full">
                <NavbarItem className="w-full">
                  {/* Display the selected period */}
                  <div 
        className="text-sm text-center text-default-500 cursor-pointer bg-default-100 p-2 rounded-lg hover:bg-default-200 transition-colors duration-200"
        
      >
        {selectedPeriod || "Select Period"}
      </div>

            <ModelFetch 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSelection={handleSelection}
              onDataFetched={(data) => {
                if (modalPurpose === "upload") {
                  // Handle upload-specific logic
                  console.log("Upload data:", data);
                }
                handleDataFetched(data);
              }}
              isUpload={modalPurpose === "upload"}
            />
          </NavbarItem>
        </NavbarContent>

        <div className="w-full h-px bg-default-200" />

        <NavbarContent className="w-full mt-10 flex-1">
          <ul className="flex flex-col gap-2 w-full">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href} className="w-full">
                <NextLink
                  className={clsx(
                    "text-default-600",
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                    "flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-default-100"
                  )}
                  href={item.href}
                >
                  <item.icon size={20} />
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <div className="w-full h-px bg-default-200" />

        <NavbarContent className="w-full flex-col gap-4 mt-10">
          <NavbarItem className="w-full">
            <Button
              className="w-full text-sm font-normal text-default-600 bg-default-100"
              startContent={<Upload  />}
              variant="flat"
              onPress={() => setIsModalOpen(true)}
            >
              Upload
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden w-full" justify="end">
          <NavbarMenuToggle />
        </NavbarContent>
      </div>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? "primary" : index === siteConfig.navMenuItems.length - 1 ? "danger" : "foreground"}
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default Sidebar;