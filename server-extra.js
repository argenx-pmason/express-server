app.get("/sql/:db/:code", (req, res, next) => {
  // console.log('req', req, 'db', req.params.db, 'code', req.params.code);
  const sql = req.params.code,
    db = eval(req.params.db),
    params = [];
  console.log("db: ", db, "req.params.db", req.params.db, "sql: ", sql);
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
app.post("/sqlpost/:db", (req, res, next) => {
  const { sql } = req.body,
    db = eval(req.params.db);
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
app.post("/sqlpost2/:db", (req, res, next) => {
  const { sql } = req.body,
    db = eval(req.params.db);
  console.log("sql: ", sql, "req.body", req.body);
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
app.get("/note/:code", (req, res, next) => {
  const sql = req.params.code;
  const params = [];
  console.log("/note:", sql);
  urlNotes.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});
app.get("/getdata/:file", (req, res) => {
  const file = req.params.file;
  const fs = require("fs");
  fs.readFile("data/" + file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data.replace(/(?:\r\n|\r|\n)/g, "\r\n"));
  });
});
app.get("/r2/:file", function (req, res) {
  const file = req.params.file;
  const R = require("r-integration");
  const out = R.executeRScript("./scripts/R/" + file + ".R");
  console.log("R2--> (get) file = " + file + ": ", out, "res", res);
});
app.get("/r/:file", function (req, res) {
  const file = req.params.file;
  var R = require("r-script");
  var out = R("./scripts/R/" + file + ".R")
    .data()
    .callSync([], (err, data) => {
      console.log("R--> err: file = " + file + ":", err, "data: ", data);
    });
  res.send(out);
  console.log("R--> (get) file = " + file + ": ", out);
});
app.get("/r-pdf/:file", function (req, res) {
  const file = req.params.file;
  var R = require("r-script");
  var out = R("./scripts/R/" + file + ".R")
    .data()
    .callSync([], (err, data) => {
      console.log("R--> err: file = " + file + ":", err, "data: ", data);
    });
  const stream = fs.createReadStream(
    "/Users/philipmason/Projects/server/temp.pdf"
  );
  let filename = "report.pdf";
  filename = encodeURIComponent(filename);
  res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
  res.setHeader("Content-type", "application/pdf");
  stream.pipe(res);
  console.log("R--> (get) file = " + file + ": ", out);
});
app.get("/python/:file", (req, res) => {
  const { spawn } = require("child_process"),
    file = req.params.file,
    pyProg = spawn("python", ["./scripts/python/" + file + ".py"]);
  pyProg.stdout.on("data", function (data) {
    console.log(data.toString());
    res.send(data.toString());
    // res.write(data);
    // res.end('end');
  });
});

get files in a directory
app.get("/email", (req, res) => {
  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "xploratum@gmail.com",
      pass: "Xploratum-824891",
    },
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
    to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>", // html body
  };

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
  });
});
app.post("/getAnswer", (req, res) => {
  console.log("req.body", req.body);
  chatController
    .getAnswer(req)
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});
app.get("/getcsvdata/:file", (req, res) => {
  // CSV file to parse passed in on URL as a query parameter
  const { file } = req.params;
  // Convert a csv file with csvtojson
  csv()
    .fromFile("data/" + file)
    .then(function (jsonArrayObj) {
      res.send({ data: jsonArrayObj });
    });
});
