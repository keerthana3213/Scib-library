import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { DEFAULT_CONFIG } from './story.configs';
import React from 'react';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-organisms-advanced-data-table'),
	title: 'Design System/Organisms/Advanced Data Table',
	render: (args) => (
		<div style={{ margin: '0 auto', maxWidth: '1200px' }}>
			<scib-ui-v2-card>
				<scib-organisms-advanced-data-table {...args}>
					<div slot="header-actions" style={{ display: 'flex', gap: '8px', color: '#137e84' }}>
						<i className="icon icon-information-in-a-circle" />
						<i className="icon icon-refresh-reload-screen" />
						<i className="icon icon-download" />
						<i className="icon icon-settings" />
						<scib-atoms-button
							style={{ marginLeft: '4px' }}
							text="Action"
							size="xs"
							level="primary"
							variant="basic"
							type="button"
						></scib-atoms-button>
					</div>
				</scib-organisms-advanced-data-table>
			</scib-ui-v2-card>
		</div>
	)
};
export default meta;

export const Standard: StoryObj = {
	args: {
		...DEFAULT_CONFIG,
		controlManager: 'local'
	}
};

export const InfiniteScroll: StoryObj = {
	args: {
		...DEFAULT_CONFIG,
		controlManager: 'infiniteScroll'
	}
};

export const LocalInfiniteScroll: StoryObj = {
	args: {
		...DEFAULT_CONFIG,
		controlManager: 'localInfiniteScroll'
	}
};
