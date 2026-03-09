import { newSpecPage } from '@stencil/core/testing';
import { MoleculesStepInfo } from '../component/step-info';

describe('molecules-step-info', () => {
	const components = [MoleculesStepInfo];
	const testArgs = {
		icon: 'icon-circle-info',
		literals: {
			title: 'You require permissions',
			subtitle: 'To be able to save documents on ECM viewer follow these steps:',
			infoText:
				'If the appropriate profile is not found when searching in Sailpoint, it shall be requested through the validator manager of each user in the same Sailpoint tool'
		},
		steps: [
			{
				title: 'Follow the indications',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'
			},
			{
				title: 'Use “Manage my access”',
				description:
					'Lorem ipsum dolor sit amet, “PERMISSION 01ASDJA”, “PERMISSION 02ASDJA” consectetur, sed do eiusmod tempor incididunt ut labore et dolore magna.'
			},
			{
				title: 'Go to Sailpoint',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing. '
			}
		]
	};

	it('showImage function status warning', () => {
		const stepInfo = new MoleculesStepInfo();
		expect(new MoleculesStepInfo()).toBeTruthy();
		stepInfo.showImage();
		expect(stepInfo.image).toEqual('/assets/images/i-attention_dialog.svg');
	});

	it('showImage function status success', () => {
		const stepInfo = new MoleculesStepInfo();
		expect(new MoleculesStepInfo()).toBeTruthy();
		stepInfo.status = 'success';
		stepInfo.showImage();
		expect(stepInfo.image).toEqual('/assets/images/i-success_dialog.svg');
	});

	it('showImage function status attention', () => {
		const stepInfo = new MoleculesStepInfo();
		expect(new MoleculesStepInfo()).toBeTruthy();
		stepInfo.status = 'attention';
		stepInfo.showImage();
		expect(stepInfo.image).toEqual('/assets/images/i-attention_dialog.svg');
	});

	it('showImage function status error', () => {
		const stepInfo = new MoleculesStepInfo();
		expect(new MoleculesStepInfo()).toBeTruthy();
		stepInfo.status = 'error';
		stepInfo.showImage();
		expect(stepInfo.image).toEqual('/assets/images/i-error_dialog.svg');
	});

	it('showImage function status information', () => {
		const stepInfo = new MoleculesStepInfo();
		expect(new MoleculesStepInfo()).toBeTruthy();
		stepInfo.status = 'information';
		stepInfo.showImage();
		expect(stepInfo.image).toEqual('/assets/images/i-information-dialog.svg');
	});

	it('showImage function status loading', () => {
		const stepInfo = new MoleculesStepInfo();
		expect(new MoleculesStepInfo()).toBeTruthy();
		stepInfo.status = 'loading';
		stepInfo.showImage();
		expect(stepInfo.image).toEqual('/assets/images/spinner.gif');
	});

	it('Empty component', async () => {
		const page = await newSpecPage({
			html: `<scib-molecules-step-info></scib-molecules-step-info>`,
			components
		});
		expect(page.root).toBeTruthy();
	});

	it('Render component', async () => {
		const page = await newSpecPage({
			components,
			html: `<scib-molecules-step-info literals='${testArgs.literals}' steps='${testArgs.steps}' icon='${testArgs.icon}'>`
		});
		expect(page.root).toBeTruthy();
	});
});
