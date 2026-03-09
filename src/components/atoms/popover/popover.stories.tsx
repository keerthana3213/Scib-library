import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect, useRef } from 'react';
import { PopoverConfig } from './component/popover';
import { ILiterals } from './models/popover.model';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

// Interface for story arguments
interface PopoverStoryArgs {
	height?: string;
	offsetX?: number;
	offsetY?: number;
	popoverConfig?: PopoverConfig;
	literals?: ILiterals;
}

const meta: Meta = {
	...getStoryConfig('scib-atoms-popover'),
	title: 'Design System/Atoms/Popover',
	parameters: {
		docs: {
			description: {
				component: 'Popover component that displays floating content when a trigger element is clicked.'
			}
		}
	}
};
export default meta;

export const Playground: StoryObj<PopoverStoryArgs> = {
	render: (args) => (
		<scib-atoms-popover {...args}>
			<button
				slot="trigger"
				className="flame-px-4 flame-py-2.5 flame-bg-action-main-default flame-text-white flame-border-0 flame-rounded-1 flame-cursor-pointer"
			>
				Open Popover
			</button>
			<div className="flame-p-5">
				<h3 className="flame-m-0 flame-mb-2.5">Popover Content</h3>
				<p className="flame-m-0 flame-mb-4">This is a sample content for the popover.</p>
			</div>
		</scib-atoms-popover>
	),
	args: {
		height: '',
		offsetX: 0,
		offsetY: 0,
		popoverConfig: {
			type: 'elevated',
			variant: 'white'
		},
		literals: {
			triggerAriaLabel: 'Open example popover',
			closeAriaLabel: 'Close example popover'
		}
	}
};

const searchItems = [
	{ id: 1, icon: '💼', title: 'Main Business', subtitle: 'Business administration', selected: false },
	{ id: 2, icon: '📊', title: 'Statistics', subtitle: 'Reports and analytics', selected: true },
	{ id: 3, icon: '👥', title: 'Customers', subtitle: 'Customer management', selected: false },
	{ id: 4, icon: '💰', title: 'Finance', subtitle: 'Transactions and balances', selected: false },
	{ id: 5, icon: '🔔', title: 'Notifications', subtitle: 'Messages and alerts', selected: true }
];

export const ContentCustom: StoryObj = {
	render: (args) => {
		// This component is for Storybook demonstration only
		const BoxBuscadorDemo = () => {
			const [items, setItems] = useState(searchItems);
			const [searchTerm, setSearchTerm] = useState('');
			const [rowHeight, setRowHeight] = useState(48);
			const textFieldRef = useRef(null);

			// Filter items based on the search term
			const filteredItems = searchTerm
				? items.filter(
						(item) =>
							item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
				  )
				: items;

			// Change selection status
			const handleSelectChange = (id, checked) => {
				setItems(items.map((item) => (item.id === id ? { ...item, selected: checked } : item)));
			};

			return (
				<div className="flame-flex flame-flex-col flame-gap-5 flame-items-start">
					<div className="flame-mb-2.5">
						<label>
							Row height:
							<input
								type="range"
								min="40"
								max="80"
								value={rowHeight}
								onChange={(e) => setRowHeight(parseInt(e.target.value))}
								className="flame-ml-2.5"
							/>
							{rowHeight}px
						</label>
					</div>

					<scib-atoms-popover {...args}>
						<scib-atoms-button slot="trigger" text="Search options" level="primary" icon="search" icon-position="leading" />
						<div className="flame-p-4 flame-w-[400px]">
							<div className="flame-mb-4">
								<scib-ui-v2-text-field
									ref={textFieldRef}
									label="Search..."
									icon="search"
									value={searchTerm}
									onValueChange={(e) => setSearchTerm(e.detail)}
								/>
							</div>

							<div className="flame-my-4 flame-max-h-[280px] flame-overflow-y-auto flame-border flame-border-border-soft flame-rounded-1">
								<scib-atoms-list>
									{filteredItems.map((item) => (
										<scib-atoms-item-list key={item.id}>
											<div className="flame-flex flame-items-center flame-px-3" style={{ height: `${rowHeight}px` }}>
												<div>
													<scib-ui-v2-checkbox
														uid={`checkbox-${item.id}`}
														value={item.selected ? 'checked' : 'unchecked'}
														onValueChange={(e) => handleSelectChange(item.id, e.detail.checkboxValue === 'checked')}
													/>
												</div>
												<div className="flame-ml-3 flame-text-[20px]">{item.icon}</div>
												<div className="flame-flex-1 flame-ml-3">
													<div className="flame-font-bold flame-text-[14px]">{item.title}</div>
													<div className="flame-text-text-soft flame-text-[12px]">{item.subtitle}</div>
												</div>
											</div>
										</scib-atoms-item-list>
									))}
								</scib-atoms-list>
							</div>

							<div className="flame-flex flame-justify-end flame-gap-2 flame-mt-4">
								<scib-atoms-button text="Cancel" level="tertiary" variant="basic" />
								<scib-atoms-button text="Apply" level="primary" variant="basic" />
							</div>
						</div>
					</scib-atoms-popover>
				</div>
			);
		};

		return <BoxBuscadorDemo />;
	}
};

export const Offset: StoryObj<PopoverStoryArgs> = {
	render: (args) => (
		<div className="flame-flex flame-flex-col flame-gap-8 flame-items-start flame-mt-8">
			<div>
				<h3 className="flame-mb-2">With custom offsets (X: 20px, Y: 15px)</h3>
				<scib-atoms-popover {...args}>
					<scib-atoms-button slot="trigger" text="With offsets" level="primary" variant="basic" />
					<div className="flame-p-4 flame-w-[250px]">
						<h4 className="flame-m-0 flame-mb-2">Popover with offset</h4>
						<p className="flame-text-sm flame-text-text-soft">
							This popover has a horizontal offset of 20px and a vertical offset of 15px.
						</p>
					</div>
				</scib-atoms-popover>
			</div>

			<div>
				<h3 className="flame-mb-2">Without offsets (default)</h3>
				<scib-atoms-popover
					popoverConfig={{
						type: 'elevated',
						variant: 'white',
						tooltip: 'Popover without offsets'
					}}
				>
					<scib-atoms-button slot="trigger" text="Without offsets" level="primary" variant="basic" />
					<div className="flame-p-4 flame-w-[250px]">
						<h4 className="flame-m-0 flame-mb-2">Standard popover</h4>
						<p className="flame-text-sm flame-text-text-soft">This popover has no additional offset.</p>
					</div>
				</scib-atoms-popover>
			</div>
		</div>
	),
	args: {
		offsetX: 0,
		offsetY: 50
	}
};
