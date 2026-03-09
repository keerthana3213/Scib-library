import { newSpecPage } from '@stencil/core/testing';
import { UIFilter } from '../component/ui-filter';
import { h } from '@stencil/core';

describe('ui-filter', () => {
	it('builds', () => {
		expect(new UIFilter()).toBeTruthy();
	});
	describe('render', () => {
		it('should render correctly with checkbox field', async () => {
			const filterLiterals = {
				filterTitle: 'Filter',
				filterbtn: 'Apply',
				fieldset: [
					{
						checkbox: {
							idCheckbox: 'filter-checkbox',
							label: 'Saved files'
						}
					}
				]
			};
			await newSpecPage({
				components: [UIFilter],
				template: () => <scib-ui-filter id="filter" open={true} filterLiterals={JSON.stringify(filterLiterals)}></scib-ui-filter>,
				supportsShadowDom: true
			});
			const UIFilterHTMLElement: HTMLElement = document.getElementById('filter');
			const UIFilterChildrenHTMLElements: HTMLElement = document.getElementsByTagName('scib-ui-v2-checkbox')[0];

			expect(UIFilterHTMLElement).toBeTruthy();
			expect(UIFilterChildrenHTMLElements).toBeTruthy();
		});
	});
});
