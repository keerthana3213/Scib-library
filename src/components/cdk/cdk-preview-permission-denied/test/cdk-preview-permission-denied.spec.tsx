import { CDKPreviewPermissionDenied } from '../component/cdk-preview-permission-denied';

describe.skip('cdk-preview-permission-denied', () => {
	it('builds', () => {
		expect(new CDKPreviewPermissionDenied()).toBeTruthy();
	});
});
