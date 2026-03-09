import { newSpecPage } from '@stencil/core/testing';
import { AtomsList } from '../component/list';
import { h } from '@stencil/core';

describe('atoms-list', () => {
	describe('render', () => {
		it('should render list element', async () => {
			const page = await newSpecPage({
				components: [AtomsList],
				template: () => <scib-atoms-list></scib-atoms-list>,
				supportsShadowDom: true
			});
			const listClass = page.root.querySelector('.scib-atoms-list-container');
			expect(listClass).toBeTruthy();
		});
	});
});
