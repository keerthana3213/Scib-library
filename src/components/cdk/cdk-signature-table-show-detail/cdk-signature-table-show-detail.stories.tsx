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
	...getStoryConfig('scib-cdk-signature-table-show-detail'),
	title: 'Design System/DEPRECATED/CDK/Signature Table Show Detail',
	render: (args) => <scib-cdk-signature-table-show-detail {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		literals: {
			titleSignatureTable: 'Envelopes Sent',
			completedStatusLabel: 'Completed',
			pendingStatusLabel: 'Pending to sign',
			rejectedStatusLabel: 'Rejected',
			canceledStatusLabel: 'Canceled',
			draftStatusLabel: 'Draft',
			menuButtonOptions: {
				resendButton: 'Resend',
				modifyButton: 'Continue',
				cancelButton: 'Cancel',
				cloneButton: 'Duplicate',
				downloadButton: 'Download docs',
				saveEcmButton: 'Save in ECM'
			},
			accordionInfo: {
				textInfoLabel: 'New',
				errorText: 'Pending rquired info',
				buttonLabelList: [''],
				signerTitle: 'Signers',
				ccTitle: 'CCs',
				resumeTitle: 'Resume',
				documentsTitle: 'Documents',
				resumeCreatedOn: 'CREATED ON',
				resumeExpireDate: 'EXPIRE DATE',
				resumeSignatureType: 'SIGNATURE TYPE',
				resumeDocuments: 'DOCUMENTS',
				team: 'TEAM',
				ceco: 'TEAM ID/ CECO',
				createdBy: 'CREATED BY',
				resumeSentOn: 'SENT ON',
				signed: 'Signed',
				notValidEmail: 'Email error',
				withError: ' (with error)',
				delivered: 'Seen, Pending to sign',
				sent: 'Not seen',
				tooltipWrongEmail: 'It has not been possible to send the envelope. Please check the email.'
			}
		},
		envelope: {
			id: 2354,
			created_at: '2022-09-27T15:01:48.143Z',
			updated_at: '2022-09-27T16:53:02.219Z',
			senderName: 'TEST, USER GRAPHIO 2',
			senderLdapId: 'GRAPHIO002',
			senderOriginApp: 'Graphio Digital Signature',
			envelopeId: '6a1c0adc-b343-46ba-83ee-816927b92ea6',
			envelopeStatus: 'sent',
			mailSent: '2022-09-27T16:53:02.260Z',
			envelopeUiUri: 'https://nodejs.org/dist/latest-v13.x/',
			signatureType: '',
			emailSubject: 'New to sign at Santander CIB - 2 Documents',
			emailBody: null,
			expirationDays: '120',
			ceco: 'No team graphio003',
			team: 'TEST, USER GRAPHIO 2 TRES DOS UNO',
			manager: 'graphio003',
			envelopeRecipient: [
				{
					id: 4651,
					created_at: '2022-09-27T15:01:48.143Z',
					updated_at: '2022-09-27T16:53:02.260Z',
					subsidiary: 'Otra prueba',
					name: 'adrian error',
					email: 'meloinvento.muyguachy@masguachy.com',
					type: 'signer',
					order: '1',
					status: 'NotValidEmail',
					date_delivered: null,
					date_sent: '2022-09-27T15:07:21.550Z',
					date_signed: null,
					date_declined: '2022-09-27T15:50:24.820Z',
					sms: null
				},
				{
					id: 4652,
					created_at: '2022-09-27T15:01:48.143Z',
					updated_at: '2022-09-27T16:53:02.260Z',
					subsidiary: null,
					name: 'adrian suazo',
					email: 'asuazolo@nttdata.com',
					type: 'signer',
					order: '1',
					status: 'declined',
					date_delivered: null,
					date_sent: '2022-09-27T15:07:20.550Z',
					date_signed: null,
					date_declined: '2022-09-27T15:50:24.820Z',
					sms: null
				},
				{
					id: 4653,
					created_at: '2022-09-27T15:01:48.143Z',
					updated_at: '2022-09-27T16:53:02.260Z',
					subsidiary: 'everis',
					name: 'Otra Prueba',
					email: 'x390172@santanderglobaltech.com',
					type: 'signer',
					order: '1',
					status: 'sent',
					date_delivered: null,
					date_sent: '2022-09-27T15:07:22.490Z',
					date_signed: null,
					date_declined: '2022-09-27T15:50:24.820Z',
					sms: null
				}
			],
			envelopeDocument: [
				{
					id: 2912,
					created_at: '2022-09-27T15:01:48.143Z',
					updated_at: '2022-09-27T16:53:02.206Z',
					name: 'Prueba_IBOR_V1 (1).pdf',
					extension: 'pdf',
					order: '1',
					uri: '/envelopes/6a1c0adc-b343-46ba-83ee-816927b92ea6/documents/1',
					guid: '19ccf3db-0942-4ac4-8926-98a0a6214be4',
					size: '100.94 kB'
				},
				{
					id: 2913,
					created_at: '2022-09-27T15:01:48.143Z',
					updated_at: '2022-09-27T16:53:02.206Z',
					name: 'EV_BUG (10) (4).pdf',
					extension: 'pdf',
					order: '2',
					uri: '/envelopes/6a1c0adc-b343-46ba-83ee-816927b92ea6/documents/2',
					guid: '353ea62e-2941-4ade-9172-bff0ee78a2f3',
					size: '381.10 kB'
				}
			],
			signatureTypeId: {
				id: 1,
				created_at: '2021-05-06T10:55:24.631Z',
				updated_at: '2021-05-06T10:55:24.631Z',
				name: 'Simple',
				providerName: 'universalsignaturepen_imageonly',
				active: true,
				options: null
			},
			senderOriginAppId: {
				id: 2,
				created_at: '2021-05-06T11:51:04.001Z',
				updated_at: '2021-05-06T11:51:04.001Z',
				name: 'Graphio Digital Signature',
				clientId: '3552ed41-a2ae-5a2e-9e9f-c0cdc35d2d90',
				callback: null,
				statusList: null,
				hosts: ['employee-santandercib.scib.pre.corp', 'employee-cert.scib.pre.corp'],
				accessToken: null,
				active: true
			},
			team_detail: {
				id: 90,
				name: '### No team graphio003 ###',
				ceco: 'No team graphio003',
				manager: 'graphio003',
				created_at: '2022-02-24T12:15:47.967Z',
				updated_at: '2022-02-24T12:15:47.967Z'
			}
		},
		withoutActions: false,
		withoutDocuments: false,
		modalDetailStyle: false
	}
};
