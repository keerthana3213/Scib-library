import { UITapbar } from '../component/ui-tapbar';

describe.skip('ui-tapbar', () => {
	it('builds', () => {
		expect(new UITapbar()).toBeTruthy();
	});
});
