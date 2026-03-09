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
	...getStoryConfig('scib-molecules-step-info'),
	title: 'Design System/Molecules/Step Info',
	render: (args) => (
		<scib-molecules-step-info {...args}>
			<div slot="actions" style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
				<scib-atoms-button
					style={{ minWidth: '200px', minHeight: '48px', marginTop: '24px', marginLeft: '24px' }}
					text="Cancel"
					size="s"
					level="secondary"
					type="button"
				></scib-atoms-button>
				<scib-atoms-button
					style={{ minWidth: '200px', minHeight: '48px', marginTop: '24px', marginLeft: '24px' }}
					text="Go to Sailpoint"
					size="s"
					level="primary"
					type="button"
				></scib-atoms-button>
			</div>
		</scib-molecules-step-info>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		icon: 'icon-circle-info',
		literals: {
			title: 'You require permissions',
			subtitle: 'To be able to save documents on ECM viewer follow these steps:',
			infoText:
				'If the appropriate profile is not found when searching in Sailpoint, it shall be requested through the validator manager of each user in the same Sailpoint tool'
		},
		steps: [
			{
				title: 'Follow the indications',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'
			},
			{
				title: 'Use “Manage my access”',
				description:
					'Lorem ipsum dolor sit amet, “PERMISSION 01ASDJA”, “PERMISSION 02ASDJA” consectetur, sed do eiusmod tempor incididunt ut labore et dolore magna.'
			},
			{
				title: 'Go to Sailpoint',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing. '
			}
		]
	}
};
