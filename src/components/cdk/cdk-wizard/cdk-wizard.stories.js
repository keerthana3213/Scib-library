import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Wizard',
	...getStoryConfig('scib-cdk-wizard'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
		<scib-ui-dialog open hide-header absolute>
			<scib-cdk-wizard literals='${parseObject(args.literals)}' >
					<scib-cdk-content 
						slot='step'
						main-title='<h2><strong>Welcome to the Portal, Tom!</strong></h2>'
						text='<p>Here you can find all your applications, <em>services and transactional</em> tools to manage your business.</p><p>Take a look and <strong> enjoy your new digital experience.</strong></p>'
						img-src='https://images.unsplash.com/photo-1552257079-e48b715185fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80'
						img-alt='alt de la imagen'
					></scib-cdk-content>
					<scib-cdk-showcase 
						slot='step'  
						main-title='<h2>What can you find into the <strong>Communication Framework?</strong></h2>'
						content-cards='[
								{
										"text": "<p>Stay informed and <em>communicate safely and efficiently worldwide</em>.</p>",
										"imgSrc": "https://images.unsplash.com/photo-1552257079-e48b715185fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80", 
										"imgAlt": "alt de la imagen"
								},
								{
										"text": "Lorem ipsum2", 
										"imgSrc": "url2", 
										"imgAlt": "lorem2"
								}
						]'
					></scib-cdk-showcase>
					<scib-cdk-video 
						slot='step' 
						main-title='<h2>Take a quick look at the <strong>Client Hub</strong></h2>'
						src-video='[
							{"src": "https://youtu.be/Fg1dbDa79Ps", "type":"mp4"},
							{"src": "https://youtu.be/Fg1dbDa79Ps", "type":"ogg"}
						]'
						video-description='Lorem ipsum dolor'
						imgSrc='url'
						imgAlt='alt url'
					></scib-cdk-video>
			</scib-cdk-wizard>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		btnNext: 'Next',
		btnFinish: 'Go Scib Store',
		btnBackTooltip: 'Back',
		btnViewLater: 'View later',
	},
};
