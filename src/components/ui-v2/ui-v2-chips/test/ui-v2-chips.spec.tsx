import { UI_V2Chips } from '../component/ui-v2-chips';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-chips', () => {
	const value = [
		{
			id: 1,
			value: [
				{
					0: 'filter1'
				}
			]
		},
		{
			id: 2,
			value: [
				{
					0: 'filter2'
				}
			]
		}
	];
	describe('render', () => {
		it('should set property id on the span element', async () => {
			const page = await newSpecPage({
				components: [UI_V2Chips],
				template: () => <scib-ui-v2-chips value={value} buttonText={'buttonText'}></scib-ui-v2-chips>,
				supportsShadowDom: true
			});
			const div = page.root.shadowRoot.querySelectorAll('div.mdc-evolution-chip');
			expect(div[0].getAttribute('id')).toBe('chip-1');
			expect(div[1].getAttribute('id')).toBe('chip-2');
		});
		it('should call _removeChip when clicked input element', async () => {
			const page = await newSpecPage({
				components: [UI_V2Chips],
				template: () => <scib-ui-v2-chips value={value} buttonText={'buttonText'}></scib-ui-v2-chips>,
				supportsShadowDom: true
			});
			const component: UI_V2Chips = page.rootInstance;
			const button: HTMLInputElement = page.root.shadowRoot.querySelector('i.icon');
			const removeChipSpy = jest.spyOn(component, '_removeChip');
			button.click();
			expect(removeChipSpy).toHaveBeenCalled();
		});
		it('should render scib-atoms-button element when chips is more than one and buttonText is defined', async () => {
			const page = await newSpecPage({
				components: [UI_V2Chips],
				template: () => <scib-ui-v2-chips value={value} buttonText={'buttonText'}></scib-ui-v2-chips>,
				supportsShadowDom: true
			});
			const uiButton = page.root.shadowRoot.querySelector('scib-atoms-button');
			expect(uiButton).toBeTruthy();
		});
		it('should call _removeAllChips when clicked scib-atoms-button element', async () => {
			const page = await newSpecPage({
				components: [UI_V2Chips],
				template: () => <scib-ui-v2-chips value={value} buttonText={'buttonText'}></scib-ui-v2-chips>,
				supportsShadowDom: true
			});
			const component: UI_V2Chips = page.rootInstance;
			const uiButton = page.root.shadowRoot.querySelector('scib-atoms-button');
			const removeAllChipSpy = jest.spyOn(component, '_removeAllChips');
			uiButton.click();
			expect(removeAllChipSpy).toHaveBeenCalled();
		});
	});
	describe('_removeAllChips', () => {
		it('should emit valueChange when _removeAllChips is emited', async () => {
			const page = await newSpecPage({
				components: [UI_V2Chips],
				template: () => <scib-ui-v2-chips value={value} buttonText={'buttonText'}></scib-ui-v2-chips>,
				supportsShadowDom: true
			});
			const component: UI_V2Chips = page.rootInstance;
			component.value = value;
			const uiButton = page.root.shadowRoot.querySelector('scib-atoms-button');
			const emitvalueChange = jest.spyOn(component.valueChange, 'emit');
			uiButton.click();
			expect(emitvalueChange).toHaveBeenCalledWith({ activeChips: null, oldChips: [] });
		});
	});
	describe('_removeChip', () => {
		it('should emit valueChange when _removeChip is emited', async () => {
			const page = await newSpecPage({
				components: [UI_V2Chips],
				template: () => <scib-ui-v2-chips value={value} buttonText={'buttonText'}></scib-ui-v2-chips>,
				supportsShadowDom: true
			});
			const component: UI_V2Chips = page.rootInstance;
			component.value = value;
			const button: HTMLInputElement = page.root.shadowRoot.querySelector('i.icon');
			const emitvalueChange = jest.spyOn(component.valueChange, 'emit');
			button.click();
			expect(emitvalueChange).toHaveBeenCalled();
		});
	});
});
