import { ValueAccessorConfig } from '@stencil/angular-output-target';

export const angularValueAccessorBindings: ValueAccessorConfig[] = [
	{
		elementSelectors: [
			'scib-ui-v2-text-field',
			'scib-ui-v2-select',
			'scib-ui-v2-chips',
			'scib-atoms-slider',
			'scib-ui-v2-checkbox',
			'scib-ui-v2-date-picker',
			'scib-atoms-group-radio-button',
			'scib-molecules-autocomplete-text-field',
			'scib-atoms-segmented-control',
			'scib-molecules-input-range',
			'scib-atoms-input-telephone',
			'scib-molecules-otp'
		],
		event: 'valueChange',
		targetAttr: 'value',
		type: 'text'
	},
	{
		elementSelectors: ['scib-molecules-upload-files'],
		event: 'selectValue',
		targetAttr: 'initialfiles',
		type: 'text'
	},
	{
		elementSelectors: ['scib-atoms-switch'],
		event: 'valueChange',
		targetAttr: 'checked',
		type: 'boolean'
	}
];
