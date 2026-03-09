const fg = require('fast-glob');
const path = require('upath');
const _ = require('lodash');
var fs = require('fs');

const docsDir = path.resolve(__dirname, '../.storybook/docs');

/**
 *
 */
const getProps = (file) => {
	const lines = fs
		.readFileSync(file)
		.toString()
		.split('\n')
		.map((line) => line.replace(/(\r\n|\n|\r|\t)/gm, ''));
	const _index = lines.findIndex((value) => value === ':root {');
	const _props = _.compact(lines.slice(_index + 1));
	_props.pop();
	return _props.map((prop) => {
		const [key, value] = prop.replace(';', '').split(':');
		return { key: _.trim(key), value: _.trim(value) };
	});
};

/**
 *
 */
const _props = fg
	.sync([path.resolve(__dirname, '../src/themes/scib/components/**/*.scss')])
	.filter((file) => !file.endsWith('/_index.scss'))
	.reduce((acc, file) => {
		const [type, name] = _.last(file.split('/components/')).split('/');
		let _name = `scib-${name.replace('.scss', '')}`;
		if (['apps', 'atoms', 'molecules', 'organisms', 'ui-v2'].includes(type)) {
			_name = `scib-${type}-${name.replace('.scss', '')}`;
		}
		acc[_name.replace('scib-ui-v2-ui-v2-', 'scib-ui-v2-')] = { type, customProps: getProps(file) };
		return acc;
	}, {});

if (!fs.existsSync(docsDir)) {
	fs.mkdirSync(docsDir);
}

/**
 *
 */
const fileDocs = path.resolve(docsDir, 'components-data.json');
const fileProps = path.resolve(docsDir, 'custom-props.json');

fs.writeFileSync(fileProps, JSON.stringify(_props, null, 2));

if (!fs.existsSync(fileDocs)) {
	fs.writeFileSync(fileDocs, JSON.stringify({}, null, 2));
}
