import {
  Home,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart2,
  Gift,
  DollarSign,
  Settings,
  User,
  LayoutDashboard,
} from 'lucide-react';

// Define the type for navigation items
interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType; // Ensure icons are React components
}

interface SiteConfig {
  name: string;
  description: string;
  navItems: NavItem[];
  navMenuItems: NavItem[];
  links: {
    github: string;
    twitter: string;
    docs: string;
    discord: string;
    sponsor: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Management",
      href: "/authenticated/docs",
      icon: FolderKanban,
    },
    
    {
      label: "Logger",
      href: "/authenticated/Mouchard",
      icon: BarChart2,
    },
    {
      label: "About",
      href: "/authenticated/About",
      icon: User,
    },
   
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
