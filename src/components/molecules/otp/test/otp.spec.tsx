import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { MoleculesOtp } from '../component/otp';
import { IOtpLiterals } from '../models/otp.model';

describe('molecules-otp', () => {
	it('builds', () => {
		expect(new MoleculesOtp()).toBeTruthy();
	});
	it('input should be type password when property type is password', async () => {
		const page = await newSpecPage({
			components: [MoleculesOtp],
			template: () => <scib-molecules-otp type={'password'} inputCount={4}></scib-molecules-otp>,
			supportsShadowDom: true
		});
		const component: MoleculesOtp = page.rootInstance;
		component.inputRefs.forEach((input) => {
			expect(input.type).toBe('password');
		});
	});

	describe('Otp disabled', () => {
		it('should disable the otp inputs and has disabled class when disabled property is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesOtp],
				template: () => <scib-molecules-otp disabled={true} inputCount={4}></scib-molecules-otp>,
				supportsShadowDom: true
			});
			const component: MoleculesOtp = page.rootInstance;
			component.inputRefs.forEach((input) => {
				expect(input.disabled).toBe(true);
				expect(input.classList.contains('otp__input--disabled')).toBe(true);
			});
		});

		it('should label has disabled class', async () => {
			const page = await newSpecPage({
				components: [MoleculesOtp],
				template: () => <scib-molecules-otp disabled={true} inputCount={4}></scib-molecules-otp>,
				supportsShadowDom: true
			});
			const otpLabel = page.root.shadowRoot.querySelector('#otpLabel');
			expect(otpLabel.className).toBe('otp__label--disabled');
		});

		it('should show atoms color component when is disabled', async () => {
			const literals: IOtpLiterals = { disabled: 'test', error: 'test', defaultText: 'test', loading: 'test' };
			const page = await newSpecPage({
				components: [MoleculesOtp],
				template: () => <scib-molecules-otp disabled={true} inputCount={4} literals={literals}></scib-molecules-otp>,
				supportsShadowDom: true
			});
			const colorIconElement = page.root.shadowRoot.querySelector('scib-atoms-color-icon');
			expect(colorIconElement).not.toBeNull();
		});
	});

	describe('Otp loading', () => {
		it('should show loading component when is loading', async () => {
			const page = await newSpecPage({
				components: [MoleculesOtp],
				template: () => <scib-molecules-otp loading={true} inputCount={4}></scib-molecules-otp>,
				supportsShadowDom: true
			});
			const loadingElement = page.root.shadowRoot.querySelector('scib-atoms-loading');
			expect(loadingElement).not.toBeNull();
		});
	});

	describe('Otp invalid', () => {
		it('should show atoms color component when is invalid', async () => {
			const page = await newSpecPage({
				components: [MoleculesOtp],
				template: () => <scib-molecules-otp invalid={true} inputCount={4}></scib-molecules-otp>,
				supportsShadowDom: true
			});
			const colorIconElement = page.root.shadowRoot.querySelector('scib-atoms-color-icon');
			expect(colorIconElement).not.toBeNull();
		});
	});

	describe('Otp keydown events', () => {
		it('should focus on the previous input when Backspace is pressed and the input is empty', async () => {
			const page = await newSpecPage({
				components: [MoleculesOtp],
				template: () => <scib-molecules-otp disabled={false} inputCount={4}></scib-molecules-otp>,
				supportsShadowDom: true
			});

			const component: MoleculesOtp = page.rootInstance;
			const inputs = component.inputRefs;

			// Assuming there are at least two inputs
			inputs[1].value = '';
			inputs[0].focus = jest.fn();
			inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

			await page.waitForChanges();

			expect(inputs[0].focus).toHaveBeenCalled();
		});
	});

	describe('Otp input changes', () => {
		it('should focus on the next input when an input is filled', async () => {
			const page = await newSpecPage({
				components: [MoleculesOtp],
				html: `<scib-molecules-otp disabled={true} inputCount={4}></scib-molecules-otp>`,
				supportsShadowDom: true
			});

			const component: MoleculesOtp = page.rootInstance;
			const inputs = component.inputRefs;

			// Assuming there are at least two inputs
			inputs[0].value = '1';
			inputs[0].dispatchEvent(new Event('input'));

			await page.waitForChanges();

			expect(document.activeElement).toBe(inputs[1]);
		});
	});
});
