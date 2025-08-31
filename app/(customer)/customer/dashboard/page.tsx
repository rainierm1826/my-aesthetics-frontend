"use client";

import { useAuthStore } from "@/provider/store/authStore";
import { useUserStore } from "@/provider/store/userStore";

export default function CustomerDashboard() {
  const { auth, isAuth } = useAuthStore();
  const {user} = useUserStore()


  if (!isAuth) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <h1 className="h-screen flex justify-center items-center">
      Welcome {auth?.email}
      Role {auth?.role}
      name {user?.first_name}
    </h1>
  );
}
