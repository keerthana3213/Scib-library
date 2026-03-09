import { newE2EPage } from '@stencil/core/testing';

describe('chip-selector', () => {
	it('renders', async () => {
		const page = await newE2EPage();
		await page.setContent('<chip-selector></chip-selector>');

		const element = await page.find('chip-selector');
		expect(element).toHaveClass('hydrated');
	});
});
