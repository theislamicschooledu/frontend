import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import AlwaysOnTop from "../utils/AlwaysOnTop";

const Main = () => {
  return (
    <div className="overflow-x-hidden">
      <AlwaysOnTop>
        <Navbar />
        <Outlet />
        <Footer />
      </AlwaysOnTop>
    </div>
  );
};

export default Main;
