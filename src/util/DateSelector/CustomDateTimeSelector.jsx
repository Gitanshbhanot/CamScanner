import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ThemeProvider, createTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

dayjs.extend(utc);
dayjs.extend(timezone);

const CustomDateTimeSelector = ({
  type = "",
  value = "",
  min = "",
  max = "",
  text = "Select",
  disabled = false,
  timeSteps = { hours: 1, minutes: 1, seconds: 1 },
  format = "",
  ampm = false,
  timezone = "system",
  setDateTime = () => {},
  ...rest
}) => {
  const commonProps = {
    label: text,
    slotProps: {
      // Targets the `IconButton` component.
      openPickerButton: {
        sx: {
          color: "#4164E9", // Change the icon color here
          "&:hover": {
            color: "#1E40AF", // Optional: change color on hover
          },
        },
      },
      textField: {
        size: "small",
        InputProps: {
          sx: {
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none", // Removes the border
            },
            "& input": {
              fontSize: "14px", // Input text size in pixels
            },
            color:"#605D64"
          },
        },
      },
      popper: { sx: { zIndex: 99 } },
    },

    timezone: timezone,
    disabled: disabled,
    slots: { openPickerIcon: ExpandMoreOutlinedIcon },
  };

  const minDateTime = min ? dayjs.utc(min) : undefined;
  const maxDateTime = max ? dayjs.utc(max) : undefined;

  const date = (
    <DatePicker
      {...commonProps}
      value={dayjs.utc(value)}
      onChange={(newValue) => {
        let val = newValue?.toDate();
        setDateTime(val);
      }}
      format={format || "DD/MM/YYYY"}
      className="w-full"
      minDate={minDateTime}
      maxDate={maxDateTime}
      {...rest}
    />
  );

  const dateTime = (
    <DateTimePicker
      {...commonProps}
      value={dayjs.utc(value)}
      timeSteps={timeSteps}
      onChange={(newValue) => {
        let val = newValue?.toDate();
        setDateTime(val);
      }}
      format={format || "DD/MM/YYYY HH:mm"}
      ampm={ampm || false}
      className="w-full"
      minDateTime={minDateTime}
      maxDateTime={maxDateTime}
      {...rest}
    />
  );

  const time = (
    <TimePicker
      {...commonProps}
      value={dayjs.utc(value).local()}
      onChange={(newValue) => {
        let val = newValue?.toDate();
        setDateTime(val);
      }}
      timeSteps={{
        hours: timeSteps.hours || 1,
        minutes: timeSteps.minutes || 1,
        seconds: timeSteps.seconds,
      }}
      format={format || "HH:mm"}
      ampm={ampm || false}
      className="w-full"
      disableIgnoringDatePartForTimeValidation={true}
      minTime={min ? dayjs.utc(min) : undefined}
      maxTime={max ? dayjs.utc(max) : undefined}
      {...rest}
    />
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        {type === "date" ? date : type === "time" ? time : dateTime}
    </LocalizationProvider>
  );
};

export default CustomDateTimeSelector;
