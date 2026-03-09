import { EcmViewerAddFormFilesService } from './../../services/ecmviewer-form-add-files.service';

jest.mock('./../../services/ecmviewer.service', () => ({
	getFSEECMVPermissions: jest.fn(),
	getGeoTranslate: jest.fn(),
	getConfidentialTranslate: jest.fn(),
	getAllDocumentClass: jest.fn(),
	getMetadataByDocType: jest.fn(),
	getFilesByDocumentType: jest.fn(),
	uploadFiles: jest.fn(),
	getUserPreference: jest.fn(),
	setUserPreference: jest.fn()
}));
import ECMPermision from './../mock/ecm-fse-permission.json';
describe('EcmViewerAddFormFilesService test', () => {
	it('builds', () => {
		expect(EcmViewerAddFormFilesService).toBeTruthy();
	});
});

describe('EcmViewerAddFormFilesService getFSEPermissionsData', () => {
	it('builds', () => {
		// const response =  as unknown as string;
		const permission = EcmViewerAddFormFilesService.getFSEPermissionsData(ECMPermision);

		expect(permission.userArea).toEqual('AccountingDerivados');
		expect(permission.userGeography).toEqual('SCIBBoadilla');
		expect(permission.permissions.map((p) => p.permision).filter((p) => p === 'write').length).toEqual(3);
	});
});
