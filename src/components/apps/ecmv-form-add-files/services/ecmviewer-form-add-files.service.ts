import { IAnalyticEvent } from '../models/ecmv-form-add-files.model';
import {
	FSEPermissions,
	FSEScopeDataCode,
	IECMVAreaRelatedMetadatasData,
	IECMVDocumentClassData,
	IECMVDocumentMetadata,
	IECMVDocumentTypeData,
	IECMVFSEData,
	IECMVFSEHowData,
	IECMVMetadataByDocType,
	IECMVMetadataData,
	PermissionType
} from '../models/ecmv-service.model';
import { EcmViewerService } from './ecmviewer.service';

class EcmViewerAddFormFilesServiceController {
	private userGeography: string = '';
	private userArea: string = '';
	private permissions: FSEPermissions[];

	documentClassSelected;

	userHasEditPermissions: boolean = false;
	selectedDocTypeObj: any;
	areaRelatedMetadatasData: IECMVAreaRelatedMetadatasData = {
		business_process: {
			id: '',
			label: '',
			t_list: ''
		},
		gdpr: {
			id: '',
			label: '',
			t_list: ''
		},
		document_owner: {
			id: '',
			label: '',
			t_list: ''
		},
		confidentiality: {
			id: '',
			label: '',
			t_list: ''
		},
		geography: {
			id: '',
			label: '',
			t_list: ''
		}
	};
	metadata: IECMVDocumentMetadata[] = [];
	automaticMetadata: IECMVDocumentMetadata[] = [];

	allOriginDocumentClass: IECMVDocumentClassData[] = [];
	documentClassesFilteredByEdit: IECMVDocumentClassData[] = [];
	multiChoiceMetadata: string[] = [];

	/**
	 * @description Retrieve and return FSE Data on a custom DataInterface FSEPermissions[]
	 */
	getFSEPermissionsData(ecm_user_cases: IECMVFSEData[]): { permissions: FSEPermissions[]; userGeography: string; userArea: string } {
		let fseData: FSEPermissions[] = [];
		ecm_user_cases.forEach((fse_use_case) => {
			let array_documents: string[] = [];
			let use_case: FSEPermissions = {
				access: {
					area: '',
					geography: ''
				},
				scope: {
					document_type: array_documents,
					geography: '',
					confidentiality: '',
					gdpr: false,
					document_owner: '',
					business_process: ''
				},
				permision: ''
			};

			const document_type_FSEScopeData: IECMVFSEHowData[] = this.filterFSEScopeData(fse_use_case, FSEScopeDataCode.HOWDOCUMENT);
			const document_type_list: string[] = this.getAllDocumentTypeFromFSEScope(document_type_FSEScopeData);
			use_case.scope.document_type = document_type_list;
			use_case.permision = fse_use_case.what?.toLowerCase();
			use_case.access.area = this.findFSEScopeData(fse_use_case, FSEScopeDataCode.HOWAREA)?.descrip;
			use_case.scope.document_owner = use_case.access?.area;
			use_case.access.geography = this.findFSEScopeData(fse_use_case, FSEScopeDataCode.HOWGEOGRAPHY)?.descrip;
			use_case.scope.geography = use_case.access?.geography;
			use_case.scope.confidentiality = this.findFSEScopeData(fse_use_case, FSEScopeDataCode.HOWCONFIDENTIAL)?.descrip;
			use_case.scope.gdpr = this.findFSEScopeData(fse_use_case, FSEScopeDataCode.HOWGDPR)?.descrip.toLowerCase() === 'no' ? false : true;
			use_case.scope.business_process = this.findFSEScopeData(fse_use_case, FSEScopeDataCode.HOWBUSPROCESS)?.descrip;
			fseData.push(use_case);

			this.obtainUserAreaAndGeographyValues(use_case);
		});

		this.permissions = fseData;

		return { permissions: fseData, userArea: this.userArea, userGeography: this.userGeography };
	}

