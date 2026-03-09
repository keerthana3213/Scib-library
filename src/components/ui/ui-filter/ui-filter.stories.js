import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Filter',
	...getStoryConfig('scib-ui-filter'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style='display: flex; justify-content: flex-end; position:relative;'>
		<scib-ui-filter
			no-result='${args.noResults}'
			filter-literals='${parseObject(args.filterLiterals)}'
			date='${args.date}'
		>
		</scib-ui-filter>
	</div>
	<hr style='margin: 30px 0;'>
	<div style='display: flex; justify-content: flex-end; position:relative; padding-top: 13px;'>
		<scib-ui-filter
            align-buttons='${parseBoolean(args.alignButtons)}'
			no-result='${args.noResults}'
			horizontal-filter= '${parseBoolean(args.horizontalFilter)}'
			filter-literals='${parseObject(args.filterLiterals)}'
		></scib-ui-filter>
	</div>
	<hr style='margin: 30px 0;'>
	<div style='position:relative; padding-top: 13px;'>
		<scib-ui-filter
            align-buttons='${parseBoolean(args.alignButtons)}'
			open='${args.open}'
			disable-toggle='${args.disableToggle}'
			no-result='${args.noResults}'
			horizontal-filter='${parseBoolean(args.horizontalFilter)}'
			filter-literals='${parseObject(args.filterLiterals)}'
			full-width='${args.fullWidth}'
			full-slim='${args.fullSlim}'
			intrusive='${args.intrusive}'
		></scib-ui-filter>
	</div>
	<hr style='margin: 30px 0;'>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
    alignButtons: false,
	noResults: 'No results',
	horizontalFilter: true,
	fullWidth: true,
	fullSlim: false,
	intrusive: true,
	disableToggle: false,
	open: false,
	filterLiterals: {
		'filterTitle': 'Filter',
		'filterbtn': 'Apply',
		'fieldset': [
			{
				'dropdown':
					{
						'idSelect': 'id1',
						'label': 'Status',
						'placeholderSelect': 'Choose status',
						'values': [
							{
								'id': 'campo1',
								'name': 'campo 1'
							},
							{
								'id': 'campo2',
								'name': 'campo 2',
							},
							{
								'id': 'campo3',
								'name': 'campo 3',
							},
						],
					},
			},
			{
				'dropdown':
					{
						'idSelect': 'id2',
						'label': 'Status',
						'placeholderSelect': 'Choose status',
						'values': [
							{
								'id': 'campo1',
								'name': 'campo 1'
							},
							{
								'id': 'campo2',
								'name': 'campo 2',
							},
							{
								'id': 'campo3',
								'name': 'campo 3',
							},
						],
					},
			},
			{
				'select':
					{
						'label': 'Status2',
						'multiselect': true,
						'placeholderSelect': 'Choose status2',
						'values': [
							{
								'id': 'campo 12',
								'label': '12',
								'name': '12',
							},
							{
								'id': 'campo 22',
								'label': '22',
								'name': '22',
							},
							{
								'id': 'campo 32',
								'label': '32',
								'name': '32',
							},
						],
					},
			},
			{
				'input':
					{
						'idInput': 'inputsID',
						'label': 'id request',
						'placeholder': 'Enter ID request',
					},
			},
			{
				'select':
					{
						'label': 'Status3',
						'placeholderSelect': 'Choose status3',
						'values': [
							{
								'value': '44',
								'name': 'campo 44',
							},
							{
								'value': '66',
								'name': 'campo 66',
							},
							{
								'value': '32',
								'name': 'campo 32',
							},
						],
					},
			},
			{
				'datepicker':
					{
						'idDate': 'idDate1',
						'valueDatePickerLabel': 'Effective Date Range',
						'txt': 'To',
						'limitDate': true
					},
			},
			{
				'datepicker':
					{
						'idDate': 'idDate2',
						'valueDatePickerLabel': 'Effective Date Range2',
						'txt': 'To',
					},
			},
			{
				'checkbox':
					{
						'idCheckbox': 'checkbox',
						'label': 'Saved files'
					}
					
			}
		],
		'hasExtendedFilters': true,
		'hideIconLabel': 'Hide advanced filters',
		'showIconLabel': 'Show advanced filters',
		'extendedFilters': [
			{
				'legend': 'prueba1',
				'fieldset': [
					{
						'dropdown':
							{
								'idSelect': 'id01',
								'label': 'Status',
								'placeholderSelect': 'Choose status',
								'values': [
									{
										'id': 'campo1',
										'name': 'campo 1',
									},
									{
										'id': 'campo2',
										'name': 'campo 2',
									},
									{
										'id': 'campo3',
										'name': 'campo 3',
									},
								],
							},
					},
					{
						'dropdown':
							{
								'idSelect': 'id02',
								'label': 'Status',
								'placeholderSelect': 'Choose status',
								'values': [
									{
										'id': 'campo1',
										'name': 'campo 1',
									},
									{
										'id': 'campo2',
										'name': 'campo 2',
									},
									{
										'id': 'campo3',
										'name': 'campo 3',
									},
								],
							},
					}
				]
			},
			{
				'legend': 'prueba2',
				'fieldset': [
					{
						'dropdown':
							{
								'idSelect': 'id03',
								'label': 'Status',
								'placeholderSelect': 'Choose status',
								'values': [
									{
										'id': 'campo1',
										'name': 'campo 1',
									},
									{
										'id': 'campo2',
										'name': 'campo 2',
									},
									{
										'id': 'campo3',
										'name': 'campo 3',
									},
								],
							},
					},
					{
						'dropdown':
							{
								'idSelect': 'id04',
								'label': 'Status',
								'placeholderSelect': 'Choose status',
								'values': [
									{
										'id': 'campo1',
										'name': 'campo 1',
									},
									{
										'id': 'campo2',
										'name': 'campo 2',
									},
									{
										'id': 'campo3',
										'name': 'campo 3',
									},
								],
							},
					},
				]
			}
		],
		'dateErrorMessage': 'Incorrect date',
		'expectedYear': '2020'
	},

	// Add default values here
};
