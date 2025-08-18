import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartArea, Info } from "lucide-react";

const DashboardCard = ({}) => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef] border-none">
      <CardHeader className="w-full">
        <CardTitle className="flex gap-2 whitespace-nowrap items-center text-sm font-normal ">
          <span>
            <ChartArea className="w-4 h-4" />
          </span>
          Card Title
          <div className="flex justify-end w-full">
            <Info className="w-4 h-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">Card Content</p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
