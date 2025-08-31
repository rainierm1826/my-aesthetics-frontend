import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePicture = ({
  size,
  image,
  fallback,
}: {
  size?: string;
  image?: string;
  fallback?: string;
}) => {
  return (
    <Avatar className={`${size}`}>
      <AvatarImage src={image || `https://github.com/shadcn.png`} />
      <AvatarFallback>{fallback || "CN"}</AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
