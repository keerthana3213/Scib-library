import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Video',
	...getStoryConfig('scib-cdk-video')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-video slot="step" 
		main-title="<h2>Take a quick look at the <strong>Client Hub</strong></h2>"
		src-video='[
			{"src": "https://youtu.be/Fg1dbDa79Ps", "type":"mp4"},
			{"src": "https://youtu.be/Fg1dbDa79Ps", "type":"ogg"}
		]'
		video-description="Lorem ipsum dolor"
		imgSrc="url"
		imgAlt="alt url"
	></scib-cdk-video>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {};
