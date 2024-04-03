"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("7f549b21-0c9a-431a-80e2-097d9ce5c906");
  }, []);

  return null;
};