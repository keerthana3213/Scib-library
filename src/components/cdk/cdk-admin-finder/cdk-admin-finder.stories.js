import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Admin Finder',
	...getStoryConfig('scib-cdk-admin-finder')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-admin-finder literals='${parseObject(args.literals)}'></scib-cdk-admin-finder>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		title: 'Search client users by entity/GLCS or name/email ',
		legend: 'customer finder filter',
		'fieldset': [
			{'autocomplete':
				{
					'hidden':false,
					'label': 'Entity or GLCS',
					'name': 'entity_glcs_finder',
					'placeholder': 'Enter entity or GLCS',
					'charMin':'3',
					'noResult': 'No results found',
					'noMinHeight':true,
					'error':'Must be at least 3 characters',
					'options': [
						{
							'value': 'jcardenas@santander.es',
							'name': 'Jesús Cárdenas Vizcaíno',
						},
						{
							'value': 'jc',
							'name': 'Je',
						}
					],
					'debounceTime': '500'
				}
			},
			{'input':
				{
					'label': 'User name or email  ',
					'name': 'name_email__finder',
					'placeholder': 'Enter user name or email',
					'charMin':'3',
					'error':'Must be at least 3 characters',
					'noResult': 'No results found',
					'options': [
						{
							'value': 'jcardenas@santander.es',
							'name': 'Jesús Cárdenas Vizcaíno',
						},
						{
							'value': 'jperez@santander.es',
							'name': 'Jerónimo Pérez'
						},
						{
							'value': 'asanchez@santander.es',
							'name': 'Alba Sanchez'
						},
					]
				}
			},
			{
				'dropdown': {
					'label': 'User Status',
					'name': 'user-status',
					'labels': '[{"id": "all", "value": "all", "name": "All"}, {"id": "active", "value": "active", "name": "Active"}, {"id": "inactive", "name": "Inactive"}]'
				}
			},
			{'autocomplete':
					{
						'hidden':false,
						'label': 'App',
						'name': 'app_finder',
						'placeholder': 'Enter app name',
						'charMin':'2',
						'noResult': 'No results found',
						'noMinHeight':true,
						'error':'Must be at least 2 characters',
						'options': [
							{
								'value': 'jcardenas@santander.es',
								'name': 'Jesús Cárdenas Vizcaíno',
							},
							{
								'value': 'jc',
								'name': 'Je',
							}
						],
						'debounceTime': '500'
					}
			},
		],
		btn: 'Search'
	}
};
