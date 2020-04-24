'use strict';

const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');

const config = require('./config');

/**
 * Generate a file directory index.html.
 */
exports.generateHtmlDirectory = () => {
  const source = fs.readFileSync(`${__dirname}/${path.parse(__filename).name}.hbs`).toString();
  const template = Handlebars.compile(source);

  const files = fs.readdirSync(config.outputDir).sort().reverse();
  const result = template({ files });
  fs.writeFileSync(path.join(config.outputDir, 'index.html'), result);
};
