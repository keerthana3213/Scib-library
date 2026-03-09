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
	...getStoryConfig('scib-atoms-toaster'),
	title: 'Design System/Atoms/Toaster',
	render: (args) => (
		<div>
			<scib-atoms-toaster {...args} />
			<br />
			<scib-atoms-toaster {...args}>
				<div
					slot="actions"
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						textAlign: 'left',
						alignItems: 'center',
						width: '100%'
					}}
				>
					<scib-ui-v2-checkbox class="mdc-tutorial__checkbox" label="Do not show again" value="unchecked"></scib-ui-v2-checkbox>
					<a
						id="link-go-to-sailpoint"
						href="#"
						target="_blank"
						style={{
							minWidth: 'fit-content',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-start',
							paddingRight: '48px',
							color: 'var(--color-action-alternative-default)',
							fontWeight: 'bold'
						}}
					>
						<span style={{ fontSize: '16px', lineHeight: '24px' }}> Go to Sailpoint </span>
						<span role="image" className="u-icon icon-open-link" style={{ paddingLeft: '9px' }}></span>
					</a>
				</div>
			</scib-atoms-toaster>
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		status: 'success',
		variant: 'normal',
		open: true,
		message: 'Changes saved succesfully',
		description: 'Please save another document',
		time: -1
	}
};

export const WithActionLink: StoryObj = {
	args: {
		status: 'success',
		variant: 'normal',
		open: true,
		message: 'Changes saved succesfully',
		description: 'Please save another document',
		time: -1,
		action: 'Click here'
	}
};
