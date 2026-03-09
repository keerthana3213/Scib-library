import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Recaptcha',
	...getStoryConfig('scib-ui-recaptcha')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-recaptcha
		sitekey='${args.sitekey}'
	>
	</scib-ui-recaptcha>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	"sitekey":"6LfdIAUbAAAAAIl3y_Xc5or-hWtZknbhOWX3IhA_"

};