	private obtainUserAreaAndGeographyValues(use_case: FSEPermissions) {
		if (!this.userArea.length) {
			this.userArea = use_case.access.area;
		}
		if (!this.userGeography.length) {
			this.userGeography = use_case.access.geography;
		}
		this.userArea = this.userArea.includes(use_case.access.area) ? this.userArea : this.userArea + '/' + use_case.access.area;
		this.userGeography = this.userGeography.includes(use_case.access.geography)
			? this.userGeography
			: this.userGeography + '/' + use_case.access.geography;
	}

	private filterFSEScopeData(fse_use_case: IECMVFSEData, scopeCode: FSEScopeDataCode): IECMVFSEHowData[] {
		return fse_use_case.how.filter((item) => {
			return item.key == scopeCode;
		});
	}

	private getAllDocumentTypeFromFSEScope(fse_docType_filtered: IECMVFSEHowData[]): string[] {
		let docTypeFromScope: string[] = [];
		fse_docType_filtered.forEach((docType) => {
			docTypeFromScope.push(docType.value);
		});

		return docTypeFromScope;
	}

	private findFSEScopeData(fse_use_case: IECMVFSEData, scopeCode: FSEScopeDataCode): IECMVFSEHowData {
		return fse_use_case.how.find((item) => {
			return item.key == scopeCode;
		});
	}

	async getAllDocuments(): Promise<IECMVDocumentClassData[]> {
		const [itemsGeo, fseConfidentialTranslates] = await Promise.all([
			EcmViewerService.getGeoTranslate(),
			EcmViewerService.getConfidentialTranslate()
		]);
		this.translateMetadata(this.permissions, itemsGeo, fseConfidentialTranslates);

		let allowed_docTypes_permissions = 'permissions=';
		this.getPermissionOfDocType(this.permissions).forEach((item) => {
			allowed_docTypes_permissions += item + '_';
		});

		const documentClassItmes: IECMVDocumentClassData[] = await EcmViewerService.getAllDocumentClass(allowed_docTypes_permissions);

		if (Array.isArray(documentClassItmes) && documentClassItmes.length > 0) {
			this.allOriginDocumentClass = JSON.parse(JSON.stringify(documentClassItmes));
			const documentClassesFilteredByEdit = this.filterDocumentClassesByEditPermission(documentClassItmes, this.permissions);
			this.documentClassesFilteredByEdit = documentClassesFilteredByEdit;
			return documentClassesFilteredByEdit;
		} else {
			console.warn('NO TIENE CLASES DOCUMENTALES');
			return [];
		}
	}

	private translateMetadata(permissions: FSEPermissions[], itemsGeo: any[], fseConfidentialTranslates: any[]): FSEPermissions[] {
		permissions.forEach((element) => {
			const geographyValue = itemsGeo.find((item) => {
				return item.fsename == element.scope.geography;
			});
			if (geographyValue) {
				element.scope.geography = geographyValue.metaname;
			}
			const confidentialityValue = fseConfidentialTranslates.find((item) => {
				return item.fsename == element.scope.confidentiality;
			});
			if (confidentialityValue) {
				element.scope.confidentiality = confidentialityValue.metaname;
			}
		});

		return permissions;
	}

	public getUserAreaMetadatasValuesByDocumentOwner(value) {
		this.automaticMetadata = [];
		const document_owner: string = value?.length ? value[0] : '';
		const docTypeEditPermissions: FSEPermissions[] = this.getUserEditPermissionsByDocType();

		const permissionsByDocumentOwner: FSEPermissions[] = docTypeEditPermissions.filter((useCase) => {
			return useCase.scope?.document_owner === document_owner;
		});

		this.filterAreaMetadataByDocumentOwner(permissionsByDocumentOwner);

		return this.getMetadataAndAutomaticMetadata();
	}

