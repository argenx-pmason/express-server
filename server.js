// nodemon ./server.js localhost 3001

const express = require("express"),
  // cors = require("cors"),
  PORT = process.env.PORT || 3001,
  app = express(),
  // csvToJson = require("convert-csv-to-json"),
  // papa = require("papaparse"),
  // csv = require("csvtojson"),
  // nodemailer = require("nodemailer"),
  // mail = require("nodemailer").mail,
  // sqlite3 = require("sqlite3").verbose(),
  // make a reference to each database
  // sdtm = new sqlite3.Database("./data/sdtm.db"),
  // sdtm2 = new sqlite3.Database("./data/sdtm2.db"),
  // sdtm4 = new sqlite3.Database("./data/sdtm4.db"),
  // global = new sqlite3.Database("./data/global.db"),
  // urlNotes = new sqlite3.Database("./data/url-notes.db"),
  // chatController = require("./chatController"),
  fs = require("fs");

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
app.get("/api", (req, res) => {
  res.json({ message: "API call to server was made successfully!" });
});

// e.g. http://localhost:3001/getfile/server.js, http://localhost:3001/getfile/..%2Fpackage.json, http://localhost:3001/getfile/..%2F..%2FTemp%2Fsetenv.log
app.get("/getfile/:file", (req, res) => {
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

// http://localhost:3001/dir/., http://localhost:3001/dir/..%2F..%2F.., http://localhost:3001/dir/..%2F..%2F..%2fusers%2fpmason
app.get("/dir/:folder", (req, res) => {
  const fs = require("fs"),
    folder = req.params.folder,
    path = "./" + folder + "/",
    files = fs.readdirSync(path);
  console.log("folder = ", folder, "path = ", path, "files = ", files);
  res.send(files);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
