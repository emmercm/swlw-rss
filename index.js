'use strict';

const async = require('async');

const config = require('./lib/config');
const { getIssues, getIssue } = require('./lib/swlw-fetch');
const { writeIssuesRss, writeIssueRss } = require('./lib/swlw-rss');
const { generateHtmlDirectory } = require('./lib/html');

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

  await async.eachLimit(issues, 5, async (issue) => {
    const posts = await getIssue(issue);
    writeIssueRss(issue, posts);
  }, (err) => {
    if (err) {
      throw new Error(err);
    }

    generateHtmlDirectory(issues);
  });
};

main();
