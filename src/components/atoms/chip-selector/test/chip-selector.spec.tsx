import { newSpecPage } from '@stencil/core/testing';
import { ChipSelector } from '../component/chip-selector';

describe('chip-selector', () => {
	it('renders', async () => {
		const page = await newSpecPage({
			components: [ChipSelector],
			html: `<chip-selector></chip-selector>`
		});
		expect(page.root).toEqualHtml(`
		<chip-selector></chip-selector>
    `);
	});
});
