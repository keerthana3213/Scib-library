import { UIRecaptcha } from '../component/ui-recaptcha';

describe.skip('ui-recaptcha', () => {
	it('builds', () => {
		expect(new UIRecaptcha()).toBeTruthy();
	});
});
