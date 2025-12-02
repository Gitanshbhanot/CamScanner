import "./App.css";
import { useLocation, useRoutes } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import NavContext from "./modules/NavContext";
import routes from "./util/Routes";
import { ErrorBoundary } from "./Common/ErrorBoundary";
import { CustomImg } from "./Common/Components";

function generateFilteredRoutes(homeRef) {
  return routes?.map((route, index) => ({
    ...route,
    element: (
      <ErrorBoundary key={`error-boundary-for-${index}-${route?.path}`}>
        {route.element}
      </ErrorBoundary>
    ),
  }));
}

// Might need to add single page for Scrap Reduction in the future

function App() {
  if (window.location.hostname !== "localhost") {
    console.log = function no_console() {};
  }
  const [demoRoutes, setDemoRoutes] = useState([]);
  // const elements = useRoutes(routes.filter())
  const pageLocation = useLocation();
  const { origin, hash, pathname, search } = pageLocation;

  useEffect(() => {
    setDemoRoutes(generateFilteredRoutes());
  }, []);

  const allRoutes = useRoutes(demoRoutes);

  return (
    <>
      <NavContext.Provider value={{}}>
        <div
          className="!font-lexend w-[100dvw] h-[100dvh] flex flex-col items-center relative overflow-hidden"
          style={{
            background:
              "var(--Gradient-New, linear-gradient(180deg, #2660B6 0%, #112A50 100%))",
          }}
        >
          <div className="px-2 sm:px-6 pb-12 sm:pb-4 pt-2 sm:pt-4 w-full flex-grow overflow-y-auto z-50">
            {allRoutes}
          </div>
         
        </div>
      </NavContext.Provider>
    </>
  );
}

export default App;
