const checkStock = require("./lulu");
const sendMail = require("./email");
const express = require("express");
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
var log = [];

/* URL for lulu product needs COLOR and SIZE */
const URL =
  "https://shop.lululemon.com/p/women-pants/Align-Pant-2/_/prod2020012?color=43635&sz=4";

/* Emails to be notified */
const RECIPIENTS = ["fran_enriquez@yahoo.com", "watt_kristy@yahoo.com"];

/* Main task that is called */
function repeatThis() {
  checkStock(URL, function(result) {
		var timestamp = moment().format("MMM DD YYYY, h:mm:ss a");
    if (result === true) {
      log.push(`${timestamp}: Lulus are in stock! - ${URL}`);
      sendMail(
        RECIPIENTS,
        "Lulus are in stock!",
        `${timestamp}: Buy here - ${URL}`
      );
    } else if (result === null) {
			log.push(`${timestamp}: Problem with URL. Please fix. - ${URL}`);
      sendMail(
        RECIPIENTS,
        "Lulu URL Invalid",
        `${timestamp}: Please fix Lulu URL - ${URL}`
      );
    } else if (result === false) {
      log.push(`${timestamp}: Lulus are not in stock`);
    }

		/* Only keeps last 100 task executions in log */
    if (log.length > 100) {
      log.shift();
    }
	}) 
}

/* Root address displays log */
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

/* Manual task execution */
app.get("/check", (request, response) => {
	repeatThis();
  response.send("Task completed");
});

app.listen(PORT, () => {
	console.log(`Express running on localhost:${PORT}`);
	repeatThis(); // Execute first once

	
	if (process.env.NODE_ENV === "production") {
		setInterval(repeatThis, 1000 * 60 * 30); // Execute every 30 mins
	} else {
		setInterval(repeatThis, 1000 * 5); // 5 secs
}
});
