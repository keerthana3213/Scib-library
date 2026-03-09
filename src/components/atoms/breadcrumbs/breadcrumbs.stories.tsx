import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { omit } from 'lodash';
import React from 'react';
declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-atoms-breadcrumbs'),
	title: 'Design System/Atoms/Breadcrumbs',
	render: (args) => <scib-atoms-breadcrumbs {...args} />,
	args: {
		breadcrumb: [
			{
				name: 'Level 1',
				tooltip: 'Back to Level 1'
			},
			{
				name: 'Level 2',
				tooltip: 'Back to Level 2'
			},
			{
				name: 'Level 3',
				tooltip: 'Back to level 3'
			},
			{
				name: 'Level 4',
				tooltip: 'Back to level 4'
			},
			{
				name: 'Level 5',
				tooltip: 'Back to level 5'
			},
			{
				name: 'Level 6',
				tooltip: 'Back to level 6'
			},
			{
				name: 'Level 7',
				tooltip: 'Back to level 7'
			},
			{
				name: 'Level 8',
				tooltip: 'Back to level 8'
			}
		],
		literals: {
			ariaLabel: 'Navegación de migas de pan',
			backButtonAriaLabel: 'Volver',
			currentPageLabel: 'Página actual',
			homeIconTitle: 'Ir al inicio',
			backIconTitle: 'Volver',
			ellipsisTooltip: 'Más navegación',
			ellipsisLabel: 'Más navegación',
			defaultHomeName: 'Home',
			defaultHomeTooltip: 'Go to Home',
			backButtonText: 'Volver a'
		},
		level: 'secondary'
	}
};
export default meta;

export const Playground: StoryObj = {
	args: {
		size: 's',
		level: null
	},
	render: (args) => (
		<div className="sb-container">
			<div className="sb-example-wrapper">
				<h3 className="sb-example-title">Level Primary</h3>
				<scib-atoms-breadcrumbs {...args} level="primary" />
			</div>

			<div className="sb-example-wrapper">
				<h3 className="sb-example-title">Level Secondary</h3>
				<scib-atoms-breadcrumbs {...args} level="secondary" />
			</div>

			<div className="sb-deprecated">
				<h3 className="sb-example-title">
					Breadcrumb deprecated (not use): If level prop. is not configured, this deprecated version will be displayed.
				</h3>
				<scib-atoms-breadcrumbs {...args} />
			</div>
		</div>
	)
};

// Size comparison with two sizes side by side
export const Size: StoryObj = {
	args: {
		size: null,
		level: 'primary'
	},
	render: (args) => (
		<div className="sb-container">
			<div className="sb-example-wrapper">
				<h3 className="sb-example-title">Small Size (Default)</h3>
				<scib-atoms-breadcrumbs {...args} size={args['size'] ?? 's'} />
			</div>

			<div className="sb-example-wrapper">
				<h3 className="sb-example-title">Medium Size</h3>
				<scib-atoms-breadcrumbs {...args} size={args['size'] ?? 'm'} />
			</div>
		</div>
	)
};
