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
	...getStoryConfig('scib-atoms-segmented-control'),
	title: 'Design System/Atoms/Segmented Control',
	render: (args) => <scib-atoms-segmented-control {...args}></scib-atoms-segmented-control>
};
export default meta;

export const Playground: StoryObj = {
	args: {
		options: [
			{ icon: 'add', value: 'option1' },
			{ label: 'Option medium', value: 'option2' },
			{ label: 'Option long !!!!!!', icon: 'account-user', value: 'option3' }
		],
		value: 'option2',
		size: 'm'
	}
};

export const Size: StoryObj = {
	args: {
		options: [
			{ icon: 'add', value: 'option1' },
			{ label: 'Option medium', value: 'option2' },
			{ label: 'Option long!!!!!!', icon: 'account-user', value: 'option3' }
		],
		value: 'option2',
		size: null
	},
	render: (args) => (
		<div className="sb-container">
			<div className="sb-example-wrapper">
				<h3 className="sb-example-title">Size S</h3>
				<scib-atoms-segmented-control {...args} size="s"></scib-atoms-segmented-control>
			</div>

			<div className="sb-example-wrapper">
				<h3 className="sb-example-title">Size M (default)</h3>
				<scib-atoms-segmented-control {...args} size="m"></scib-atoms-segmented-control>
			</div>
		</div>
	)
};
