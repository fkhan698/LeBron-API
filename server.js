const PORT = 8000;

const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");

const sites = [
  {
    name: "espn",
    address: "https://www.espn.com/nba",
    base: "",
  },
  {
    name: "si",
    address: "https://www.si.com/nba",
    base: "",
  },
  {
    name: "reddit",
    address: "https://www.reddit.com/r/nba",
    base: "",
  },
];

const articles = [];

sites.forEach((site) => {
  axios.get(site.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("LeBron")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: site.base + url,
        source: site.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to Lebron API");
});

app.get("/sites", (req, res) => {
  res.json(articles);
});

app.get("/sites/:siteId", (req, res) => {
  const siteId = req.params.siteId;

  const siteAddress = sites.filter((site) => site.name == siteId)[0].address;
  const siteBase = sites.filter((site) => site.name == siteId)[0].base;
  axios
    .get(siteAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const site = [];

      $('a:contains("LeBron")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        site.push({
          title,
          url: siteBase + url,
          source: siteId,
        });
      });

      res.json(site);
    })
    .catch((e) => console.log(e));
});

app.listen(PORT);
