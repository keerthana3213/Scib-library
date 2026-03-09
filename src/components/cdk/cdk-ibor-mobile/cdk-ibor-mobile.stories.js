import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ibor Mobile',
	...getStoryConfig('scib-cdk-ibor-mobile')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ibor-mobile
		img-src="${args.img}"
		literals='${parseObject(args.literals)}'
	></scib-cdk-ibor-mobile>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	img: "assets/images/i-unavailable-mobile.svg",
	literals: {
		"title": "IBOR is not available on mobile.",
		"subtitle": "Please go on desktop."
	}
};
