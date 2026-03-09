import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-atoms-tutorial-modal'),
	title: 'Design System/Atoms/Tutorial Modal',
	render: (args) => <scib-atoms-tutorial-modal {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		open: true,
		imgSrc: 'assets/images/portal-trade.svg',
		modalTitle: 'Discover your Confirming app',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum, turpis at porttitor malesuada, enim lectus mattis dolor, a maximus quam lorem egestas velit.',
		btnText: 'Start the tutorial',
		chkText: 'Dont show this message again'
	}
};