	private filterAreaMetadataByDocumentOwner(permissionsByDocumentOwner: FSEPermissions[]) {
		const business_process_index = this.metadata.findIndex((metadata) => metadata.id_doc_metadata === 'BusinessProcess');
		const business_process_list: string[] = this.getUserBusinessProcessByDocTypeList(permissionsByDocumentOwner);
		this.filterAreaMetadataByUser(
			this.metadata[business_process_index],
			business_process_list,
			this.areaRelatedMetadatasData.business_process.t_list
		);

		const confidentiality_index = this.metadata.findIndex((metadata) => metadata.id_doc_metadata === 'ConfidentialityLevel');
		const confideality_list: string[] = this.getUserConfidentialityByDocTypeList(permissionsByDocumentOwner);
		this.filterAreaMetadataByUser(this.metadata[confidentiality_index], confideality_list, this.areaRelatedMetadatasData.confidentiality.t_list);

		const gdpr_index = this.metadata.findIndex((metadata) => metadata.id_doc_metadata === 'GDPR');
		const gdpr_list: string[] = this.getUserGDPRByDocTypeList(permissionsByDocumentOwner);
		this.metadata[gdpr_index].required = true;
		this.filterAreaMetadataByUser(this.metadata[gdpr_index], gdpr_list, this.areaRelatedMetadatasData.gdpr.t_list);
	}

	private getPermissionOfDocType(permissions) {
		const initialValue = [];
		const documentTypes = permissions.map((useCase) => useCase.scope.document_type);
		const documentTypesPlanned = documentTypes.reduce((total, value) => {
			return total.concat(value);
		}, initialValue);
		return [...new Set(documentTypesPlanned)];
	}

	private filterDocumentClassesByEditPermission(
		documentClassesFilteredByEdit: IECMVDocumentClassData[],
		permissions: FSEPermissions[]
	): IECMVDocumentClassData[] {
		let docClassWithoutEditPermissions: IECMVDocumentClassData[] = [];
		documentClassesFilteredByEdit.forEach((docClass) => {
			docClass.documentyype = this.removeToEdit(docClass.documentyype, permissions);
			if (!docClass.documentyype || !docClass.documentyype.length) {
				docClassWithoutEditPermissions.push(docClass);
			}
		});

		return documentClassesFilteredByEdit.filter((currentDocClass) => {
			return !docClassWithoutEditPermissions.includes(currentDocClass);
		});
	}

	private removeToEdit(documentyype: IECMVDocumentTypeData[], permissions: FSEPermissions[]) {
		const editPermissionsAux = permissions
			.filter((editMode) => {
				return editMode.permision.includes(PermissionType.EDIT);
			})
			.map((useCase) => useCase.scope.document_type);
		const documentTypesPlanned = editPermissionsAux.reduce((total, value) => {
			return total.concat(value);
		}, []);

		if (!this.userHasEditPermissions) {
			this.userHasEditPermissions = documentTypesPlanned.length > 1;
		}

		let idToPreserve = [...new Set(documentTypesPlanned)];

		return documentyype.filter((item) => idToPreserve.includes(item.id_doc_type));
	}

	public searchClassDataToEdit(documentClass?): IECMVDocumentClassData | undefined {
		const classToSearch = documentClass ? documentClass : this.documentClassSelected;
		return this.documentClassesFilteredByEdit.find((elem) => elem.id_doc_class === classToSearch);
	}

	public async getAutoValuesByType(docuTypeDetail): Promise<{ metadata: IECMVDocumentMetadata[]; automaticMetadata: IECMVDocumentMetadata[] }> {
		this.selectedDocTypeObj = docuTypeDetail.id;
		const metadataByDocType = await EcmViewerService.getMetadataByDocType(this.selectedDocTypeObj);

		this.filterGeographiesMetadatasByUser(metadataByDocType);
		this.generateAreaRelatedMetadata(metadataByDocType);
		metadataByDocType.forEach((elem) => {
			if (elem.id_doc_type == '04TY' && elem.id_doc_metadata == 'ClientName' && elem.documentmetadata.id_doc_metadata == 'ClientName') {
				elem.documentmetadata.required = false;
			}
			this.metadata.push(elem.documentmetadata);
		});

		return this.getMetadataAndAutomaticMetadata();
	}

