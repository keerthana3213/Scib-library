import { CDKToolbox } from '../component/cdk-toolbox';

describe.skip('cdk-toolbox', () => {
	it('builds', () => {
		expect(new CDKToolbox()).toBeTruthy();
	});
});
