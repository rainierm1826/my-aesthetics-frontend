"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit2, Save, X } from "lucide-react";

interface UserProfile {
  profilePicture: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  dateOfBirth: string;
  phoneNumber: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  lot: string;
  email: string;
  password: string;
  role: string;
}

export default function UserForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    profilePicture: "https://github.com/shadcn.png",
    firstName: "Rainier",
    lastName: "Marasigan",
    middleInitial: "R",
    dateOfBirth: "1990-01-15",
    phoneNumber: "+63 912 345 6789",
    region: "CALABARZON",
    province: "Batangas",
    city: "Lipa City",
    barangay: "Marawoy",
    lot: "123 Rizal Street",
    email: "john.doe@email.com",
    password: "••••••••••",
    role: "Owner",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange("profilePicture", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const displayProfile = isEditing ? editedProfile : profile;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={displayProfile.profilePicture} alt="Profile" />
              <AvatarFallback className="text-lg">
                {getInitials(displayProfile.firstName, displayProfile.lastName)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {displayProfile.firstName} {displayProfile.lastName}
            </h3>
            <p className="text-muted-foreground">{displayProfile.email}</p>
            <Badge variant="secondary" className="mt-1">
              {displayProfile.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={editedProfile.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.firstName}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={editedProfile.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.lastName}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleInitial">Middle Initial</Label>
              {isEditing ? (
                <Input
                  id="middleInitial"
                  value={editedProfile.middleInitial}
                  onChange={(e) =>
                    handleInputChange("middleInitial", e.target.value)
                  }
                  maxLength={1}
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.middleInitial}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={editedProfile.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {new Date(profile.dateOfBirth).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  value={editedProfile.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.phoneNumber}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Your current address details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              {isEditing ? (
                <Input
                  id="region"
                  value={editedProfile.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.region}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              {isEditing ? (
                <Input
                  id="province"
                  value={editedProfile.province}
                  onChange={(e) =>
                    handleInputChange("province", e.target.value)
                  }
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.province}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={editedProfile.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.city}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay</Label>
              {isEditing ? (
                <Input
                  id="barangay"
                  value={editedProfile.barangay}
                  onChange={(e) =>
                    handleInputChange("barangay", e.target.value)
                  }
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md">
                  {profile.barangay}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lot">Lot/Street Address</Label>
            {isEditing ? (
              <Input
                id="lot"
                value={editedProfile.lot}
                onChange={(e) => handleInputChange("lot", e.target.value)}
              />
            ) : (
              <div className="px-3 py-2 bg-muted rounded-md">{profile.lot}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account credentials and role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground">
              {profile.email} <span className="text-xs">(Read-only)</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            {isEditing ? (
              <Input
                id="password"
                type="password"
                value={editedProfile.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            ) : (
              <div className="px-3 py-2 bg-muted rounded-md">
                {profile.password}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground">
              <Badge variant="secondary">{profile.role}</Badge>{" "}
              <span className="text-xs ml-2">(Read-only)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
