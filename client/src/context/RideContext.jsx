import { createContext, useState, useContext } from "react";
const RideContext = createContext();
export const RideProvider = ({ children }) => {
  const [accepteRide, setAccepteRide] = useState(null);

  return (
    <RideContext.Provider value={{ accepteRide, setAccepteRide }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => useContext(RideContext);
