import mixpanel from "mixpanel-browser";
import { mixpanelToken } from "../..";
import { getBrowserGeolocation, getIPGeolocation } from "./utils";

// identify the user via email and register the super property location
export const mixpanelIdentify = async ({ email = "", location = "" }) => {
  if (mixpanelToken) {
    mixpanel.identify(email);
    mixpanel.register({
      email: email,
      location: location,
    });
  }
};

// to initialize mixpanel
export const mixpanelInit = () => {
  if (mixpanelToken)
    mixpanel.init(mixpanelToken, {
      api_host: "https://drdun9bya6vw5.cloudfront.net",
      persistence: "localStorage",
      track_pageview: true,
    });
};

// login tracking and setting data for user
export const mixpanelLoginFunction = async ({ res = {}, email = "" }) => {
  if (mixpanelToken) {
    const fallbackName = email?.split("@")?.[0] || "Anonymous";
    const fallbackOrg = email?.split("@")?.[1]?.split(".")?.[0] || "Unknown";
    mixpanel.identify(email);

    mixpanel.people.set({
      email: email || "",
      name: res?.data?.fullname || fallbackName,
      organisation: res?.data?.organisation || fallbackOrg,
      role: res?.data?.role || "",
      location: res?.data?.location || "",
      phone: res?.data?.phoneNumber || "",
    });
    mixpanel.register({
      email: email,
      role: res?.data?.role,
      organisation: res?.data?.organisation || fallbackOrg,
    });
    mixpanel.track("User login", {
      email: email,
      location: res?.data?.location,
    });
  }
};

// track which tool user goes to
export const mixpanelTrackTool = ({ productName = "" }) => {
  if (mixpanelToken)
    mixpanel.track("Product viewed", {
      productName: productName,
    });
};

// logout tracking
export const mixpanelTrackLogOut = () => {
  if (mixpanelToken) {
    mixpanel.track("Log out");
    mixpanel.reset();
  }
};
