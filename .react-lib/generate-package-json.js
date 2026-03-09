// Script para generar package.json en la carpeta react después del build
const fs = require('fs');
const path = require('path');

const srcPkgPath = path.resolve(__dirname, 'package.json');
const destDir = path.resolve(__dirname, '../react');
const destPkgPath = path.join(destDir, 'package.json');

// Leer el package.json fuente
const srcPkg = JSON.parse(fs.readFileSync(srcPkgPath, 'utf8'));

// Construir el nuevo package.json para la carpeta react
const newPkg = {
	name: srcPkg.name,
	version: srcPkg.version,
	main: 'index.js',
	module: 'index.js',
	typings: 'index.d.ts',
	exports: {
		'./package.json': {
			default: './package.json'
		},
		'.': {
			esm: './index.js',
			import: './index.js',
			esm2022: './index.js',
			default: './index.js',
			types: './index.d.ts'
		}
	},
	sideEffects: false,
	dependencies: srcPkg.dependencies || {}
};

// Crear la carpeta destino si no existe
if (!fs.existsSync(destDir)) {
	fs.mkdirSync(destDir);
}

// Escribir el nuevo package.json
fs.writeFileSync(destPkgPath, JSON.stringify(newPkg, null, 2));

console.log('package.json generado en /react');
