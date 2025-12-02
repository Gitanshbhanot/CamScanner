export const getRandomElement = (arr = []) => {
  let randomIdx = Math.floor(Math.random() * arr.length);

  return arr[randomIdx];
};

// function for finding heading for responsive filters
export const findHeading = (elem) => {
  const checkSetValue = (value) => {
    return elem?.props?.setValue?.toString()?.includes(value);
  };
  const checkTitle = (value) => {
    return elem?.props?.title?.includes(value);
  };
  const checkOptionValue = (value) => {
    return elem?.props?.options?.some(
      (item) => typeof item === "string" && item?.toLowerCase()?.includes(value)
    );
  };

  if (elem?.type === "div") {
    if (
      Array.isArray(elem?.props?.children) &&
      elem?.props?.children?.length >= 2 // checking if it is a from , to date selector
    ) {
      let heading2 = elem?.props?.children?.[0]?.props?.titleAccess;
      let heading = elem?.props?.children?.[0]?.props?.children;
      let title = heading ? heading : heading2 ? heading2 : null;
      return {
        heading: title ? title + " Time" : null,
        comp: elem?.props?.children?.[1],
      };
    } else if (
      ["date", "time", "datetime"]?.includes(elem?.props?.children?.props?.type)
    ) {
      return {
        heading: elem?.props?.children?.props?.type,
        comp: elem?.props?.children,
      };
    } else
      return {
        heading: null,
        comp: elem,
      };
  } else if (elem?.props?.options?.length > 0) {
    // must be a select tag
    if (checkTitle("zone")) {
      return {
        heading: "Zone",
        comp: elem,
      };
    } else if (
      checkTitle("camera") ||
      checkSetValue("camera") ||
      checkOptionValue("cams")
    ) {
      return {
        heading: "Camera",
        comp: elem,
      };
    } else if (
      checkTitle("plant") ||
      checkSetValue("plant") ||
      checkOptionValue("plant")
    ) {
      return {
        heading: "Plant",
        comp: elem,
      };
    } else if (checkSetValue("date")) {
      return {
        heading: "Date range",
        comp: elem,
      };
    } else if (checkOptionValue("basis")) {
      return {
        heading: "Basis",
        comp: elem,
      };
    } else
      return {
        heading: null,
        comp: elem,
      };
  } else {
    return {
      heading: null,
      comp: elem,
    };
  }
};
