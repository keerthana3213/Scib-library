import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Modal Massive Load',
	...getStoryConfig('scib-cdk-modal-massive-load'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-modal-massive-load
		literals='${parseObject(args.literals)}'
		open='${parseBoolean(args.open)}'
		is-loading='${parseBoolean(args.isLoading)}'
	></scib-cdk-modal-massive-load>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'title': 'Carga masiva de clientes',
		'message': 'Para actualizaciones masivas, use una plantilla CSV',
		'isRequiredLabel': '*Campo requerido',
		'showIsRequired': true,
		'close': {
			'text': 'Cerrar modal',
			'eventName': 'closeModal',
		},
		'downloadcsv': {
			'text': 'Descargar plantilla (CSV)',
			'eventName': 'downloadButton',
		},
		'buttonList': [
			{
				'text': 'Cancelar',
				'eventName': 'cancelButton',
				'type': 'secondary',
				'disabledIfRequired': false,
			},
			{
				'text': 'Enviar',
				'eventName': 'submitButton',
				'type': 'primary',
				'disabledIfRequired': true,
			},
		],
		'fileSelector': {
			'titleselector': 'Seleccionar o arrastrar archivos para actualizar',
			'titleselectorMobile': 'Seleccionar archivos para actualizar',
			'errorMaxFiles': 'Lo sentimos, no puede cargar más de un archivo a la vez',
			'errorFormat': 'El archivo o la extensión no es compatible',
			'fileSelectedText': 'Documento adjunto',
		},
		'notification': {
			'label': 'Notification of activation',
			'formName': 'emailNotification',
			'placeholder': 'Enter email',
			'subMessaje': 'Introduzca los correos electrónicos separados por “,” cada uno. Ejemplo: contact1@email.com, contact2@email.com',
		},
	},
	open: true,
	isLoading: false,
	// Add default values here
};
