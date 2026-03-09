import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { UI_V2Card } from '../component/ui-v2-card';

describe('ui-v2-card', () => {
	it('builds', () => {
		expect(new UI_V2Card()).toBeTruthy();
	});
	describe('render', () => {
		it('should render the slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2Card],
				template: () => (
					<scib-ui-v2-card>
						<p id="my-content">Content</p>
					</scib-ui-v2-card>
				)
			});
			const content = page.root.querySelector('#my-content');
			expect(content).toBeTruthy();
		});
		it('should set className mdc-card--outlined when type is outlined', async () => {
			const page = await newSpecPage({
				components: [UI_V2Card],
				template: () => <scib-ui-v2-card type={'outlined'}></scib-ui-v2-card>,
				supportsShadowDom: true
			});
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector('.mdc-card');
			expect(cardElement.classList.contains('mdc-card--outlined')).toBe(true);
		});
		it('should set className mdc-card--outlined and mdc-card--link when type is link', async () => {
			const page = await newSpecPage({
				components: [UI_V2Card],
				template: () => <scib-ui-v2-card type={'link'}></scib-ui-v2-card>,
				supportsShadowDom: true
			});
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector('.mdc-card');
			expect(cardElement.classList.contains('mdc-card--outlined')).toBe(true);
			expect(cardElement.classList.contains('mdc-card--link')).toBe(true);
		});
		it('should set className mdc-card--elevated when type is elevated', async () => {
			const page = await newSpecPage({
				components: [UI_V2Card],
				template: () => <scib-ui-v2-card type={'elevated'}></scib-ui-v2-card>,
				supportsShadowDom: true
			});
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector('.mdc-card');
			expect(cardElement.classList.contains('mdc-card--elevated')).toBe(true);
		});
		it('should emit eventOnCardClick when clicked and type is link', async () => {
			const page = await newSpecPage({
				components: [UI_V2Card],
				template: () => <scib-ui-v2-card type={'link'} cardId={'0'}></scib-ui-v2-card>,
				supportsShadowDom: true
			});
			const component: UI_V2Card = page.rootInstance;
			const eventEmitSpy = jest.spyOn(component.eventOnCardClick, 'emit');
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector('.mdc-card');
			cardElement.click();
			expect(eventEmitSpy).toHaveBeenCalledWith('0');
		});
		it('should not emit eventOnCardClick when clicked and type is not link', async () => {
			const page = await newSpecPage({
				components: [UI_V2Card],
				template: () => <scib-ui-v2-card type={'elevated'}></scib-ui-v2-card>,
				supportsShadowDom: true
			});
			const component: UI_V2Card = page.rootInstance;
			const eventEmitSpy = jest.spyOn(component.eventOnCardClick, 'emit');
			const cardElement: HTMLElement = page.root.shadowRoot.querySelector('.mdc-card');
			cardElement.click();
			expect(eventEmitSpy).not.toHaveBeenCalled();
		});
		it('should set title with the tooltip property when it is link', async () => {
			const page = await newSpecPage({
				components: [UI_V2Card],
				template: () => <scib-ui-v2-card tooltip={'text'} type={'link'}></scib-ui-v2-card>,
				supportsShadowDom: true
			});
			const card: HTMLElement = page.root.shadowRoot.querySelector('.mdc-card');
			const value = card.title;
			expect(value).toBe('text');
		});
	});
});
