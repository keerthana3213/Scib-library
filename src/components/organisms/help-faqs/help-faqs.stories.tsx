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
	...getStoryConfig('scib-organisms-help-faqs'),
	title: 'Design System/Organisms/Help Faqs',
	render: (args) => <scib-organisms-help-faqs {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		modal: {
			open: true,
			imgSrc: 'assets/images/portal-trade.svg',
			modalTitle: `Discover your Confirming app`,
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum, turpis at porttitor malesuada, enim lectus mattis dolor, a maximus quam lorem egestas velit.',
			btnText: 'Start the tutorial',
			chkText: `Dont show this message again`
		},
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
		],
		footer: {}
	}
};
