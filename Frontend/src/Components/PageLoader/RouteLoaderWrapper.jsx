import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

const RouteLoaderWrapper = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <PageLoader active={loading} />
      {children}
    </>
  );
};

export default RouteLoaderWrapper;
