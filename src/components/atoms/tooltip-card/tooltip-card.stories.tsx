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
	...getStoryConfig('scib-atoms-tooltip-card'),
	title: 'Design System/Atoms/Tooltip Card',
	render: (args) => <scib-atoms-tooltip-card {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		idBullet: '1',
		content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo`,
		tooltipCardTitle: 'Activate Tutorial',
		btnTitle: 'Got it',
		arrowPosition: 'left',
		disableClose: false,
		open: true,
		zIndex: '150',
		linkTitle: 'More info',
		disableLink: false,
		prev: '',
		next: ''
	}
};
