"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  BarChart3,
  Calendar,
  MapPin,
  Save,
} from "lucide-react";

interface Branch {
  id: string;
  name: string;
  location: string;
  status: "active" | "closed";
}

interface SettingsData {
  predictiveAnalytics: boolean;
  closingAppointments: boolean;
  selectedBranch: string;
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<SettingsData>({
    predictiveAnalytics: true,
    closingAppointments: false,
    selectedBranch: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sample branch data
  const branches: Branch[] = [
    {
      id: "1",
      name: "Batangas City Branch",
      location: "Lipa City, Batangas",
      status: "active",
    },
    {
      id: "2",
      name: "Lipa City Branch",
      location: "Makati City, Metro Manila",
      status: "active",
    },
    {
      id: "3",
      name: "Lemery City Branch",
      location: "Quezon City, Metro Manila",
      status: "active",
    },
    {
      id: "4",
      name: "Sto Tomas City Branch",
      location: "Cebu City, Cebu",
      status: "closed",
    },
  ];

  const handleSettingChange = (
    key: keyof SettingsData,
    value: boolean | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving settings:", settings);
    setHasUnsavedChanges(false);

    // Show success message (you could use a toast notification here)
    alert("Settings saved successfully!");
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );

  const getSelectedBranch = () => {
    return branches.find((branch) => branch.id === settings.selectedBranch);
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex justify-end items-center">
          {hasUnsavedChanges && (
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        {hasUnsavedChanges && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                You have unsaved changes. Don&apos;t forget to save your
                settings.
              </span>
            </div>
          </div>
        )}

        {/* Analytics Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Analytics & Predictions</CardTitle>
            </div>
            <CardDescription>
              Configure data analytics and predictive features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="predictive-analytics"
                      className="text-base font-medium"
                    >
                      Predictive Analytics
                    </Label>
                    <InfoTooltip content="Enable AI-powered predictions to forecast appointment trends, patient flow, and resource allocation. This helps optimize scheduling and improve operational efficiency." />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use machine learning to predict appointment patterns and
                    optimize scheduling
                  </p>
                </div>
              </div>
              <Switch
                id="predictive-analytics"
                checked={settings.predictiveAnalytics}
                onCheckedChange={(checked) =>
                  handleSettingChange("predictiveAnalytics", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="closing-appointments"
                        className="text-base font-medium"
                      >
                        Closing Appointments
                      </Label>
                      <InfoTooltip content="Allow temporary closure of appointment bookings for specific branches during maintenance, holidays, or capacity management. Existing appointments remain valid." />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable appointment booking for selected
                      branches
                    </p>
                  </div>
                </div>
                <Switch
                  id="closing-appointments"
                  checked={settings.closingAppointments}
                  onCheckedChange={(checked) =>
                    handleSettingChange("closingAppointments", checked)
                  }
                />
              </div>

              {settings.closingAppointments && (
                <div className="ml-6 space-y-3 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <Label className="text-sm font-medium">
                      Select Branch to Close
                    </Label>
                    <InfoTooltip content="Choose which branch location will have appointment booking temporarily disabled. This won't affect existing scheduled appointments." />
                  </div>

                  <Select
                    value={settings.selectedBranch}
                    onValueChange={(value) =>
                      handleSettingChange("selectedBranch", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a branch to close appointments" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem
                          key={branch.id}
                          value={branch.id}
                          disabled={branch.status === "closed"}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{branch.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {branch.location}
                              </span>
                            </div>
                            {branch.status === "closed" && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                Already Closed
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {settings.selectedBranch && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800">
                            {getSelectedBranch()?.name} appointments will be
                            closed
                          </p>
                          <p className="text-amber-700 mt-1">
                            New appointment bookings will be disabled for this
                            branch. Existing appointments will remain scheduled
                            and active.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>
              Overview of your current settings configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Predictive Analytics
                </Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      settings.predictiveAnalytics ? "secondary" : "secondary"
                    }
                  >
                    {settings.predictiveAnalytics ? "Enable" : "Disabled"}
                  </Badge>
                  {settings.predictiveAnalytics && (
                    <span className="text-xs text-muted-foreground">
                      AI predictions active
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Appointment Status
                </Label>
                <div className="flex items-center gap-2">
                  {settings.closingAppointments && settings.selectedBranch ? (
                    <>
                      <Badge variant="destructive">Partially Closed</Badge>
                      <span className="text-xs text-muted-foreground">
                        {getSelectedBranch()?.name}
                      </span>
                    </>
                  ) : (
                    <Badge variant="secondary">All Branches Open</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branch Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Overview</CardTitle>
            <CardDescription>
              Current status of all branch locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className={`p-3 border rounded-lg ${
                    settings.closingAppointments &&
                    settings.selectedBranch === branch.id
                      ? "border-amber-300 bg-amber-50"
                      : branch.status === "closed"
                      ? "border-red-300 bg-red-50"
                      : "border-green-300 bg-green-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{branch.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {branch.location}
                      </p>
                    </div>
                    <Badge
                      variant={
                        settings.closingAppointments &&
                        settings.selectedBranch === branch.id
                          ? "destructive"
                          : branch.status === "closed"
                          ? "secondary"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {settings.closingAppointments &&
                      settings.selectedBranch === branch.id
                        ? "Closing"
                        : branch.status === "closed"
                        ? "Closed"
                        : "Open"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
