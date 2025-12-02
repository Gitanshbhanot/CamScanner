import {
  Autocomplete,
  TextField,
  Slider,
  Radio,
  Tabs,
  Tab,
  RadioGroup,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  IconButton as MuiIconButton,
  Select,
  InputAdornment,
  Breadcrumbs,
  Tooltip,
  FormControlLabel,
  MenuItem,
  Checkbox,
  Button,
  createTheme,
  ThemeProvider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Drawer,
  CircularProgress,
  TextareaAutosize,
  IconButton,
} from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";
import React, { useEffect, useRef, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useLocation, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMemo } from "react";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import {
  MoodBad,
  ThumbDown,
  ThumbUp,
  AspectRatio,
  DownloadForOfflineOutlined,
  ExpandMore,
  ExpandLess,
  CheckCircleOutline,
  CancelOutlined,
  EditNote,
  WarningRounded,
  Replay,
  FilterList,
  ChevronLeft,
  InfoOutlined,
  TipsAndUpdates,
} from "@mui/icons-material";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import GradientText from "../util/V2/GradientText";
import { humanReadableString } from "../util/V2/humanReadableString";
import ReactCardFlip from "react-card-flip";
import { Flip, CloseOutlined } from "@mui/icons-material";
import CustomDateTimeSelector from "./CustomDateTime";
import { userActionsDefault } from "./CommonAction";
import { isMobileWidth } from "..";
import { useToast } from "./Toast";
import { findHeading } from "../util/V2/utilFuncs";
import { useLottie } from "lottie-react";

// Not of use right now..................................................

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  // padding: '16px',
  width: "80%",
  borderRadius: "4px",
};

// Radio checked mui
export const CustomRadio = ({
  value = "",
  setValue = () => {},
  options = [],
  disable = false,
}) => {
  return (
    <RadioGroup
      onChange={(e) => setValue(e?.target?.value)}
      value={value}
      sx={{
        overflowX: "auto",
        height: "fit-content",
        width: "100%",
      }}
    >
      <div className="flex gap-1 w-full whitespace-nowrap capitalize items-center">
        {options.map((x, idx) => {
          return (
            <div
              key={idx}
              style={{
                backgroundColor: x == value ? "#DDEEFF80" : "inherit",
                borderRadius: "8px",
              }}
            >
              <FormControlLabel
                value={x}
                control={
                  <Radio
                    sx={{
                      color: "#6CA6FC",
                      "&.Mui-checked": {
                        color: "#6CA6FC",
                      },
                      "&.MuiRadio-colorSecondary": {
                        color: "#6CA6FC",
                      },
                    }}
                  />
                }
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#3E3C42",
                  marginLeft: "0px",
                }}
                disabled={disable}
                label={x}
              />
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
};

//Common Menu checked mui
export const CustomMenu = ({
  top = "20px",
  right = "8px",
  position = "absolute",
  width = "fit-content",
  color = "#757575",
  options = [
    {
      icon: <CustomImg />,
      type: "",
    },
  ],
  handleMenuClick = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        position: position,
        top: top,
        right: right,
      }}
    >
      <MuiIconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={{ color: color }} />
      </MuiIconButton>
      <MuiMenu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: {
              width: width,
              minWidth: "fit-content",
              borderRadius: "8px",
            },
          },
        }}
      >
        {options.map((item, idx) => (
          <MuiMenuItem
            key={idx}
            onClick={() => {
              handleMenuClick(item.type);
              handleClose();
            }}
          >
            <div className="flex gap-2 items-center">
              {item?.icon ? (
                <CustomImg
                  src={item.icon}
                  alt={item.type}
                  height={"15px"}
                  width={"15px"}
                />
              ) : null}
              {item.type}
            </div>
          </MuiMenuItem>
        ))}
      </MuiMenu>
    </div>
  );
};

//Responsive button container
export const ButtonContainer = ({ children, normalClasses = "w-fit" }) => {
  const size = useWindowSize();
  return (
    <div
      className={
        size.width >= 540
          ? normalClasses
          : "fixed bottom-4 z-[70] left-6 right-7 bg-white rounded"
      }
    >
      {children}
    </div>
  );
};

//Custom Checkbox checked mui
export const CustomCheckbox = ({
  text = "",
  isChecked = false,
  handleChange = () => {},
  borderColor = "#FFC107",
  backgroundColor = "#4164E9",
  extraProps = {},
  isDisabled = false,
}) => {
  return (
    <FormControlLabel
      value={text}
      control={
        <Checkbox
          sx={{
            padding: 0,
            "&.Mui-checked": {
              color: backgroundColor,
            },
            "&:hover": {
              color: backgroundColor,
            },
            ...extraProps,
          }}
          onChange={(e) => {
            handleChange(e);
          }}
          checked={isChecked}
          disabled={isDisabled}
        />
      }
      sx={{
        m: 0,
      }}
      label={text}
      labelPlacement="end"
    />
  );
};

//Autocomplete checked mui
export const AutoComplete = ({
  handleChange = () => {},
  value,
  options = [],
  label = "",
  autoCompleteProps = {},
}) => {
  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      disablePortal
      id="combo-box-demo"
      options={options}
      size="small"
      sx={{ width: "auto" }}
      {...autoCompleteProps}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

//Custom slider checked mui
export const CustomSliderMui = ({
  value = 0,
  setValue = () => {},
  isInput = false,
  min = 0,
  max = 100,
  isTooltip = false,
  trackMarks = [
    {
      value: "",
      label: "",
    },
  ] && false,
}) => {
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleInputChange = (event) => {
    let val = Number(event?.target?.value);
    let ans = val < min ? min : val > max ? max : val;
    setValue(ans);
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <div className="flex w-full gap-6 items-center">
      <Slider
        value={typeof value === "number" ? value : 0}
        onChange={handleSliderChange}
        marks={trackMarks}
        min={min}
        max={max}
        valueLabelDisplay={isTooltip ? "on" : "off"}
        aria-labelledby="input-slider"
        sx={{
          width: "100%",
        }}
      />
      {isInput && (
        <TextField
          value={value}
          variant={"standard"}
          size="small"
          type="number"
          onChange={handleInputChange}
          onBlur={handleBlur}
          aria-labelledby="input-slider"
          sx={{
            width: "45px",
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      )}
    </div>
  );
};

//Card / table toggle checked html
export const CardTableToggle = ({ ViewType = "", setViewType = () => {} }) => {
  return (
    <div className="flex gap-0">
      {["card", "table"].map((i, idx) => {
        return (
          <div
            key={idx}
            className={`py-[7px] px-3 capitalize border text-sm ${
              idx == 0 ? "rounded-l-lg" : "rounded-r-lg"
            }`}
            style={{
              backgroundColor: ViewType == i ? "#FFFFED" : "white",
              borderColor: ViewType == i ? "#FFC107" : "#EBEBEB",
              color: ViewType == i ? "#3E3C42" : "#605D64",
              fontWeight: ViewType == i ? 500 : 400,
              cursor: ViewType == i ? "" : "pointer",
            }}
            onClick={() => setViewType(i)}
          >
            <CustomImg
              src={`/${i === "card" ? "cardIcon" : "tableIcon"}.svg`}
              alt={i}
            />
          </div>
        );
      })}
    </div>
  );
};

// //Common Data grid container html checked
export const DataGridContainer = ({
  children,
  height = "70vh",
  width = "100%",
  borderRadius = "0.25rem",
  border = "1px solid #E3E2E4",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width: windowWidth } = useWindowSize();
  let styles =
    windowWidth < isMobileWidth
      ? {
          minHeight: `min(${height},420px)`,
          height: "fit-content",
          width: width,
          borderRadius: borderRadius,
          border: border,
        }
      : {
          height: height,
          width: width,
          borderRadius: borderRadius,
          border: border,
        };
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        ...styles,
      }}
    >
      {/* {showAdd && (
        <div className="pt-1 pl-1">
          <CustomButton
          label={}/>
          <TextButton
            text={addText}
            Icon={<AddIcon />}
            width={"fit-content"}
            disable={disableAdd}
            onClick={() =>
              addUrl
                ? navigate(addUrl, {
                    state: {
                      prevPath: location?.pathname + location?.search,
                    },
                  })
                : handleAdd()
            }
          />
        </div>
      )} */}
      {children}
    </div>
  );
};

