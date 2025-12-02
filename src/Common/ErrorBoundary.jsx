import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { devMode } from "..";
import { CustomButton } from "./Components";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import { CustomImg } from "./Components";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "", errorInfo: "" };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: `${error?.name} - ${error?.message}`,
      errorInfo: errorInfo,
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    if (error) {
      return (
        <Fallback error={error} errorInfo={errorInfo} showErrors={devMode} />
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}

export const Fallback = ({ error = "", errorInfo, showErrors = true }) => {
  const navigate = useNavigate(0);
  const location = useLocation();
  if (error?.includes("Failed to fetch dynamically imported module")) {
    navigate(location?.pathname + location?.search, {
      replace: true,
    });
    window.location.reload();
    return null;
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "85dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "grey.50",
        fontFamily: "Roboto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
          width: { xs: "90%", md: 600 },
        }}
      >
        <CustomImg alt="fallback" src="/fallback.svg" style={{ height: 200 }} />
        <Typography
          variant="h4"
          component="p"
          color="textPrimary"
          fontWeight="bold"
        >
          Oops! Something went wrong.
        </Typography>
        <Typography
          variant="body1"
          component="div"
          color="textSecondary"
          fontWeight="medium"
        >
          We track these errors automatically, but if the problem persists, feel
          free to contact us. In the meantime, try refreshing the page.
        </Typography>

        {showErrors && (
          <Accordion sx={{ width: "100%" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "grey.200", borderRadius: 1, px: 2 }}
            >
              <Typography
                sx={{ flex: 1, textAlign: "left", fontWeight: "medium" }}
              >
                Error details
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 1,
                p: 2,
                fontSize: "0.875rem",
                backgroundColor: "grey.100",
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              <Typography fontWeight="bold">Error:</Typography>
              <Typography color="error">{error}</Typography>
              <Typography fontWeight="bold">Component Stack Trace:</Typography>
              <Typography color="textSecondary">
                {errorInfo?.componentStack}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
        <div className="flex gap-2 items-center">
          <CustomButton
            onClick={() => window.location.reload()}
            label="Refresh page"
            variant="contained"
            startIcon={<RefreshIcon />}
          />
          <CustomButton
            onClick={() => {
              setTimeout(() => {
                window.location.href = "/";
              }, 0);
            }}
            label="Home"
            variant="outlined"
            minWidth="140px"
            startIcon={<HomeIcon />}
          />
        </div>
      </Box>
    </Box>
  );
};
