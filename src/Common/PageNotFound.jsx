import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { CustomButton } from "./Components";

const PageNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full h-full flex flex-col rounded items-center justify-center bg-gray-100 text-center">
      <img
        src="/websiteUnderConstruction.svg"
        alt="Page Not Found"
        className="w-1/2 max-w-md mb-8"
      />
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-500 mb-6">
        The page you are looking for might be under construction or does not
        exist.
      </p>
      <CustomButton
        onClick={() =>
          navigate("/home", {
            state: {
              prevPath: location?.pathname + location?.search,
            },
          })
        }
        label="Go to Home"
        variant="outlined"
        minWidth="140px"
        startIcon={<HomeIcon />}
      />
    </div>
  );
};

export default PageNotFound;
