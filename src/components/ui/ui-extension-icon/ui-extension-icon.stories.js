import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Extension Icon',
	...getStoryConfig('scib-ui-extension-icon', {
		argTypes:{
			fileextension: {
				control: {
					type: 'select',
					options: {
						'pdf': 'pdf',
						'jpeg': 'jpeg',
						'xls': 'xls',
						'mpeg': 'mpeg',
						'zip': 'zip'
					}
				}
			}
		}
	})
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-extension-icon fileextension="${args.fileextension}"></scib-ui-extension-icon>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	fileextension: 'pdf'
};
