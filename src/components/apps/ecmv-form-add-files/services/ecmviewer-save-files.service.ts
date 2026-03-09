import { ISaveInFNResult } from '../models/ecmv-form-add-files.model';
import { ICMVUploadFile, IECMVMetadataObject } from '../models/ecmv-service.model';
import { EcmViewerAddFormFilesService } from './ecmviewer-form-add-files.service';
import { EcmViewerService } from './ecmviewer.service';

class EcmViewerSaveFilesServiceController {
	multiChoiceMetadata: string[] = [];

	sendFiles(formData, checkExistsFile = false): Promise<Array<ISaveInFNResult>> {
		const files = formData['files'];

		if (Array.isArray(files) && files.length > 0) {
			return Promise.all(
				files.map((f) => {
					return this.sendSingleFile(formData, f, checkExistsFile);
				})
			);
		}
	}

	sendSingleFile(formData, file, checkExistsFile): Promise<ISaveInFNResult> {
		return new Promise(async (resolve) => {
			try {
				const documentTypeData: IECMVMetadataObject = this.filterDocumentTypeData(formData.documentType[0]);

				if (checkExistsFile) {
					//TODO Pasar los hideMetadatas para revisar el duplicado
					const fileAlreadyExist = await this.checkForDuplicatedFiles(formData, file);
					if (fileAlreadyExist) {
						// Con estos datos se pueden setear todos los valores que se necesita??
						const dataInfo = {
							...formData
						};
						delete dataInfo.files;
						resolve({
							state: 'duplicateFile',
							file,
							duplicateDocument: fileAlreadyExist,
							metadata: EcmViewerAddFormFilesService.getMetadataFile(dataInfo),
							storagePath: this.getFinalStoragePath(dataInfo)
						});
						return;
					}
				}
				const reader = new FileReader();
				const blob = new Blob([file]);

				reader.readAsDataURL(blob);
				reader.onload = async (ele: any) => {
					const fileToSend = this.getFileData(formData, file, ele);
					if (fileToSend.metadata.Geographyownerdocument == 'SCIBMéxico') {
						fileToSend.metadata.Geographyownerdocument = 'SCIBMexico';
					}
					if (fileToSend.metadata.Geographymanagesdocument == 'SCIBMéxico') {
						fileToSend.metadata.Geographymanagesdocument = 'SCIBMexico';
					}
					if (!fileToSend.metadata.ClientName) {
						fileToSend.metadata.ClientName = [''];
					}
					this.multiChoiceMetadata?.forEach((element) => {
						if (fileToSend.metadata[element] !== undefined) {
							if (!fileToSend.metadata[element].length) {
								fileToSend.metadata[element] = ['NotInformed'];
							}
						}
					});
					let filenet_gn_id: string;
					await EcmViewerService.uploadFiles(fileToSend)
						.then((data) => {
							filenet_gn_id = data.GN_ID;
						})
						.catch((error) => {
							resolve({ state: 'ko', file: fileToSend, error });
							return;
						});

					const tipo_usuario = fileToSend.metadata.Geographyownerdocument ? fileToSend.metadata.Geographyownerdocument : '';
					const document_type = documentTypeData.nombre + ' - ' + documentTypeData.valor;
					const producto = fileToSend.metadata['TypeProduct'] ? fileToSend.metadata['TypeProduct'] : '';

					resolve({
						state: 'ok',
						filenet_gn_id: filenet_gn_id,
						filename: fileToSend.fileName,
						file: fileToSend.file,
						analyticsEvent: EcmViewerAddFormFilesService.getAnalyticsEvent(
							'ev_subidaDocumentoECM',
							tipo_usuario,
							'subirDocumentoECM',
							document_type,
							producto
						)
					});
					return;
				};
			} catch (error) {
				resolve({ state: 'ko', file, error });
				return;
			}
		});
	}

	private getFileData(data, file, fileB64): ICMVUploadFile {
		let dataInfo = {
			...data
		};
		delete dataInfo.files;
		let typeDoc = file.type;
		if (file.type === '' && file.extension === '.msg') {
			typeDoc = 'application/vnd.ms-outlook';
		}
		if (file.hideMetadata && file.hideMetadata.length > 0) {
			file.hideMetadata.forEach((hideMetadata) => {
				if (hideMetadata.value !== undefined && hideMetadata.value != '') {
					dataInfo[hideMetadata.key] = [hideMetadata.value];
				}
			});
		}
		return {
			fileName: file.name,
			docClass: data.documentClass ? data.documentClass[0] : '',
			file: fileB64.srcElement.result.split(';')[1].split(',')[1],
			typeMIME: typeDoc,
			storagePath: this.getFinalStoragePath(dataInfo),
			metadata: EcmViewerAddFormFilesService.getMetadataFile(dataInfo)
		};
	}

	private getFinalStoragePath(dataInfo) {
		let docClass;
		if (dataInfo['documentClass']) {
			docClass = EcmViewerAddFormFilesService.searchClassDataToEdit(dataInfo['documentClass'][0]);
		} else {
			docClass = EcmViewerAddFormFilesService.searchClassDataToEdit();
		}
		const stPath = EcmViewerAddFormFilesService.getStPath(dataInfo);
		return `/SCIB/${stPath + docClass.storage_path}`;
	}

	// ¿??¿ Se puede migrar a EcmViewerAddFormFilesService?
	private filterDocumentTypeData(docType: string): IECMVMetadataObject {
		let filteredDocumentType;

		const allOriginDocumentClass = EcmViewerAddFormFilesService.allOriginDocumentClass;

		if (Array.isArray(allOriginDocumentClass)) {
			for (const documentClass_element of allOriginDocumentClass) {
				for (const documentType_element of documentClass_element.documentyype) {
					if (documentType_element.id_doc_type === docType) {
						filteredDocumentType = documentType_element;
						break;
					}
				}
			}
		} else {
			console.error('save service - filterDocumentTypeData - allOriginDocumentClass', allOriginDocumentClass);
		}

		let documentTypeData: IECMVMetadataObject = {
			nombre: filteredDocumentType ? filteredDocumentType.t_name : '',
			valor: filteredDocumentType ? filteredDocumentType.id_doc_type : ''
		};

		return documentTypeData;
	}

