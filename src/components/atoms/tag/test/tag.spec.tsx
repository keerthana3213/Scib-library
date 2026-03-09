import { newSpecPage } from '@stencil/core/testing';
import { AtomsTag } from '../component/tag';
import { h } from '@stencil/core';

describe('atoms-tag', () => {
	describe('render', () => {
		it('should render the text', async () => {
			const page = await newSpecPage({
				components: [AtomsTag],
				template: () => <scib-atoms-tag text={'stringText'}></scib-atoms-tag>,
				supportsShadowDom: true
			});
			const span: HTMLSpanElement = page.root.shadowRoot.querySelector('span.tag-figure__text');
			expect(span.textContent).toBe('stringText');
		});
	});
});
