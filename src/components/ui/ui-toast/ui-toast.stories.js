import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Toast',
	...getStoryConfig('scib-ui-toast')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-toast
	data='${parseObject(args.data)}'
	>
	</scib-ui-toast>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	data: {
		state: 'success',
		message: 'Changes saved succesfully',
		time: '500000',
        messageExtraLines: [
            'Extra line information'
        ]
	}
	// Add default values here
};
