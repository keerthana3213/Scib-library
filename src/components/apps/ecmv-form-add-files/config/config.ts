export const config = {
	endpoints: {
		permissions: `/wrapper-ecm-viewer/fse/permissions`,
		geotranslates: `/wrapper-ecm-viewer/geotranslates`,
		confidentialtranslates: `/wrapper-ecm-viewer/confidentialtranslates`,
		getAllDocumentsClass: `/wrapper-ecm-viewer/document-class/getAllDocumentsClass`,
		getMetadataByDocType: '/wrapper-ecm-viewer/document-type-to-metadata/getMetadataByDocType?docType=',
		documents: '/wrapper-ecm-viewer/documents',
		usersPreferences: '/wrapper-ecm-viewer/user-preference'
	}
};

export const APP_HEAD_FRONT_API = `front-api`;

export interface CommonHttpHeaders {
	'current-glcs'?: string;
	'X-Application-Context': string;
}
