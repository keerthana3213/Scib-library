import { CDKSignatureTableShowDetail } from '../component/cdk-signature-table-show-detail';
import { UIInfoTooltip } from '../../../ui/ui-info-tooltip/component/ui-info-tooltip';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('cdk-signature-table-show-detail', () => {
	beforeEach(async () => {
		document.body.innerHTML = '';
		jest.clearAllMocks();
	});

	it('builds', () => {
		expect(new CDKSignatureTableShowDetail()).toBeTruthy();
	});
	describe('render', () => {
		it('should render tooltip in table detail correctly', async () => {
			const literals = {
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
					downloadButton: 'Download docs'
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
					tooltipWrongEmail: 'It has not been possible to send the envelope. Please check the email.',
					tooltipPendingSaveFilenet: 'Not save in filenet'
				}
			};
			const envelope = {
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
				ceco: '',
				team: '',
				manager: 'graphio003',
				saved_in_filenet: false,
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
			};
			const page = await newSpecPage({
				components: [CDKSignatureTableShowDetail, UIInfoTooltip],
				template: () => (
					<scib-cdk-signature-table-show-detail
						literals={literals}
						envelope={JSON.stringify(envelope)}
					></scib-cdk-signature-table-show-detail>
				),
				supportsShadowDom: true
			});

			const tooltipHTMLElement = page.root.shadowRoot.querySelector('scib-ui-info-tooltip') as HTMLScibUiInfoTooltipElement;
			expect(tooltipHTMLElement).toBeTruthy();
		});
		it('should not render tooltip in table detail', async () => {
			const literals = {
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
					downloadButton: 'Download docs'
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
					tooltipWrongEmail: 'It has not been possible to send the envelope. Please check the email.',
					tooltipPendingSaveFilenet: 'Not save in filenet'
				}
			};
			const envelope = {
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
				ceco: '',
				team: '',
				manager: 'graphio003',
				saved_in_filenet: true,
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
			};
			const page = await newSpecPage({
				components: [CDKSignatureTableShowDetail],
				template: () => (
					<scib-cdk-signature-table-show-detail
						literals={literals}
						envelope={JSON.stringify(envelope)}
					></scib-cdk-signature-table-show-detail>
				),
				supportsShadowDom: true
			});
			const parentTooltipHTMLElement = page.root.shadowRoot.querySelector('.signature-data__docs--title');
			const tooltipHTMLElement = page.root.shadowRoot.querySelector('scib-ui-info-tooltip');
			expect(parentTooltipHTMLElement.childElementCount).toEqual(1);
			expect(tooltipHTMLElement).toEqual(expect.objectContaining({}));
		});
	});
});
