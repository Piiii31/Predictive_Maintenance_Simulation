import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Define types for the data structure
 type DriveStatus = {
  good: number;
  warning: number;
  critical: number;
  dead: number;
};

type Vault = {
  name: string;
  drives: DriveStatus;
};

type Cluster = {
  name: string;
  vaults: Vault[];
};

export type Floor = {
  floor: number;
  clusters: Cluster[];
};