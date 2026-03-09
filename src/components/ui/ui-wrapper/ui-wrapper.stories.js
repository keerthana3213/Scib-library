import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Wrapper',
	...getStoryConfig('scib-ui-wrapper')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-wrapper>
		<scib-ui-row>
			<scib-ui-column col-lg="2">
				<div style="background-color:black;color:white;padding:20px;">
					Hello
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg="2">
				<div style="background-color:pink;color:white;padding:20px;">
					Hello
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg="4" col-xs="4">
				<div style="background-color:green;color:white;padding:20px;">
					Hello
				</div>
			</scib-ui-column>
		</scib-ui-row>
	</scib-ui-wrapper>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {};
