import { CDKAppPermissionDenied } from '../component/cdk-app-permission-denied';

describe.skip('cdk-app-permission-denied', () => {
	it('builds', () => {
		expect(new CDKAppPermissionDenied()).toBeTruthy();
	});
});
