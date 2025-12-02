import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastProvider } from "./Common/Toast";
import { ErrorBoundary } from "./Common/ErrorBoundary";
import { LicenseInfo } from "@mui/x-license";
import { mixpanelInit } from "./util/Mixpanel/functions";

export const devMode = import.meta.env.DEV === true;
export const enableSSO = Boolean(import.meta.env.VITE_ENABLE_SSO === 'true');
export const isMobileWidth = 480;
export const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN || null;

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  typography: {
    fontFamily: `"Lexend", "Helvetica", sans-serif`,
  },
  components: {
    MuiDataGrid: {
      defaultProps: {
        slotProps: {
          panel: {
            sx: {
              '& .MuiDataGrid-panelWrapper': {
                maxWidth: 'calc(100vw - 3rem)',
              },
            },
          },
        },
      },
    },
  },
});

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_KEY);

mixpanelInit();

const providerConfig = {
  domain: import.meta.env.VITE_AD_DOMAIN,
  clientId: import.meta.env.VITE_AD_CLIENT,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
};

const withAuthProvider = (Component) => {
  return function WrappedComponent(props) {
    if (!enableSSO) {
      return <Component {...props} />;
    }
    return (
      <Auth0Provider {...providerConfig}>
        <Component {...props} />
      </Auth0Provider>
    );
  };
};

const RootComponent = withAuthProvider(() => (
  <HashRouter>
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </HashRouter>
));

root.render(<RootComponent />);
