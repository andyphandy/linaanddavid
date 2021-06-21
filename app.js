"use strict";
const express = require("express");
const app = express();
const PORT_NUM = 8000;

require('dotenv').config();

const multer = require("multer");
const nodemailer = require("nodemailer");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const SENDER_USER = process.env.SENDER_USER;
const SENDER_PASS = process.env.SENDER_PASS;
const RECEIVER_USER = process.env.RECEIVER_USER;

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
     ciphers:'SSLv3'
  },
  auth: {
    user: SENDER_USER,
    pass: SENDER_PASS
  }
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get('/rsvp', function(req, res) {
  res.sendFile(__dirname + "/public/rsvp.html");
});

app.get('/registry', function(req, res) {
  res.sendFile(__dirname + "/public/registry.html");
});

app.post("/submitForm", async function(req, res) {
  //console.log(SENDER_USER);
  //console.log(SENDER_PASS);
  let { firstName, lastName, email, option, comments, number } = req.body;
  let msg = createMsg(option);
  let subject = `${firstName} ${lastName} ${msg}`;
  let text = `Their email is ${email}. They have ${number} guests attending IRL.`;
  if (comments) {
    text += `\n \n Here\'s what they said: \n ${comments}`;
  }
  try {
    let info = await transporter.sendMail({
      from: SENDER_USER,
      to: RECEIVER_USER,
      subject: subject,
      text: text
    })
    res.status(200).send(info);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

function createMsg(option) {
  let msg = "";
  switch (option) {
    case "yes-irl":
      msg = "will attend in person";
      break;
    case "yes-virtual":
      msg = "will attend virtually";
      break;
    case "no":
      msg = "cannot attend";
      break;
    case "idk":
      msg = "is unsure on attendance";
      break;
    case "other":
      msg = "says other";
      break;
    default:
      msg = "RSVP'd";
  }
  return msg;
}

app.use(express.static("public"));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);