import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Header Summary',
	...getStoryConfig('scib-cdk-header-summary'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-header-summary
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		no-have-back-btn='${parseBoolean(args.noHaveBackBtn)}'
		no-have-stats='${parseBoolean(args.noHaveStats)}'
		is-simple='${parseBoolean(args.isSimple)}'

	></scib-cdk-header-summary>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		accessibleLoading: 'Loading info...',
		countedItemsName: 'Contracts',
		progressItemsLabel: 'Templates Assigned',
		progressItemsName: 'Groups',
		tableListLabel: 'Ungrouped',
		tableListName: 'Contracts',
		buttonLabelList: ['New Group'],
	},
	data: {
		titleName: 'Endesa Energía SAU',
		subtitleName: 'GLCS: 29384LJ',
		countedItems: 425,
		progressPart: 3,
		progressTotal: 5,
		tableListCount: 6,
		buttons: [
			{
				eventName: 'newGroup',
				type: 'primary',
			},
		],
		buttonsAlign: true,
	},
	noHaveBackBtn: false,
	noHaveStats: false,
	isSimple: false
	// Add default values here
};
