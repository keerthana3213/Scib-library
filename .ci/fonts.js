const webfont = require('webfont').default;
const path = require('upath');
const _ = require('lodash');
const fs = require('fs');

const iconsMap = {};

webfont({
	files: path.join(__dirname, '../src/assets/icons/*.svg'),
	glyphTransformFn: (obj) => {
		const { path, name, unicode = [] } = obj;
		const [code] = unicode;
		if (!name.startsWith('OLD_')) {
			const parts = name.split('_');
			parts.shift();
			iconsMap[parts.join('_')] = code;
		} else {
			iconsMap[name.replace('OLD_', '')] = code;
		}
		return obj;
	}
}).then(() => {
	let iconsFile = path.join(__dirname, `../src/scss/03_elements/scib-icons.scss`);
	let rows = fs.readFileSync(iconsFile).toString().split('\n');
	rows.forEach((row, index) => (rows[index] = row.replace(/\?\d+&v=/g, '?v=')));
	rows.unshift(`@use '../01_settings/settings';`);
	rows.push(`:root{`);
	Object.keys(iconsMap).forEach((key) => {
		rows.push(`\t--theme-scib-icon-${key}: "${iconsMap[key]}";`);
	});
	rows.push('}');
	fs.writeFileSync(iconsFile, rows.join('\n'));
});
