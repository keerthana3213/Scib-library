import { AtomsHelperText } from '../component/helper-text';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('atoms-text', () => {
	it('builds', () => {
		expect(new AtomsHelperText()).toBeTruthy();
	});
});
