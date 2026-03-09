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
	...getStoryConfig('scib-atoms-notification-toaster'),
	title: 'Design System/Atoms/Notification Toaster',
	render: (args) => <scib-atoms-notification-toaster {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		footerText: 'All notification (8)',
		open: true,
		itemList: [
			{
				id: 1,
				title: 'New export payment ready',
				app: 'Contract reviewer',
				content: 'New contract to sign off in your Document Area email@wp.es',
				type: 'Notification'
			},
			{
				id: 2,
				app: 'Contract reviewer',
				content: 'New contract to sign off in your Document Area asd',
				type: 'Message',
				users: {
					from: {
						id: 466,
						created_at: '2022-01-21T10:31:08.951Z',
						updated_at: '2022-01-21T10:31:08.951Z',
						ldapUid: 'graphio002',
						avatar: {},
						addressee: 'TEST, USER GRAPHIO 2, TEST, USER GRAPHIO 2 <graphio002>',
						email: 'hugoan.arnejo@servexternos.gruposantander.com',
						name: 'TEST, USER GRAPHIO 2',
						surname: 'TEST, USER GRAPHIO 2',
						is_employee: true,
						is_owner: true,
						is_offline: false,
						global_portal_email_notification: false,
						email_notifications_apps_blocked: null,
						deleted_at: null
					},
					avatar: {
						src: 'https://i.pravatar.cc/300',
						alt: '',
						text: 'TU'
					}
				},
				entity_id: 7222,
				title: 'Topico nuevo QA2',
				unread: 1,
				read: false
			}
		]
	}
};
