// import axios from 'axios';

// const res = await axios.post("https://app.progps.com.do/api-v2/vehicle/list?hash=cf229226a28d0bc8a646d34b7fa86377", { sort: ["garage_organization_name=desc"] });
// const resGroups = await axios.post("https://app.progps.com.do/api-v2/tracker/group/list?hash=cf229226a28d0bc8a646d34b7fa86377");
// const vehicles = res.data.list;
// const garages = resGroups.data.list;

// // console.log(vehicles);
// console.log(`id,nombre,placa,garaje,secundario`);
// vehicles.map(async(vehicle) => {
//     if (vehicle.tracker_id) {
//         const _res = await axios.post(`https://app.progps.com.do/api-v2/tracker/read?hash=cf229226a28d0bc8a646d34b7fa86377&tracker_id=${vehicle.tracker_id}`);
//         const tracker = _res.data.value;
//         const groupName = garages.filter(_group => _group.id === tracker.group_id)[0]?.title || "No Group";
        
//         console.log(`${vehicle.tracker_id},${vehicle.tracker_label},${vehicle.reg_number},${groupName},${String(vehicle.additional_info).toUpperCase().includes("SECUNDARIA") ? "SI" : "NO"}`);
//     }
// });

function getDateFromDayNumber(day, year = new Date().getFullYear()) {
  const date = new Date(year, 0); // January 1st of the given year
  date.setDate(day); // Add the day number
  return date;
}

// Example: Get the 200th day of 2025
const date = getDateFromDayNumber(200, 2025);
console.log(date.toDateString()); // e.g., "Mon Jul 21 2025"


function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0); // Jan 0 is Dec 31 of the previous year
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Example: Get today's day number
const dayOfYear = getDayOfYear(new Date(date));
console.log(dayOfYear); // e.g., 172 for June 20, 2025