import { getInProgress } from "@/services/ride";
import { createContext, useState, useContext, useEffect } from "react";
import { useConnection } from "./ConnectionContext";
import Loader from "@/components/common/Loader";
const RideContext = createContext();
export const RideProvider = ({ children }) => {
  const [accepteRide, setAccepteRide] = useState(null);
  const [scheduledRides, setScheduledRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const { invoke, handleConnect } = useConnection();

  const getCurrentRides = async () => {
    try {
      const { inmediate, scheduled } = await getInProgress();
      setScheduledRides(scheduled);
      const currentRide = inmediate[0];
      if (!currentRide) return;

      await handleConnect();
      await invoke("JoinRideGroup", currentRide.id);
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
    <RideContext.Provider
      value={{ accepteRide, setAccepteRide, scheduledRides }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => useContext(RideContext);
