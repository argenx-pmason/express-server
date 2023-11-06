// nodemon ./server.js localhost 3001

const express = require("express"),
  // cors = require("cors"),
  PORT = process.env.PORT || 3001,
  app = express(),
  fs = require("fs"),
  nodemailer = require("nodemailer"),
  http2 = require("http2");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json()); // <==== parse request body as JSON

// e.g. http://localhost:3001/api
app.get("/test-server", (req, res) => {
  res.json({ message: "API call to server was made successfully!" });
});

// http://localhost:3001/dir/., http://localhost:3001/dir/..%2F..%2F.., http://localhost:3001/dir/..%2F..%2F..%2fusers%2fpmason
app.get("/dir/:folder", (req, res) => {
  console.log(req);
  const folder = req.params.folder,
    fileObjects = fs.readdirSync(folder, { withFileTypes: true });
  const files = [],
    dirs = [];
  fileObjects.forEach((item) => {
    if (!item.isDirectory()) {
      files.push(item.name);
    } else {
      dirs.push(item.name);
    }
  });
  console.log(
    "fileObjects=",
    fileObjects,
    "folder = ",
    folder,
    "files = ",
    files
  );
  res.send({ dirs: dirs, files: files });
});

// e.g. http://localhost:3001/getfile/server.js, http://localhost:3001/getfile/..%2Fpackage.json, http://localhost:3001/getfile/..%2F..%2FTemp%2Fsetenv.log
app.get("/getcsv/:file", (req, res) => {
  // name of file to as a query parameter to return contents of file
  const file = req.params.file;
  console.log("/getfile: ", file);
  // reads data from file
  fs.readFile(file, function (err, fileData) {
    if (err) {
      console.log(err);
    } else {
      res.header("Content-Type", "text/csv");
      res.attachment(file);
      res.status(200).send(fileData);
    }
  });
});

app.get("/getfile/:dirName/:fileName", (req, res) => {
  const { fileName, dirName } = req.params;
  const filePath = `${dirName}/${fileName}`;
  const jsonContent = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });
  res.header("Content-Type", "text/json");
  res.status(200).send(jsonContent);
});

app.get("/gmail", (req, res) => {
  // create reusable transport method (opens pool of SMTP connections)
  const smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "xploratum@gmail.com",
        pass: "ynmngtxxcyvtqzmj",
      },
    }),
    // setup e-mail data with unicode symbols
    mailOptions = {
      from: "Fred Foo ✔ <phil@woodstreet.org.uk>", // sender address
      to: "test@woodstreet.org.uk", // list of receivers
      subject: "Hello", // Subject line
      text: "Hello world", // plaintext body
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

app.get("/email", async (req, res) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  // console.log(transporter);
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Phil Mason 👻" <phil@woodstreet.org.uk>', // sender address
    to: "phil@woodstreet.org.uk", // list of receivers
    subject: "Test Email", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  // console.log(info);
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  res.status(200).send(nodemailer.getTestMessageUrl(info));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
