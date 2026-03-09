const SVGFixer = require('oslllo-svg-fixer');
const { rimraf } = require('rimraf');
const path = require('upath');
const fg = require('fast-glob');

SVGFixer(path.join(__dirname, '../src/assets/icons/fix'), path.join(__dirname, '../src/assets/icons')).fix((error) => {
	if (error) {
		console.log(error);
	} else {
		const files = fg.sync([path.resolve(__dirname, '../src/assets/icons/fix/**/*.svg')]);
		Promise.all(files.map((file) => rimraf(file))).then(() => {
			console.log('done');
		});
	}
});
