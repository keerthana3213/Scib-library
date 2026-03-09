const { importer } = require('sass-import-modules');
const { updateThemes } = require('./utils');
const { last, isEmpty } = require('lodash');
const { rimraf } = require('rimraf');
const fg = require('fast-glob');
const path = require('upath');
const sass = require('sass');
const fs = require('fs');

updateThemes();

const themeModes = fg.sync([path.join(__dirname, '../src/flame/**/(dark|light).css')]);
(themeModes || []).forEach((file) => {
	const mode = (last(file.split('/')) || '').replace('.css', '');
	if (!isEmpty(mode)) {
		const _buffer = fs.readFileSync(file);
		const _fileContent = _buffer.toString();
		let _newFileContent = _fileContent;
		if (mode === 'dark') {
			_newFileContent = _fileContent.replaceAll(':root {', `:root[mode='${mode}'] {`);
		}
		const _newFile = path.join(__dirname, `../src/themes/scib/${mode}.scss`);
		fs.writeFileSync(_newFile, _newFileContent);
	}
});

const files = fg.sync([path.join(__dirname, '../src/themes/**/theme.scss')]);
const themesPath = '../src/assets/themes';
rimraf(path.join(__dirname, themesPath)).then(() => {
	files.forEach((file) => {
		const parts = file.split('/');
		const name = parts[parts.length - 2];
		sass.render(
			{
				file: file,
				importer: importer(),
				outputStyle: 'compressed'
			},
			(error, result) => {
				if (!error) {
					const destPath = path.join(__dirname, themesPath);
					if (!fs.existsSync(destPath)) {
						fs.mkdirSync(destPath);
					}
					fs.writeFile(path.join(__dirname, themesPath, `${name}.css`), result.css, (e) => {});
				} else {
					console.error(error);
				}
			}
		);
	});
});
