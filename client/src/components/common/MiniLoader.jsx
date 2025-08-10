import React from "react";

const MiniLoader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-yellow-500"></div>
    </div>
  );
};

export default MiniLoader;
