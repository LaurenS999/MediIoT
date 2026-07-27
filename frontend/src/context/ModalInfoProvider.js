import { createContext, useContext, useState } from "react";
import ModalInfo from "../components/common/ModalInfo";

const ModalInfoContext = createContext();

export function ModalInfoProvider({ children }) {
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    message: "",
  });

  const showModal = (message) => {
    setModalInfo({
      isOpen: true,
      message,
    });
  };

  const closeModal = () => {
    setModalInfo({
      isOpen: false,
      message: "",
    });
  };

  return (
    <ModalInfoContext.Provider
      value={{
        showModal,
        closeModal,
      }}
    >
      {children}

      <ModalInfo
        isOpen={modalInfo.isOpen}
        message={modalInfo.message}
        onClose={closeModal}
      />
    </ModalInfoContext.Provider>
  );
}

export const useModalInfo = () => useContext(ModalInfoContext);
