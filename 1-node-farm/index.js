const fs = require("fs");
const http = require("http");

const replaceTemplate = require("./modules/replaceTemplate");

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
  const baseUrl = `http://${req.headers.host || "127.0.0.1:8000"}`;
  const parsedUrl = new URL(req.url, baseUrl);
  const { pathname, searchParams } = parsedUrl;

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    const id = searchParams.get("id");
    const product = dataObj[id];

    if (!product) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("<h1>Product not found</h1>");
      return;
    }

    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    // Not Found
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
