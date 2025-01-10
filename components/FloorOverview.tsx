import { Floor } from "@/types";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Bar } from "react-chartjs-2";

interface FloorOverviewProps {
  floor: Floor;
}

const FloorOverview: React.FC<FloorOverviewProps> = ({ floor }) => {
  const driveStatus = floor.clusters.reduce(
    (acc, cluster) => {
      cluster.vaults.forEach((vault) => {
        acc.good += vault.drives.good;
        acc.warning += vault.drives.warning;
        acc.critical += vault.drives.critical;
        acc.dead += vault.drives.dead;
      });
      return acc;
    },
    { good: 0, warning: 0, critical: 0, dead: 0 }
  );

  const barChartData = {
    labels: ["Good", "Warning", "Critical", "Dead"],
    datasets: [
      {
        label: 'Drive Status',
        data: [driveStatus.good, driveStatus.warning, driveStatus.critical, driveStatus.dead],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)', 
          'rgba(255, 206, 86, 0.2)', 
          'rgba(255, 99, 132, 0.2)', 
          'rgba(153, 102, 255, 0.2)', 
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="bg-default-100">
      <CardHeader className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Floor {floor.floor}</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <h3 className="text-md font-semibold">Drive Status Overview</h3>
        <div className="mt-4">
          <Bar
            data={barChartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};


export default  FloorOverview