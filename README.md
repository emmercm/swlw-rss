# [swlw-rss](https://swlw-rss.netlify.app/)

❄️ Software Lead Weekly RSS Feeds

## Motivation

Software Lead Weekly doesn't offer RSS feeds of any kind, even a master list of all issues. The main motivation is to provide RSS feeds that can be used by software such as [Calibre](https://calibre-ebook.com/).

## Building

This website is built with [Node.js](https://nodejs.org):

```bash
node index
```

The resulting `build` directory contains the output, similar to:

```text
build
├── 1.rss
├── 2.rss
├── 3.rss
├── index.html
├── issues.rss
└── latest.rss
```

## Deploying

This website is set up to be hosted with [Netlify](https://www.netlify.com/).
