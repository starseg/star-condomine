"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Defina os tipos do contexto
interface ControliDUpdateContextType {
  update: boolean;
  triggerUpdate: () => void;
}

// Crie o contexto com um valor padrão
const ControliDUpdateContext = createContext<
  ControliDUpdateContextType | undefined
>(undefined);

// Defina o provider do contexto
interface ControliDUpdateProviderProps {
  children: ReactNode;
}

export function ControliDUpdateProvider({
  children,
}: ControliDUpdateProviderProps) {
  const [update, setUpdate] = useState(false);

  const triggerUpdate = () => setUpdate((prev) => !prev);

  return (
    <ControliDUpdateContext.Provider value={{ update, triggerUpdate }}>
      {children}
    </ControliDUpdateContext.Provider>
  );
}

// Hook para usar o contexto
export function useControliDUpdate() {
  const context = useContext(ControliDUpdateContext);
  if (context === undefined) {
    throw new Error(
      "useControliDUpdate must be used within a ControliDUpdateProvider"
    );
  }
  return context;
}
