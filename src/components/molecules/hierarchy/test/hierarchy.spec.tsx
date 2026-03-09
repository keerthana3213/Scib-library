import { newSpecPage } from '@stencil/core/testing';
import { MoleculesHierarchy } from '../component/hierarchy';

describe('molecules-hierarchy', () => {
	it('renders', async () => {
		await newSpecPage({
			components: [MoleculesHierarchy],
			html: `<molecules-hierarchy></molecules-hierarchy>`
		});
		expect(new MoleculesHierarchy()).toBeTruthy();
	});
});
