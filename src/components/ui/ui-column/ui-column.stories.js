import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Column',
	...getStoryConfig('scib-ui-column'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = args => render(args, `
	<scib-ui-wrapper>
		<scib-ui-row>
			<scib-ui-column col-md='3'col-lg='4'>
				<div style='background-color:black;color:white;padding:20px;'>
					Black Div
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg='2'>
				<div style='background-color:pink;color:white;padding:20px;'>
					Pink Div
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg='2'>
				<div style='background-color:green;color:white;padding:20px;'>
					Green Div
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg='2'>
				<div style='background-color:yellow;color:white;padding:20px;'>
					Yellow Div
				</div>
			</scib-ui-column>
		</scib-ui-row>
	</scib-ui-wrapper>
`);

const TemplateOffset = args => render(args, `
	<scib-ui-wrapper>
		<scib-ui-row>
			<scib-ui-column col-lg='3'>
				<div style='background-color:black;color:white;padding:20px;'>
					<scib-ui-row>
						<scib-ui-column col-lg='3'>	col 1</scib-ui-column>
						<scib-ui-column col-lg='3'>	col 2</scib-ui-column>
					</scib-ui-row>
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg='2' offset-lg='1'>
				<div style='background-color:pink;color:white;padding:20px;'>
					Pink Div
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg='3' offset-lg='3'>
				<div style='background-color:green;color:white;padding:20px;'>
					Green Div
				</div>
			</scib-ui-column>
			<scib-ui-column col-lg='6' offset-lg='0'>
				<div style='background-color:yellow;color:white;padding:20px;'>
					Yellow Div
				</div>
			</scib-ui-column>
		</scib-ui-row>
	</scib-ui-wrapper>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {};
// Example story
export const Offset = TemplateOffset.bind();
Offset.args = {};
