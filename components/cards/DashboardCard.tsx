import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartArea } from "lucide-react";
import InfoTooltip from "../InfoTooltip";

const DashboardCard = ({title, content, info }:{title:string, content:string|number, info:string}) => {
  return (
    <Card className="flex-1 bg-gradient-to-br from-white to-[#fffcef] border-none">
      <CardHeader className="w-full">
        <CardTitle className="flex gap-2 whitespace-nowrap items-center text-sm font-normal ">
          <span>
            <ChartArea className="w-4 h-4" />
          </span>
          {title}
          <div className="flex justify-end w-full">
            <InfoTooltip content={info}/>
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
