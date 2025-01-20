"use client";
import { Button } from "./ui/button";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

const ButtonLogout = () => {
  const { signOut, isLoaded } = useAuth();

  const queryClient = useQueryClient();
  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
    if (isLoaded) {
      queryClient.clear();
    }
  };

  return (
    <Button onClick={handleLogout} variant="neutral">
      Logout
    </Button>
  );
};

export default ButtonLogout;
