import { UINotification } from '../component/ui-notification';

describe.skip('ui-notification', () => {
	it('builds', () => {
		expect(new UINotification()).toBeTruthy();
	});
});
