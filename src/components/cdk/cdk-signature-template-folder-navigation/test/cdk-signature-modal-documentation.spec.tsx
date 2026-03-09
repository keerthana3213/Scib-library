import { newSpecPage } from '@stencil/core/testing';
import { CdkSignatureTemplateFolderNavigation } from '../component/cdk-signature-template-folder-navigation';
import { h } from '@stencil/core';
import * as enGB from '../../cdk-signature-modal/i18n/en-GB.json';

describe('cdk-signature-template-folder-navigation', () => {
	it('builds', () => {
		expect(new CdkSignatureTemplateFolderNavigation()).toBeTruthy();
	});
	describe('render', () => {
		it('should render correctly', async () => {
			await newSpecPage({
				components: [CdkSignatureTemplateFolderNavigation],
				template: () => (
					<scib-cdk-signature-template-folder-navigation
						id="documentation-step"
						literals={enGB}
					></scib-cdk-signature-template-folder-navigation>
				),
				supportsShadowDom: true
			});
			const CdkSignatureTemplateFolderNavigationHTMLElement: HTMLElement = document.getElementById('documentation-step');
			expect(CdkSignatureTemplateFolderNavigationHTMLElement).toBeTruthy();
		});
		it('should render file selector', async () => {
			await newSpecPage({
				components: [CdkSignatureTemplateFolderNavigation],
				template: () => (
					<scib-cdk-signature-template-folder-navigation
						id="documentation-step"
						literals={enGB}
					></scib-cdk-signature-template-folder-navigation>
				),
				supportsShadowDom: true
			});
			const CdkSignatureTemplateFolderNavigationHTMLElement: HTMLElement = document.getElementById('documentation-step');
			const fileSelector: HTMLCollection = CdkSignatureTemplateFolderNavigationHTMLElement.getElementsByTagName('scib-cdk-file-selector');
			expect(fileSelector.length > 0).toBeTruthy();
		});
		it('should not render file selector', async () => {
			await newSpecPage({
				components: [CdkSignatureTemplateFolderNavigation],
				template: () => (
					<scib-cdk-signature-template-folder-navigation
						id="documentation-step"
						literals={enGB}
					></scib-cdk-signature-template-folder-navigation>
				),
				supportsShadowDom: true
			});
			const CdkSignatureTemplateFolderNavigationHTMLElement: HTMLElement = document.getElementById('documentation-step');
			const fileSelector: HTMLCollection = CdkSignatureTemplateFolderNavigationHTMLElement.getElementsByTagName('scib-cdk-file-selector');
			expect(fileSelector.length === 0).toBeTruthy();
		});
	});
});
