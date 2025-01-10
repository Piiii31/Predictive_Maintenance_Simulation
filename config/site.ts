import { Home, FolderKanban, CheckSquare, Users, BarChart2, Gift, DollarSign, Settings ,LayoutDashboard} from 'lucide-react';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard, // Add icon
    },
    {
      label: "Management",
      href: "/docs",
      icon: FolderKanban, // Add icon
    },
    {
      label: "Pricing",
      href: "/pricing",
      icon: DollarSign, // Add icon
    },
    {
      label: "Blog",
      href: "/blog",
      icon: BarChart2, // Add icon
    },
    {
      label: "About",
      href: "/about",
      icon: Users, // Add icon
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