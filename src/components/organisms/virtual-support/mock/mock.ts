export const VirtualSupportES = {
	MAIN_TITLE: {
		title: 'Digital Asssistance',
		virtual_support: '¿Necesitas ayuda?'
	},
	CARD_TITLE: {
		title: 'SCIB Digital Assistant'
	},
	REQUEST: {
		title: 'Tu petición',
		reset_request: 'Resetear petición'
	},
	WELCOME: {
		message_text: '¡Hola! ¿Cómo podría ayudarte hoy?',
		button_1_text: 'Información del producto',
		button_1_actionType: 'PRODUCT',
		button_2_text: 'Error de acceso',
		button_2_actionType: 'ERROR',
		button_3_text: 'Nuevo usuario',
		button_3_actionType: 'NEW_USER'
	},

	ERROR: {
		title: 'Error de acceso',
		backTo: 'WELCOME',
		message_text: 'Estos son tus resultados:',
		contact_info_title: 'Problemas con tu acceso.',
		contact_info_info: 'Intenta resetear tu contraseña. Si  el problema persiste, contecte con nosotros.',
		contact_card_title: 'Contacto global',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	NEW_USER: {
		title: 'Nuevo usuario',
		backTo: 'WELCOME',
		message_text: '¿En qué producto está interesado?',
		button_1_text: 'Confirming',
		button_1_actionType: 'CONFIRMING',
		button_2_text: 'RPP',
		button_2_actionType: 'RPP',
		button_3_text: 'Collections',
		button_3_actionType: 'COLLECTIONS',
		button_4_text: 'Client Onboarding',
		button_4_actionType: 'CLIENT_ONBOARDING'
	},
	PRODUCT: {
		title: 'Información del producto',
		backTo: 'WELCOME',

		message_text: '¿En qué poducto está interesado?',

		button_1_actionType: 'CONFIRMING',
		button_1_text: 'Confirming',
		button_2_actionType: 'RPP',
		button_2_text: 'RPP',
		button_3_actionType: 'COLLECTIONS',
		button_3_text: 'Collections'
	},
	CONFIRMING: {
		title: 'Confirming',
		backTo: 'PRODUCT',

		message_text: '¿Cuál es tu geografía?',

		button_1_actionType: 'UK',
		button_1_text: 'Reino Unido',
		button_2_actionType: 'EUROPE',
		button_2_text: 'Europa',
		button_3_actionType: 'EAST_ASIA',
		button_3_text: 'Este asiático',
		button_4_actionType: 'USA',
		button_4_text: 'Estados Unidos'
	},

	RPP: {
		title: 'RPP',
		backTo: 'PRODUCT',
		message_text: 'Estos son tus resultados:',
		contact_card_title: 'Contacto global',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},

	COLLECTIONS: {
		title: 'Collections',
		backTo: 'PRODUCT',

		message_text: 'Estos son tus resultados:',

		contact_info_title: 'Phone contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '+34 912 573 060',

		contact_card_title: 'Contacto global',
		contact_card_info: 'GTBClientService@gruposantander.com'
	},

	CLIENT_ONBOARDING: {
		title: 'Client Onboarding',
		backTo: 'NEW_USER',
		message_text: 'Estos son tus resultados:',
		contact_card_title: 'Contacto global',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	UK: {
		title: 'Reino Unido',
		backTo: 'CONFIRMING',

		message_text: 'Estos son tus resultados:',
		contact_info_title: 'Contacto Reino Unido',
		contact_info_info: 'Desde las 8 a.m. a 5 p.m. de Lunes a Jueves, y Viernes de 8 a.m. a 3 p.m.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Contacto global',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},

	EAST_ASIA: {
		title: 'Este asiático',
		backTo: 'CONFIRMING',

		message_text: 'Estos son tus resultados:',

		contact_info_title: 'Contacto Este asiático',
		contact_info_info: 'De 8 a.m. a 5 p.m. de Lunes a Jueves, y Viernes desde las 8 a.m. hasta las 3 p.m.',
		contact_info_contact: '08082340867',

		contact_card_title: 'Contacto global',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	EUROPE: {
		title: 'Europa',
		backTo: 'CONFIRMING',

		message_text: 'Estos son tus resultados:',

		contact_info_title: 'Contacto Europa',
		contact_info_info: 'De 8 a.m. a 5 p.m. de Lunes a Jueves, y Viernes desde las 8 a.m. hasta las 3 p.m.',
		contact_info_contact: '08082340867',

		contact_card_title: 'Contacto global',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},

	USA: {
		title: 'Estados Unidos',
		backTo: 'CONFIRMING',

		message_text: 'Estos son tus resultados:',

		contact_info_title: 'Contacto Estado Unidos',
		contact_info_info: 'De 8 a.m. a 5 p.m. de Lunes a Jueves, y Viernes desde las 8 a.m. hasta las 3 p.m.',
		contact_info_contact: '08082340867',

		contact_card_title: 'Contacto global',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	}
};

export const VirtualSupport = {
	MAIN_TITLE: {
		title: 'Digital Asssitant',
		virtual_support: 'Need help?'
	},
	CARD_TITLE: {
		title: 'SCIB Digital Assistant'
	},
	REQUEST: {
		title: 'Your request',
		reset_request: 'Reset request'
	},
	WELCOME: {
		message_text: 'Hello! How could I help you?',
		button_1_text: 'Product information',
		button_1_actionType: 'PRODUCT',
		button_2_text: 'Access error',
		button_2_actionType: 'ERROR',
		button_3_text: 'New user',
		button_3_actionType: 'NEW_USER'
	},
	ERROR: {
		title: 'Access error',
		backTo: 'WELCOME',
		message_text:
			'These are your results: Problems with your access? Try to reset your password.If the problem persists, please contact us through this textbox explaining the issue. ',
		contact_card_title: 'Support contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	NEW_USER: {
		title: 'New user',
		backTo: 'WELCOME',
		message_text: 'What is the product you are interested for?',
		button_1_actionType: 'CONFIRMING_NEWUSER',
		button_1_text: 'Confirming',
		button_2_actionType: 'RPP_NEWUSER',
		button_2_text: 'RPP',
		button_3_actionType: 'COLLECTIONS_NEWUSER',
		button_3_text: 'Collections',
		button_4_actionType: 'CLIENT_ONBOARDING_NEWUSER',
		button_4_text: 'Client Onboarding'
	},
	PRODUCT: {
		title: 'Product information',
		backTo: 'WELCOME',
		message_text: 'What is the product you are interested for?',
		button_1_actionType: 'CONFIRMING',
		button_1_text: 'Confirming',
		button_2_actionType: 'RPP',
		button_2_text: 'RPP',
		button_3_actionType: 'COLLECTIONS',
		button_3_text: 'Collections'
	},
	CONFIRMING: {
		title: 'Confirming',
		backTo: 'PRODUCT',
		message_text: 'What is your geography?',
		button_1_actionType: 'UK',
		button_1_text: 'UK',
		button_2_actionType: 'EUROPE',
		button_2_text: 'Europe',
		button_3_actionType: 'EAST_ASIA',
		button_3_text: 'East Asia',
		button_4_actionType: 'USA',
		button_4_text: 'USA'
	},
	CONFIRMING_NEWUSER: {
		title: 'Confirming',
		backTo: 'NEW_USER',
		message_text: 'What is your geography?',
		button_1_actionType: 'UK_NEWUSER',
		button_1_text: 'UK',
		button_2_actionType: 'EUROPE_NEWUSER',
		button_2_text: 'Europe',
		button_3_actionType: 'EAST_ASIA_NEWUSER',
		button_3_text: 'East Asia',
		button_4_actionType: 'USA_NEWUSER',
		button_4_text: 'USA'
	},
	RPP: {
		title: 'RPP',
		backTo: 'PRODUCT',
		message_text: 'This is your result:',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	RPP_NEWUSER: {
		title: 'RPP',
		backTo: 'NEW_USER',
		message_text: 'This is your result:',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	COLLECTIONS: {
		title: 'Collections',
		backTo: 'PRODUCT',
		message_text: 'These are your results:',
		contact_info_title: 'Phone contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '+34 912 573 060',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'GTBClientService@gruposantander.com'
	},
	COLLECTIONS_NEWUSER: {
		title: 'Collections',
		backTo: 'NEW_USER',
		message_text: 'These are your results:',
		contact_info_title: 'Phone contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '+34 912 573 060',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'GTBClientService@gruposantander.com'
	},
	CLIENT_ONBOARDING_NEWUSER: {
		title: 'Client Onboarding',
		backTo: 'NEW_USER',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com',
		message_text: 'This is your result:'
	},
	UK: {
		title: 'UK',
		backTo: 'CONFIRMING',
		message_text: 'These are your results:',
		contact_info_title: 'UK',
		contact_info_info: 'From 9 a.m. to 6 p.m. CET from Monday to Friday.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	UK_NEWUSER: {
		title: 'UK',
		backTo: 'CONFIRMING_NEWUSER',
		contact_info_title: 'UK',
		contact_info_info: 'From 9 a.m. to 6 p.m. CET from Monday to Friday.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com',
		message_text: 'These are your results:'
	},
	EAST_ASIA: {
		title: 'East Asia',
		backTo: 'CONFIRMING',
		message_text: 'These are your results:',
		contact_info_title: 'East Asia contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	EAST_ASIA_NEWUSER: {
		title: 'East Asia',
		backTo: 'CONFIRMING_NEWUSER',
		message_text: 'These are your results:',
		contact_info_title: 'East Asia contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	EUROPE: {
		title: 'Europe',
		backTo: 'CONFIRMING',
		message_text: 'These are your results:',
		contact_info_title: 'EU contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	EUROPE_NEWUSER: {
		title: 'Europe',
		backTo: 'CONFIRMING_NEWUSER',
		message_text: 'These are your results:',
		contact_info_title: 'EU contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	USA: {
		title: 'USA',
		backTo: 'CONFIRMING',
		message_text: 'These are your results:',
		contact_info_title: 'USA contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	},
	USA_NEWUSER: {
		title: 'USA',
		backTo: 'CONFIRMING_NEWUSER',
		message_text: 'These are your results:',
		contact_info_title: 'USA contact',
		contact_info_info: 'From 8 a.m. to 5 p.m. from Monday to Thursday, and Friday from 8 a.m. to 3 p.m.',
		contact_info_contact: '08082340867',
		contact_card_title: 'Global Support Contact',
		contact_card_info: 'scibdigitalplatform@gruposantander.com'
	}
};
