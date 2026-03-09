import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Preview Permission Denied',
	...getStoryConfig('scib-cdk-preview-permission-denied')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-preview-permission-denied
		literals='${parseObject(args.literals)}'
		list-glcs='${parseObject(args.listGlcs)}'
	>
	</scib-cdk-preview-permission-denied>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		title: 'No permission to operate with this entity',
        listTitle: 'Entities with permissions:'
	},
    listGlcs: [
        'Repsol Trading S.A.',
        'Repsol Export Brazil',
        'Repsol Finance LATAM',
        'Repsol Finance EUR',
        'Repsol Finance Spain',
    ]
	// Add default values here
};
