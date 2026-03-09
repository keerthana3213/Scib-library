const [path, fs, utils] = [require('path'), require('fs'), require('./utils')];

const COMMON_EXCLUDES = ['node_modules', 'src/**/*stories.tsx', '**/*.spec.ts'];
const COMMON_INCLUDES = ['src/tailwind.config.ts', 'src/utils', 'src/components.d.ts'];

// Configuración de componentes
const COMPONENT_CONFIG = utils.COMPONENTS_TSCONFIG_PATHS;

const componentType = process.env.COMPONENT_TYPE;

if (!componentType || !COMPONENT_CONFIG[componentType]) {
	console.error(`Invalid component type. Valid types are: ${Object.keys(COMPONENT_CONFIG).join(', ')}`);
	process.exit(1);
}

// Ruta del archivo tsconfig.dev.json
const tsconfigPath = path.join(process.cwd(), 'tsconfig.dev.json');

// Comprobar si el archivo tsconfig.dev.json existe
if (!fs.existsSync(tsconfigPath)) {
	console.log('⚠️ tsconfig.dev.json not found. Generating a new one...');
	const defaultTsconfigDev = {
		extends: './tsconfig.json',
		include: [],
		exclude: []
	};
	fs.writeFileSync(tsconfigPath, JSON.stringify(defaultTsconfigDev, null, 2));
	console.log('✅ tsconfig.dev.json has been created.');
}

// Leer el tsconfig.dev.json
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Actualizar el tsconfig.dev.json con la configuración del componente
const componentConfig = COMPONENT_CONFIG[componentType];
tsconfig.include = [...COMMON_INCLUDES, ...componentConfig.include];
tsconfig.exclude = [...COMMON_EXCLUDES, ...componentConfig.exclude];

try {
	// Guardar el tsconfig.json actualizado
	fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

	// Listar los componentes que se van a compilar
	console.log('\n📦 Components to be compiled:');
	console.log('===========================');

	const includes = tsconfig.include.filter((include) => include.includes('components') && !include.endsWith('components.d.ts'));
	includes.forEach((include) => {
		const componentPath = include.replace('src/components/', '').replace('/**/*', '');
		console.log(`\n🔹 ${componentPath}:`);

		// Leer el directorio de componentes
		const fullPath = path.join(process.cwd(), 'src/components', componentPath);

		if (fs.existsSync(fullPath)) {
			const components = fs.readdirSync(fullPath).filter((item) => fs.statSync(path.join(fullPath, item)).isDirectory());
			components.forEach((component) => {
				console.log(`   └─ ${component}`);
			});
		} else {
			console.log('   └─ No components with stories found');
		}
	});

	console.log('\n✅ Successfully updated tsconfig.dev.json for', componentType, 'components');
} catch (error) {
	console.error(`Error compiling ${componentType} components: ${error.message}`);
	process.exit(1);
}
