export const config = {
	env: {
		stencil: '/wrapper-portafirmas',
		local: '/wrapper-portafirmas',
		dev: '/wrapper-portafirmas',
		cert: '/wrapper-portafirmas',
		pre: '/wrapper-portafirmas',
		pro: '/wrapper-portafirmas'
	},
	endpoints: {
		createEnvelopeStep1: '/create-envelope/step-1',
		createEnvelopeStep2: '/create-envelope/step-2',
		createEnvelopeStep3: '/create-envelope/step-3',
		createEnvelope: '/create-envelope',
		getEnvelopes: '/envelopes',
		getSignatureTypes: '/signatures?active=true&client_id=',
		getUseCasesFSE: '/fse/permissions',
		getTemplates: '/templates',
		getApps: '/apps',
		getManager: '/managers',
		getIfBlockedCreationOfEnvelopeForUnassignedUsers: '/envelopes/permissions',
		subsidiaries: '/subsidiaries'
	}
};