	public getMetadataAndAutomaticMetadata(): { metadata: IECMVDocumentMetadata[]; automaticMetadata: IECMVDocumentMetadata[] } {
		return {
			metadata: this.filterOutMetadatas(['IDSignature', 'IDMigration', 'IDUsuario', 'Signed', 'DateDigitalSignature']),
			automaticMetadata: this.automaticMetadata
		};
	}

	private generateAreaRelatedMetadata(metadatas: IECMVMetadataByDocType[]) {
		this.automaticMetadata = [];
		const docTypeEditPermissions: FSEPermissions[] = this.getUserEditPermissionsByDocType();

		const document_owner_list: string[] = this.getUserDocumentOwnerByDocTypeList(docTypeEditPermissions);
		const document_owner_index = metadatas.findIndex((metadata) => metadata.id_doc_metadata === 'DocumentOwner');
		this.areaRelatedMetadatasData.document_owner = this.setMetadataData(metadatas[document_owner_index]);
		this.filterAreaMetadataByUser(metadatas[document_owner_index], document_owner_list, this.areaRelatedMetadatasData.document_owner.t_list);

		const business_process_index = metadatas.findIndex((metadata) => metadata.id_doc_metadata === 'BusinessProcess');
		this.areaRelatedMetadatasData.business_process = this.setMetadataData(metadatas[business_process_index]);
		const confidentiality_index = metadatas.findIndex((metadata) => metadata.id_doc_metadata === 'ConfidentialityLevel');
		this.areaRelatedMetadatasData.confidentiality = this.setMetadataData(metadatas[confidentiality_index]);
		const gdpr_index = metadatas.findIndex((metadata) => metadata.id_doc_metadata === 'GDPR');
		this.areaRelatedMetadatasData.gdpr = this.setMetadataData(metadatas[gdpr_index]);

		if (document_owner_list.length === 1) {
			const business_process_list: string[] = this.getUserBusinessProcessByDocTypeList(docTypeEditPermissions);
			this.filterAreaMetadataByUser(
				metadatas[business_process_index],
				business_process_list,
				this.areaRelatedMetadatasData.business_process.t_list
			);

			const confideality_list: string[] = this.getUserConfidentialityByDocTypeList(docTypeEditPermissions);
			this.filterAreaMetadataByUser(metadatas[confidentiality_index], confideality_list, this.areaRelatedMetadatasData.confidentiality.t_list);

			const gdpr_list: string[] = this.getUserGDPRByDocTypeList(docTypeEditPermissions);
			metadatas[gdpr_index].documentmetadata.required = true;
			this.filterAreaMetadataByUser(metadatas[gdpr_index], gdpr_list, this.areaRelatedMetadatasData.gdpr.t_list);
		}
	}

	private getUserBusinessProcessByDocTypeList(docTypeEditPermissions: FSEPermissions[]) {
		let business_process_list: string[] = [];
		const business_process = docTypeEditPermissions.map((useCase) => useCase.scope.business_process);
		business_process_list = business_process.reduce((total, value) => {
			return total.concat(value);
		}, []);
		business_process_list = [...new Set(business_process_list)];
		return business_process_list;
	}

	private filterOutMetadatas(id_metadatas_value: string[]) {
		const filter = this.metadata.filter((elem) => {
			if (!id_metadatas_value.includes(elem.id_doc_metadata)) {
				return elem;
			}
		});
		return filter;
	}

