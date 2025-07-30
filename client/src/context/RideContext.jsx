import { getInProgress } from "@/services/ride";
import { createContext, useState, useContext, useEffect } from "react";
import { useConnection } from "./ConnectionContext";
import Loader from "@/components/common/Loader";
const RideContext = createContext();
export const RideProvider = ({ children }) => {
  const [accepteRide, setAccepteRide] = useState(null);
  const [loading, setLoading] = useState(true);

  const { connect } = useConnection();

  const getCurrentRides = async () => {
    try {
      const { inmediate, _scheduled } = await getInProgress();
      const currentRide = inmediate[0];
      if (!currentRide) return;

      await connect();
      setAccepteRide(currentRide);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentRides();
  }, []);

  if (loading) return <Loader />;

  return (
    <RideContext.Provider value={{ accepteRide, setAccepteRide }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => useContext(RideContext);
