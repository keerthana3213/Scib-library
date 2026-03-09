module.exports = {
	fontName: 'scib-icons',
	template: 'scss',
	dest: './src/assets/fonts',
	destTemplate: './src/scss/03_elements',
	templateClassName: 'icon',
	templateFontPath: '#{settings.$font_path}',
	fontHeight: 800,
	normalize: true,
	centerHorizontally: false,
	fixedWidth: false,
	addHashInFontUrl: true,
	glyphTransformFn: (obj) => {
		const { name } = obj;
		if (!name.startsWith('OLD_')) {
			const parts = name.split('_');
			parts.shift();
			obj['name'] = parts.join('_');
		} else {
			obj['name'] = name.replace('OLD_', '');
		}
		return obj;
	}
};
