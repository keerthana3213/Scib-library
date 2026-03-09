import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Toolbox',
	...getStoryConfig('scib-cdk-toolbox')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-toolbox
		literals='${parseObject(args.literals)}'
		user-info='${parseObject(args.userInfo)}'
        notifications='${args.notifications}'
	>
	</scib-cdk-toolbox>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		avatarBtn: 'Open my profile',
		moveBtn: 'Move toolbox',
		commBtn: 'Open Communication Framework',
		newTabBtn: 'Open on new tab',
        closeBtn: 'Close application'
	},
    userInfo: {
        avatar: {
            src: '',
            alt: 'Juan Garcia Garcia'
        },
        isEmployee: true
    },
    notifications: "+99"
	// Add default values here
};
