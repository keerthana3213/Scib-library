import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getStoryConfig } from '../../../../.storybook/utils';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-cdk-pitch-card'),
	title: 'Design System/DEPRECATED/CDK/Pitch Card',
	render: (args) => <scib-cdk-pitch-card {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		literals: {
			btnOpen: 'Open'
		},
		data: [
			{
				area: 'area',
				id: '1',
				title: 'My first pitch',
				url: 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
				btnUrl: '/testBoton1',
				actions: [
					{
						text: 'Download',
						icon: 'icon-download',
						eventId: 'downloadPitch'
					},
					{
						text: 'Share',
						icon: 'icon-share-24',
						eventId: 'sharePitch'
					},
					{
						text: 'Options',
						icon: 'icon-menu',
						eventId: 'optionsPitch',
						options: [
							{
								text: 'Edit Pitch',
								icon: 'icon-edit-pencil',
								eventId: 'editPitch'
							},
							{
								text: 'Duplicate Pitch',
								icon: 'icon-duplicate-clipboard',
								eventId: 'duplicatePitch'
							},
							{
								text: 'Delete Pitch',
								icon: 'icon-delete',
								eventId: 'deletePitch'
							}
						]
					}
				]
			},
			{
				area: 'area',
				id: '2',
				title: 'My second pitch',
				url: 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
				btnUrl: '/testBoton2',
				actions: [
					// {
					// 	text: 'Download',
					// 	icon: 'icon-download',
					// 	eventId: 'downloadPitch',
					// },
					// {
					// 	text: 'Share',
					// 	icon: 'icon-share-24',
					// 	eventId: 'sharePitch',
					// },
					{
						text: 'Options',
						icon: 'icon-menu',
						eventId: 'optionsPitch',
						options: [
							// {
							// 	text: 'Edit Pitch',
							// 	icon: 'icon-edit-pencil',
							// 	eventId: 'editPitch'
							// },
							// {
							// 	text: 'Duplicate Pitch',
							// 	icon: 'icon-duplicate-clipboard',
							// 	eventId: 'duplicatePitch'
							// },
							{
								text: 'Delete Pitch',
								icon: 'icon-delete',
								eventId: 'deletePitch'
							}
						]
					}
				]
			},
			{
				area: 'area',
				id: '3',
				title: 'My third pitch',
				url: 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
				btnUrl: '/testBoton3',
				actions: [
					{
						text: 'Download',
						icon: 'icon-download',
						eventId: 'downloadPitch'
					},
					{
						text: 'Share',
						icon: 'icon-share-24',
						eventId: 'sharePitch'
					},
					{
						text: 'Options',
						icon: 'icon-menu',
						eventId: 'optionsPitch'
					}
				]
			},
			{
				area: 'area',
				id: '4',
				title: 'My fourth pitch',
				url: 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
				btnUrl: '/testBoton4',
				actions: [
					{
						text: 'Download',
						icon: 'icon-download',
						eventId: 'downloadPitch'
					},
					{
						text: 'Share',
						icon: 'icon-share-24',
						eventId: 'sharePitch'
					},
					{
						text: 'Options',
						icon: 'icon-menu',
						eventId: 'optionsPitch'
					}
				]
			},
			{
				area: 'area',
				id: '5',
				title: 'My fifth pitch',
				url: 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
				btnUrl: '/testBoton5',
				actions: []
			}
		]
	}
};
