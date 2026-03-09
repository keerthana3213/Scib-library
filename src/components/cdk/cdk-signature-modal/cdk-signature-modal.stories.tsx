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
	...getStoryConfig('scib-cdk-signature-modal'),
	title: 'Design System/DEPRECATED/CDK/Signature Modal',
	render: (args) => <scib-cdk-signature-modal {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		// clientId: '753cf827-6ac6-5039-9eca-bfe93f63361sasas1',//error
		// clientId: '753cf827-6ac6-5039-9eca-bfe93f633611',//ibor
		clientId: '3552ed41-a2ae-5a2e-9e9f-c0cdc35d2d90', //graphio
		// clientId: '43eea6e0-a9c9-5409-93b0-c6935b729d5d',//prueba
		env: 'stencil',
		language: 'es-ES',
		acceptedFiles: '.doc, .docx, .pdf',
		asButton: false,
		skipHelp: true,
		hasManager: true,
		bodyLimitFile: 26214400,
		downloadTemplateUrl: 'https://www.cmu.edu/blackboard/files/evaluate/tests-example.xls',
		useTemplates: true,
		openSignatureModal: true,
		// allowedSignatures: ['universalsignaturepen_imageonly','universalsignaturepen_signer_held_eu_qualified','docusign_eu_qualified_idnow_tsp','signer_held_mexico', 'universalsignaturepen_opentrust_hash_tsp', 'signer_held_european_ades_qc']
		recipentsOptions: [
			{
				envelopeRecipient_name: 'test',
				envelopeRecipient_email: 'test@gaid.com'
			},
			{
				envelopeRecipient_name: 'test',
				envelopeRecipient_email: 'test@gmil.com'
			},

			{
				envelopeRecipient_name: 'Test 3 modificado',
				envelopeRecipient_email: 'test3@email.com'
			},
			{
				envelopeRecipient_name: 'Test5',
				envelopeRecipient_email: 'meloinvento@melo.com'
			},
			{
				envelopeRecipient_name: 'Test 8 Update',
				envelopeRecipient_email: 'test8@email.com'
			},
			{
				envelopeRecipient_name: 'asdfasdf',
				envelopeRecipient_email: 'asdflj@akjdflk.com'
			},
			{
				envelopeRecipient_name: 'Maria Sanchez Alamo',
				envelopeRecipient_email: 'x263493@santanderglobaltech.com'
			}
		]
	}
};
