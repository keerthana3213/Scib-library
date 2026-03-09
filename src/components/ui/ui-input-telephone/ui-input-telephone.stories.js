import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Input telephone',
	...getStoryConfig('scib-ui-input-telephone', {status: 'deprecated'}),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => {
	return render(args, `
	<div style='padding: 1rem; max-width: 340px'>
		<scib-ui-input-telephone  id="input"
			language='${args.language}'
			placeholder='${args.placeholder}'
			literals='${JSON.stringify(args.literals)}'
			name='${args.name}'
			id-input='${args.idInput}'
		></scib-ui-input-telephone>
	</div>
`)
};

// Default Story
export const Develop = Template.bind();
Develop.args = {
	languague: 'en',
	placeholder: 'Enter a number',
	name: 'Name',
	literals: {
		format: 'Formato incorrecto',
		required: 'Campo requerido',
		requiredCountry: 'Prefijo obligatorio'
	},
	idInput: 'phone'
	// Add default values here
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
 const TemplateLanguage = (args) => {
	setTimeout(() => {
		const buttonEs = document.getElementById('button-es');
		buttonEs.addEventListener('click',() => {
			document.getElementById('input').setAttribute('language', 'es-ES')}
		);

		const buttonEn = document.getElementById('button-en');
		buttonEn.addEventListener('click',() => {
			document.getElementById('input').setAttribute('language', 'en-GB')}
		)
		alert('Se han cargado los eventos')
	}, 4000)

	return render(args, `
	<button id="button-es">Cambiar a español</button>
	<button id="button-en">Cambiar a inglés</button>
	<div style='padding: 1rem; max-width: 340px'>
		<scib-ui-input-telephone class="no-validate"  id="input"
			language='${args.language}'
			label='${args.label}'
			placeholder='${args.placeholder}'
			literals='${JSON.stringify(args.literals)}'
			name='${args.name}'
			id-input='${args.idInput}'
		></scib-ui-input-telephone>
	</div>
`)
};

// Default Story
export const TestLanguague = TemplateLanguage.bind();
TestLanguague.args = {
	label: 'Phone Number*',
	languague: 'en',
	placeholder: 'Enter a number',
	name: 'Name',
	literals: {
		format: 'Formato incorrecto',
		required: 'Campo requerido',
		requiredCountry: 'Prefijo obligatorio'
	},
	idInput: 'phone'
	// Add default values here
};
