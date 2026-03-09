import { UI_V2Checkbox } from '../component/ui-v2-checkbox';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-checkbox', () => {
	describe('render', () => {
		it('should define label element when label is provided', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox label={'string'}></scib-ui-v2-checkbox>
			});
			const label = page.root.shadowRoot.querySelector('.mdc-checkbox__label');
			expect(label).toBeTruthy();
		});
		it('should not define label element when label is not provided', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox></scib-ui-v2-checkbox>
			});
			const label = page.root.shadowRoot.querySelector('.mdc-checkbox__label');
			expect(label).toBeFalsy();
		});
		it('should contain label text when label is not empty', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox label={'text label'}></scib-ui-v2-checkbox>
			});
			const label: HTMLElement = page.root.shadowRoot.querySelector('.mdc-checkbox__label');
			expect(label.innerText).toBe('text label');
		});
		it('should define helper element when helper is provided', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox helper={'string'}></scib-ui-v2-checkbox>
			});
			const helper = page.root.shadowRoot.querySelector('.mdc-checkbox__helper');
			expect(helper).toBeTruthy();
		});
		it('should not define helper element when helper is not provided', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox></scib-ui-v2-checkbox>
			});
			const helper = page.root.shadowRoot.querySelector('.mdc-checkbox__helper');
			expect(helper).toBeFalsy();
		});
		it('should activate mdc-checkbox__helper--invalid class name when invalid is true', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox invalid={true} helper={'string'}></scib-ui-v2-checkbox>
			});
			const helper = page.root.shadowRoot.querySelector('.mdc-checkbox__helper');
			expect(helper.classList.contains('mdc-checkbox__helper--invalid')).toBeTruthy();
		});
		it('should contain helper text when helper is not empty', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox helper={'text Helper'}></scib-ui-v2-checkbox>
			});
			const helper: HTMLElement = page.root.shadowRoot.querySelector('.mdc-checkbox__helper');
			expect(helper.innerText).toBe('text Helper');
		});
		it('should assign uid to the id attribute on the input element', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox uid={'textUid21'}></scib-ui-v2-checkbox>
			});
			const input: HTMLElement = page.root.shadowRoot.querySelector('.mdc-checkbox__native-control');
			expect(input.id).toBe('checkbox-textUid21');
		});
	});
	describe('disabled (watch)', () => {
		it('should set disabled of chechboxRef when disabled parameter changes', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox></scib-ui-v2-checkbox>
			});
			const component: UI_V2Checkbox = page.rootInstance;
			component.disabled = true;
			await page.waitForChanges();
			expect((component as any)._checkboxRef.disabled).toBe(true);
		});
	});
	describe('componentDidLoad', () => {
		it('should emit valueChange when change is emited', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox></scib-ui-v2-checkbox>
			});
			const component: UI_V2Checkbox = page.rootInstance;
			const spy = jest.spyOn(component.valueChange, 'emit');
			const event = new CustomEvent('change', { detail: 'checked' });
			(component as any)._checkboxRef.root.dispatchEvent(event);
			expect(spy).toHaveBeenCalled();
		});
		it('should set indeterminate true and checked false when value is indeterminate', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox value={'indeterminate'}></scib-ui-v2-checkbox>
			});
			const component: UI_V2Checkbox = page.rootInstance;
			expect((component as any)._checkboxRef.indeterminate).toBe(true);
			expect((component as any)._checkboxRef.checked).toBe(false);
		});
		it('should set indeterminate false and checked true when value is checked', async () => {
			const page = await newSpecPage({
				components: [UI_V2Checkbox],
				template: () => <scib-ui-v2-checkbox value={'checked'}></scib-ui-v2-checkbox>
			});
			const component: UI_V2Checkbox = page.rootInstance;
			expect((component as any)._checkboxRef.indeterminate).toBe(false);
			expect((component as any)._checkboxRef.checked).toBe(true);
		});
	});
});