	private getUserConfidentialityByDocTypeList(docTypeEditPermissions: FSEPermissions[]) {
		let confidentiality_list: string[] = [];
		const confidentiality = docTypeEditPermissions.map((useCase) => useCase.scope.confidentiality);
		confidentiality_list = confidentiality.reduce((total, value) => {
			return total.concat(value);
		}, []);
		confidentiality_list = [...new Set(confidentiality_list)];
		return confidentiality_list;
	}

	private getUserGDPRByDocTypeList(docTypeEditPermissions: FSEPermissions[]) {
		let gdpr_list: string[] = [];
		const gdpr = docTypeEditPermissions.map((useCase) => useCase.scope.gdpr);
		gdpr_list = gdpr.reduce((total, value) => {
			return total.concat(value.toString());
		}, []);
		gdpr_list = [...new Set(gdpr_list)];
		return gdpr_list;
	}

	private getUserDocumentOwnerByDocTypeList(docTypeEditPermissions: FSEPermissions[]) {
		let document_owner_list: string[] = [];
		const document_owner = docTypeEditPermissions.map((useCase) => useCase.scope.document_owner);
		document_owner_list = document_owner.reduce((total, value) => {
			return total.concat(value);
		}, []);
		document_owner_list = [...new Set(document_owner_list)];
		return document_owner_list;
	}

	private filterAreaMetadataByUser(metadata_element, valuesToFilter: string[], listToFilterFrom) {
		let elem = metadata_element.documentmetadata ? metadata_element.documentmetadata : metadata_element;
		const filteredMetadata = this.filterMetadataListByUser(valuesToFilter, listToFilterFrom);
		if (filteredMetadata) {
			elem = this.filterMetadataWithUseCaseValues(elem, filteredMetadata);
		}
		this.automaticMetadata.push(elem);
	}

	private filterMetadataWithUseCaseValues(elem: any, filteredMetadata: any) {
		elem.b_automatic = filteredMetadata.length < 2 ? true : false;
		if (filteredMetadata.length === 1) {
			elem.selectedDefaultLabel = filteredMetadata[0].split('#')[0];
			elem.selectedDefaultId = filteredMetadata[0].split('#')[1];
			elem.display_value_metadata = filteredMetadata[0].split('#')[0];
			elem.value_metadata = filteredMetadata[0].split('#')[1];
		} else {
			elem.selectedDefaultLabel = '';
			elem.selectedDefaultId = '';
			elem.display_value_metadata = '';
			elem.value_metadata = '';
		}
		const filteredList = filteredMetadata.join('||');
		elem = this.trimMetadataValuesByUser(elem, filteredList);
		return elem;
	}

	private filterMetadataListByUser(values: string[], listToFilterFrom) {
		const splitter = listToFilterFrom.split('||');
		const lowerCaseValues = values.map((value) => value.toLowerCase());
		const filter = splitter.filter((location: string) => {
			const display_value = location.split('#')[0];
			const id_value = location.split('#')[1];
			return lowerCaseValues.some((value) => {
				if (display_value.toLowerCase() === value || id_value.toLowerCase() === value) {
					return location;
				}
			});
		});
		return filter;
	}

	private setMetadataData(metadataData: IECMVMetadataByDocType): IECMVMetadataData {
		const data: IECMVMetadataData = {
			id: metadataData?.id_doc_metadata,
			label: metadataData?.documentmetadata?.t_name,
			t_list: metadataData?.documentmetadata?.t_list_value
		};
		return data;
	}

	private getUserEditPermissionsByDocType() {
		const docTypePermissions: FSEPermissions[] = this.getFSEPermissionsByDocType(this.permissions, this.selectedDocTypeObj);
		const docTypeEditPermissions: FSEPermissions[] = this.getFSEPermissionsByPermssionType(docTypePermissions, PermissionType.EDIT);
		return docTypeEditPermissions;
	}

	private getFSEPermissionsByDocType(permissionsToFilter: FSEPermissions[], docType: string): FSEPermissions[] {
		const permissions: FSEPermissions[] = permissionsToFilter.filter((useCase) => {
			return useCase.scope?.document_type?.includes(docType);
		});

		return permissions;
	}

