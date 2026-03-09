const { getThemesList, updateThemes, getComponents, updatePlaygrounds } = require('../.ci/utils');
const camelCase = require('lodash/camelCase');
const startCase = require('lodash/startCase');
const config = require('./config.json');
const { execSync } = require('child_process');

const storyTypes = {};
const componentTypes = (config && config.options || []).map(option => {
	storyTypes[option.folder] = option.storyGroupName;
	return {
		name: option.name,
		value: option.folder,
	}
});
const isIsolatedComponentBuild = process.env.TYPE_BUILDER === 'isolated-component-build';
module.exports = function(plop) {

	if(isIsolatedComponentBuild){
		plop.setActionType('prepareTsConfig', (answers) => {
			try {
				execSync(`cd .. && cross-env COMPONENT_TYPE=${answers.componentType} node .ci/prepare-tsconfig.js --component=${answers.componentType} && cross-env COMPONENT_TYPE=${answers.componentType} npm run start:servers`, { stdio: 'inherit' });
				return 'Successfully configured tsconfig.json for isolated component build';
			} catch (error) {
				return `Error configuring tsconfig.json: ${error.message}`;
			}
		});

		plop.setGenerator('Type Compiler', {
			description: 'Configure isolated component compilation',
			prompts: [
				{
					type: 'list',
					name: 'componentType',
					message: 'Select the type of component to build:',
					choices: [
						{
							name: 'Atoms - Fundamental building blocks of UI components',
							value: 'atoms'
						},
						{
							name: 'Molecules - Groups of atoms combined to form reusable components',
							value: 'molecules'
						},
						{
							name: 'Organisms - Complex components composed of molecules and atoms',
							value: 'organisms'
						},
						{
							name: 'Apps - High-level applications composed of multiple components',
							value: 'apps'
						},
						{
							name: 'All - Compile all components (Atoms, Molecules, Organisms, Apps, and deprecated components)',
							value: 'all'
						}
					]
				}
			],
			actions: [
				{
					type: 'prepareTsConfig'
				}
			]
		})
	} else {
		plop.setHelper('storyType', (type) => storyTypes[type] || 'Empty config');

		plop.setHelper('fragmentName', (type, parent, name) => {
			const fragmentName = parent.replace(`${type}-`, '') + `-${name}`;
			return startCase(camelCase(fragmentName)).replace(/ /g, '');
		});

		plop.setActionType('updateThemes', updateThemes);

		plop.setActionType('updatePlaygrounds', () => {
			try {
				updatePlaygrounds();
				return 'Playgrounds actualizados';
			} catch (e) {
				return 'No se han podido actualizar los playgrounds, intenta hacerlo manualmente con el comando: npm run playgrounds:generator';
			}
		});

		plop.setGenerator('Component', {
			description: 'Create a stencil JS component',
			prompts: [
				{
					type: 'input',
					name: 'name',
					message: 'Component Name (without prefix)',
				},
				{
					type: 'list',
					name: 'type',
					choices: componentTypes,
				},
			],
			actions: [
				{
					type: 'add',
					path: '../src/components/{{type}}/{{dashCase name}}/component/{{dashCase name}}.tsx',
					templateFile: 'component/component/component.tsx.hbs',
				},
				{
					type: 'add',
					path: '../src/components/{{type}}/{{dashCase name}}/component/{{dashCase name}}.scss',
					templateFile: 'component/component/component.scss.hbs',
				},
				{
					type: 'add',
					path: '../src/components/{{type}}/{{dashCase name}}/models/{{dashCase name}}.model.ts',
					templateFile: 'component/models/component.model.ts.hbs',
				},
				{
					type: 'add',
					path: '../src/components/{{type}}/{{dashCase name}}/test/{{dashCase name}}.spec.tsx',
					templateFile: 'component/test/component.spec.tsx.hbs',
				},
				{
					type: 'add',
					path: '../src/components/{{type}}/{{dashCase name}}/{{dashCase name}}.stories.tsx',
					templateFile: 'component/component.stories.tsx.hbs',
				},
				...getThemesList().map(theme => ({
					type: 'add',
					path: `../src/themes/${theme}/components/{{type}}/{{dashCase name}}.scss`,
					templateFile: 'component/scss/component.scss.hbs',
				})),
				{
					type: 'updateThemes',
				},
			],
		});

		plop.setGenerator('Functional Components', {
			description: 'Create a functional component for chosen component ',
			prompts: [
				{
					type: 'list',
					message: 'Parent type',
					name: 'type',
					choices: componentTypes,
				},
				{
					type: 'list',
					message: 'Parent component',
					name: 'parent',
					when: ({ type }) => {
						const next = getComponents(type).length > 0;
						if (!next) {
							console.log(`No hay componentes de tipo: ${type}`);
							console.log('Primero genera un componente padre');
							process.exit(0);
						}
						return next;
					},
					choices: ({ type }) => getComponents(type),
				},
				{
					type: 'input',
					name: 'name',
					message: 'Functional component name',
				},
			],
			actions: [
				{
					type: 'add',
					path: '../src/components/{{type}}/{{dashCase parent}}/fragments/{{dashCase parent}}-{{dashCase name}}.fragment.tsx',
					templateFile: 'fragment/fragment.tsx.hbs',
				}
			],
		});

		plop.setGenerator('Playground APP', {
			description: 'Create a stencil Playground APP',
			prompts: [
				{
					type: 'input',
					name: 'name',
					message: 'Playground app name',
				},
			],
			actions: [
				{
					type: 'add',
					path: '../src/playgrounds/{{dashCase name}}/index.html',
					templateFile: 'playground/index.hbs',
				},
				{
					type: 'updatePlaygrounds',
				},
			],
		})
	}

};
