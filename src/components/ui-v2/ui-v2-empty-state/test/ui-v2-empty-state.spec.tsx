import { UI_V2EmptyState } from '../component/ui-v2-empty-state';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-empty-state', () => {
	describe('render', () => {
		it('should set src with the image name', async () => {
			const page = await newSpecPage({
				components: [UI_V2EmptyState],
				template: () => <scib-ui-v2-empty-state image={'nameImage'}> </scib-ui-v2-empty-state>,
				supportsShadowDom: true
			});
			const image = page.root.shadowRoot.querySelector('img');
			expect(image.src).toBe('http://testing.stenciljs.com/nameImage');
		});
		it('should set description with the property description', async () => {
			const page = await newSpecPage({
				components: [UI_V2EmptyState],
				template: () => (
					<scib-ui-v2-empty-state description={'When contracts are loaded for client review they will appear in this area.'}>
						{' '}
					</scib-ui-v2-empty-state>
				),
				supportsShadowDom: true
			});
			const description: HTMLElement = page.root.shadowRoot.querySelector('.emptye__desc');
			expect(description.textContent).toBe('When contracts are loaded for client review they will appear in this area.');
		});
		it('should set title with the property title', async () => {
			const page = await newSpecPage({
				components: [UI_V2EmptyState],
				template: () => <scib-ui-v2-empty-state mainTitle={'There are no contracts at this moment'}> </scib-ui-v2-empty-state>,
				supportsShadowDom: true
			});
			const title: HTMLElement = page.root.shadowRoot.querySelector('.emptye__title');
			expect(title.textContent).toBe('There are no contracts at this moment');
		});
		it('should active emptye--reverse when right is false', async () => {
			const page = await newSpecPage({
				components: [UI_V2EmptyState],
				template: () => <scib-ui-v2-empty-state right={false}> </scib-ui-v2-empty-state>,
				supportsShadowDom: true
			});
			const elements = page.root.shadowRoot.querySelectorAll('div');
			expect(elements[0].classList.contains('emptye--reverse')).toBe(true);
		});
	});
});
