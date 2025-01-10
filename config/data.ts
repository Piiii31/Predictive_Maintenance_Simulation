import { Floor } from "@/types";

// Mock data for each floor
export const floorData: Floor[] = [
    {
      floor: 1,
      clusters: [
        {
          name: "Cluster A",
          vaults: [
            { name: "Vault 1", drives: { good: 90, warning: 5, critical: 3, dead: 2 } },
            { name: "Vault 2", drives: { good: 85, warning: 10, critical: 3, dead: 2 } },
          ],
        },
        {
          name: "Cluster B",
          vaults: [
            { name: "Vault 3", drives: { good: 80, warning: 10, critical: 5, dead: 5 } },
            { name: "Vault 4", drives: { good: 70, warning: 15, critical: 10, dead: 5 } },
          ],
        },
      ],
    },
    {
      floor: 2,
      clusters: [
        {
          name: "Cluster C",
          vaults: [
            { name: "Vault 5", drives: { good: 95, warning: 3, critical: 1, dead: 1 } },
            { name: "Vault 6", drives: { good: 80, warning: 10, critical: 5, dead: 5 } },
          ],
        },
        {
          name: "Cluster D",
          vaults: [
            { name: "Vault 7", drives: { good: 85, warning: 10, critical: 3, dead: 2 } },
            { name: "Vault 8", drives: { good: 75, warning: 15, critical: 5, dead: 5 } },
          ],
        },
      ],
    },
    {
      floor: 3,
      clusters: [
        {
          name: "Cluster C",
          vaults: [
            { name: "Vault 5", drives: { good: 95, warning: 3, critical: 1, dead: 1 } },
            { name: "Vault 6", drives: { good: 80, warning: 10, critical: 5, dead: 5 } },
          ],
        },
        {
          name: "Cluster D",
          vaults: [
            { name: "Vault 7", drives: { good: 85, warning: 10, critical: 3, dead: 2 } },
            { name: "Vault 8", drives: { good: 75, warning: 15, critical: 5, dead: 5 } },
          ],
        },
      ],
    },
  ];