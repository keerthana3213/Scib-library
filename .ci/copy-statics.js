const path = require('upath');
var fs = require('fs');

const source = path.resolve(__dirname, '../dist/scib-ui-kit');
const destination = path.resolve(__dirname, '../dist/storybook/stencil-server');

fs.cpSync(source, destination, { recursive: true });
