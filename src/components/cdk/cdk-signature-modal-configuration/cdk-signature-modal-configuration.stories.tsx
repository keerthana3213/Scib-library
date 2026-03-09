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
	...getStoryConfig('scib-cdk-signature-modal-configuration'),
	title: 'Design System/DEPRECATED/CDK/Signature Modal Configuration',
	render: (args) => <scib-cdk-signature-modal-configuration {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		env: 'dev',
		language: 'es-ES',
		downloadTemplateUrl: null,
		minValueExpireDays: null,
		maxValueExpireDays: null,
		mailRegExpString: null,
		validateDaysExpire: null,
		validateEmailRegExp: null,
		isAsignedTemplate: null,
		asignedTemplate: null,
		recipentNameOptions: null,
		recipentEmailOptions: null,
		emailInvalid: null,
		selectedSignatureType: null,
		manager: null,
		recipentsOptions: null,
		literals: null,
		validation: null,
		radioRecipientTypes: null,
		radioSignatureTypes: null,
		recipientsList: null
	}
};
