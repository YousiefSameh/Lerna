export function formatDate(
  date: Date | string,
  formatStr: string = "MMMM dd, yyyy"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  if (formatStr === "MMMM dd, yyyy") {
    return `${months[month]} ${day < 10 ? "0" + day : day}, ${year}`;
  }

  if (formatStr === "MMM dd, yyyy") {
    return `${monthsShort[month]} ${day < 10 ? "0" + day : day}, ${year}`;
  }

  // Default fallback
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
