import { UIWrapper } from '../component/ui-wrapper';

describe.skip('ui-wrapper', () => {
	it('builds', () => {
		expect(new UIWrapper()).toBeTruthy();
	});
});
