"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LogoutButton from "./LogoutButton";

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-black text-white p-4 flex justify-center space-x-6">
      <Link href="/" className="hover:underline">
        Inicio
      </Link>
      {user ? (
        <LogoutButton />
      ) : (
        <>
          <Link href="/login" className="hover:underline">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="hover:underline">
            Registrarse
          </Link>
        </>
      )}
    </nav>
  );
}