// No data comp
export const NoData = ({
  width = "100%",
  height = "100%",
  minHeight = "200px",
  text = "No Data!",
  icon = <MoodBad fontSize={"large"} />,
}) => {
  return (
    <div
      className="flex flex-row justify-center items-center border rounded-md"
      style={{
        width: width,
        height: height,
        minHeight: minHeight,
      }}
    >
      <div className="flex flex-row items-center gap-2 text-gray-400">
        {icon}
        <h2 className="text-2xl">{text}</h2>
      </div>
    </div>
  );
};

// Image zoom container
export const ZoomWrapper = ({ image = "" }) => {
  const size = useWindowSize();
  return (
    <TransformWrapper
      initialScale={1}
      wheel={{ disabled: false }}
      doubleClick={{ disabled: false }}
      pinch={{ disabled: false }}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div className="relative w-full h-full">
          {size?.width > 768 && (
            <div className="top-0 right-0 z-50 absolute flex flex-col gap-0 bg-[#616161] rounded-b text-[18px] text-white">
              <button
                onClick={() => zoomIn()}
                className="px-[6px] py-2 w-full hover:bg-gray-700"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="px-[6px] py-2 w-full hover:bg-gray-700"
              >
                -
              </button>
              <button
                onClick={() => resetTransform()}
                className="px-[6px] py-2 w-full hover:bg-gray-700"
              >
                x
              </button>
            </div>
          )}
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              zIndex: 0,
              borderRadius: "0px 0px 4px 4px",
              height: "100%",
            }}
            contentStyle={{
              width: "100%",
              borderRadius: "0px 0px 4px 4px",
              height: "100%",
            }}
          >
            <CustomImg
              src={image}
              alt="Zoomable content"
              className="rounded-b w-full h-full"
            />
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

// Built and tested.......................................................

//Select checked mui
export const CustomSelect = ({
  value = "",
  setValue = () => {},
  options = [],
  isPlain = true,
  valueKey = "",
  displayKey = "",
  disable = false,
  width = "150px",
  size = "small",
  multiple = false,
  title = "",
  iconKey = "",
  displayEmpty = false,
}) => {
  const { width: windowWidth } = useWindowSize();
  const changeForMobile = Boolean(windowWidth < isMobileWidth);
  return (
    <Select
      onChange={(e) => setValue(e.target.value)}
      value={value}
      disabled={disable}
      displayEmpty={displayEmpty}
      multiple={multiple}
      sx={{
        width: changeForMobile ? "100%" : width,
        "& .MuiSelect-icon": {
          color: "#4164E9", // Change the color of the arrow to blue
        },
        border: "none", // No border
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none", // Remove border from the outline
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "none", // Also remove border when focused
        },
        color: "#605D64",
        fontWeight: 500,
        fontSize: changeForMobile ? "14px" : "16px",
        height: "24px",
        textTransform: "capitalize",
        minHeight: "24px",
      }}
      renderValue={(selected) =>
        !selected || selected?.length === 0
          ? "Select " + title
          : multiple
          ? selected?.length === options?.length
            ? "All " + title
            : selected.join(", ")
          : selected
      }
      IconComponent={ExpandMoreOutlinedIcon}
      size={size}
      inputProps={{ "aria-label": "Select-something" }}
    >
      {options.map((item, idx) => {
        let valueItem = isPlain ? item : item[valueKey];
        let displayItem = isPlain ? item : item[displayKey];
        let icon =
          iconKey && item?.[iconKey] ? (
            typeof item?.[iconKey] === "string" ? (
              <CustomImg src={item?.[iconKey]} alt="img" className="h-6 w-6" />
            ) : (
              item?.[iconKey]
            )
          ) : (
            ""
          );
        return (
          <MenuItem
            key={idx}
            value={valueItem}
            sx={{
              color: "#605D64",
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            <div className="flex items-center gap-[2px] text-base mob:text-lg">
              {multiple && (
                <CustomCheckbox
                  text={""}
                  isChecked={value?.includes(valueItem)}
                />
              )}
              {icon ? icon : null}
              {displayItem}
            </div>
          </MenuItem>
        );
      })}
    </Select>
  );
};

//Tablist checked mui
export const Tablist = ({
  tabList = [],
  isLazy = false,
  pageIndex = 0,
  setPageIndex = () => {},
  visible = true,
  customTabs = null,
}) => {
  const { width } = useWindowSize();
  const tabComp = useMemo(() => {
    if (isLazy) return tabList?.find((item) => item?.index === pageIndex);
    else {
      const obj = {
        element: (
          <>
            {tabList?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: item?.index !== pageIndex ? "none" : "block",
                }}
                className="w-full h-full"
              >
                {item?.element}
              </div>
            ))}
          </>
        ),
      };
      return obj;
    }
  }, [tabList, isLazy]);
  return (
    <>
      <div className="flex gap-2 items-start justify-between flex-wrap">
        <Tabs
          orientation="horizontal"
          value={pageIndex}
          indicatorColor=""
          variant="scrollable"
          sx={{
            display: !visible ? "none" : "",
            height: "38px",
            minHeight: "38px",
          }}
          TabIndicatorProps={{
            sx: {
              display: "none",
            },
          }}
          scrollButtons={"auto"}
        >
          {tabList.map((item, idx) => {
            let x = item.index;
            let isSelected = x == pageIndex;
            let icon =
              typeof item?.icon === "string" ? (
                <CustomImg src={item?.icon} alt="img" className="h-6 w-6" />
              ) : (
                item?.icon
              );
            let selectedIcon =
              typeof item?.selectedIcon === "string" ? (
                <CustomImg
                  src={item?.selectedIcon}
                  alt="img"
                  className="h-6 w-6"
                />
              ) : (
                item?.selectedIcon
              );
            return (
              <Tab
                key={idx}
                icon={isSelected ? selectedIcon : icon}
                iconPosition={"start"}
                label={
                  width >= 540 || isSelected || !icon || !selectedIcon
                    ? item?.tabName
                    : ""
                }
                value={x}
                sx={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: isSelected ? "1px solid #124CA2" : "",
                  fontSize: "16px",
                  marginRight: "16px",
                  height: "36px",
                  minHeight: "36px",
                  marginRight: "8px",
                  boxShadow:
                    "0px 0px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 8px 0px rgba(0, 0, 0, 0.06)",
                  fontWeight: isSelected ? 400 : 400,
                  color: isSelected ? "#FFF !important" : "#79767D",
                  cursor: isSelected ? "default" : "pointer",
                  background: isSelected
                    ? "var(--Linear-1, linear-gradient(180deg, #124CA2 0%, #0B2F65 100%))"
                    : "#fff",
                  whiteSpace: "nowrap",
                  width: "fit-content !important",
                  minWidth: "fit-content !important",
                  textTransform: "capitalize",
                }}
                onClick={() => setPageIndex(x)}
              />
            );
          })}
        </Tabs>
        {customTabs}
      </div>
      {tabComp?.element}
    </>
  );
};

