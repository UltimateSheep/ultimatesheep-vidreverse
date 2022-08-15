import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

import React from "react";
import ReactDOMServer from "react-dom/server";

import App from "../src/App";

const app = express();
app.use(cors());


app.use("^/$", (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error 500");
    }
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    );
  });
});

app.use(express.static(path.resolve(__dirname, "..", "build")));

 const PORT = 8000;
 app.listen(PORT, () => {
   console.log("listening to PORT: " + PORT);
 });