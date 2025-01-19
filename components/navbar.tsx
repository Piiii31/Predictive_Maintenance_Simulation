'use client'
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Home, FolderKanban, CheckSquare, Users, BarChart2, Gift, DollarSign, Settings, LogOut } from 'lucide-react';

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";


export const Sidebar = () => {
  const { user } = useAuth();
  const userString = user?.email || '';
  const router = useRouter();
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="h-screen w-80 p-4 border-r border-default-200">
      <div className="flex flex-col w-full gap-10">
        {/* Top Section with Logo and Theme Switch */}
        <NavbarContent className="w-full" justify="center">
          <NavbarBrand className="gap-3">
            <NextLink className="flex justify-start items-center gap-2" href="/">
              <Logo />
              <p className="font-bold text-inherit text-lg">DT MANAGEMENT</p>
              
            </NextLink>
          </NavbarBrand>
          <ThemeSwitch />
        </NavbarContent>

        {/* Search Input */}
        <NavbarContent className="w-full">
          <NavbarItem className="w-full">
            {searchInput}
          </NavbarItem>
        </NavbarContent>

        {/* Separator */}
        <div className="w-full h-px bg-default-200" />

        {/* Navigation Items */}
        <NavbarContent className="w-full mt-10 flex-1">
          <ul className="flex flex-col gap-2 w-full">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href} className="w-full">
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                    "flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-default-100"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  <item.icon size={20} />
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        {/* Separator */}
        <div className="w-full h-px bg-default-200" />

        {/* Bottom Section with Social Links and Sponsor */}
        <NavbarContent className="w-full flex-col gap-4 mt-10">
          {/* Social Links */}
         

          {/* Sponsor Button */}
          <NavbarItem className="w-full">
            <Button
              isExternal
              as={Link}
              className="w-full text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.sponsor}
              startContent={<HeartFilledIcon className="text-danger" />}
              variant="flat"
            >
              Sponsor
            </Button>
          </NavbarItem>
          {/* Sign Out Button */}
          <NavbarItem className="w-full">
  <Button
    className="w-full text-sm font-normal text-default-600 bg-default-100"
    onClick={handleLogout}
    startContent={<LogOut className="text-default-500" size={18} />}
    variant="flat"
  >
    {user && ` ${userString.split('@')[0]}`}
  </Button>
</NavbarItem>

        </NavbarContent>

        {/* Mobile Menu Toggle */}
        <NavbarContent className="sm:hidden w-full" justify="end">
          <NavbarMenuToggle />
        </NavbarContent>
      </div>

      {/* Mobile Menu */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
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