	private async checkForDuplicatedFiles(fileData, file) {
		return await this.checkForFilesAlreadyUploaded(fileData, file);
	}

	private async checkForFilesAlreadyUploaded(detail, file) {
		const documentClass = detail.documentClass[0];
		const doctType = detail.documentType[0];
		const totalSizePage = 5;
		let queryFilter = [];
		let metadataFilteredByDocType;
		queryFilter.push({ id: 'DocumentTitle', metadata: 'document Title', value: file.name, typeItem: 'String' });
		let metadataToCheck = [...queryFilter];
		metadataToCheck.push({ id: 'DocumentType', metadata: 'document Type', value: doctType, typeItem: 'String(ValueList)' });

		let metadata = await EcmViewerService.getMetadataByDocType(doctType);

		metadata = metadata.filter((v, i, a) => a.findIndex((t) => t.id_doc_metadata === v.id_doc_metadata) === i);
		metadataFilteredByDocType = '';

		metadata.forEach((itemDoc) => {
			if (metadataFilteredByDocType.indexOf(itemDoc.id_doc_metadata) < 0) {
				metadataFilteredByDocType += itemDoc.id_doc_metadata + ',';
				metadataToCheck = this.createMetadataToCheck(detail, itemDoc, metadataToCheck);
				if (!itemDoc.documentmetadata.b_automatic) {
					queryFilter = this.createQueryFilterToCheck(detail, itemDoc, queryFilter);
				}
			}
		});
		const queryFilterString = btoa(JSON.stringify(queryFilter));
		const queryData = {
			name: file.name,
			qtotalSizePage: totalSizePage,
			qdoctType: doctType,
			qdocumentClass: documentClass,
			queryFilterString: queryFilterString,
			qmetadataFilteredByDocType: metadataFilteredByDocType,
			qqueryOrderString: '',
			checkDuplicates: true
		};

		return await this.checkIfFileAlreadyExist(queryData, metadataToCheck);
	}

	private createMetadataToCheck(detail, itemDoc, metadataToCheck) {
		if (!['GN_ID', 'IDUsuario', 'DocumentType'].includes(itemDoc.id_doc_metadata)) {
			let itemValue;
			if (this.multiChoiceMetadata?.includes(itemDoc.id_doc_metadata)) {
				itemValue = detail[itemDoc.id_doc_metadata];
			} else {
				const value = detail[itemDoc.id_doc_metadata];
				itemValue = value ? value[0] : '';
			}

			metadataToCheck = this.pushArrayToCheck(metadataToCheck, itemDoc, itemValue);
		}
		return metadataToCheck;
	}

	private createQueryFilterToCheck(detail, itemDoc, queryFilter) {
		if (detail[itemDoc.id_doc_metadata]) {
			const itemValue = this.multiChoiceMetadata?.includes(detail[itemDoc.id_doc_metadata])
				? detail[itemDoc.id_doc_metadata]
				: detail[itemDoc.id_doc_metadata][0];
			queryFilter = this.pushArrayToCheck(queryFilter, itemDoc, itemValue);
		}
		return queryFilter;
	}

	private pushArrayToCheck(array, itemDoc, itemValue) {
		array.push({
			id: itemDoc.id_doc_metadata,
			metadata: itemDoc.documentmetadata.t_name,
			value: itemValue,
			typeItem: itemDoc.documentmetadata.t_type
		});
		return array;
	}

	private async checkIfFileAlreadyExist(queryData, metadataToCheck) {
		let duplicateDocument = null;
		const files = await EcmViewerService.getFilesByDocumentType(
			queryData.qtotalSizePage,
			0,
			queryData.qdocumentClass,
			queryData.qdoctType,
			queryData.qmetadataFilteredByDocType,
			queryData.queryFilterString,
			queryData.qqueryOrderString,
			queryData.checkDuplicates
		);

		if (files.resultList.length > 0) {
			files.resultList.forEach((result) => {
				let isSame = true;
				let k = 0;

				do {
					let metadataSelected = metadataToCheck[k].id;
					let currentValue;
					let newValue;
					if (!this.multiChoiceMetadata?.includes(metadataSelected)) {
						let actualMetadata = result[metadataSelected][0] === undefined ? '' : result[metadataSelected][0].toString();
						if (metadataToCheck[k].typeItem === 'Date' && actualMetadata) {
							actualMetadata = actualMetadata.split('T')[0];
						}
						currentValue = actualMetadata;
						newValue = metadataToCheck.find((metadata) => metadata.id == metadataSelected)?.value;
					} else {
						currentValue = result[metadataSelected].toString();
						const value = metadataToCheck.find((metadata) => metadata.id == metadataSelected)?.value;
						newValue = value ? value.toString() : '';
					}

					if (currentValue != newValue) {
						isSame = false;
					}

					k++;
				} while (k < metadataToCheck.length && isSame);

				if (isSame) duplicateDocument = result;
			});

			if (duplicateDocument) {
				let resultSize: any = (parseFloat(duplicateDocument['ContentSize'][0]) / 1024 / 1024).toFixed(2);
				resultSize = resultSize + ' MB';
				duplicateDocument.size = resultSize;
			}
		}
		return duplicateDocument;
	}
}

export const EcmViewerSaveFilesService = new EcmViewerSaveFilesServiceController();
