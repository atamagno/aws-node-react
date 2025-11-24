import { type ReactNode, createContext, useContext } from "react";

import useThingsData from "../hooks/useThingData";
import type { CreateThingDto, Thing } from "../types/Thing";

interface ThingsDataContextProps {
  thing: Thing;
  setThing: React.Dispatch<React.SetStateAction<Thing>>;
  things: Thing[];
  loadingStatus: string;
  createThing: (thing: CreateThingDto, callbackDone: () => void) => void;
  readThings: () => void;
  readThingById: (id: string) => void;
  updateThing: (thing: Thing, callbackDone: () => void) => void;
  deleteThing: (id: string, callbackDone: () => void) => void;
}

const ThingsContext = createContext<ThingsDataContextProps | undefined>(undefined);

export const ThingsDataProvider = ({ children }: { children: ReactNode }) => {
  const { thing, things, loadingStatus, setThing, createThing, readThings, readThingById, updateThing, deleteThing } = useThingsData();

  const value = {
    thing,
    things,
    loadingStatus,
    setThing,
    createThing,
    readThings,
    readThingById,
    updateThing,
    deleteThing,
  };

  return <ThingsContext.Provider value={value}>{children}</ThingsContext.Provider>;
};

export const useThingsDataContext = () => {
  const context = useContext(ThingsContext);
  if (!context) {
    throw new Error("useThingsDataContext must be used within a ThingsDataProvider");
  }
  return context;
};