	private getFSEPermissionsByPermssionType(permissionsToFilter: FSEPermissions[], permission_type: PermissionType): FSEPermissions[] {
		const permissions: FSEPermissions[] = permissionsToFilter.filter((useCase) => {
			return useCase.permision?.includes(permission_type);
		});

		return permissions;
	}

	filterGeographiesMetadatasByUser(metadatas: IECMVMetadataByDocType[]) {
		if (Array.isArray(metadatas) && metadatas.length > 0) {
			const geography_owner_index = metadatas.findIndex((metadata) => metadata.id_doc_metadata === 'Geographyownerdocument');
			const geography_manager_index = metadatas.findIndex((metadata) => metadata.id_doc_metadata === 'Geographymanagesdocument');

			if (geography_owner_index) {
				metadatas[geography_owner_index] = this.filterMetadataGeographyManagesOwnerByUser(metadatas[geography_owner_index]);
			}
			if (geography_manager_index != -1) {
				metadatas[geography_manager_index] = this.filterMetadataGeographyManagesOwnerByUser(metadatas[geography_manager_index]);
			}
		}
	}

	private filterMetadataGeographyManagesOwnerByUser(elem) {
		const filteredUserGeography = this.getMetadataValueByUser(elem, this.userGeography);
		if (filteredUserGeography) {
			if (elem.id_doc_metadata == 'Geographymanagesdocument') {
				elem.documentmetadata = this.trimMetadataValuesByUser(elem.documentmetadata, filteredUserGeography);
			}
			elem.documentmetadata.selectedDefaultLabel = filteredUserGeography.split('#')[0];
			elem.documentmetadata.selectedDefaultId = filteredUserGeography.split('#')[1];
		}
		return elem;
	}

	private getMetadataValueByUser(elem, value) {
		const metadataValueFiltered = '#' + value;
		const splitter = elem.documentmetadata.t_list_value.split('||');
		const filter = splitter.find((location) => {
			if (location.toLowerCase().includes(metadataValueFiltered.toLowerCase())) {
				return location;
			}
		});
		return filter;
	}

	private trimMetadataValuesByUser(elemMetadata, filteredValue) {
		elemMetadata.t_list_value = filteredValue;
		return elemMetadata;
	}

	// To save file

	getStPath(dataInfo) {
		let stPath;
		for (const elem of this.metadata) {
			if (dataInfo.Geographyownerdocument) {
				if (elem.id_doc_metadata === 'Geographyownerdocument') {
					let valueArray;
					if (elem.t_list_value) {
						valueArray = elem.t_list_value.split('||');
					} else {
						// this.metadata es el valor documentmetadata, este caso no debería de ocurrir
						// valueArray = elem.documentmetadata.t_list_value.split('||');
					}
					valueArray.map((va_i) => {
						if (va_i.split('#')[1] === dataInfo.Geographyownerdocument[0]) {
							stPath = va_i.split('#')[0];
						}
					});
				}
			}
		}

		return stPath;
	}

