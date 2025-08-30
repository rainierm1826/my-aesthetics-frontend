"use client";

import { useAuthStore } from "@/provider/store/userStore";

export default function CustomerDashboard() {
  const { auth, isAuth } = useAuthStore();
  console.log(auth, isAuth);

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
    </h1>
  );
}
