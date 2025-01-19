"use client";
import { useUserByClerkId } from "@/hooks/reactQuery/user/userGetById";
import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext({} as any);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser();
  const { data: user } = useUserByClerkId({ isSignedIn });

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
