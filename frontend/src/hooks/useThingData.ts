import config from "../config";
import type { CreateThingDto, Thing } from "../types/Thing";
import useGeneralizedCrudMethods from "./useGeneralizedCrudMethods";

const useThingsData = () => {
  const initialThing: Thing = { id: "", description: "" };
  const { singleData, data, error, loadingStatus, setSingleData, createRecord, readRecords, readRecordById, updateRecord, deleteRecord } =
    useGeneralizedCrudMethods<Thing>(`${config.restApiUrl}/thing`, initialThing);

  const createThing = (thing: CreateThingDto, callbackDone: () => void) => {
    createRecord<CreateThingDto>(thing, callbackDone);
  };

  const readThings = () => {
    readRecords();
  };

  const readThingById = (id: string) => {
    readRecordById(id);
  };

  const updateThing = (thing: Thing, callbackDone: () => void) => {
    updateRecord<Thing>(thing, callbackDone);
  };

  const deleteThing = (id: string, callbackDone: () => void) => {
    deleteRecord(id, callbackDone);
  };

  return {
    thing: singleData,
    things: data,
    loadingStatus,
    error,
    setThing: setSingleData,
    createThing,
    readThings,
    readThingById,
    updateThing,
    deleteThing,
  };
};

export default useThingsData;
