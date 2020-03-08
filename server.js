const checkStock = require("./lulu");
const sendMail = require("./email");
const express = require("express");
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? 8080 : 3000
const log = [];

/** URL for lulu need COLOR and SIZE **/
const URL =
  "https://shop.lululemon.com/p/women-pants/Align-Pant-2/_/prod2020012?color=43635&sz=4";

const RECIPIENTS = ["fran_enriquez@yahoo.com"];

function repeatThis() {
  checkStock(URL).then(result => {
		var timestamp = moment().format("MMM DD YYYY, h:mm:ss a");
    if (result === true) {
      log.push(`${timestamp}: Lulus are in stock! - ${URL}`);
      sendMail(
        RECIPIENTS,
        "Lulus are in stock!",
        `${timestamp}: Buy here - ${URL}`
      );
    } else if (result === null) {
      sendMail(
        RECIPIENTS,
        "Lulu URL Invalid",
        `${timestamp}: Please fix Lulu URL - ${URL}`,
        function() {
          process.exit(0);
        }
      );
    } else if (result === false) {
      log.push(`${timestamp}: Lulus are not in stock`);
    }

    if (log.length > 100) {
      log.shift();
    }
  });
}

repeatThis(); // Execute first once

if (process.env.NODE_ENV === "production") {
  setInterval(repeatThis, 1000 * 60 * 30); // Execute every 30 mins
} else {
  setInterval(repeatThis, 1000 * 5); // 5 secs
}

app.get("/", (request, response) => {
  response.send(
    log
      .map(entry => {
        return `<div>${entry}</div>`;
      })
      .reverse()
      .join("")
  );
});

app.listen(PORT, () => {
  console.log(`Express running on localhost:${PORT}`);
});
