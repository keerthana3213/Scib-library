import { ScrollBarInstanceOptions } from '../models/ui-v2-scroll-container.model';
import { UI_V2ScrollContainer } from '../component/ui-v2-scroll-container';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-scroll-container', () => {
	it('builds', () => {
		expect(new UI_V2ScrollContainer()).toBeTruthy();
	});
	describe('render', () => {
		it('should render the slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2ScrollContainer],
				template: () => (
					<scib-ui-v2-scroll-container>
						<p id="my-content">Content</p>
					</scib-ui-v2-scroll-container>
				)
			});
			const content = page.root.querySelector('#my-content');
			expect(content).toBeTruthy();
		});
		it('should set attribute scrollbar-visibility always', async () => {
			const options: ScrollBarInstanceOptions = {
				scrollbarVisibility: 'always'
			};
			const page = await newSpecPage({
				components: [UI_V2ScrollContainer],
				template: () => <scib-ui-v2-scroll-container options={options}></scib-ui-v2-scroll-container>,
				supportsShadowDom: true
			});
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector("scrollable-component[scrollbar-visibility='always']");
			expect(cardElement).toBeTruthy();
		});
		it('should set attribute vertical-scrollbar-position right', async () => {
			const options: ScrollBarInstanceOptions = {
				verticalScrollbarPosition: 'right'
			};
			const page = await newSpecPage({
				components: [UI_V2ScrollContainer],
				template: () => <scib-ui-v2-scroll-container options={options}></scib-ui-v2-scroll-container>,
				supportsShadowDom: true
			});
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector("scrollable-component[vertical-scrollbar-position='right']");
			expect(cardElement).toBeTruthy();
		});
		it('should set attribute horizontal-scrollbar-position always', async () => {
			const options: ScrollBarInstanceOptions = {
				horizontalScrollbarPosition: 'bottom'
			};
			const page = await newSpecPage({
				components: [UI_V2ScrollContainer],
				template: () => <scib-ui-v2-scroll-container options={options}></scib-ui-v2-scroll-container>,
				supportsShadowDom: true
			});
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector("scrollable-component[horizontal-scrollbar-position='bottom']");
			expect(cardElement).toBeTruthy();
		});
	});
});
