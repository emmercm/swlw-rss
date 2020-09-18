'use strict';

const { DateTime } = require('luxon');

const config = require('./config');
const { fetchHtml } = require('./fetch');

/**
 * Get a list of SWLW issues.
 *
 * @returns {object[]}
 */
exports.getIssues = async () => {
  const $ = await fetchHtml(config.swlwIssuesUrl);

  const $issues = $('.table-issue');
  if (!$issues.length) {
    throw new Error('no issues found');
  }

  return $issues
    .map((i, elem) => {
      const $elem = $(elem);

      const title = $elem.find('.title-table-issue a').text();
      if (!title) {
        throw new Error('failed to find title');
      }

      let url = $elem.find('.title-table-issue a').attr('href').toString();
      if (url.indexOf('://') === -1) {
        if (url[0] === '/') {
          url = `${config.swlwUrl}${url}`;
        } else {
          url = `${config.swlwIssuesUrl}/${url}`;
        }
      }
      if (!url) {
        throw new Error('failed to find link');
      }

      const text = $elem.find('.text-table-issue').text()
        .trim()
        .replace(/^([0-9]+)(st|nd|rd|th)/, '$1');
      let date = DateTime.fromFormat(text, 'd LLLL y');
      if (!date || !date.isValid) {
        throw new Error('failed to find date');
      }
      date = date.toJSDate();

      const issueNumber = (title.match(/([0-9]+)/) || [null, null])[1];
      if (!issueNumber) {
        throw new Error(`couldn't find issue number: ${title}`);
      }
      const filename = `${issueNumber}.rss`;

      return {
        title,
        description: title,
        url,
        date,
        filename,
      };
    })
    .get()
    .slice(0, config.maxIssues);
};

/**
 * Get a list of posts from an SWLW issue.
 *
 * @param {object} issue
 * @returns {object[]}
 */
exports.getIssue = async (issue) => {
  const $ = await fetchHtml(issue.url);

  const $posts = $('.topic-title').siblings('div');
  if (!$posts.length) {
    throw new Error(`no posts found for ${issue.url}`);
  }

  return $posts
    .map((i, elem) => {
      const $elem = $(elem);

      const title = $elem.find('.post-title').text();
      if (!title) {
        throw new Error('failed to find title');
      }

      const url = $elem.find('.post-title').attr('href').toString();
      if (!url) {
        throw new Error('failed to find link');
      }

      $elem.children().remove();
      let description = $(elem).text();
      description = (description.match(/.+\n(.+)\n.+/) || [null, description])[1].trim();

      return {
        title, description, url, date: issue.date,
      };
    })
    .get();
};
