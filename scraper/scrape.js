const cheerio = require('cheerio');
const fetch = require('node-fetch');
const got = require ('got');
const { JSDOM } = require ('jsdom');
const webParseURL = "https://webscraper.io/test-sites/e-commerce/allinone";

got(webParseURL).then(response => {
    const $ = cheerio.load(response.body);
    // console.log($('title')[0].children([0]).data);
    $('body').children().each((i,link) => {
        // const txt = $(link).text();
        const href = $(link).text();
        console.log(href);
    })
}).catch(err => {
  console.log(err);
});

