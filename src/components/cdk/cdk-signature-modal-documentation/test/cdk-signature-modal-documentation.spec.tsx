import { CdkSignatureModalDocumentation } from '../component/cdk-signature-modal-documentation';
import * as enGB from '../../cdk-signature-modal/i18n/en-GB.json';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('cdk-signature-modal-documentation', () => {
	it('builds', () => {
		expect(new CdkSignatureModalDocumentation()).toBeTruthy();
	});
	describe('render', () => {
		it('should render correctly', async () => {
			await newSpecPage({
				components: [CdkSignatureModalDocumentation],
				template: () => (
					<scib-cdk-signature-modal-documentation
						id="documentation-step"
						literals={enGB}
						loadOnlyTemplates={false}
						useTemplates={false}
						filesUploaded={[]}
					></scib-cdk-signature-modal-documentation>
				),
				supportsShadowDom: true
			});
			const CdkSignatureModalDocumentationHTMLElement: HTMLElement = document.getElementById('documentation-step');
			expect(CdkSignatureModalDocumentationHTMLElement).toBeTruthy();
		});
		it('should render file selector', async () => {
			await newSpecPage({
				components: [CdkSignatureModalDocumentation],
				template: () => (
					<scib-cdk-signature-modal-documentation
						id="documentation-step"
						literals={enGB}
						loadOnlyTemplates={false}
						useTemplates={false}
						filesUploaded={[]}
					></scib-cdk-signature-modal-documentation>
				),
				supportsShadowDom: true
			});
			const CdkSignatureModalDocumentationHTMLElement: HTMLElement = document.getElementById('documentation-step');
			const fileSelector: HTMLCollection = CdkSignatureModalDocumentationHTMLElement.getElementsByTagName('scib-cdk-file-selector');
			expect(fileSelector.length > 0).toBeTruthy();
		});
		it('should not render file selector', async () => {
			await newSpecPage({
				components: [CdkSignatureModalDocumentation],
				template: () => (
					<scib-cdk-signature-modal-documentation
						id="documentation-step"
						literals={enGB}
						loadOnlyTemplates={false}
						useTemplates={false}
						filesUploaded={[]}
					></scib-cdk-signature-modal-documentation>
				),
				supportsShadowDom: true
			});
			const CdkSignatureModalDocumentationHTMLElement: HTMLElement = document.getElementById('documentation-step');
			const fileSelector: HTMLCollection = CdkSignatureModalDocumentationHTMLElement.getElementsByTagName('scib-cdk-file-selector');
			expect(fileSelector.length === 0).toBeTruthy();
		});
	});
});
