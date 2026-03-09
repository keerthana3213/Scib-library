const replace = require('replace-in-file');
const fg = require('fast-glob');
const path = require('upath');

const files = fg.sync([path.join(__dirname, '../dist/scib-ui-kit/**/*.css')]);

(files || []).forEach((file) => {
	const options = {
		files: file,
		from: /\/assets\//g,
		to: 'assets/'
	};
	replace.sync(options);
});
