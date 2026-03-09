import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Add Element',
	...getStoryConfig('scib-cdk-add-element'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-add-element section='${args.section}' data='${parseObject(args.data)}'></scib-cdk-add-element>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	data: [
		{
			title: 'Custom',
			description: 'Press or drag a .ppt file to add a presentation of your own',
			image: 'assets/images/i-laptop.svg',
			imageAlt: 'Laptop',
			subtitle:"Extracting images"
		},
		{
			title: 'Tombstones',
			description: 'Search and select any Tombstone available in the database',
			image: 'assets/images/i-shop.svg',
			imageAlt: 'Minimalist icon of shop',
		},
	],
	section: 0
	// Add default values here
};
