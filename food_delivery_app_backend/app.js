var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var speakeasy = require('speakeasy');
var twilio = require('twilio');

var indexRouter = require("./routes/index");
var authenticationRouter = require("./routes/authentication");
var userRouter = require("./routes/user.route");
var restaurantRouter = require("./routes/restaurant.route");
var cartRouter = require("./routes/cart.route");
var foodRouter = require("./routes/food.route");
var bookmarkRouter = require("./routes/bookmark.route");
const MongoDB = require("./services/mongodb.service");
const serverPort = require("./config").serverConfig.port;

// Replace these with your actual Twilio Account SID and Auth Token
const accountSid = 'AC4937484868d121330897e48a1d02c5b6';
const authToken = '50c11a6869c077a769448315d6ac9b0c';
const twilioPhoneNumber = '+1 417 541 3216'; // replaced with your Twilio phone number

const client = new twilio(accountSid, authToken);

MongoDB.connectToMongoDB();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("static"));

app.use("*", require("./services/authentication.service").tokenVerification);

app.use("/", indexRouter);
app.use("/api", authenticationRouter);
app.use("/api/user", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/cart", cartRouter);
app.use("/api/food", foodRouter);
app.use("/api/bookmark", bookmarkRouter);

// Add OTP routes here
app.post('/api/sendOTP', async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const secret = speakeasy.generateSecret({ length: 20 });
  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });

  await client.messages
    .create({
      body: `Your OTP is: ${token}`,
      from: twilioPhoneNumber,
      to: phoneNumber
    })
    .then((message) => console.log(message.sid))
    .catch(err => console.error(err));

  // Save the secret for this phoneNumber in your database
  await MongoDB.saveOTP(phoneNumber, secret.base32);

  res.json({ phoneNumber, token });
});

app.post('/api/verifyOTP', async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const token = req.body.token;

  // Get the secret from your database based on phoneNumber
  const secret = await MongoDB.getSecret(phoneNumber);

  console.log(`Secret for phone number ${phoneNumber}: ${secret}`); // This line logs the secret

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(serverPort, () => console.log(`Server started on port ${serverPort}`));

module.exports = app;
