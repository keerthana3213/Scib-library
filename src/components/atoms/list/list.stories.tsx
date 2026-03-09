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
	...getStoryConfig('scib-atoms-list'),
	title: 'Design System/Atoms/List',
	render: (args) => <scib-atoms-list {...args} dangerouslySetInnerHTML={{ __html: args.content }} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		content: `<scib-atoms-item-list>
	<span style="font-weight: bold; font-size: 16px;">GLT - 32DEFCC891</span>
</scib-atoms-item-list>
<scib-atoms-item-list>
	<span style="font-weight: bold; font-size: 16px;">GLT - 32DEFCC891</span>
</scib-atoms-item-list>
<scib-atoms-item-list>
	<span style="font-weight: bold; font-size: 16px;">GLT - 32DEFCC891</span>
</scib-atoms-item-list>
<scib-atoms-item-list>
	<span style="font-weight: bold; font-size: 16px;">GLT - 32DEFCC891</span>
</scib-atoms-item-list>
<scib-atoms-item-list>
	<span style="font-weight: bold; font-size: 16px;">GLT - 32DEFCC891</span>
</scib-atoms-item-list>
<scib-atoms-item-list>
	<span style="font-weight: bold; font-size: 16px;">GLT - 32DEFCC891</span>
</scib-atoms-item-list>
<scib-atoms-item-list>
	<span style="font-weight: bold; font-size: 16px;">GLT - 32DEFCC891</span>
</scib-atoms-item-list>`
	}
};
