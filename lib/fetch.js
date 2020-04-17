'use strict';

const cheerio = require('cheerio');
const fetch = require('make-fetch-happen');

/**
 * Fetch a URL and return a Cheerio object.
 *
 * @param {string} url
 * @returns {Promise<*>}
 */
exports.fetchHtml = async (url) => {
  const res = await fetch(url);
  const body = await res.buffer();
  return cheerio.load(body);
};
