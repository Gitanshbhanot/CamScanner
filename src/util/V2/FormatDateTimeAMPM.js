export const formatDateTime = (epochTimestamp, options = {}) => {
  const updatedOptions = {
    showSec: true,
    showDate: true,
    dateFormat: "dd/mm/yy",
    showTime: true,
    hour12: true,
    ...options,
  };
  if (
    epochTimestamp === "" ||
    typeof epochTimestamp != "number" ||
    !epochTimestamp
  )
    return "";
  const isMilliseconds = epochTimestamp >= 1000000000000; // Check if timestamp is in milliseconds (after 2001)
  const date = new Date(
    isMilliseconds ? epochTimestamp : epochTimestamp * 1000
  );

  let formattedDate = "";
  let formattedTime = "";

  // Format the date if showDate is true
  if (updatedOptions.showDate) {
    const dateParts = {
      dd: String(date.getDate()).padStart(2, "0"),
      mm: String(date.getMonth() + 1).padStart(2, "0"),
      yyyy: String(date.getFullYear()),
      yy: String(date.getFullYear()).slice(-2),
    };

    if (updatedOptions.dateFormat === "dd/mm/yyyy") {
      formattedDate = `${dateParts.dd}/${dateParts.mm}/${dateParts.yyyy}`;
    } else if (updatedOptions.dateFormat === "dd/mm/yy") {
      formattedDate = `${dateParts.dd}/${dateParts.mm}/${dateParts.yy}`;
    }
  }

  // Format the time if showTime is true
  if (updatedOptions.showTime) {
    formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: updatedOptions.showSec ? "2-digit" : undefined,
      hour12: updatedOptions.hour12,
    });
    // Convert AM/PM to uppercase
    if (updatedOptions.hour12) {
      formattedTime = formattedTime.replace(/am|pm/gi, (match) =>
        match.toUpperCase()
      );
    }
  }

  // Return based on enabled updatedOptions
  if (formattedDate && formattedTime) {
    return `${formattedDate} ${formattedTime}`;
  } else if (formattedDate) {
    return formattedDate;
  } else if (formattedTime) {
    return formattedTime;
  }

  return ""; // Default empty string if no updatedOptions are enabled
};
