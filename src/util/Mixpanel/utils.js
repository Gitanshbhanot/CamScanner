export const getIPGeolocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      city: data.city || "",
      region: data.region || "",
      country: data.country_name || "",
    };
  } catch (error) {
    console.warn("IP Geolocation fetch failed:", error.message);
    return null;
  }
};

export const getBrowserGeolocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation API not supported by this browser.");
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lon: longitude });
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        resolve(null);
      },
      { timeout: 10000, maximumAge: 60000 } // 10s timeout, 1min cache
    );
  });
