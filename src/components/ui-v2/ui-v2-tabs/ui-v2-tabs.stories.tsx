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
	...getStoryConfig('scib-ui-v2-tabs'),
	title: 'Design System/Atoms/Tabs',
	render: (args) => <scib-ui-v2-tabs {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		tabOptions: [
			{ id: 1, icon: 'communication-announcement', badge: '9+', value: 'Notifications', tooltip: 'Noti Info' },
			{ id: 2, icon: 'conversation', badge: '9+', value: 'Messages', tooltip: 'Messages Info' },
			{ id: 3, icon: 'edit', badge: '9+', value: 'Tasks' }
		],
		tooltipDelay: 1000,
		activeIndex: 1,
		variant: 'white',
		level: 'primary'
	}
};
