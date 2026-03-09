import { UIToast } from '../component/ui-toast';

describe.skip('ui-toast', () => {
	it('builds', () => {
		expect(new UIToast()).toBeTruthy();
	});
});
