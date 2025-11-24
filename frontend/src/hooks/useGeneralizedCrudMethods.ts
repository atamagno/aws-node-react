import { useEffect, useState } from "react";

import axios from "../lib/axios";
import { LoadingStatus } from "../types/LoadingStatus";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useGeneralizedCrudMethods = <T extends { id: string }>(url: string, initialValue: T) => {
  const [data, setData] = useState<T[]>([]);
  const [singleData, setSingleData] = useState<T>(initialValue);
  const [error, setError] = useState("");
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(LoadingStatus.loading);

  if (!url || url.length === 0) {
    throw new Error("useGeneralizedCrudMethods no url passed in error");
  }

  const formatErrorString = (error: unknown) => {
    let errorMessage = "An error occurred.";
    if (error instanceof Error) {
      errorMessage += ` ${error.message}`;
    }
    console.log(errorMessage);
    return errorMessage;
  };

  const readRecords = async (callbackDone?: () => void) => {
    setLoadingStatus(LoadingStatus.loading);
    try {
      await delay(1000);
      const response = await axios.get(url);
      setData(response.data);
      setLoadingStatus(LoadingStatus.loaded);
    } catch (e) {
      setError(formatErrorString(e));
      setLoadingStatus(LoadingStatus.error);
    }
    if (callbackDone) callbackDone();
  };

  useEffect(() => {
    readRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const readRecordById = async (id: string, callbackDone?: () => void) => {
    setLoadingStatus(LoadingStatus.loading);
    try {
      await delay(1000);
      const response = await axios.get(`${url}/${id}`);
      setSingleData(response.data);
      setLoadingStatus(LoadingStatus.loaded);
    } catch (e) {
      setError(formatErrorString(e));
      setLoadingStatus(LoadingStatus.error);
    }
    if (callbackDone) callbackDone();
  };

  const createRecord = <U>(record: U, callbackDone?: () => void) => {
    const addData = async () => {
      try {
        await delay(1000);
        const response = await axios.post(url, record);
        const newRecord = response.data as T;
        setData([newRecord, ...(data || [])]);
      } catch (e) {
        setError(formatErrorString(e));
      }
      if (callbackDone) callbackDone();
    };
    addData();
  };

  const updateRecord = <U extends { id: string }>(record: U, callbackDone?: () => void) => {
    const updateData = async () => {
      try {
        await delay(1000);
        const response = await axios.put(url, record);
        const updatedRecord = response.data as T;
        const updatedRecords = data.map((item) => (item.id === updatedRecord.id ? updatedRecord : item));
        setData(updatedRecords);
      } catch (e) {
        setError(formatErrorString(e));
      }
      if (callbackDone) callbackDone();
    };
    updateData();
  };

  const deleteRecord = (id: string, callbackDone?: () => void) => {
    const deleteData = async () => {
      try {
        await delay(1000);
        await axios.delete(`${url}/${id}`);
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      } catch (e) {
        setError(formatErrorString(e));
      }
      if (callbackDone) callbackDone();
    };
    deleteData();
  };

  return {
    singleData,
    data,
    error,
    loadingStatus,
    setSingleData,
    createRecord,
    readRecords,
    readRecordById,
    updateRecord,
    deleteRecord,
  };
};

export default useGeneralizedCrudMethods;
