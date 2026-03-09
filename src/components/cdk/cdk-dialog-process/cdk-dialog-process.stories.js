import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Dialog Process',
	...getStoryConfig('scib-cdk-dialog-process'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open hide-header>
		<scib-cdk-dialog-process  
            literals='${parseObject(args.literals)}'
            icon-extra-btn='${args.iconExtraBtn}'
		></scib-cdk-dialog-process>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'typeDialog': 'error',
		'mainTitle': 'Oh, no!',
		'message': 'We are sorry, but there is no available balance for the transfer',
		'btnLeft': 'Close',
        'btnRight': 'Change',
        'extraBtn': 'View duplicate document'
    },
    iconExtraBtn: 'icon-viewdetail'
	// Add default values here
};
