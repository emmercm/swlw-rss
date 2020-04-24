'use strict';

const fs = require('fs');
const path = require('path');
const RSS = require('rss');

const config = require('./config');

/**
 * Make an RSS feed.
 *
 * @param {string} filename
 * @param {object} feedOptions
 * @param {object} items
 */
const writeRss = (filename, feedOptions, items) => {
  const feed = new RSS(feedOptions);
  items
    .slice(0, config.maxRssItems)
    .forEach((item) => {
      feed.item(item);
    });

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir);
  }
  fs.writeFileSync(path.join(config.outputDir, filename), feed.xml());
};

/**
 * Write a list of issues to an RSS file.
 *
 * @param {object[]} issues
 */
exports.writeIssuesRss = (issues) => {
  writeRss('issues.rss', {
    title: config.swlwTitle,
    site_url: config.swlwUrl,
  }, issues);
};

/**
 * Write a single issue to an RSS file.
 *
 * @param {object} issue
 * @param {object[]} posts
 * @param {string=} filename
 * @returns {Promise<*>}
 */
exports.writeIssueRss = async (issue, posts, filename) => {
  if (!filename) {
    const issueNumber = (issue.title.match(/([0-9]+)/) || [null, null])[1];
    if (!issueNumber) {
      throw new Error(`couldn't find issue number: ${issue.title}`);
    }
    filename = `${issueNumber}.rss`;
  }

  let { title } = issue;
  if (title.toLowerCase().indexOf(config.swlwTitle.toLowerCase()) === -1) {
    title = `${config.swlwTitle} ${title}`;
  }

  writeRss(filename, {
    title,
    site_url: issue.url,
  }, posts);

  return posts;
};
