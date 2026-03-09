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
	...getStoryConfig('scib-molecules-paginator'),
	title: 'Design System/Molecules/Paginator',
	render: (args) => <scib-molecules-paginator {...args} />
};
export default meta;

export const Standard: StoryObj = {
	args: {
		language: 'es',
		totalItems: 50000,
		paginationSizeSelector: [10, 20, 30],
		infinitePaginator: false,
		disableNext: false
	}
};

export const Advanced: StoryObj = {
	args: {
		language: 'es',
		variant: 'advanced',
		totalItems: 50000,
		paginationSizeSelector: [10, 20, 30],
		infinitePaginator: false,
		disableNext: false
	}
};
