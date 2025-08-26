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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BarChart3, Save } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useBranches } from "@/hooks/useBranches";
import { Branch } from "@/lib/branch-types";
import SkeletonCompactCard from "./SkeletonCompactCard";

export default function SettingsForm() {
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useBranches();
  const branches: Branch[] = data?.branch || [];

  // const branchMutation = useBaseMutation("patch", {
  //   queryKey: "branch",
  //   updateFn: patchBranch,
  //   successMessages: {
  //     update: "Branch has been updated successfully.",
  //   },
  // });

  const handleSave = () => {
    console.log("");
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex justify-end items-center">
          <Button className="flex items-center gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Analytics Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Predictive Features & Branch Management</CardTitle>
            </div>
            <CardDescription>
              Configure predictive features and manage branch
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
              <Switch id="predictive-analytics" />
            </div>

            <Separator />
            <Collapsible
              open={open}
              onOpenChange={setOpen}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-left hover:bg-muted/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium">
                      Manage Branch Opening
                    </Label>
                    <InfoTooltip content="Temporarily close a branch and reopen it anytime when needed." />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Close and open branches.
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-3 px-4 pb-3">
                {branches.map((branch) => (
                  <div
                    className="flex items-center justify-between py-2 px-4 shadow rounded"
                    key={branch.branch_id}
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {branch.branch_name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {`${branch.address.city}, ${branch.address.province}`}
                      </span>
                    </div>
                    <Switch
                      checked={branch.status === "active" ? true : false}
                    />
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
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
              {isFetching
                ? Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCompactCard key={index} />
                  ))
                : branches.map((branch) => (
                    <div
                      key={branch.branch_id}
                      className={`${
                        branch.status === "active"
                          ? "bg-green-50 border-green-400 "
                          : "bg-red-50 border-red-400"
                      } border p-4 rounded-sm`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">
                            {branch.branch_name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {`${branch.address.city}, ${branch.address.province}`}
                          </p>
                        </div>
                        <Badge
                          variant={
                            branch.status === "active"
                              ? "secondary"
                              : branch.status === "close"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {branch.status.charAt(0).toUpperCase() +
                            branch.status.slice(1)}
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
