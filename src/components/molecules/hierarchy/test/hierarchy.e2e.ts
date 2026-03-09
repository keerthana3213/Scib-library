import { newE2EPage } from '@stencil/core/testing';

describe('molecules-hierarchy', () => {
	it('renders', async () => {
		const page = await newE2EPage();
		await page.setContent('<molecules-hierarchy></molecules-hierarchy>');

		const element = await page.find('molecules-hierarchy');
		expect(element).toHaveClass('hydrated');
	});
});
