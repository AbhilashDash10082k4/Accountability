// Helper to generate the 42-day calendar grid
export const getCalendarDays = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDayOfMonth = new Date(year, month, 1);
  // Day of the week firstDayOfMonth falls on (0 = Sunday, 6 = Saturday)
  const startDayOfWeek = firstDayOfMonth.getDay();

  // Start date of the grid (may fall in the previous month)
  const gridStartDate = new Date(year, month, 1 - startDayOfWeek);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const nextDay = new Date(gridStartDate);
    nextDay.setDate(gridStartDate.getDate() + i);
    days.push(nextDay);
  }
  return days;
};
