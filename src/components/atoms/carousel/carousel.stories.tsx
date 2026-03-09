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
	...getStoryConfig('scib-atoms-carousel'),
	title: 'Design System/Atoms/Carousel',
	render: (args) => (
		<div style={{ height: '300px' }}>
			<scib-atoms-carousel {...args} dangerouslySetInnerHTML={{ __html: args.content }} />
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		content: `<img src='https://source.unsplash.com/random?landscape,cars' />
		<img src='https://source.unsplash.com/random?landscape,cars' />
		<img src='https://source.unsplash.com/random?landscape,cars' />
		<img src='https://source.unsplash.com/random?landscape,cars' />
		<video width="400" controls>
			<source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
			<source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
		</video>`
	}
};
