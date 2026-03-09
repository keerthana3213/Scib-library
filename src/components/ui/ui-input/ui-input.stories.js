import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Input',
	...getStoryConfig('scib-ui-input', {status: 'deprecated'}),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style='padding: 1rem; max-width: 340px'>
		<scib-ui-input
			label='${args.label}'
			name='${args.name}'
			icon-inner-right='${args.iconInnerRight}'
			placeholder='${args.placeholder}'
			multiselect='${parseBoolean(args.multiselect)}'
			required='${parseBoolean(args.required)}'
			error='${args.error}'
			no-icon-right='${parseBoolean(args.noIconRight)}'
			icon-label='${parseBoolean(args.iconLabel)}'
			copy-info='${parseBoolean(args.copyInfo)}'
			show-label-tooltip='${parseBoolean(args.infoTooltip)}'
			info-tooltip-text='${args.tooltipText}'
			is-password-field='${true}'
		></scib-ui-input>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	label: 'Name*',
	iconInnerRight: 'icon-open-eye',
	name: 'name',
	noIconRight: true,
	required: true,
	placeholder: 'Placeholder',
	error: 'campo requerido',
	multiselect: false,
	iconLabel: false,
	copyInfo: false,
	infoTooltip: true,
	tooltipText:'This is a sample text, Lorem ipsum'
	// Add default values here
};

const TemplateAutocomplete = (args) => render(args, `
	<div style='padding: 1rem; max-width: 340px'>
		<scib-ui-input
			autocomplete
			multiselect='${false}'
			loading='${parseBoolean(args.loading)}'
			options='${parseObject(args.options)}'
			label='${args.label}'
			placeholder='${args.placeholder}'
		></scib-ui-input>
	</div>
`);

// Autocomplete Story
export const Autocomplete = TemplateAutocomplete.bind();
Autocomplete.args = {
	label: 'Label',
	placeholder: '',
	loading: false,
	options: [
		{
			value: 'jcardenas@santander.es',
			name: 'Jesús Cárdenas Vizcaíno',
			avatar: {
				src:
                'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				alt: 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
			value: 'jmartinez@santander.es',
			name: 'Jeremías Martínez',
			avatar: {
                src:
					'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
                    alt: 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
			value: 'jperez@santander.es',
			name: 'Jerónimo Pérez',
			avatar: {
				src:
					'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
                    alt: 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
			value: 'asanchez@santander.es',
			name: 'Alba Sanchez',
			avatar: {
                src:
                'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				alt: 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
            value: 'jmiguel@santander.es',
			name: 'José Miguel Martínez',
			avatar: {
                src:
					'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
                    alt: 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
            value: 'aarturo@santander.es',
			name: 'Adán Arturo Martínez',
			avatar: {
                src:
                'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				alt: 'Adán Arturo Martínez',
			},
		},
	],
	// Add default values here
};

const TemplateSearch = (args) => render(args, `
	<div style='padding: 1rem; max-width: 340px'>
		<scib-ui-input
			search-input
			loading='${parseBoolean(args.loading)}'
			options='${parseObject(args.options)}'
			label='${args.label}'
			placeholder='${args.placeholder}'
			char-min='${args.charMin}'
			no-icon-right='${parseBoolean(args.noIconRight)}'
			no-min-height='${parseBoolean(args.noMinHeight)}'
			no-result='${args.noResult}'
			multiselect='${parseBoolean(args.multiselect)}'
			error='${args.error}'
            ></scib-ui-input>
            </div>
            `);
            
// Search autocomplete Story
export const Search = TemplateSearch.bind();
Search.args = {
    label: 'Entity or GLCS',
	name: 'entity_glcs_finder',
	placeholder: 'Enter entity or GLCS',
	multiselect: false,
	loading: false,
	iconInnerRight: 'icon-fill-clear',
	noIconRight: false,
	noMinHeight:true,
	charMin: 3,
	noResult: 'No results found',
	error: 'Min 3',
	options: [
        {
            value: 'jcardenas@santander.es',
			name: 'Jesús Cárdenas Vizcaíno'
		},
		{
			value: 'jmartinez@santander.es',
			name: 'Jeremías Martínez'
		},
		{
            value: 'jperez@santander.es',
			name: 'Jerónimo Pérez'
		},
		{
			value: 'asanchez@santander.es',
			name: 'Alba Sanchez'
		},
		{
            value: 'jmiguel@santander.es',
			name: 'José Miguel Martínez'
		},
		{
			value: 'aarturo@santander.es',
			name: 'Adán Arturo Martínez'
		}
	],
	// Add default values here
};

const TemplateConversation = (args) => render(args, `
    <div style='padding: 1rem; max-width: 340px'>
        <scib-ui-input
            as-inline='${parseBoolean(args.asInline)}'
            capitalize-label='${parseBoolean(args.capitalizeLabel)}'
            no-min-height='${parseBoolean(args.noMinHeight)}'
            required='${parseBoolean(args.required)}'
            input-text-large='${parseBoolean(args.required)}'
            label='${args.label}'
            name='${args.name}'
        ></scib-ui-input>
    </div>
`);

// Input new conversation Story
export const Conversation = TemplateConversation.bind();
Conversation.args = {
    asInline: true,
	label: 'Subject',
	name: 'subject_input',
	noMinHeight: true,
    capitalizeLabel: true,
    required: true,
    inputTextLarge: true
	// Add default values here
};