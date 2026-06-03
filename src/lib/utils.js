import moment from "moment";

export function dateToUtcFormat(datePayload) {
  let result = moment(datePayload).utc().format();
  return result;
}

export function getDistanceFromLatLng(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Haversine formula
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance.toFixed(2);
}

export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function extractDateTimeComponents(dateTimeString) {
  // Check if the dateTimeString is valid
  if (!moment(dateTimeString).isValid()) {
    return { date: undefined, time: undefined };
  }
  const dateTime = moment(dateTimeString);
  const date = dateTime.format("YYYY-MM-DD");
  const time = dateTime.format("hh:mm A");
  return { date, time };
}

export const convertDateToISOFormat = (date) => {
  return moment(new Date(date)).format("YYYY-MM-DD");
};
export function convertToUTCDate(date) {
  if (!date) {
      return null;
  }

  // Convert the date to UTC and format it as YYYY-MM-DD
  return moment.utc(date).add(1, 'day').format('YYYY-MM-DD');
}
export const utcConversion = (date) => {
  console.log("date::::: in utc function", date);

  // Check if the input date is a Date object or needs to be converted
  const dateObj = date instanceof Date ? date : new Date(date);

  // Log the initial state of the date object
  console.log("Initial date object:", dateObj);

  // Convert the date to ISO string in UTC
  const formattedDate = new Date(
    dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
  ).toISOString();

  // Log the final formatted date
  console.log("Formatted date in UTC:", formattedDate);

  return formattedDate;
};
export function truncate(source, size) {
  return source && source?.length > size
    ? source.slice(0, size - 1) + "…"
    : source;
}

export function ReturnCurrentTime() {
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
}
export function extractTimeIn24HourFormat(dateTimeString) {
  // debugger
  // Parse the date-time string using moment
  const parsedDateTime = moment(
    dateTimeString,
    "ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)"
  );

  // Format the time in 24-hour format
  const timeIn24HourFormat = parsedDateTime.format("HH:mm:ss");

  return timeIn24HourFormat;
}

export const convertTimeIntoUTC = (time, withDate = null) => {
  // debugger;
  const date = withDate;
  const utcTime = new Date(`${date} ${time}`)?.toISOString();
  return utcTime;
};

export function stringAvatar(name) {
  if (name?.includes(" ")) {
    return {
      sx: {
        bgcolor: "rgb(224, 40, 40)",
      },
      children: `${name?.split(" ")[0][0]}${name?.split(" ")[1][0]}`,
    };
  } else {
    return {
      sx: {
        bgcolor: "rgb(224, 40, 40)",
      },
      children: `${name[0]}`,
    };
  }
}

export function formatTime(utcTime) {
  const now = moment().startOf("day");
  const inputTime = moment.utc(utcTime).local();
  const timeDiff = now.diff(inputTime, "days");

  if (timeDiff === 0) {
    return "Today";
  } else if (timeDiff === 1) {
    return "Yesterday";
  } else {
    return inputTime.format("M/D/YYYY");
  }
}

export function getFormattedCurrentDate() {
  const date = new Date();

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}
