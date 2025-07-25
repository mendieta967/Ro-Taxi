import { createContext, useState, useContext } from "react";

const VehicleContext = createContext();

const VehicleProvider = ({ children }) => {
  const [selectVehicle, setSelectVehicle] = useState(() => {
    const storedVehicle = localStorage.getItem("selectedVehicle");
    return storedVehicle ? JSON.parse(storedVehicle) : null;
  });

  const handleVehicle = (id) => {
    const vehicle = selectVehicle === id ? null : id;
    console.log(vehicle);
    setSelectVehicle(vehicle);
    localStorage.setItem("selectedVehicle", JSON.stringify(vehicle));
  };
  return (
    <VehicleContext.Provider value={{ handleVehicle, selectVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) throw new Error("vehicle context must be within provider");
  return context;
};

export default VehicleProvider;
