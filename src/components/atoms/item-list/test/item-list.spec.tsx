import { AtomsItemList } from '../component/item-list';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('atoms-item-list', () => {
	describe('render', () => {
		it('should render item-list class', async () => {
			const page = await newSpecPage({
				components: [AtomsItemList],
				template: () => <scib-atoms-item-list></scib-atoms-item-list>,
				supportsShadowDom: true
			});
			const itemList = page.root.shadowRoot.querySelector('.item-list');
			expect(itemList).toBeTruthy();
		});
	});
});
