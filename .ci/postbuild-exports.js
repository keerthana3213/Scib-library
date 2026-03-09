// .ci/postbuild-exports.js
// Añade exports automáticos a dist/types/index.d.ts y dist/index.js

const fs = require('fs');
const path = require('path');

// Configura aquí los exports que quieras añadir
defineExports();

function defineExports() {
	// Para dist/types/index.d.ts (exports de tipos)
	const typeExports = [
		{ path: '../angular', isType: true }
		// Puedes añadir más: { path: '../otra-cosa', isType: true }
	];

	// Para dist/index.js (exports de JS)
	const jsExports = [
		{ path: './angular/index.js', isType: false }
		// Puedes añadir más: { path: './esm/index.js', isType: false }
	];

	updateFile(path.join(__dirname, '../dist/types/index.d.ts'), typeExports.map((e) => `export * from '${e.path}';`).join('\n'));
	updateFile(path.join(__dirname, '../dist/index.js'), jsExports.map((e) => `export * from '${e.path}';`).join('\n'));
}

function updateFile(filePath, exportBlock) {
	let content = '';
	if (fs.existsSync(filePath)) {
		content = fs.readFileSync(filePath, 'utf8');
		// Elimina exports previos generados por este script
		content = content.replace(/\/\/ AUTO-EXPORTS-START[\s\S]*?\/\/ AUTO-EXPORTS-END/g, '');
		content = content.trim();
	}
	// Añade los nuevos exports
	const autoBlock = `// AUTO-EXPORTS-START\n${exportBlock}\n// AUTO-EXPORTS-END`;
	if (content) {
		content += '\n' + autoBlock + '\n';
	} else {
		content = autoBlock + '\n';
	}
	fs.writeFileSync(filePath, content, 'utf8');
	console.log(`Actualizado: ${filePath}`);
}
