"use client";
import { useUser } from "@clerk/nextjs";
import { Button } from "../button";
import { Plus } from "lucide-react";

export default function Akun() {
  const { user } = useUser();
  return (
    <div>
      <p>{user?.fullName}</p>
    </div>
  );
}
