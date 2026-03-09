import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/App Permission Denied',
	...getStoryConfig('scib-cdk-app-permission-denied')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-app-permission-denied
		literals='${parseObject(args.literals)}'
		list-glcs='${parseObject(args.listGlcs)}'
	>
	</scib-cdk-app-permission-denied>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		title: 'At the moment, you have no permissions to operate with this entity',
		description: 'To start operating you need to change your entity to the one you have permissions or contact with your administrator.',
        titleList: 'Entities with permissions:',
        btnText: 'Change entity'
	},
    listGlcs: [
        {
            name: 'Repsol Trading S.A.',
            id: 0
        },
        {
            name: 'Repsol Trading S.A.',
            id: 1
        },
        {
            name: 'Repsol Trading S.A.',
            id: 2
        },
        {
            name: 'Repsol Trading S.A.',
            id: 3
        },
        {
            name: 'Repsol Trading S.A.',
            id: 4
        }
    ]
	// Add default values here
};
