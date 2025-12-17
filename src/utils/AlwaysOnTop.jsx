import { useEffect } from "react";
import { useLocation } from "react-router";

const AlwaysOnTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

export default AlwaysOnTop;