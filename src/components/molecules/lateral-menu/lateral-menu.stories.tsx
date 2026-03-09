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
	...getStoryConfig('scib-molecules-lateral-menu'),
	title: 'Design System/Molecules/Lateral Menu',
	render: (args) => (
		<scib-molecules-lateral-menu {...args}>
			<div className="title">Title</div>
		</scib-molecules-lateral-menu>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		selected: '2',
		items: [
			{
				id: '1',
				text: 'Item 1',
				subtext: 'Notifications',
				icon: 'icon-settings',
				tag: {
					text: '2',
					type: 'alert'
				}
			},
			{
				id: '2',
				text: 'Item 2',
				bullet: {
					idBullet: 'demo-bullet-2',
					size: 'small',
					position: 'right'
				}
			},
			{ id: '7', text: 'Item 3', icon: 'icon-account-user' },
			{
				id: '9',
				text: 'Item 4',
				subtext: 'Messages',
				tag: {
					text: 'New',
					type: 'success'
				}
			},
			{ id: '5', text: 'Item 5' },
			{ id: '6', text: 'Item 6' }
		],
		icon: 'icon-slot'
	}
};

export const Levels: StoryObj = {
	args: {
		selected: '8', // Select a level 3 child item to demonstrate functionality
		collapsible: true,
		showChevrons: false, // No chevrons in this story
		literals: {
			showMenu: 'Mostrar menú',
			hideMenu: 'Ocultar menú'
		},
		items: [
			{
				id: '1',
				text: 'Dashboard Principal',
				level: 1,
				isTitle: true,
				icon: 'icon-slot'
			},
			{
				id: '2',
				text: 'Analytics',
				level: 1,
				icon: 'icon-slot'
			},
			{
				id: '3',
				text: 'Reportes Generales',
				level: 2,
				icon: 'icon-slot'
			},
			{
				id: '4',
				text: 'Métricas de Ventas',
				level: 3,
				icon: 'icon-slot',
				subtext: '15'
			},
			{
				id: '5',
				text: 'KPIs Financieros',
				level: 3,
				icon: 'icon-slot'
			},
			{
				id: '6',
				text: 'Configuración',
				level: 1,
				isTitle: true,
				icon: 'icon-slot'
			},
			{
				id: '7',
				text: 'Gestión de Usuarios',
				level: 2,
				icon: 'icon-slot',
				subtext: '8'
			},
			{
				id: '8',
				text: 'Roles y Permisos',
				level: 3,
				icon: 'icon-slot'
			},
			{
				id: '9',
				text: 'Auditoría',
				level: 3,
				icon: 'icon-slot'
			},
			{
				id: '10',
				text: 'Sistema',
				level: 1,
				icon: 'icon-slot'
			}
		]
	}
};

export const Accordions: StoryObj = {
	args: {
		selected: '4',
		collapsible: true,
		showChevrons: true, // With chevrons in this story
		literals: {
			showMenu: 'Mostrar menú',
			hideMenu: 'Ocultar menú'
		},
		items: [
			{
				id: '1',
				text: 'Dashboard',
				level: 1,
				isTitle: true,
				icon: 'icon-slot',
				isExpanded: true // Accordion open by default
			},
			{
				id: '2',
				text: 'Reportes',
				level: 2,
				icon: 'icon-slot',
				isExpanded: true // Accordion open by default
			},
			{
				id: '3',
				text: 'Ventas',
				level: 3,
				icon: 'icon-slot'
			},
			{
				id: '4',
				text: 'Marketing',
				level: 3,
				icon: 'icon-slot',
				subtext: '12'
			},
			{
				id: '5',
				text: 'Analytics',
				level: 2,
				icon: 'icon-slot',
				isExpanded: false // Accordion closed by default
			},
			{
				id: '6',
				text: 'Usuarios',
				level: 3,
				icon: 'icon-slot'
			},
			{
				id: '7',
				text: 'Sesiones',
				level: 3,
				icon: 'icon-slot',
				subtext: '5'
			},
			{
				id: '8',
				text: 'Configuración',
				level: 1,
				isTitle: true,
				icon: 'icon-slot',
				isExpanded: true // Accordion open by default
			},
			{
				id: '9',
				text: 'Permisos',
				level: 2,
				icon: 'icon-slot',
				isExpanded: false // Accordion closed by default
			},
			{
				id: '10',
				text: 'Roles',
				level: 3,
				icon: 'icon-slot'
			},
			{
				id: '11',
				text: 'Usuarios Admin',
				level: 3,
				icon: 'icon-slot'
			},
			{
				id: '12',
				text: 'Sistema',
				level: 2,
				icon: 'icon-slot',
				isExpanded: true // Accordion open by default
			},
			{
				id: '13',
				text: 'Logs',
				level: 3,
				icon: 'icon-slot',
				subtext: '25'
			}
		]
	}
};

export const TypeCollapsed: StoryObj = {
	render: (args) => (
		<div>
			<div
				style={{
					padding: '16px',
					marginBottom: '16px',
					backgroundColor: '#f5f5f5',
					borderRadius: '8px',
					fontSize: '14px',
					color: '#666'
				}}
			>
				<strong>Collapse Mode Demo:</strong> Change the <code>collapseMode</code> property to see different behaviors:
				<br />• <code>'icons'</code>: Shows only icons when collapsed
				<br />• <code>'full'</code>: Completely hides the menu when collapsed
			</div>
			<scib-molecules-lateral-menu {...args}>
				<div className="title">Title</div>
			</scib-molecules-lateral-menu>
		</div>
	),
	args: {
		selected: '3',
		collapsible: true,
		collapsed: false, // Starts expanded to show the difference
		showChevrons: false, // No chevrons for flat menu
		literals: {
			showMenu: 'Mostrar menú',
			hideMenu: 'Ocultar menú'
		},
		items: [
			{
				id: '1',
				text: 'Dashboard',
				level: 1,
				icon: 'icon-slot'
			},
			{
				id: '2',
				text: 'Analytics',
				level: 1,
				icon: 'icon-slot'
			},
			{
				id: '3',
				text: 'Reportes',
				level: 1,
				icon: 'icon-slot'
			},
			{
				id: '4',
				text: 'Configuración',
				level: 1,
				icon: 'icon-slot'
			},
			{
				id: '5',
				text: 'Usuarios',
				level: 1,
				icon: 'icon-slot'
			},
			{
				id: '6',
				text: 'Sistema',
				level: 1,
				icon: 'icon-slot'
			}
		]
	}
};

export const WithTagsAndBullets: StoryObj = {
	args: {
		selected: '2',
		items: [
			{
				id: '1',
				text: 'Dashboard',
				icon: 'icon-slot',
				tag: {
					text: 'New',
					type: 'success'
				},
				subtext: 'Main overview',
				notification: true
			},
			{
				id: '2',
				text: 'Analytics',
				icon: 'icon-slot',
				tag: {
					text: 'Beta',
					type: 'warning'
				},
				subtext: 'Data insights'
			},
			{
				id: '3',
				text: 'Reports',
				icon: 'icon-slot',
				subtext: 'Generate reports',
				notification: true
			},
			{
				id: '4',
				text: 'Settings',
				icon: 'icon-slot',
				tag: {
					text: 'Updated',
					type: 'info'
				}
			},
			{
				id: '5',
				text: 'Custom Item',
				icon: 'icon-slot',
				tag: {
					text: 'Pro',
					type: 'primary',
					customColor: '#ff6b35'
				},
				subtext: 'Premium feature',
				notification: true
			}
		],
		icon: 'icon-slot'
	}
};
