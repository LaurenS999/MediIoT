import { useEffect, useRef, useState } from "react";
import { getGateway } from "../services/adminPanelServices";

export default function useGateway() {
  const [gateway, setGateway] = useState([]);

  const ambilGateway = async () => {
    try {
      const result = await getGateway();
      setGateway(result.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    gateway,

    ambilGateway,
  };
}
