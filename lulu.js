const cheerio = require("cheerio");
const moment = require("moment")
const axios = require("axios");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const cookieJar = new tough.CookieJar();
axiosCookieJarSupport(axios);


async function checkStock(URL, callback) {
  const html = await axios.get(URL, {
    jar: cookieJar, // tough.CookieJar or boolean
    withCredentials: true // If true, send cookie stored in jar
  });
  const $ = await cheerio.load(html.data)
  const addToBagButtonSelector = "button.add-to-bag";
  const timestamp = moment().format('MMM DD YYYY, h:mm:ss a');

  if(!URL.includes('?color') || !URL.includes('&sz') || !URL.includes('shop.lululemon')){
    console.log(`${timestamp}: ERROR - Check URL - URL must contain color and sz`)
    callback(null);
  } else if ($(addToBagButtonSelector).length === 0) {
    console.log(`${timestamp}: ERROR - Check URL - Cannot find add to bag button`)
    callback(null);
  } else if ($(addToBagButtonSelector).prop('disabled')){
    console.log(`${timestamp}: Out of stock`)
    callback(false);
  } else if (!$(addToBagButtonSelector).prop('disabled')) {
    console.log(`${timestamp}: Lulus In Stock!: ${URL}`)
    callback(true);
  }
}

module.exports = checkStock
