import { newE2EPage } from '@stencil/core/testing';

describe.skip('cdk-signature-template-folder-navigation', () => {
	it('renders', async () => {
		const page = await newE2EPage();
		await page.setContent('<scib-cdk-signature-template-folder-navigation></scib-cdk-signature-template-folder-navigation>');
		const element = await page.find('scib-cdk-signature-template-folder-navigation');
		expect(element).toHaveClass('hydrated');
	});
});
