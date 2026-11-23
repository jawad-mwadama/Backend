const fs = require("fs");
const http = require("http");
const url = require("url");

////////////////////////////////////////////////////
////// FILES

//1) BLOCKING SYNCHRONOUS WAY

// const textIn = fs.readFileSync("./txt/append.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
//console.log("File written!");

// 2) NON-BLOCKING ASYNCHRONOUS WAY

//This is callback hell
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error! 💥");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your file has been written 😌");
//       });
//     });
//   });
// });

// console.log("will read file");

////////////////////////////////////////////////////
////// SERVER

const replaceTemplate = (temp, product) => {};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el));

    res.end(tempOverview);

    //Product Page
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT !");

    //Api
  } else if (pathName === "/api") {
    fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(data);
    });
  } else {
    //Not Found
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000 ");
});
