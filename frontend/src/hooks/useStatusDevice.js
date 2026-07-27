import { useState, useEffect, useCallback } from "react";
import {
  getStatusDevice,
  updateHeartBeatDevice,
} from "../services/deviceService";

export default function useStatusDevice() {
  const [usedDeviceSet, setUsedDeviceSet] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchStatusDevice = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getStatusDevice();

      setUsedDeviceSet(new Set(response.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHeartbeat = useCallback(async (mac_address) => {
    try {
      const response = await updateHeartBeatDevice(mac_address);
    } catch (error) {
      console.error(error);
    }
  });

  return {
    usedDeviceSet,
    loading,
    fetchStatusDevice,
    updateHeartbeat,
  };
}
