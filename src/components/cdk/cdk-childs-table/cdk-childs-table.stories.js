import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Childs Table',
	...getStoryConfig('scib-cdk-childs-table'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-childs-table
		slot='child'
		labels='${parseObject(args.labels)}'
		childs='${parseObject(args.childs)}'
	></scib-cdk-childs-table>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	labels: [
		'Status',
		'Product',
		'Currency',
		'Bank Swift Code',
		'Account Number',
	],
	childs: {
		data: [
			{
				'status': 'Pending',
				'product': 'Flexible incoming',
				'currency': 'EUR',
				'bicCorresponsal': '123456789127',
				'cuentaCorresponsal': 'TRG1 ESMMXXXX00015000490000F2',
			},
		],
	},
	// Add default values here
};
