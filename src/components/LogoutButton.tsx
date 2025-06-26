"use client";

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Sesión cerrada");
      // Optionally redirect or update UI
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
    >
      Cerrar Sesión
    </button>
  );
}
