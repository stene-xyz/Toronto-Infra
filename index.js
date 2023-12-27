'use strict';

const puppeteer = require('puppeteer');

const http = require('http');
const express = require('express');
const app = express();
const port = process.argv[2];

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var browser = null;

(async() => {
    browser = await puppeteer.launch();
    console.log("Started browser");
})();

app.get("/visit", (req, res) => {
    console.log(`New request => ${req.body.url}`);
    while(browser == null) {}
    (async () => {
        try {
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.100.0')
            await page.goto(req.body.url);
            await page.setViewport({width: 1080, height: 1024});
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            res.send(data);
            console.log(`Completed request: ${req.body.url}`)
            await page.close();
        } catch(e) {
            console.log(`Error fetching ${req.body.url}: ${e}`);
            res.send(500);
        }
      })();
});

console.log(`Listening on ${port}...`);
http.createServer(app).listen(port);