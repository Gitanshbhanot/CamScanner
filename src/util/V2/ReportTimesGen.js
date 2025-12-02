export const generateReportTimes = (fromTime, toTime, selectedBasis) => {
  let reportTimes = [];
  if (
    new Date(toTime).toISOString().slice(0, 10) ===
    new Date().toISOString().slice(0, 10)
  ) {
    if (selectedBasis == '0') {
      let current = new Date(toTime);

      while (current >= new Date(fromTime).setHours(0, 0, 0, 0)) {
        reportTimes.push({
          endTime: new Date(current.setHours(23, 59, 59, 59)),
          startTime: new Date(current.setHours(0, 0, 0, 0)),
        });
        current = new Date(current.getTime() - 24 * 60 * 60 * 1000);
      }
    } else if (selectedBasis == '2') {
      let current = new Date(
        new Date(toTime).setHours((new Date().getHours() + 1) % 24, 0, 0, 0)
      );
      while (
        current >
        new Date(
          new Date(fromTime).setHours(new Date(fromTime).getHours(), 0, 0, 0)
        )
      ) {
        reportTimes.push({
          endTime: new Date(current),
          startTime: new Date(current.getTime() - 60 * 60 * 1000),
        });
        current = new Date(current.getTime() - 60 * 60 * 1000);
      }
    } else if (selectedBasis == '1') {
      let current =
        new Date().getHours() >= 22
          ? new Date(new Date().setHours(22, 0, 0, 0) + 8 * 60 * 60 * 1000)
          : new Date().getHours() >= 14
          ? new Date(new Date().setHours(22, 0, 0, 0))
          : new Date().getHours() >= 6
          ? new Date(new Date().setHours(14, 0, 0, 0))
          : new Date(new Date().setHours(6, 0, 0, 0));

      let fromDateHourStart = new Date(fromTime).getHours();
      fromDateHourStart =
        fromDateHourStart >= 22
          ? 22
          : fromDateHourStart >= 14
          ? 14
          : fromDateHourStart >= 6
          ? 6
          : 0;
      let endDateHourStart = new Date().getHours();
      endDateHourStart =
        endDateHourStart >= 22
          ? 23
          : endDateHourStart >= 14
          ? 22
          : endDateHourStart >= 6
          ? 14
          : 6;
      while (
        new Date(current.getTime() - 8 * 60 * 60 * 1000) >=
          new Date(new Date(fromTime).setHours(fromDateHourStart)) &&
        current <= new Date(new Date(toTime).setHours(endDateHourStart))
      ) {
        reportTimes.push({
          endTime: new Date(current),
          startTime: new Date(current.getTime() - 8 * 60 * 60 * 1000),
        });
        current = new Date(current.getTime() - 8 * 60 * 60 * 1000);
      }
    }
  } else {
    if (selectedBasis == '0') {
      let current = new Date(toTime);

      while (current >= new Date(fromTime).setHours(0, 0, 0, 0)) {
        reportTimes.push({
          endTime: new Date(current.setHours(23, 59, 59, 59)),
          startTime: new Date(current.setHours(0, 0, 0, 0)),
        });
        current = new Date(current.getTime() - 24 * 60 * 60 * 1000);
      }
    } else if (selectedBasis == '2') {
      let current = new Date(
        new Date(toTime).setHours(new Date(toTime).getHours() % 24, 0, 0, 0)
      );
      while (
        current >
        new Date(
          new Date(fromTime).setHours(new Date(fromTime).getHours(), 0, 0, 0)
        )
      ) {
        reportTimes.push({
          endTime: new Date(current),
          startTime: new Date(current.getTime() - 60 * 60 * 1000),
        });
        current = new Date(current.getTime() - 60 * 60 * 1000);
      }
    } else if (selectedBasis == '1') {
      let current =
        new Date(toTime).getHours() >= 22
          ? new Date(
              new Date(toTime).setHours(22, 0, 0, 0) + 8 * 60 * 60 * 1000
            )
          : new Date(toTime).getHours() >= 14
          ? new Date(new Date(toTime).setHours(22, 0, 0, 0))
          : new Date(toTime).getHours() >= 6
          ? new Date(new Date(toTime).setHours(14, 0, 0, 0))
          : new Date(new Date(toTime).setHours(6, 0, 0, 0));

      let fromDateHourStart = new Date(fromTime).getHours();
      fromDateHourStart =
        fromDateHourStart >= 22
          ? 22
          : fromDateHourStart >= 14
          ? 14
          : fromDateHourStart >= 6
          ? 6
          : 0;
      let endDateHourStart = new Date(toTime).getHours();
      endDateHourStart =
        endDateHourStart >= 22
          ? 23
          : endDateHourStart >= 14
          ? 22
          : endDateHourStart >= 6
          ? 14
          : 6;
      while (
        new Date(current.getTime() - 8 * 60 * 60 * 1000) >=
          new Date(new Date(fromTime).setHours(fromDateHourStart)) &&
        current <= new Date(new Date(toTime).setHours(endDateHourStart))
      ) {
        reportTimes.push({
          endTime: new Date(current),
          startTime: new Date(current.getTime() - 8 * 60 * 60 * 1000),
        });
        current = new Date(current.getTime() - 8 * 60 * 60 * 1000);
      }
    }
  }
  return reportTimes;
};
