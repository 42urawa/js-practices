import axios from "axios";
import https from "https";

const url = "https://api.cultivationdata.net/past?no=47598&year=2022&month=8";
const options = {
  method: "GET",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  url,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};

try {
  const res = await axios(options);
  console.log(res.data.小名浜);
} catch (err) {
  console.error(err);
}
