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
	...getStoryConfig('scib-atoms-lottie-player'),
	title: 'Design System/Atoms/Lottie Player',
	render: (args) => (
		<div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
			<scib-atoms-lottie-player {...args} />
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		src: {
			default: 'assets/animations/splash-desktop.json',
			md: 'assets/animations/splash-mobile.json',
			sm: 'assets/animations/splash-mobile.json'
		},
		autoplay: true,
		loop: true
	}
};
