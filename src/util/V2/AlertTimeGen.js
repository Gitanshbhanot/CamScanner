export function generateRandomDates(
  startDate,
  endDate,
  pointsPerHour = 2,
  minDiff = 0 // in milliseconds
) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (start >= end) {
    throw new Error("startDate must be earlier than endDate.");
  }

  const hoursBetween = (end - start) / (1000 * 60 * 60);
  const numDates = Math.floor(
    hoursBetween * pointsPerHour * (1 + Math.random() * 0.5)
  );

  const randomDates = [];
  let lastTimestamp = start;
  const targetStep = (end - start) / numDates; // Average step to distribute dates
  const buffer = Math.max(minDiff, targetStep * 0.5); // Ensure last date is at least half a step before end

  for (let i = 0; i < numDates; i++) {
    const remainingTime = end - lastTimestamp - buffer; // Reserve buffer before endDate
    const remainingDates = numDates - i - 1;
    const maxPossible = remainingTime - remainingDates * minDiff;

    if (maxPossible <= minDiff) break;

    // Random step with variation, ensuring we don't exceed maxPossible
    const randomVariation = Math.random() * targetStep * 0.5;
    const randomStep = Math.max(
      minDiff,
      Math.min(maxPossible, targetStep * (0.5 + Math.random()))
    );

    const newTimestamp = lastTimestamp + randomStep;
    if (newTimestamp >= end - buffer) break; // Stop before hitting the buffer zone

    randomDates.push(new Date(newTimestamp));
    lastTimestamp = newTimestamp;
  }

  return randomDates.sort((a, b) => b - a);
}

export function generateAlertTimestampPairs(
  startDate,
  endDate,
  numberOfPairs,
  minInterval = 1000
) {
  const pairs = [];
  let currentStartTime = startDate;

  for (let i = 0; i < numberOfPairs; i++) {
    // Generate startTime after the last endTime
    const startTime = getRandomTimestamp(currentStartTime, endDate);

    // Ensure there's enough space between startTime and endDate for at least one second
    if (endDate.getTime() - startTime.getTime() < 1000) break;

    // Generate endTime after startTime
    const endTime = getRandomTimestamp(
      new Date(startTime.getTime() + minInterval),
      endDate
    );

    if (new Date(endDate).getTime() > endTime.getTime())
      pairs.push({ startTime, endTime });

    // Update currentStartTime for the next iteration to ensure no overlap
    currentStartTime = new Date(endTime.getTime() + 1000); // 1 second after endTime
  }

  // Sort pairs by startTime (though they should already be sorted by construction)
  pairs.sort((a, b) => a.startTime - b.startTime);

  return pairs;
}

function getRandomTimestamp(startDate, endDate) {
  return new Date(
    startDate.getTime() +
      Math.random() *
        Math.min(endDate.getTime() - startDate.getTime(), 60 * 60 * 1000)
  );
}