	public getMetadataFile(data): any {
		const finalMetas = {};
		const metaCopy = this.metadata.filter((v, i, a) => a.findIndex((t) => t.id_doc_metadata === v.id_doc_metadata) === i);
		const dateEqual = new Date();
		metaCopy.map((item) => {
			if (item.t_type_send.toLowerCase() === 'array') {
				finalMetas[item.id_doc_metadata] = [];
			} else {
				if (item.t_type.toLowerCase() === 'date') {
					finalMetas[item.id_doc_metadata] = dateEqual;
				} else {
					finalMetas[item.id_doc_metadata] = '';
				}
			}
		});
		for (const [key, value] of Object.entries(finalMetas)) {
			for (const [key_d, value_d] of Object.entries(data)) {
				if (key === key_d) {
					if (value === '') {
						finalMetas[key] = value_d.toString();
					} else {
						finalMetas[key] = value_d;
					}
				}
			}
		}
		finalMetas['DocumentType'] = this.selectedDocTypeObj;
		finalMetas['DocumentOwner'] = this.getDocumentOwnerFileData(finalMetas['DocumentOwner']);

		if (finalMetas['EventType'] !== undefined) {
			if (finalMetas['EventType'] == '') {
				delete finalMetas['EventType'];
			}
		}

		if (finalMetas['ClientName'] === undefined) {
			finalMetas['ClientName'] = [];
		}

		this.multiChoiceMetadata?.forEach((element) => {
			if (finalMetas[element] !== undefined) {
				if (finalMetas[element] == '') {
					finalMetas[element] = ['NotInformed'];
				}
			}
		});

		if (finalMetas['GN_ID'] !== undefined) {
			if (finalMetas['GN_ID'] == '') {
				delete finalMetas['GN_ID'];
			}
		}

		metaCopy.map((item) => {
			if (item.t_type.toLowerCase() === 'date') {
				if (!Array.isArray(finalMetas[item.id_doc_metadata])) {
					delete finalMetas[item.id_doc_metadata];
				} else {
					finalMetas[item.id_doc_metadata] = new Date(finalMetas[item.id_doc_metadata][0]);
				}
			}
			// final condicional metadata list Strings, set default values or delete (if requered and if is list)
			if (item.t_type === 'String(ValueList)') {
				if (item.required == false && item.b_list == true) {
					if (finalMetas[item.id_doc_metadata] == '') {
						delete finalMetas[item.id_doc_metadata];
					}
				}
			}
			if (item.t_type === 'String') {
				if (item.required == false && item.b_list == false) {
					if (finalMetas[item.id_doc_metadata] == '') {
						delete finalMetas[item.id_doc_metadata];
					}
				}
			}
		});
		return finalMetas;
	}

	private getDocumentOwnerFileData(documentOwnerArray: string[]): string[] {
		if (documentOwnerArray[0].split('/').length > 1) {
			const arrayDocumentOwner = documentOwnerArray[0].split('/');
			documentOwnerArray = [];
			const do_index = this.metadata.findIndex((metadata) => metadata.id_doc_metadata === 'DocumentOwner');
			arrayDocumentOwner.forEach((element) => {
				let document_owner_id = this.getMetadataFromListByValueOrName(this.metadata[do_index], element);
				document_owner_id = document_owner_id?.split('#')[1];
				documentOwnerArray.push(document_owner_id);
			});
		}

		return documentOwnerArray;
	}

	private getMetadataFromListByValueOrName(elem, value) {
		const metadataValueFiltered = value;
		const t_list_value = elem.documentmetadata ? elem.documentmetadata.t_list_value : elem.t_list_value;
		const splitter = t_list_value?.split('||');
		const filter = splitter.find((location) => {
			if (location.toLowerCase().includes('#' + metadataValueFiltered.toLowerCase())) {
				return location;
			}
			if (location.toLowerCase().includes(metadataValueFiltered.toLowerCase() + '#')) {
				return location;
			}
		});
		return filter;
	}

	/**
	 * @description Send event to dataLayer
	 * @param event_category
	 * @param event_label
	 */
	public getAnalyticsEvent(event, event_category, event_action, event_label, producto?): IAnalyticEvent {
		return {
			event: event, //ev_subidaDocumentoECM
			event_category: event_category, //event_category: {{tipo_usuario}}
			event_action: event_action, //subirDocumentoECM
			event_label: event_label, // {{document_class}} : {{document_type}}
			producto: producto ? producto : '', //producto: {{producto}}
			user_id: '',
			user_area: this.userArea,
			user_geography: this.userGeography
		};
	}
}

export const EcmViewerAddFormFilesService = new EcmViewerAddFormFilesServiceController();
