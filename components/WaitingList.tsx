import { Clock } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";
import DropDownBranch from "./selects/DropDownBranch";

const waitingList = [
  {
    id: 1,
    name: "Alice Brown",
    service: "Facial Treatment",
    time: "2:00 PM",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Bob Smith",
    service: "Body Massage",
    time: "2:30 PM",
    status: "Waiting",
  },
  {
    id: 3,
    name: "Carol White",
    service: "Manicure & Pedicure",
    time: "3:00 PM",
    status: "Waiting",
  },
  {
    id: 4,
    name: "Dan Wilson",
    service: "Hair Styling",
    time: "3:30 PM",
    status: "Waiting",
  },
  {
    id: 5,
    name: "Eva Garcia",
    service: "Facial Treatment",
    time: "4:00 PM",
    status: "Waiting",
  },
  {
    id: 6,
    name: "Frank Lee",
    service: "Spa Package",
    time: "4:30 PM",
    status: "Waiting",
  },
  {
    id: 7,
    name: "Grace Taylor",
    service: "Waxing Service",
    time: "5:00 PM",
    status: "Waiting",
  },
];

const WaitingList = () => {
  return (
    <div
      className="bg-white shadow-sm p-6 border-t md:border-l border-gray-200 
                 md:h-screen md:overflow-y-auto md:[direction:rtl]"
    >
      <div className="md:[direction:ltr]">
        <div className="flex flex-col gap-2 mb-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            <span className="truncate">Waiting List</span>
          </h2>
          <DropDownBranch useUrlParams={true} includeAllOption={true} />
        </div>

        <div className="space-y-3">
          {waitingList.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <Badge
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Waiting"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">{item.service}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
