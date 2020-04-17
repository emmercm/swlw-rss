'use strict';

const async = require('async');

const config = require('./config');
const { getIssues, getIssue } = require('./swlw-fetch');
const { writeIssuesRss, writeIssueRss } = require('./swlw-rss');
const { generateHtmlDirectory } = require('./html');

/**
 * Main function.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
  const issues = await getIssues();
  writeIssuesRss(issues);

  const latestPosts = await getIssue(issues[0]);
  writeIssueRss(issues[0], latestPosts, 'latest.rss');

  // async.eachLimit(issues.slice(0, config.maxIssues), 5, async (issue) => {
  //   const posts = await getIssue(issue);
  //   writeIssueRss(issue, posts);
  // }, (err) => {
  //   if (err) {
  //     throw new Error(err);
  //   }

    generateHtmlDirectory();
  // });
};

main();
