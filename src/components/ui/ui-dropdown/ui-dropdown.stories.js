import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Dropdown',
	...getStoryConfig('scib-ui-dropdown'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style='display: grid; grid-template-columns: 100%;'>
		<div>
			<scib-ui-dropdown
				literals='${parseObject(args.literals)}'
				label='${args.label}'
				header='${args.header}'
				options='${parseObject(args.options)}'
				metadatavalues='${parseBoolean(args.metadatavalues)}'
				multipleselector='${args.multipleselector}'
				disabledselector='${parseBoolean(args.disabledselector)}'
				idselect='${args.idselect}'
				large='${parseBoolean(args.large)}'
				medium='${parseBoolean(args.medium)}'
				small='${parseBoolean(args.small)}'
				enableitemaddition='${parseBoolean(args.enableitemaddition)}'
				noborders='${parseBoolean(args.noborders)}'
				iconheader='${args.iconheader}'
				isloading='${parseBoolean(args.isloading)}'
				reset='${parseBoolean(args.reset)}'
				show-asterisk-if-required='${parseBoolean(args.showAsteriskIfRequired)}'
				boldtext='${parseBoolean(args.boldtext)}'
			>
			</scib-ui-dropdown>
		</div>
		<div>
			<scib-ui-dropdown
				literals='${parseObject(args.literals)}'
				label='LABEL2'
				header='LABEL2'
				options='${parseObject(args.options)}'
				metadatavalues='${parseBoolean(args.metadatavalues)}'
				multipleselector='${args.multipleselector}'
				disabledselector='${parseBoolean(args.disabledselector)}'
				idselect='LABEL2'
				large='${parseBoolean(args.large)}'
				medium='${parseBoolean(args.medium)}'
				small='${parseBoolean(args.small)}'
				enableitemaddition='${parseBoolean(args.enableitemaddition)}'
				noborders='${parseBoolean(args.noborders)}'
				iconheader='${args.iconheader}'
				isloading='${parseBoolean(args.isloading)}'
			>
			</scib-ui-dropdown>
		</div>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		addItemLabel: 'Add to a new group',
		itemInputLabel: 'NEW GROUP NAME*',
		inputPlaceholder: 'Enter value',
	},
	label: 'Label',
	header: 'Choose Class',
	multipleselector: 'single',
	idselect: 'documentClass',
	boldtext: 'false',
	options: [
		{
			id_doc_type: '01AS',
			t_name: 'Accounting controls',
		},
		{
			id_doc_type: '01BA',
			t_name: 'Contracts',
		},
		{
			id_doc_type: '01CDD',
			t_name: 'Legal persons and entities',
		},
	],
	// Add default values here
};
