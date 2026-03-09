import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { AtomsStepProgress } from '../component/step-progress';

describe('atoms-step-progress', () => {
	const activeId = 2;
	const allowFlow = false;
	const allowOnlyEvents = false;
	const adjustText = false;
	const steps = [
		{
			id: 1,
			value: 'first_step',
			label: 'First large large step'
		},
		{
			id: 2,
			value: 'second_step',
			label: 'Second step'
		},
		{
			id: 3,
			value: 'third_step',
			label: 'Third step'
		},
		{
			id: 4,
			value: 'fourth_step',
			label: 'Fourth step'
		},
		{
			id: 5,
			value: 'fifth_step',
			label: 'Fifth step',
			notAllow: true
		}
	];

	it('builds', async () => {
		const page = await newSpecPage({
			components: [AtomsStepProgress],
			template: () => (
				<scib-atoms-step-progress
					steps={steps}
					activeId={activeId}
					allowFlow={allowFlow}
					allowOnlyEvents={allowOnlyEvents}
					adjustText={adjustText}
				></scib-atoms-step-progress>
			)
		});
		expect(page.root).toBeTruthy();
	});
});
