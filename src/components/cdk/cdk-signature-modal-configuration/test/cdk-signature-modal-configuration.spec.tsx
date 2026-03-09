import { CDKSignatureModalConfiguration } from '../component/cdk-signature-modal-configuration';
import * as enGB from '../../cdk-signature-modal/i18n/en-GB.json';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('cdk-signature-modal-configuration', () => {
	it('builds', () => {
		expect(new CDKSignatureModalConfiguration()).toBeTruthy();
	});
	it('should add correctly glcs in recipients list when execute _handleGlcsInputChange() function', () => {
		const component = new CDKSignatureModalConfiguration();
		component._recipientsList = [{ id: 0, name: '', email: '', type: '', typeLabel: '', showForm: true, cardId: 0, glcs: '' }];
		const ev: CustomEvent = new CustomEvent('customEventMock', { detail: 'NTT DATA' });
		component._handleGlcsInputChange(ev, 0);
		expect(component._recipientsList[0].glcs).toEqual('NTT DATA');
	});
	describe('render', () => {
		it('should render correctly', async () => {
			await newSpecPage({
				components: [CDKSignatureModalConfiguration],
				template: () => (
					<scib-cdk-signature-modal-configuration
						id="configuration-step"
						radioRecipientTypes={[]}
						literals={enGB}
					></scib-cdk-signature-modal-configuration>
				),
				supportsShadowDom: true
			});
			const CDKSignatureModalConfigurationHTMLElement: HTMLElement = document.getElementById('configuration-step');
			const HTMLElementsWithCDKSignatureModalTitleClass: HTMLCollection = document.getElementsByClassName('cdk-signature-modal__title');
			expect(CDKSignatureModalConfigurationHTMLElement).toBeTruthy();
			expect(HTMLElementsWithCDKSignatureModalTitleClass.length > 0).toBeTruthy();
		});
		it('should render GLCS input correctly when there is a signer', async () => {
			const recipientListMock = [
				{ id: 0, name: '', email: '', type: '', typeId: 'recipient_signer', typeLabel: '', showForm: true, cardId: 0, glcs: '' }
			];
			await newSpecPage({
				components: [CDKSignatureModalConfiguration],
				template: () => (
					<scib-cdk-signature-modal-configuration
						id="configuration-step"
						radioRecipientTypes={[]}
						recipientsList={recipientListMock}
						literals={enGB}
					></scib-cdk-signature-modal-configuration>
				),
				supportsShadowDom: true
			});
			const HTMLElementsWithCDKSignatureModalRecipientGLCSClass: HTMLCollection =
				document.getElementsByClassName('cdk-signature-modal__recipient-glcs');
			expect(HTMLElementsWithCDKSignatureModalRecipientGLCSClass.length === 1).toBeTruthy();
		});
		it('should not render GLCS input correctly when there is only a cc', async () => {
			const recipientListMock = [
				{ id: 0, name: '', email: '', type: '', typeId: 'recipient_cc', typeLabel: '', showForm: true, cardId: 0, glcs: '' }
			];
			await newSpecPage({
				components: [CDKSignatureModalConfiguration],
				template: () => (
					<scib-cdk-signature-modal-configuration
						id="configuration-step"
						radioRecipientTypes={[]}
						recipientsList={recipientListMock}
						literals={enGB}
					></scib-cdk-signature-modal-configuration>
				),
				supportsShadowDom: true
			});
			const HTMLElementsWithCDKSignatureModalRecipientGLCSClass: HTMLCollection =
				document.getElementsByClassName('cdk-signature-modal__recipient-glcs');
			expect(HTMLElementsWithCDKSignatureModalRecipientGLCSClass.length > 0).toBeFalsy();
		});
		// it('should render access code input correctly when check Document access code', async () => {
		// 	const recipientListMock = [
		// 		{
		// 			id: 0,
		// 			name: '',
		// 			email: '',
		// 			type: '',
		// 			typeId: 'recipient_signer',
		// 			typeLabel: '',
		// 			showForm: true,
		// 			cardId: 0,
		// 			glcs: '',
		// 			accessCode: ''
		// 		}
		// 	];

		// 	await newSpecPage({
		// 		components: [CDKSignatureModalConfiguration],
		// 		template: () => (
		// 			<scib-cdk-signature-modal-configuration
		// 				id="configuration-step"
		// 				radioRecipientTypes={[]}
		// 				recipientsList={recipientListMock}
		// 				literals={enGB}
		// 			></scib-cdk-signature-modal-configuration>
		// 		),
		// 		supportsShadowDom: true
		// 	});
		// 	const HTMLElementCheckboxAccessCodeInSigntureModalRecipient: HTMLElement = document.getElementById('access-code-check-0');
		// 	HTMLElementCheckboxAccessCodeInSigntureModalRecipient.setAttribute('value', 'checked');
		// 	const HTMLElementWithCDKSignatureModalRecipientAccessCode: HTMLElement = document.getElementById('doc-access-code-0');
		// 	expect(HTMLElementWithCDKSignatureModalRecipientAccessCode).toBeTruthy();
		// });
		// it('should render access code input correctly when check Document access code for CC', async () => {
		// 	const recipientListMock = [
		// 		{
		// 			id: 0,
		// 			name: '',
		// 			email: '',
		// 			type: '',
		// 			typeId: 'recipient_cc',
		// 			typeLabel: '',
		// 			showForm: true,
		// 			cardId: 0,
		// 			glcs: '',
		// 			accessCode: ''
		// 		}
		// 	];

		// 	await newSpecPage({
		// 		components: [CDKSignatureModalConfiguration],
		// 		template: () => (
		// 			<scib-cdk-signature-modal-configuration
		// 				id="configuration-step"
		// 				radioRecipientTypes={[]}
		// 				recipientsList={recipientListMock}
		// 				literals={enGB}
		// 			></scib-cdk-signature-modal-configuration>
		// 		),
		// 		supportsShadowDom: true
		// 	});
		// 	const HTMLElementCheckboxAccessCodeInSigntureModalRecipient: HTMLElement = document.getElementById('access-code-check-0');
		// 	HTMLElementCheckboxAccessCodeInSigntureModalRecipient.setAttribute('value', 'checked');
		// 	const HTMLElementWithCDKSignatureModalRecipientAccessCode: HTMLElement = document.getElementById('doc-access-code-0');
		// 	expect(HTMLElementWithCDKSignatureModalRecipientAccessCode).toBeTruthy();
		// });
		it('should not render access code input when uncheck Document access code', async () => {
			const recipientListMock = [
				{
					id: 0,
					name: '',
					email: '',
					type: '',
					typeId: 'recipient_signer',
					typeLabel: '',
					showForm: true,
					cardId: 0,
					glcs: '',
					accessCode: ''
				}
			];

			await newSpecPage({
				components: [CDKSignatureModalConfiguration],
				template: () => (
					<scib-cdk-signature-modal-configuration
						id="configuration-step"
						radioRecipientTypes={[]}
						recipientsList={recipientListMock}
						literals={enGB}
					></scib-cdk-signature-modal-configuration>
				),
				supportsShadowDom: true
			});

			const HTMLElementWithCDKSignatureModalRecipientAccessCode: HTMLElement = document.getElementById('doc-access-code-0');
			expect(HTMLElementWithCDKSignatureModalRecipientAccessCode).toBeFalsy();
		});
		// it('should render access code value correctly when apply a template', async () => {
		// 	const recipientListMock = [
		// 		{
		// 			id: 0,
		// 			name: 'Test',
		// 			email: 'testin@gmil.com',
		// 			type: '',
		// 			typeId: 'recipient_signer',
		// 			typeLabel: '',
		// 			showForm: true,
		// 			cardId: 0,
		// 			glcs: '',
		// 			accessCode: '12345'
		// 		}
		// 	];

		// 	await newSpecPage({
		// 		components: [CDKSignatureModalConfiguration],
		// 		template: () => (
		// 			<scib-cdk-signature-modal-configuration
		// 				id="configuration-step"
		// 				radioRecipientTypes={[]}
		// 				recipientsList={recipientListMock}
		// 				literals={enGB}
		// 			></scib-cdk-signature-modal-configuration>
		// 		),
		// 		supportsShadowDom: true
		// 	});
		// 	const HTMLElementCheckboxAccessCodeInSigntureModalRecipient: HTMLElement = document.getElementById('access-code-check-0');
		// 	HTMLElementCheckboxAccessCodeInSigntureModalRecipient.setAttribute('value', 'checked');
		// 	const HTMLElementWithCDKSignatureModalRecipientAccessCode: HTMLElement = document.getElementById('doc-access-code-0');
		// 	const value: string = HTMLElementWithCDKSignatureModalRecipientAccessCode.getAttribute('value');
		// 	expect(value).toEqual('12345');
		// });
		// it('should render optional configuration dropdown correctly when uncheck Optional configuration in qualified type', async () => {
		// 	const recipientListMock = [
		// 		{
		// 			id: 0,
		// 			name: '',
		// 			email: '',
		// 			type: '',
		// 			typeId: 'recipient_signer',
		// 			typeLabel: '',
		// 			showForm: true,
		// 			cardId: 0,
		// 			glcs: '',
		// 			accessCode: ''
		// 		}
		// 	];

		// 	await newSpecPage({
		// 		components: [CDKSignatureModalConfiguration],
		// 		template: () => (
		// 			<scib-cdk-signature-modal-configuration
		// 				id="configuration-step"
		// 				radioRecipientTypes={[]}
		// 				recipientsList={recipientListMock}
		// 				literals={enGB}
		// 			></scib-cdk-signature-modal-configuration>
		// 		),
		// 		supportsShadowDom: true
		// 	});
		// 	// const HTMLElementCheckboxOptionalConfigInSigntureModalRecipient: HTMLElement = document.getElementById('optional-config-check-0');

		// 	// HTMLElementCheckboxOptionalConfigInSigntureModalRecipient.setAttribute('value', 'checked');
		// 	const HTMLElementWithCDKSignatureModalRecipientOptionalConfig: HTMLElement = document.getElementById('optional-config-0');
		// 	expect(HTMLElementWithCDKSignatureModalRecipientOptionalConfig).toBeTruthy();

		// 	const HTMLElementCheckboxOptionalConfigInSigntureModalRecipient: HTMLElement = document.getElementById('optional-config-check-0');
		// 	const value: string = HTMLElementCheckboxOptionalConfigInSigntureModalRecipient.getAttribute('value');
		// 	expect(value).toEqual('checked');
		// });
		it('should not render optional configuration dropdown when uncheck Optional configuration in qualified type', async () => {
			const recipientListMock = [
				{
					id: 0,
					name: '',
					email: '',
					type: '',
					typeId: 'recipient_signer',
					typeLabel: '',
					showForm: true,
					cardId: 0,
					glcs: '',
					accessCode: ''
				}
			];

			await newSpecPage({
				components: [CDKSignatureModalConfiguration],
				template: () => (
					<scib-cdk-signature-modal-configuration
						id="configuration-step"
						radioRecipientTypes={[]}
						recipientsList={recipientListMock}
						literals={enGB}
					></scib-cdk-signature-modal-configuration>
				),
				supportsShadowDom: true
			});

			const HTMLElementCheckboxOptionalConfigInSigntureModalRecipient: HTMLElement = document.getElementById('optional-config-0');
			expect(HTMLElementCheckboxOptionalConfigInSigntureModalRecipient).toBeFalsy();
		});
	});
});
