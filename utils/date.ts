const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
] as const;

export function formatTimeAgo(date: Date) {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  if (Math.abs(duration) < 10) {
    return "Just Now";
  }

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date,
  );
}

export function toDatabaseDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addMissingDays(dates: string[], targetDays: number): string[] {
  let result: string[] = [];
  const today = new Date();

  // Iterate through the dates
  for (let i = 0; i < dates.length - 1; i++) {
    const currentDate = new Date(dates[i]);
    const nextDate = new Date(dates[i + 1]);

    // Skip date generation if it's beyond today
    if (currentDate.getTime() > today.getTime()) {
      break;
    }

    const diffTime = Math.abs(nextDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Add the current date to the result
    result.push(currentDate.toISOString().slice(0, 10));

    // If there are missing days between the current and next date
    if (diffDays > 1) {
      // Calculate the number of missing days
      const missingDays = diffDays - 1;

      // Distribute the missing days between the current and next date
      for (let j = 1; j < missingDays; j++) {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + j);
        // Skip date generation if it's beyond today
        if (newDate.getTime() > today.getTime()) {
          break;
        }
        result.push(newDate.toISOString().slice(0, 10));
      }
    }
  }

  // Add the last date in the array
  result.push(dates[dates.length - 1]);

  // Fill in the missing days around the dates
  while (result.length < targetDays) {
    const firstDate = new Date(result[0]);
    const lastDate = new Date(result[result.length - 1]);

    // Add a day before the first date
    const newFirstDate = new Date(firstDate);
    newFirstDate.setDate(newFirstDate.getDate() - 1);
    // Skip date generation if it's beyond today
    if (newFirstDate.getTime() <= today.getTime()) {
      result.unshift(newFirstDate.toISOString().slice(0, 10));
    }

    // Add a day after the last date
    const newLastDate = new Date(lastDate);
    newLastDate.setDate(newLastDate.getDate() + 1);
    // Skip date generation if it's beyond today
    if (newLastDate.getTime() <= today.getTime()) {
      result.push(newLastDate.toISOString().slice(0, 10));
    }

    // Break loop if both dates are beyond today
    if (
      newFirstDate.getTime() > today.getTime() &&
      newLastDate.getTime() > today.getTime()
    ) {
      break;
    }
  }

  // Trim the result to the target days
  result = result.filter((date) => new Date(date).getTime() <= today.getTime())
    .slice(0, targetDays);

  return result;
}