//div tabs checked html
export const SecondaryDivTabs = ({
  options = [],
  value = "",
  setValue = () => {},
  responsiveClasses = "",
  disabled = false,
  isMobile = false,
  responsiveTabClasses = "",
}) => {
  let lastIdx = options?.length - 1;
  let maxW = isMobile
    ? Math.max(...options?.map((item) => item?.length)) * 6 + 32
    : Math.max(...options?.map((item) => item?.length)) * 9 + 32;

  return (
    <div
      className={
        "flex gap-0 items-center overflow-x-auto h-fit rounded " +
        responsiveClasses
      }
      style={{
        boxShadow:
          "0px 0px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 8px 0px rgba(0, 0, 0, 0.06)",
        opacity: disabled ? 0.6 : 1, // Dim the container if disabled
        pointerEvents: disabled ? "none" : "auto", // Disable all child interactions if disabled
      }}
    >
      {options?.map((item, idx) => {
        return (
          <div
            key={idx}
            className={
              "py-[6px] px-4 capitalize border text-sm text-center " +
              responsiveTabClasses
            }
            style={{
              backgroundColor: value === item ? "#6CA6FC33" : "white",
              minWidth: maxW,
              borderRadius:
                idx === 0
                  ? "4px 0px 0px 4px"
                  : idx === lastIdx
                  ? "0px 4px 4px 0px"
                  : "0px",
              borderColor: value === item ? "#6CA6FC" : "#EBEBEB",
              color: "#605D64",
              fontWeight: value === item ? 500 : 400,
              cursor: disabled
                ? "not-allowed"
                : value === item
                ? ""
                : "pointer",
            }}
            onClick={() => !disabled && setValue(item)} // Prevent click when disabled
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

//div tabs checked html
export const PrimaryDivTabs = ({
  options = [],
  value = "",
  displayKey = "",
  valueKey = "",
  setValue = () => {},
  responsiveClasses = "",
  disabled = false,
}) => {
  let lastIdx = options?.length - 1;
  let maxW =
    Math.max(...options?.map((item) => item?.[displayKey]?.length)) * 9 + 32;

  return (
    <div
      className={
        "flex gap-1 items-center whitespace-nowrap  h-fit rounded p-[1px] border border-[#E3E2E4] " +
        responsiveClasses
      }
      style={{
        opacity: disabled ? 0.6 : 1, // Dim the container if disabled
        pointerEvents: disabled ? "none" : "auto", // Disable all child interactions if disabled
      }}
    >
      {options?.map((item, idx) => {
        let isSelected = value === item?.[valueKey];
        let icon =
          typeof item?.icon === "string" ? (
            <CustomImg src={item?.icon} alt="img" className="h-6 w-6" />
          ) : (
            item?.icon
          );
        let selectedIcon =
          typeof item?.selectedIcon === "string" ? (
            <CustomImg src={item?.selectedIcon} alt="img" className="h-6 w-6" />
          ) : (
            item?.selectedIcon
          );
        return (
          <div
            key={idx}
            className="py-1 pl-1 pr-2 capitalize text-base text-center flex gap-1 items-center justify-center flex-1"
            style={{
              background: isSelected
                ? "var(--Linear-1, linear-gradient(180deg, #124CA2 0%, #0B2F65 100%))"
                : "white",
              minWidth: maxW,
              borderRadius: "4px",
              color: isSelected ? "#fff" : "#79767D",
              fontWeight: isSelected ? 600 : 400,
              cursor: disabled ? "not-allowed" : isSelected ? "" : "pointer",
            }}
            onClick={() => !disabled && setValue(item?.[valueKey])} // Prevent click when disabled
          >
            {isSelected ? selectedIcon : icon}
            {item?.[displayKey]}
          </div>
        );
      })}
    </div>
  );
};

export const CustomButton = ({
  variant = "outlined",
  onClick = () => {},
  label = "",
  loading = false,
  startIcon = undefined,
  endIcon = undefined,
  minWidth = "fit-content",
  disable = false,
  height = "36px",
  minHeight = "36px",
}) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#4164E9",
      },
    },
    typography: {
      fontFamily: '"Lexend", "Helvetica", san-serif',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      {" "}
      <Button
        variant={variant}
        onClick={onClick}
        disabled={loading || disable}
        startIcon={startIcon}
        endIcon={endIcon}
        size="small"
        sx={{
          minWidth: minWidth,
          width: minWidth,
          height: height,
          minHeight: minHeight,
          "& .MuiButton-root": {
            backgroundColor: "#4164E9",
          },
        }}
        color="primary"
      >
        <div className="relative">
          <p
            className="truncate"
            style={{
              opacity: loading ? 0 : 1,
            }}
          >
            {label}
          </p>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CircularProgress
                sx={{
                  color: variant === "contained" ? "white" : "inherit",
                }}
                size={20}
              />
            </div>
          )}
        </div>
      </Button>
    </ThemeProvider>
  );
};

// Bage/Chip checked mui
export const Chip = ({
  top = null,
  right = null,
  left = null,
  bottom = null,
  src = "",
  customElem = null,
  isTooltip = false,
  toolTipText = "",
  toolTipProps = {},
  width = "fit-content",
  height = "fit-content",
  rounded = "4px",
  padding = "2px 4px",
  border = "0px solid #CAC5CD",
  handleClick = null,
  position = "absolute",
}) => {
  const elem = (
    <div
      className={` bg-[#5A5760] flex justify-center items-center ${
        handleClick ? "hover:scale-105" : ""
      }`}
      style={{
        padding: padding,
        top: top,
        right: right,
        left: left,
        bottom: bottom,
        cursor: handleClick ? "pointer" : "",
        width: width,
        height: height,
        border: border,
        borderRadius: rounded,
        zIndex: 50,
        position: position,
      }}
      onClick={handleClick}
    >
      {!customElem ? (
        <CustomImg
          src={src}
          alt="icon-image"
          className="w-full h-full"
          style={{
            borderRadius: rounded,
          }}
        />
      ) : (
        customElem
      )}
    </div>
  );
  return isTooltip ? (
    <Tooltip title={toolTipText} arrow placement="top" {...toolTipProps}>
      {elem}
    </Tooltip>
  ) : (
    elem
  );
};

//Back toggle checked mui
export const NavigateBack = ({
  textArray = [
    {
      text: "",
      icon: null,
      link: "",
    },
  ],
}) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const location = useLocation();
  return (
    <div className="font-medium flex justify-start gap-2 items-center rounded-md capitalize">
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            fontSize="small"
            sx={{
              color: "#084298",
              width: "24px",
              height: "24px",
            }}
          />
        }
        sx={{
          "& .MuiBreadcrumbs-separator": {
            margin: 0,
          },
        }}
        maxItems={3}
      >
        {textArray?.map((item, idx) => {
          let icon =
            typeof item?.icon === "string" ? (
              <CustomImg src={item?.icon} alt="img" className="h-6 w-6" />
            ) : (
              item?.icon
            );
          let isActive = idx === textArray?.length - 1;
          let hideText = width <= 540 && !isActive;
          return (
            <div
              key={idx}
              className="flex gap-1 items-center hover:underline cursor-pointer"
              onClick={() => {
                navigate(item?.link, {
                  state: {
                    prevPath: location?.pathname + location?.search,
                  },
                });
              }}
              style={{
                textDecorationLine: isActive ? "underline" : "inherit",
              }}
            >
              {icon}
              {!hideText && (
                <p className="text-lg mob:text-[20px] font-medium text-[#0B2F65]">
                  {item?.text}
                </p>
              )}
            </div>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

//Card grid container checked html
export const CardContainer = ({
  children,
  showRight = false,
  showLeft = false,
  leftFunc = null,
  rightFunc = null,
  padding = "16px",
  extraClasses = "",
  gap = "16px",
}) => {
  const size = useWindowSize();
  return (
    <div
      className={
        "relative grid grid-cols-1 sm:grid-cols-2 min-[1100px]:grid-cols-3 min-[1470px]:grid-cols-4 min-[1800px]:grid-cols-5 min-[2100px]:grid-cols-6 min-[2400px]:grid-cols-7 w-full h-fit bg-[#F5F5F5] rounded " +
        extraClasses
      }
      style={{
        padding: padding,
        gap: gap,
      }}
    >
      {children}
      {showRight && size?.width >= 640 && (
        <Chip
          top={"calc(50% - 20px)"}
          handleClick={rightFunc}
          width="40px"
          height="40px"
          right={-18}
          padding="1px"
          rounded="999px"
          display={showRight ? "block" : "hidden"}
          customElem={
            <ArrowCircleRightOutlinedIcon
              sx={{ color: "white", width: "100%", height: "100%" }}
            />
          }
        />
      )}
      {showLeft && size?.width >= 640 && (
        <Chip
          top={"calc(50% - 20px)"}
          width="40px"
          height="40px"
          handleClick={leftFunc}
          display={showLeft ? "block" : "hidden"}
          left={-18}
          padding="1px"
          rounded="999px"
          customElem={
            <ArrowCircleLeftOutlinedIcon
              sx={{ color: "white", width: "100%", height: "100%" }}
            />
          }
        />
      )}
    </div>
  );
};

//Image Cards checked html
export const ImageContainer = ({
  handleClick = () => {},
  minWidth = "210px",
  width = "100%",
  height = "250px",
  children,
  onDownload = null,
  onExpand = null,
  hasShadow = true,
  extraClasses = "",
  onFlip = null,
  padding = "8px",
  isMobile = false,
}) => {
  return (
    <div
      className={
        "relative flex justify-center items-center rounded bg-[#EBEBEB] border " +
        extraClasses
      }
      style={{
        minWidth: minWidth,
        height: height,
        width: width,
        padding: padding,
        boxShadow: hasShadow
          ? "-6px -6px 12px 0px #FFF, 6px 6px 12px 0px rgba(0, 0, 0, 0.16)"
          : "",
      }}
      onClick={handleClick}
    >
      {children}
      <div
        className={
          isMobile
            ? "flex inset-y-0 flex-col gap-1 justify-between absolute right-0 p-1"
            : "flex w-full flex-row gap-1 justify-end absolute bottom-0 p-2"
        }
      >
        {onFlip && (
          <Chip
            customElem={<Flip sx={{ color: "white" }} />}
            handleClick={onFlip}
            position="static"
          />
        )}
        {onExpand && (
          <Chip
            customElem={<AspectRatio sx={{ color: "white" }} />}
            handleClick={onExpand}
            position="static"
          />
        )}
        {onDownload && (
          <Chip
            customElem={<DownloadForOfflineOutlined sx={{ color: "white" }} />}
            handleClick={onDownload}
            position="static"
          />
        )}
      </div>
    </div>
  );
};

export const CustomAccordion = ({
  summaryComponent,
  detailComponent,
  isOpen = false,
  setIsOpen = () => {},
  id = "",
  isLazy = true,
  backgroundColor = "white",
  extraProps = {},
}) => {
  //Handling internal state change - optional if being controlled from outside using just a  buttom
  const handleChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion
      expanded={isOpen}
      onChange={handleChange}
      key={id}
      slotProps={{ transition: { unmountOnExit: isLazy } }}
      sx={{
        boxShadow: "none !important",
        "& MuiAccordion-root": {
          color: "transparent",
        },
        borderRadius: "4px !important",
        "::before": {
          height: "0px !important",
        },
        backgroundColor: backgroundColor,
        ...extraProps,
      }}
      disableGutters={true}
    >
      <AccordionSummary
        aria-controls={`panel-controls-${id}`}
        sx={{
          padding: "0px !important",
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
          cursor: "default !important",
        }}
      >
        {/* The tab component showing the summary of accordion */}
        {summaryComponent}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: "0px !important",
          "& .MuiAccordionDetails-root": { padding: "0px !important" },
        }}
      >
        {detailComponent}
      </AccordionDetails>
    </Accordion>
  );
};

export const DataRows = ({
  order = [],
  data = {},
  minWMap = {},
  utils = {},
  justifyContent = "start",
  bgColor = "#F5F5F5",
  viewDetail = null,
  showShadow = true,
  borderRadius = "4px",
  userAction = false,
}) => {
  const modifyTextAccordingToTheUtilsFunction = (orderItemsObj) => {
    const key = orderItemsObj?.keyToFind;

    // Check if utils has a function for the current key
    if (typeof utils?.[key]?.func === "function") {
      // Call the function with the data and args (if any) for that key

      return utils[key].func(
        data?.[key], // Value from data
        utils[key]?.args // Arguments passed from utils
      );
    }

    return utils?.data?.[key] ?? utils?.[data?.[key]] ?? data?.[key];
  };

  const { width } = useWindowSize();

  return (
    <div
      className="gap-4 py-3 px-4 flex items-center w-full h-full flex-wrap"
      style={{
        backgroundColor: bgColor,
        borderRadius: borderRadius,
        boxShadow: showShadow
          ? "-6px -6px 12px 0px #FFF, 6px 6px 12px 0px rgba(0, 0, 0, 0.16)"
          : "none",
        justifyContent: justifyContent,
      }}
    >
      {order?.map((orderItemsObj, idx) => {
        const dataValueChangeByUtils =
          modifyTextAccordingToTheUtilsFunction(orderItemsObj);
        const minW = Math.min(
          width - 90,
          minWMap[orderItemsObj?.keyToFind] || 140
        );
        return (
          <div
            className="flex flex-col gap-[6px] flex-1"
            style={{
              minWidth: minW,
            }}
            key={idx}
          >
            {dataValueChangeByUtils ? (
              typeof dataValueChangeByUtils === "object" ? (
                dataValueChangeByUtils
              ) : (
                <GradientText
                  text={dataValueChangeByUtils || ""}
                  from={"#124CA2 0%"}
                  to={"#0B2F65 100%"}
                  fontWeight={600}
                  fontSize={"16px"}
                  direction={"180deg"}
                />
              )
            ) : (
              <div className="h-[22px] w-full"></div>
            )}

            <p className="text-[#605D64] text-base">
              {humanReadableString(orderItemsObj?.displayName)}
            </p>
          </div>
        );
      })}
      {userAction && (
        <div
          className="flex-1"
          style={{
            minWidth: minWMap["userAction"] || 170,
          }}
        >
          <UserAction />
        </div>
      )}
      {viewDetail && (
        <div
          className="flex-1 min-w-[140px]"
          style={{
            minWidth: minWMap["viewDetail"] || 130,
          }}
        >
          {viewDetail}
        </div>
      )}
    </div>
  );
};

export const FeedbackButtons = ({
  selected = "",
  setSelected = () => {},
  thumbsUpPrompt = null,
  thumbsDownPrompt = null,
  positive = "up",
  negative = "down",
  size = "medium",
  fontColor = "#605D64",
}) => {
  const buttons = (
    <div className="flex gap-2">
      <ThumbUp
        fontSize={size}
        sx={{ color: selected === positive ? "#8FC44A" : "#CAC5CD" }}
        onClick={() => handleButtonClick(positive)}
      />
      <ThumbDown
        fontSize={size}
        sx={{ color: selected === negative ? "#E36059" : "#CAC5CD" }}
        onClick={() => handleButtonClick(negative)}
      />
    </div>
  );

  const handleButtonClick = (type) => {
    setSelected(type);
  };

  return (
    <>
      <div className="flex flex-row-reverse items-start sm:items-center justify-between sm:flex-col sm:gap-2 w-full sm:w-full">
        {buttons}

        <p className={`text-[${fontColor}] text-sm sm:text-base md:text-lg`}>
          Feedback
        </p>
      </div>
      {selected === positive && thumbsUpPrompt}
      {selected === negative && thumbsDownPrompt}
    </>
  );
};

export const ModalDrawer = ({
  children,
  isOpen,
  customModalStyles = {},
  handleClose = () => {},
}) => {
  const size = useWindowSize();
  return size.width >= 768 ? (
    <Modal open={isOpen} onClose={handleClose} disableAutoFocus>
      <div style={{ ...modalStyle, ...customModalStyles }}>{children}</div>
    </Modal>
  ) : (
    <Drawer
      anchor="right"
      open={isOpen}
      sx={{ overflowY: "scroll" }}
      onClose={handleClose}
    >
      <div
        style={{
          paddingTop: "env(safe-area-inset-top)",
          backgroundColor: "#F5F5F5",
        }}
      />
      {children}
    </Drawer>
  );
};

export const FilterContainer = ({ elements = [] }) => {
  const { width } = useWindowSize();
  const [openDrawer, setOpenDrawer] = useState(false);

  if (width < isMobileWidth) {
    return (
      <div
        className="flex gap-2 items-center justify-between w-[90dvw] pl-2 rounded bg-white"
        style={{
          boxShadow:
            "0px 0px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 8px 0px rgba(0, 0, 0, 0.06)",
        }}
      >
        <p className="text-[#605D64] text-base font-medium">Apply filters</p>
        <IconButton
          size="small"
          sx={{
            borderRadius: "0px 4px 4px 0px",
            padding: "6px",
            background:
              "var(--Linear-1, linear-gradient(180deg, #124CA2 0%, #0B2F65 100%))",
          }}
          onClick={() => setOpenDrawer(true)}
          color="primary"
        >
          <FilterList
            sx={{
              color: "white",
              fontSize: "24px",
            }}
          />
        </IconButton>
        {openDrawer && (
          <ModalDrawer
            isOpen={openDrawer}
            handleClose={() => setOpenDrawer(false)}
          >
            <div className="w-[80dvw] h-full flex flex-col gap-0">
              <div className="px-4 py-3 border-b flex gap-2 items-center bg-[#F5F5F5]">
                <div
                  className="p-[2px] rounded flex items-center justify-center"
                  style={{
                    background:
                      "var(--Linear-1, linear-gradient(180deg, #124CA2 0%, #0B2F65 100%))",
                  }}
                >
                  <FilterList
                    sx={{
                      color: "white",
                      fontSize: "20px",
                    }}
                  />
                </div>
                <p className="text-[#0B2F6] font-semibold text-lg">Filters</p>
              </div>
              <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
                {elements?.map((elem, idx) => {
                  const { heading, comp } = findHeading(elem);
                  return (
                    <div
                      className="p-2 rounded flex flex-col gap-2"
                      style={{
                        background:
                          "var(--Primary-primary-50-35, rgba(220, 234, 253, 0.35))",
                      }}
                      key={`mobile-responsive-filter-${idx + 1}`}
                    >
                      {heading && (
                        <p className="text-[#95919B] text-sm uppercase">
                          {heading}
                        </p>
                      )}
                      <div
                        className="bg-white px-2 py-[6px] rounded"
                        style={{
                          boxShadow:
                            "0px 0px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 8px 0px rgba(0, 0, 0, 0.06)",
                        }}
                      >
                        {comp}
                      </div>
                    </div>
                  );
                })}
                <CustomButton
                  label="Close"
                  variant="contained"
                  onClick={() => {
                    setOpenDrawer(false);
                  }}
                  startIcon={<ChevronLeft />}
                />
              </div>
              <div className="p-4">
                <div className="p-1 bg-[#EAEAEC] flex gap-2 rounded">
                  <InfoOutlined
                    sx={{
                      color: "#95919B",
                      fontSize: "16px",
                    }}
                  />
                  <p className="text-[#938F96] text-sm">
                    After selecting your filters and closing the drawer, tap
                    Apply to confirm your choices.
                  </p>
                </div>
              </div>
            </div>
          </ModalDrawer>
        )}
      </div>
    );
  }
  return (
    <div
      className="p-[6px] flex gap-4 items-stretch overflow-x-auto bg-white rounded overflow-y-clip"
      style={{
        boxShadow:
          "0px 0px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 8px 0px rgba(0, 0, 0, 0.06)",
      }}
    >
      {elements?.map((elem, idx) => (
        <React.Fragment key={`filter-element-${idx}`}>
          {elem}
          {idx !== elements?.length - 1 && (
            <div className="w-[2px] h-6 bg-[#D9D9D9]" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ExpandImageModal = ({
  open = false,
  handleClose = () => {},
  annotatedImage = "",
  originalImage = "",
  isVideo = false,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const minDimension = useMemo(() => {
    const maxHeight = windowHeight * 0.9;
    const maxWidth = windowWidth * 0.95;
    const hFactor = 9 / 16;

    // Calculate the height and width for a 16:9 aspect ratio based on the available dimensions
    const aspectHeight = maxWidth * hFactor;
    const aspectWidth = maxHeight / hFactor;

    // Choose the smaller of the two possible dimensions that respect the aspect ratio
    const height = Math.min(maxHeight, aspectHeight);
    const width = height * (16 / 9); // Maintain the 16:9 aspect ratio

    return { width, height };
  }, [windowWidth, windowHeight]);
  const [isFlipped, setIsFlipped] = useState(annotatedImage ? false : true);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") handleClose();
      }}
    >
      <div
        style={{
          ...modalStyle,
          width: minDimension?.width,
          height: minDimension?.height,
          borderRadius: "4px",
        }}
      >
        <div className="flex flex-col h-full rounded-b">
          <div className="flex justify-between items-center px-2 pt-2 bg-white relative rounded-t">
            <p className="text-gray-600 font-medium text-sm mob:text-xl">
              Expanded View
            </p>
            {/* Flip Button */}
            {annotatedImage && (
              <MuiIconButton onClick={handleFlip} color="primary">
                <Flip />
              </MuiIconButton>
            )}
            <div className="-top-4 mob:-top-6 inset-x-0 absolute flex justify-center">
              <div className="bg-white rounded-full p-1 shadow-md">
                {" "}
                <MuiIconButton
                  sx={{
                    width: windowWidth < isMobileWidth ? "24px" : "48px",
                    height: windowWidth < isMobileWidth ? "24px" : "48px",
                  }}
                  onClick={handleClose}
                  color="primary"
                >
                  <CloseOutlined />
                </MuiIconButton>
              </div>
            </div>
          </div>

          {/* Zoomable and Flippable Image */}
          <div className="flex-grow overflow-hidden">
            {" "}
            {/* Ensures the images stay inside */}
            <ReactCardFlip
              containerClassName="w-full h-full"
              isFlipped={isFlipped}
              flipDirection="horizontal"
            >
              {/* Front (Annotated Image) */}
              <div className="h-full">
                {" "}
                {/* Ensures the ZoomWrapper takes full modal height */}
                {isVideo ? (
                  <CommonVideoPlayer
                    url={annotatedImage}
                    className="rounded-b h-full w-full object-contain bg-[#EBEBEB] border"
                  />
                ) : (
                  <ZoomWrapper image={annotatedImage} />
                )}
              </div>

              {/* Back (Original Image) */}
              <div className="h-full">
                {" "}
                {/* Same as above for consistent sizing */}
                {isVideo ? (
                  <CommonVideoPlayer
                    url={originalImage}
                    className="rounded-b h-full w-full object-contain bg-[#EBEBEB] border"
                  />
                ) : (
                  <ZoomWrapper image={originalImage} />
                )}
              </div>
            </ReactCardFlip>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const BaseCard = ({
  children,
  bgColor,
  padding = "8px",
  extraClasses = "",
  hasShadow = true,
}) => {
  return (
    <div
      className={"p-2 rounded w-full " + extraClasses}
      style={{
        backgroundColor: bgColor,
        boxShadow: hasShadow
          ? "-6px -6px 12px 0px #FFF, 6px 6px 12px 0px rgba(0, 0, 0, 0.16)"
          : "none",
        padding: padding,
      }}
    >
      {children}
    </div>
  );
};

export const AccordianButton = ({
  setIsOpen = () => {},
  isOpen = false,
  showText = false,
}) => (
  <div
    className="flex flex-row gap-1 cursor-pointer justify-end"
    onClick={() => setIsOpen((prev) => !prev)}
  >
    {showText && (
      <p className="text-sm sm:text-base md:text-lg text-[#4164E9]">
        {isOpen ? "Hide Details" : "View Details"}
      </p>
    )}
    <div
      className="rounded-full bg-white"
      style={{ boxShadow: "0px 0px 6px rgba(2, 77, 135, 0.10)" }}
    >
      {isOpen ? (
        <ExpandLess sx={{ color: "#4164E9" }} />
      ) : (
        <ExpandMore sx={{ color: "#4164E9" }} />
      )}
    </div>
  </div>
);

export const LatestAlertCard = ({
  alerts = [],
  handleSelectedAlert = null,
  alertDirection = "row",
}) => {
  return (
    <BaseCard>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-1 justify-start items-center">
          <CustomImg
            src="/newTabIcons/alertIcon.svg"
            className="h-4 w-4 mob:h-6 mob:w-6"
            alt="MPS"
          />{" "}
          <p className="text-[#0B2F65] font-semibold text-sm mob:text-lg">
            Latest Alerts
          </p>
        </div>
        <div
          className="flex w-full gap-2"
          style={{ flexDirection: alertDirection }}
        >
          {alerts.length > 0 ? (
            alerts.slice(0, 2).map((item, idx) => {
              return item.message === "Empty Belt" || item?.alert === 2 ? (
                <div
                  className="flex flex-1 flex-col justify-center h-full p-1 mob:p-2 gap-1 rounded bg-[#938F96] text-white"
                  key={`empty-belt-${idx}`}
                >
                  <div className="w-full text-start text-sm sm:text-base font-bold">
                    {item.message}
                  </div>
                  <div className="text-start w-full font-medium text-sm">
                    {item.time}
                  </div>
                </div>
              ) : (
                <div
                  className={`flex flex-1 p-1 mob:p-2 flex-col gap-1 justify-between cursor-pointer bg-[#E46962] rounded text-white`}
                  key={`alert-card-${idx}`}
                  onClick={() => {
                    if (handleSelectedAlert)
                      handleSelectedAlert(item.message, item);
                  }}
                >
                  <div className="w-full flex items-center gap-1">
                    <p
                      className="truncate w-0 flex-grow max-w-fit text-sm sm:text-base font-bold"
                      title={item?.message}
                    >
                      {item.message}
                    </p>
                  </div>
                  <div className="text-start w-full font-medium text-sm">
                    {item.time}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex w-full flex-col justify-center h-full p-1 mob:p-2 gap-1 rounded bg-[#938F96] text-white">
              <div className="w-full text-start text-sm sm:text-base font-bold">
                No Alerts
              </div>
              <div className="text-start w-full font-medium text-sm">
                in last 2 hours
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export const CommonVideoPlayer = ({
  url = "",
  className = "",
  extraProps = {},
}) => {
  return (
    <video
      muted
      autoPlay
      playsInline
      disablePictureInPicture
      controls={false}
      loop
      className={className}
      {...extraProps}
      key={`custom-video-for${url}`}
      poster={`./poster/${url
        ?.split("/")
        .slice(-1)[0]
        ?.replace(".mp4", "_poster.webp")}`}
    >
      <source src={"." + url} type="video/mp4" />
    </video>
  );
};

export const GiveFeedback = () => {
  return <></>;
  return (
    <div className="flex justify-end px-4 py-5 md:py-4 w-full">
      <div className="flex flex-col items-end gap-1 md:gap-0">
        <p className="text-[#605D64] text-base">Noticed incorrect data?</p>
        <p className="hover:opacity-60 font-semibold text-[#084298] text-base cursor-pointer">
          Give us feedback
        </p>
      </div>
    </div>
  );
};

const UserActionModal = ({
  isOpen,
  handleClose = () => {},
  action,
  setAction = () => {},
}) => {
  const [tempAction, setTempAction] = useState(action);

  const handleSubmit = () => {
    setAction(tempAction);
    handleClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} disableAutoFocus>
      <div
        style={{ ...modalStyle, width: "400px" }}
        className="flex flex-col rounded"
      >
        <div className="text-center rounded-t py-2 bg-[#4164E9] w-full text-white font-semibold text-sm sm:text-base md:text-lg">
          Edit Action
        </div>
        <div className="bg-white rounded-b p-6 flex flex-col gap-6">
          <div className="w-full flex flex-col gap-3">
            <p className="text-[#2660B6] font-medium text-sm sm:text-base md:text-lg">
              Edit what action you took
            </p>
            <TextareaAutosize
              value={tempAction}
              onChange={(e) => setTempAction(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #CAC5CD",
                borderRadius: "4px",
                padding: "8px",
              }}
              maxRows={5}
              minRows={3}
              placeholder="Enter action"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5 w-full justify-center">
            <CustomButton
              minWidth="full"
              label="Save changes"
              variant="contained"
              onClick={handleSubmit}
            />
            <CustomButton
              minWidth="full"
              label="Discard changes"
              variant="outlined"
              onClick={handleClose}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const UserAction = ({ feedback = null }) => {
  const { pathname } = useLocation();
  const { width } = useWindowSize();
  const isMobile = width < isMobileWidth;
  const material = pathname.split("/")[3];

  const feedbackMessages = Object.keys(userActionsDefault).includes(material)
    ? userActionsDefault[material]
    : [
        "The alert has been acknowledged and marked as seen.",
        "The cause of the alert is being investigated.",
        "The alert has been assigned to the relevant team for action.",
        "The alert is being escalated to higher support.",
        "The issue has been resolved, and the alert marked as handled.",
        "The alert is being suppressed temporarily to avoid unnecessary noise.",
        "The alert has been dismissed as no action is required.",
        "A new incident report is being created based on this alert.",
        "The status of the alert has been updated to reflect current progress.",
        "Notes have been added with observations for reference.",
        "The stakeholders have been notified about the alert.",
        "The alert has been linked to an existing case for continuity.",
        "A detailed report is being generated for this alert.",
        "The alert has been tagged and categorized for easier tracking.",
        "An automated action has been triggered to handle the alert.",
        "The alert has been closed after ensuring all tasks are completed.",
        "The alert has been reopened for further investigation.",
        "Trends related to the alert are being analyzed for insights.",
      ];

  const isSet = Math.random() > 0.4;
  const tempFeedback = isSet
    ? feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)]
    : "";

  const [action, setAction] = useState(
    feedback !== null ? feedback : tempFeedback
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex rounded bg-white border p-[2px] mob:p-1 border-[#A7A4AC] gap-[2px] mob:gap-1.5 w-full justify-between">
        {action.length > 0 ? (
          <div
            className="flex gap-[2px] mob:gap-1.5 items-center mob:border-r border-[#A7A4AC] flex-grow"
            title={action}
          >
            <CheckCircleOutline
              sx={{ fontSize: isMobile ? "16px" : "24px", color: "#7BAD39" }}
            />
            <p
              className="text-sm mob:text-lg text-[#7BAD39] truncate w-0 flex-grow font-semibold"
              title={action}
            >
              {action}
            </p>
          </div>
        ) : (
          <div className="flex gap-1.5 items-center mob:border-r border-[#A7A4AC] flex-grow">
            <CancelOutlined
              sx={{ fontSize: isMobile ? "16px" : "24px", color: "#938F96" }}
            />
            <p className="text-sm mob:text-lg text-[#938F96] truncate w-0 flex-grow font-semibold">
              No action
            </p>
          </div>
        )}
        <EditNote
          sx={{ color: "#4164E9", cursor: "pointer" }}
          onClick={handleOpen}
        />
      </div>
      {/* <p className="text-[#605D64] text-base">User action</p> */}
      {isOpen && (
        <UserActionModal
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
          setAction={setAction}
          action={action}
        />
      )}
    </>
  );
};

export const CustomImg = (props) => {
  return <img {...props} src={"." + props.src} />;
};

export const AlertFilters = ({
  plantCamMap,
  filtersData,
  setFiltersData,
  singleDate = false,
  disable = false,
  plantCamDisable = false,
  showCam = true,
  hasAllPlants = true,
  allCamsText = "All Cams",
  allPlantsText = "All Plants",
}) => {
  const handleFilters = (value, param) => {
    switch (param) {
      case "plant": {
        setFiltersData((prev) => ({ ...prev, plant: value }));
        setFiltersData((prev) => ({
          ...prev,
          cameraId: allCamsText,
        }));
        break;
      }
      case "cameraId": {
        setFiltersData((prev) => ({ ...prev, cameraId: value }));
        break;
      }
      case "date": {
        if (value === "Last 3 days") {
          setFiltersData((prev) => ({
            ...prev,
            date: value,
            startDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          }));
        } else if (value === "Last 7 days") {
          setFiltersData((prev) => ({
            ...prev,
            date: value,
            startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          }));
        } else if (singleDate) {
          if (value === "Today") {
            setFiltersData((prev) => ({
              ...prev,
              date: value,
              startDate: new Date(new Date().setHours(0, 0, 0, 0)),
              endDate: new Date(),
            }));
          } else if (value === "Yesterday") {
            setFiltersData((prev) => ({
              ...prev,
              date: value,
              startDate: new Date(
                new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000
              ),
              endDate: new Date(
                new Date().setHours(23, 59, 59, 0) - 24 * 60 * 60 * 1000
              ),
            }));
          } else
            setFiltersData((prev) => ({
              ...prev,
              date: value,
            }));
        } else
          setFiltersData((prev) => ({
            ...prev,
            date: value,
          }));
        break;
      }
      case "startDate": {
        setFiltersData((prev) => ({ ...prev, startDate: value }));
        break;
      }
      case "endDate": {
        setFiltersData((prev) => ({ ...prev, endDate: value }));
        break;
      }
    }
  };

  const plantOptions = useMemo(
    () =>
      hasAllPlants
        ? [allPlantsText, ...(Object.keys(plantCamMap) || [])]
        : Object.keys(plantCamMap) || [],
    [plantCamMap]
  );

  const cameraOptions = useMemo(
    () =>
      hasAllPlants
        ? [allCamsText, ...(plantCamMap?.[filtersData?.plant] || [])] || []
        : plantCamMap?.[filtersData?.plant] || [],
    [plantCamMap, filtersData?.plant]
  );

  const dateOptions = ["Last 7 days", "Last 3 days", "custom"];

  const filters = [
    <CustomSelect
      options={plantOptions}
      value={filtersData.plant}
      setValue={(value) => handleFilters(value, "plant")}
      minWidth={170}
      disable={disable || Boolean(plantCamDisable)}
    />,
    showCam && filtersData?.plant !== "All Plants" && (
      <CustomSelect
        options={cameraOptions}
        value={filtersData.cameraId}
        setValue={(value) => handleFilters(value, "cameraId")}
        minWidth={150}
        disable={disable || Boolean(plantCamDisable)}
      />
    ),
    <CustomSelect
      options={dateOptions}
      value={filtersData.date}
      setValue={(value) => handleFilters(value, "date")}
      minWidth={110}
      disable={disable}
    />,
    <div className="min-w-[260px] flex items-center">
      <p className="text-[#124CA2] font-semibold">From</p>
      <CustomDateTimeSelector
        text=""
        type="datetime"
        setDateTime={(val) => {
          handleFilters(val, "startDate");
        }}
        format="DD/MM/YYYY hh:mm:ss A"
        max={filtersData?.endDate}
        min={new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
        value={filtersData?.startDate}
        disabled={disable}
      />
    </div>,
    <div className="min-w-[240px] flex items-center">
      <p className="text-[#124CA2] font-semibold">To</p>
      <CustomDateTimeSelector
        text=""
        type="datetime"
        setDateTime={(val) => handleFilters(val, "endDate")}
        format="DD/MM/YYYY hh:mm:ss A"
        max={new Date()}
        min={filtersData?.startDate}
        value={filtersData?.endDate}
        disabled={disable}
      />
    </div>,
  ].filter(
    (item, idx) =>
      item && (filtersData.date === "custom" || (idx !== 3 && idx !== 4))
  );

  return <FilterContainer elements={filters} />;
};

export const DetailViewAlertSection = ({
  camName = "",
  alerts = [
    {
      alert: 1,
      message: "",
      time: "",
    },
  ],
  handleSelectedAlert = () => {},
}) => {
  const { width } = useWindowSize();

  return (
    (width > 540 || alerts?.length > 0) && (
      <div className="w-full flex flex-col md:flex-row rounded-t border bg-[#F5F5F5] items-start border-[#EBEBEB] justify-between p-2 mob:p-4 gap-2">
        {width > 540 && (
          <div className="flex gap-2.5">
            <CustomImg
              src="/newTabIcons/camIcon.svg"
              className="h-6 w-6"
              alt="Image"
            />
            <p className="text-[#3E3C42] font-medium text-xl">{camName}</p>
          </div>
        )}
        <div className="flex gap-2 flex-grow w-full md:w-0 justify-end">
          {alerts?.map((alrt) => (
            <div
              className="flex flex-row flex-wrap gap-2 mob:gap-4 text-white p-2 justify-between items-center rounded flex-1 w-0 max-w-fit"
              style={{
                backgroundColor: alrt?.alert === 2 ? "#938F96" : "#E46962",
                cursor: alrt?.alert === 2 ? "text" : "pointer",
              }}
              key={`Alert-card-${alrt?.message}`}
              onClick={() => {
                if (alrt?.alert === 1) {
                  handleSelectedAlert(alrt);
                }
              }}
            >
              <div className="flex items-center gap-2 max-w-full">
                <WarningRounded
                  sx={{
                    color: "white",
                    flexShrink: 0,
                    fontSize: "24px",
                    alignSelf: "center",
                  }}
                />
                <p
                  className="font-bold text-sm mob:text-base items-center truncate flex-grow"
                  title={alrt?.message}
                >
                  {alrt?.message}
                </p>
              </div>
              <p className="text-nowrap font-medium text-sm mob:text-base flex-shrink-0">
                {alrt?.time}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full md:w-[300px]">
          <UserWorkflow height="40px" hasShadow={false} />
        </div>
      </div>
    )
  );
};

export const PhotoGalleryFilters = ({
  plantCamMap = {},
  filtersData = {},
  setFiltersData = () => {},
  disable = false,
  plantCamDisable = false,
  otherFilters = [],
}) => {
  // Memoize options to prevent recalculation on every render
  const plantOptions = useMemo(() => Object.keys(plantCamMap), [plantCamMap]);

  const cameraOptions = useMemo(
    () => plantCamMap?.[filtersData?.plant] || [],
    [plantCamMap, filtersData?.plant]
  );

  const dateOptions = ["Today", "Yesterday", "Custom"];

  // Unified handleChange function
  const handleFilters = (value, name) => {
    let newFilters = { ...filtersData };
    if (name === "date") {
      if (value === "Today") {
        setFiltersData({
          ...newFilters,
          date: "Today",
          startDate: new Date(new Date().setHours(0, 0, 0)),
          endDate: new Date(),
        });
      } else if (value === "Yesterday") {
        setFiltersData({
          ...newFilters,
          date: "Yesterday",
          startDate: new Date(
            new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000
          ),
          endDate: new Date(
            new Date().setHours(23, 59, 59, 999) - 24 * 60 * 60 * 1000
          ),
        });
      } else if (value === "Custom") {
        setFiltersData({
          ...newFilters,
          date: "Custom",
        });
      }
    } else if (name === "plant") {
      newFilters.cameraId = plantCamMap?.[value]?.[0];
      newFilters[name] = value;
      setFiltersData(newFilters);
    } else {
      newFilters[name] = value;
      setFiltersData(newFilters);
    }
  };

  const filters = [
    <CustomSelect
      options={plantOptions}
      value={filtersData.plant}
      setValue={(value) => handleFilters(value, "plant")}
      disable={disable || plantCamDisable}
    />,
    <CustomSelect
      options={cameraOptions}
      value={filtersData.cameraId}
      setValue={(value) => handleFilters(value, "cameraId")}
      disable={disable || plantCamDisable}
    />,
    ...otherFilters,
    <CustomSelect
      options={dateOptions}
      value={filtersData.date}
      setValue={(value) => handleFilters(value, "date")}
      disable={disable}
    />,

    <div className="min-w-[260px] flex items-center">
      <p className="text-[#124CA2] font-semibold">From</p>
      <CustomDateTimeSelector
        text=""
        type="datetime"
        setDateTime={(val) => {
          handleFilters(val, "startDate");
        }}
        format="DD/MM/YYYY hh:mm:ss A"
        max={filtersData?.endDate}
        min={new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
        value={filtersData?.startDate}
        disabled={disable}
      />
    </div>,
    <div className="min-w-[240px] flex items-center">
      <p className="text-[#124CA2] font-semibold">To</p>
      <CustomDateTimeSelector
        text=""
        type="datetime"
        setDateTime={(val) => handleFilters(val, "endDate")}
        format="DD/MM/YYYY hh:mm:ss A"
        max={new Date()}
        min={filtersData?.startDate}
        value={filtersData?.endDate}
        disabled={disable}
      />
    </div>,
  ].filter(
    (item, idx) =>
      filtersData.date === "Custom" ||
      (idx !== 3 + otherFilters.length && idx !== 4 + otherFilters.length)
  );

  return <FilterContainer elements={filters} />;
};

export const CameraNameComp = ({ camName = "", initialHeight = "50px" }) => {
  const { width } = useWindowSize();
  return (
    <div
      className="absolute py-4 pl-10 pr-4 flex text-sm sm:text-base gap-2 items-center justify-center bg-[#F5F5F5] rounded-t-lg right-0"
      style={{
        clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
        height: width < isMobileWidth ? "35px" : initialHeight,
        top: width < isMobileWidth ? "-30px" : "-" + initialHeight,
      }}
    >
      <CustomImg
        src="/newTabIcons/camIcon.svg"
        className="h-4 w-4 sm:h-6 sm:w-6"
        alt="camera"
      />
      {camName}
    </div>
  );
};

export const UserWorkflow = ({ height = "36px", hasShadow = true }) => {
  const textRef = useRef();
  const toast = useToast();
  const [status, setStatus] = useState("");
  const [disable, setDisable] = useState(false);

  const handleSubmit = (value) => {
    if (!textRef.current.value.trim()) {
      toast({
        description: "Please fill in the action",
        status: "warning",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      return;
    } else {
      toast({
        title: "Action saved",
        description: "Action has been saved",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    }
    textRef.current.value = textRef.current.value.trim();
    setStatus(value);
    setDisable(true);
  };

  return (
    <BaseCard bgColor={"white"} padding="0px" hasShadow={hasShadow}>
      <TextField
        inputRef={textRef}
        disabled={disable}
        variant={"outlined"}
        size="small"
        placeholder="Enter action"
        fullWidth
        sx={{
          height: height,
          "& .MuiOutlinedInput-root": {
            height: height,
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <div className="flex gap-0 items-center">
                <IconButton
                  size="small"
                  color="success"
                  disabled={status === "BAD"}
                  onClick={() => handleSubmit("GOOD")}
                >
                  <CheckCircleOutline />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  disabled={status === "GOOD"}
                  onClick={() => handleSubmit("BAD")}
                >
                  <CancelOutlined />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  disabled={!status}
                  onClick={() => {
                    setStatus("");
                    setDisable(false);
                  }}
                >
                  <Replay />
                </IconButton>
              </div>
            </InputAdornment>
          ),
        }}
      />
    </BaseCard>
  );
};

export const LottieLoader = ({
  animationData = Animation,
  width = "240px",
  height = "240px",
  showText = false,
  textOptions = [],
  intervalDuration = 6000,
}) => {
  const [currentFact, setCurrentFact] = useState(textOptions[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const options = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(options);

  useEffect(() => {
    if (!showText || !textOptions.length) return;

    let factIndex = 0;
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        factIndex = (factIndex + 1) % textOptions.length;
        setCurrentFact(textOptions[factIndex]);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, [showText, intervalDuration]);

  return (
    <div className="flex flex-col gap-4 flex-grow items-center justify-center">
      <div
        style={{
          width,
          height,
        }}
      >
        {View}
      </div>
      {showText && (
        <div className="flex flex-col gap-1 items-center w-full max-w-md px-4">
          <TipsAndUpdates
            sx={{
              color: "#938F96",
            }}
          />
          <div className="relative h-16 w-full overflow-hidden">
            <div
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                isTransitioning
                  ? "opacity-0 -translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <p className="text-[#938F96] text-base font-medium text-center">
                {currentFact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
