import { MoleculesLoginCredentials } from '../component/login-credentials';

describe.skip('molecules-login-credentials', () => {
	it('builds', () => {
		expect(new MoleculesLoginCredentials()).toBeTruthy();
	});
});
