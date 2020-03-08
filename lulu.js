const cheerio = require("cheerio");
const moment = require("moment")
const axios = require("axios");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const cookieJar = new tough.CookieJar();
axiosCookieJarSupport(axios);


async function checkStock(URL) {
  const html = await axios.get(URL, {
    jar: cookieJar, // tough.CookieJar or boolean
    withCredentials: true // If true, send cookie stored in jar
  });
  const $ = await cheerio.load(html.data)
  const errorSelector = "#purchase-attributes-size-notification-error";
  const timestamp = moment().format('MMM DD YYYY, h:mm:ss a');

  if(!URL.includes('?color') || !URL.includes('&sz') || !URL.includes('shop.lululemon')){
    console.log(`${timestamp}: ERROR - Check URL - URL must contain color and sz`)
    return null;
  } else if ($(errorSelector).length > 0) {
    console.log(`${timestamp}: ${$(errorSelector).text()}`)
    return false;
  } else {
    console.log(`${timestamp}: In Stock - ${URL}`)
    return true;
  }
}

module.exports = checkStock
