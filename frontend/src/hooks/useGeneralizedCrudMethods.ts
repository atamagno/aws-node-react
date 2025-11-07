import axios from "axios";
import { useEffect, useState } from "react";

import { LoadingStatus } from "../types/LoadingStatus";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useGeneralizedCrudMethods = <T extends { id: string }>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.loading
  );

  if (!url || url.length === 0) {
    throw new Error("useGeneralizedCrudMethods no url passed in error");
  }

  const readRecords = async () => {
    setLoadingStatus(LoadingStatus.loading);
    try {
      await delay(1000);
      const response = await axios.get(url);
      setData(response.data);
      setLoadingStatus(LoadingStatus.loaded);
    } catch {
      setLoadingStatus(LoadingStatus.error);
    }
  };

  useEffect(() => {
    const readRecordsUseEffect = async () => {
      try {
        setLoadingStatus(LoadingStatus.loading);
        await delay(1000);
        const response = await axios.get(url);
        setData(response.data);
        setLoadingStatus(LoadingStatus.loaded);
      } catch {
        setLoadingStatus(LoadingStatus.error);
      }
    };
    readRecordsUseEffect();
  }, [url]);

  const createRecord = <U>(record: U) => {
    const addData = async () => {
      try {
        setLoadingStatus(LoadingStatus.loading);
        await delay(1000);
        const response = await axios.post(url, record);
        const newRecord = response.data as T;
        setData([newRecord, ...(data || [])]);
        setLoadingStatus(LoadingStatus.loaded);
      } catch {
        setLoadingStatus(LoadingStatus.error);
      }
    };
    addData();
  };

  const updateRecord = <U extends { id: string }>(record: U) => {
    const updateData = async () => {
      try {
        setLoadingStatus(LoadingStatus.loading);
        await delay(1000);
        const response = await axios.put(url, record);
        const updatedRecord = response.data as T;
        const updatedRecords = data.map((item) =>
          item.id === updatedRecord.id ? updatedRecord : item
        );
        setData(updatedRecords);
        setLoadingStatus(LoadingStatus.loaded);
      } catch {
        setLoadingStatus(LoadingStatus.error);
      }
    };
    updateData();
  };

  const deleteRecord = (id: string) => {
    const deleteData = async () => {
      try {
        setLoadingStatus(LoadingStatus.loading);
        await delay(1000);
        await axios.delete(`${url}/${id}`);
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        setLoadingStatus(LoadingStatus.loaded);
      } catch {
        setLoadingStatus(LoadingStatus.error);
      }
    };
    deleteData();
  };

  return {
    data,
    loadingStatus,
    createRecord,
    readRecords,
    updateRecord,
    deleteRecord,
  };
};

export default useGeneralizedCrudMethods;
