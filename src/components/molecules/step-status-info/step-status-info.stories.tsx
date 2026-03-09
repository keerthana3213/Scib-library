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
	...getStoryConfig('scib-molecules-step-status-info'),
	title: 'Design System/Molecules/Step Status Info',
	render: (args) => <scib-molecules-step-status-info {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		panels: [
			{
				title: 'Pending',
				id: 'pending',
				color: '#F2AB4E',
				step: 1,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
			},
			{
				title: 'Cancelled',
				id: 'cancelled',
				color: '#000000',
				step: 2,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
			},
			{
				title: 'In process',
				id: 'inProcess',
				color: '#3366FF',
				step: 2,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
			},

			{
				title: 'Rejected',
				id: 'rejected',
				color: '#9E3667',
				step: 3,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
			},
			{
				title: 'Processed',
				id: 'processed',
				color: '#63BA68',
				step: 3,
				description:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
			}
		]
	}
};
