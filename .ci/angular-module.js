const utils = require('./utils');
const fg = require('fast-glob');
const path = require('upath');
const _ = require('lodash');
const fs = require('fs');

const PREFIX = 'scib';

const pascalCase = (str) => _.startCase(_.camelCase(`${PREFIX}-${str}`)).replace(/ /g, '');

const folders = ['cdk', 'ecmv', 'ui', 'ui-v2', 'atoms', 'molecules', 'organisms'];

const components = folders.reduce(
	(acc, folder) => [
		...acc,
		...utils.getComponents(folder).map((component) => {
			if (folder === 'atoms' || folder === 'molecules' || folder === 'organisms') {
				return pascalCase(`${folder}-${component.value}`);
			} else {
				return pascalCase(component.value);
			}
		})
	],
	[]
);

const baseFolder = '.angular-lib/src/lib';

// Angular 12
const moduleFile = path.join(__dirname, `../${baseFolder}/index.ts`);
const wstream = fs.createWriteStream(moduleFile, { encoding: 'utf8' });
const accessors = fg.sync([path.join(__dirname, `../${baseFolder}/*-value-accessor.ts`)]).map((file) => {
	const fileName = _.trimEnd(_.last(file.split('/')), '.ts');
	const className = _.startCase(_.camelCase(fileName)).replace(/ /g, '');
	return { fileName, className };
});

accessors.forEach((accesor) => {
	const { fileName, className } = accesor;
	wstream.write(`import { ${className} } from './${fileName}';\n`);
});

wstream.write(`import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import * as Components from './components';\n\n`);

const declarations = accessors.map((accessor) => accessor.className).join(',');
wstream.write(`@NgModule({
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	declarations: [${declarations}],
	exports: [${declarations}],
})\n`);

wstream.write(`export class ValueAccessorsModule {}\n`);

components.forEach((component) =>
	wstream.write(`
@NgModule({
	imports: [ValueAccessorsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	declarations: [Components.${component}],
	exports: [ValueAccessorsModule, Components.${component}],
})
export class ${component}Module {}
`)
);

wstream.write(`
const modules = [
	ValueAccessorsModule,
`);
components.forEach((component) => wstream.write(`	${component}Module,\n`));
wstream.write(`];`);

wstream.write(`

@NgModule({
	imports: modules,
	exports: modules,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AngularUiKitModule {}
`);

wstream.write(`
export * from './components';
`);

wstream.end();

const utilsFile = path.join(__dirname, `../${baseFolder}/angular-component-lib/utils.ts`);

fs.readFile(utilsFile, 'utf8', (err, data) => {
	if (err) {
		return console.log(err);
	}

	let result = data.replace(`import { fromEvent } from 'rxjs';`, `import { EventEmitter } from '@angular/core';`);
	result = result.replace(`instance[eventName] = fromEvent(el, eventName)`, `instance[eventName] = new EventEmitter()`);

	fs.writeFile(utilsFile, result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});
