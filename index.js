'use strict';

const async = require('async');
const urlExist = require('url-exist');

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

  // If this is a Netlify build, short circuit if we don't need to build
  if (process.env.NETLIFY) {
    const exists = await urlExist(`${process.env.URL}/${issues[0].filename}`);
    if (exists) {
      // TODO: find a better way to not cause a build failure due to missing output
      return;
    }
  }

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
