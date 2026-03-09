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
	...getStoryConfig('scib-molecules-overlay-bullets-container'),
	title: 'Design System/Molecules/Overlay Bullets Container',
	render: (args) => <scib-molecules-overlay-bullets-container {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		components: [
			{
				idBullet: '1',
				size: 'normal',
				bulletPosition: 'left',
				urlPath: '',
				contentCard: {
					content:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore' +
						' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo',
					arrowPosition: 'left',
					tooltipCardTitle: 'Track your credit line',
					linkTitle: 'More info',
					btnTitle: 'Next',
					disableLink: true,
					disableClose: false
				}
			},
			{
				idBullet: '4',
				size: 'normal',
				bulletPosition: 'left',
				urlPath: '',
				contentCard: {
					content:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore' +
						' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo',
					arrowPosition: 'right',
					tooltipCardTitle: 'Track your credit line',
					linkTitle: 'More info',
					btnTitle: 'Next',
					disableLink: true,
					disableClose: false
				}
			}
		]
	}
};
