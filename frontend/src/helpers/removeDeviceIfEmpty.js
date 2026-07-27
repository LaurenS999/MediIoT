export const removeDeviceIfEmpty = (prev, macAddress, fieldName) => {
  const currentDevice = prev[macAddress];

  const { [fieldName]: removedField, ...remainingData } = currentDevice;

  const hasOtherData = Object.keys(remainingData).some((key) => key !== "mac");

  if (hasOtherData) {
    return {
      ...prev,
      [macAddress]: remainingData,
    };
  }

  const newData = { ...prev };

  delete newData[macAddress];

  return newData;
};
