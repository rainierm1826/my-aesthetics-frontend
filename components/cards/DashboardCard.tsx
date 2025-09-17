import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartArea, Info } from "lucide-react";

const DashboardCard = ({title, content }:{title:string, content:string|number}) => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef] border-none">
      <CardHeader className="w-full">
        <CardTitle className="flex gap-2 whitespace-nowrap items-center text-sm font-normal ">
          <span>
            <ChartArea className="w-4 h-4" />
          </span>
          {title}
          <div className="flex justify-end w-full">
            <Info className="w-4 h-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <p className="text-2xl font-bold text-center">{content}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
