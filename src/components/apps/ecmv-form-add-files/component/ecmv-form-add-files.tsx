import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element, Method } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import {
	IAnalyticEvents,
	ICDKMessagesFile,
	IEmitEventSendFN,
	ILiterals,
	ISaveInFNResult,
	LangLiterals,
	Languages
} from '../models/ecmv-form-add-files.model';
import { merge } from 'lodash';

// Literals
import * as esES from '../i18n/es-ES.json';
import * as enGB from '../i18n/en-GB.json';
import * as enUS from '../i18n/en-US.json';
import { EcmViewerService } from '../services/ecmviewer.service';
import { IECMVDocumentClassData, IECMVDocumentMetadata, IECMVDocumentTypeData, PermissionType } from '../models/ecmv-service.model';
import { EcmViewerAddFormFilesService } from '../services/ecmviewer-form-add-files.service';
import { IUISelectOption } from '../../../ui/ui-select/models/ui-select.model';
import { IECMVDocumentTypeValues } from '../models/ecmv-form-add-files.model';
import { EcmViewerSaveFilesService } from '../services/ecmviewer-save-files.service';

const STATIC_LITERALS = {
	'es-ES': (esES as any).default,
	'en-GB': (enGB as any).default,
	'en-US': (enUS as any).default
};
@Component({
	tag: 'scib-apps-ecmv-form-add-files',
	styleUrl: 'ecmv-form-add-files.scss',
	shadow: false,
	scoped: false
})
export class AppsEcmvFormAddlFiles {
	@Element() _hostRef: HTMLElement;

	dropdownclassid = 'documentClass';
	dropdowntypeid = 'documentType';
	selectClassRef: HTMLScibUiV2SelectElement;
	selectTypeRef: HTMLScibUiV2SelectElement;

	formDataMap: Map<string, string[]> = new Map<string, string[]>();
	selectedFormLabelMap: Map<string, string> = new Map();
	classSelected: boolean;
	disableSelector = true;

	fileSelected: boolean = false;

	@Prop() maxfiles: number;
	@Prop() maxSizeFiles: number = null;

	selectedInnerDocuClass = null;
	selectedInnerDocuType = null;
	@State() selecteddocclass: Partial<IECMVDocumentClassData>;
	@State() selecteddoctype: IECMVDocumentTypeData;
	@State() _dropdowntypeheader: string = '';
	@State() _dropdownclassheader: string = '';
	@State() itemsMetadata: any[] = [];
	@State() itemsAutomatic: any[] = [];
	@State() typeSelected: boolean;
	@State() isValidated: boolean = false;
	@State() selectFormPreselected: any[] = [];
	@State() docclass: IECMVDocumentClassData[];
	@State() doctype: IECMVDocumentTypeValues[];

	@State() selectItem: any[];
	@State() inputItem: any[];
	@State() dateItem: any[];
	@State() resetDocClassAndType = false;

	@State() dropdownOptions: any = {};

	/* Indicates the language that the component will use */
	@Prop() language: Languages = 'en-GB';
	@State() _language: Languages;
	@Watch('language') setLang(language: Languages) {
		this._language = language;
		this.parseLiterals(JSON.stringify(STATIC_LITERALS));
	}

	/** Literals used in the component */
	@Prop() literals: LangLiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: LangLiterals | string) {
		const literals = _parseProp(newLiterals) as LangLiterals;
		const mergedLiterals = merge({}, STATIC_LITERALS, literals || {});
		this._literals = mergedLiterals[this._language] as ILiterals;
		const docTypeMessageLiteral = ['es-ES', 'en-GB', 'en-US'].map((l) => mergedLiterals[l].docTypeMessage);
		if (!this._dropdowntypeheader || docTypeMessageLiteral.includes(this._dropdowntypeheader)) {
			this._dropdowntypeheader = this._literals.docTypeMessage;
		}
		const docClassMessageLiteral = ['es-ES', 'en-GB', 'en-US'].map((l) => mergedLiterals[l].docClassMessage);
		if (!this._dropdownclassheader || docClassMessageLiteral.includes(this._dropdownclassheader)) {
			this._dropdownclassheader = this._literals.docClassMessage;
		}
	}

	/* Send this value in http request */
	@Prop() currentSubsidiaryId: number;
	@Watch('currentSubsidiaryId') setCurrentSubsidiaryId(value: number) {
		EcmViewerService.current_subsidiary_id = value;
	}

	@Prop() documentTypeSelected: any;
	@Watch('documentTypeSelected') parseDocumentTypeSelected(val: any) {
		if (val) {
			this.selecteddoctype = val;
			const classData = EcmViewerAddFormFilesService.searchClassDataToEdit();
			if (classData) {
				const documentyype =
					Array.isArray(classData.documentyype) && classData.documentyype.length > 0
						? classData.documentyype.find((dt) => dt.id_doc_type === val.id_doc_type)
						: null;
				this.setDocumentTypeExternal(documentyype);
			}
		} else {
			this.selecteddoctype = null;
		}
	}

	@Prop() documentClassSelected: string;
	@Watch('documentClassSelected') parseDocumentClassSelected(val: string) {
		if (val) {
			EcmViewerAddFormFilesService.documentClassSelected = val;
			const classData = EcmViewerAddFormFilesService.searchClassDataToEdit();
			this.selecteddocclass = classData;
			this.setDocumentClassExternal(this.selecteddocclass);
		} else {
			this.selecteddocclass = null;
			this.selecteddoctype = null;
			this.resetForm();
		}
	}

	@Prop() receiveddocs: any;
	@Watch('receiveddocs') setReceiveDdocs(newReceiveddocs: any) {
		if (newReceiveddocs) {
			const receivedDocs = {
				detail: []
			};
			for (const doc of newReceiveddocs) {
				receivedDocs.detail.push(doc);
				this.filesarray.push(doc);
				if (doc.hideMetadata) {
					doc.hideMetadata.forEach((element) => {
						this.formDataMap[element.key] = element.value;
					});
				}
			}
			this.handleSelectFile(receivedDocs);
		}
	}

	@Prop() readMode: boolean = false;
	@State() _readMode: boolean;
	@Watch('readMode') setReadMode(newReadMode: boolean) {
		this._readMode = newReadMode;
	}

	@State() numfiles: number = 0;
	ficheros: any;
	@State() filesarray: ICDKMessagesFile[] = [];

	@Prop() fileExtensionError: any;
	@State() _fileExtensionError: any;
	@Watch('fileExtensionError') setFileExtensionError(value: any) {
		this._fileExtensionError = value;
	}

	@Prop() multiChoiceMetadata: string[] = [];
	@State() _multiChoiceMetadata: string[];
	@Watch('multiChoiceMetadata') setMultiChoiceMetadata(newMultiChoiceMetadata: string[]) {
		this._multiChoiceMetadata = newMultiChoiceMetadata;
		EcmViewerAddFormFilesService.multiChoiceMetadata = this._multiChoiceMetadata;
		EcmViewerSaveFilesService.multiChoiceMetadata = this._multiChoiceMetadata;
	}

	@Event() fileError: EventEmitter<any>;

	@Event() valid: EventEmitter<boolean>;

	@Event() analytics: EventEmitter<IAnalyticEvents>;

	@Event() filesSaveInFN: EventEmitter<any>;

	@Event() errorSaveInFN: EventEmitter<IEmitEventSendFN>;

	@Event() duplicateFilesInFN: EventEmitter<IEmitEventSendFN>;

	@Event() startSaveInFN: EventEmitter;

	@Event() showPermissionsRequired: EventEmitter<boolean>;
	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this.setLang(this.language);
		this.parseLiterals(this.literals);
		this.setReadMode(this.readMode);
		this.setReceiveDdocs(this.receiveddocs);
		this.setMultiChoiceMetadata(this.multiChoiceMetadata);

		this.getECMViewerPermissions();
		this.setFileExtensionError(this.fileExtensionError);
	}

	componenteDidRender() {
		// Siempre se setea a false, por si en el siguiente renderizado se tiene que resetear.
		this.resetDocClassAndType = false;
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {}

	/**
	 * Ciclo de vida al eliminar la instancia del componente
	 */
	disconnectedCallback() {}

	componentInitLoad() {
		this.parseDocumentClassSelected(this.documentClassSelected);
		this.parseDocumentTypeSelected(this.documentTypeSelected);
	}

	@Method() async getMetadata(): Promise<IECMVDocumentMetadata[]> {
		return EcmViewerAddFormFilesService.metadata;
	}

	@Method() async externalSendFileToFn(formDataMap, file): Promise<ISaveInFNResult> {
		return EcmViewerSaveFilesService.sendSingleFile(formDataMap, file, false);
	}

	/** Method to send file to Filenet
	 *
	 */
	@Method() async sendFilesToFN(checkExistsFile = false) {
		if (this.classSelected && this.typeSelected && this.fileSelected && this.isValidated) {
			// To send data
			// Método para guardar un fichero.
			this.startSaveInFN.emit();
			this.addValuesToEmptySelectFormData();
			return new Promise((resolve) => {
				EcmViewerSaveFilesService.sendFiles(this.formDataMap, checkExistsFile)
					.then((results: ISaveInFNResult[]) => {
						if (results.filter((r) => r.state === 'ok').length === this.formDataMap['files'].length) {
							let filesData: any[] = [];
							results.forEach((result) => {
								filesData.push({ filename: result.filename, filenet_gn_id: result.filenet_gn_id, file: result.file });
							});
							// Ficheros cargados correctamente. Evento
							this.filesSaveInFN.emit(filesData);
						} else if (results.filter((r) => r.state === 'ko').length > 0) {
							// Evento fallo en la carga de documentos
							this.errorSaveInFN.emit({ formData: this.formDataMap, files: results.filter((r) => r.state === 'ko') });
						} else if (checkExistsFile && results.filter((r) => r.state === 'duplicateFile').length > 0) {
							// Ficheros duplicados. Evento con this.formDataMap
							this.duplicateFilesInFN.emit({
								formData: this.formDataMap,
								filesOK: results.filter((r) => r.state === 'ok').length,
								files: results.filter((r) => r.state === 'duplicateFile')
							});
						}

						if (results.some((r) => r.state === 'ok')) {
							this.analytics.emit(results.filter((r) => r.state === 'ok').map((r) => r.analyticsEvent));
						}
						// Set again form prefilled by document class and type selection
						this.clearFiles();
						this.handleSelectDocumentClass({ detail: this.selectedInnerDocuClass.id }, this.dropdownclassid, false);
						this.handleSelectDocumentType({ detail: this.selectedInnerDocuType.id }, this.dropdowntypeid);
						resolve(true);
					})
					.catch((err) => {
						this.errorSaveInFN.emit({ formData: this.formDataMap, files: [], err });
						resolve(false);
					});
			});
		} else {
			this.checkIsValid();
		}
	}

	@Method() async resetForm() {
		this.filesarray = [];
		this.formDataMap = new Map();
		this.selectedFormLabelMap = new Map();
		this.numfiles = 0;
		this.resetDocumentClass();

		this._dropdownclassheader = null;
		this._dropdowntypeheader = null;
		this.typeSelected = false;
		this.fileSelected = false;
		this.resetDocClassAndType = true;
		this._dropdowntypeheader = this._literals.docTypeMessage;

		this._dropdownclassheader = this._literals.docClassMessage;

		if (this.selectClassRef) {
			this.selectClassRef.value = null;
		}

		this.setDocumentTypeNull();
	}

	@Method() async clearFiles() {
		this.formDataMap['files'] = [];
		this.filesarray = [];
		this.numfiles = 0;
		this.fileSelected = false;
	}

	@Method() async setDocAndTypeAgain() {
		this.setDocumentClassExternal(this.selecteddocclass);
		this.setDocumentTypeExternal(this.selecteddoctype);
	}

	addValuesToEmptySelectFormData() {
		const listMetadata = this.selectItem.filter((metadata) => metadata.b_list === true);

		listMetadata.forEach((metadata) => {
			if (!this.formDataMap[metadata.id_doc_metadata]) {
				if (metadata.t_list_value.includes('NotInformed')) {
					this.formDataMap[metadata.id_doc_metadata] = ['NotInformed'];
				}
			}
		});
	}

	resetDocumentClass() {
		// Document class data
		this.selecteddocclass = null;
		this.classSelected = false;
		// Clear document type. Effects that delete document class selectec
		this.selecteddoctype = undefined;
		this.doctype = undefined;
		this.disableSelector = true;
		this.setDocumentTypeNull();
	}

	@Method() async setUserPreference(preference: boolean) {
		return new Promise((resolve) => {
			EcmViewerService.setUserPreference(preference)
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					console.error(e);
				});
		});
	}

	@Method() async getUserPreference() {
		return new Promise((resolve) => {
			EcmViewerService.getUserPreference()
				.then((data) => {
					resolve(data);
				})
				.catch((e) => {
					console.log(e);
				});
		});
	}

	setDocumentTypeExternal(documentyype) {
		if (documentyype) {
			this.handleSelectDocumentType({ detail: documentyype.id_doc_type }, this.dropdowntypeid);
		}
	}

	setDocumentClassExternal(classData) {
		if (classData) {
			this.handleSelectDocumentClass({ detail: classData.id_doc_class }, this.dropdownclassid);
		}
	}

	setDocumentTypeNull() {
		if (this.selectTypeRef) {
			this.selectTypeRef.value = null;
		}
	}

	async getECMViewerPermissions() {
		try {
			const ecmUserCase = await EcmViewerService.getFSEECMVPermissions();

			// Only read permissions
			const check =
				Array.isArray(ecmUserCase) &&
				ecmUserCase.some((item) => {
					return item.what.toLowerCase() == PermissionType.EDIT;
				});

			if (check) {
				EcmViewerAddFormFilesService.getFSEPermissionsData(ecmUserCase);
				this.docclass = await EcmViewerAddFormFilesService.getAllDocuments();
				if (Array.isArray(this.docclass) && this.docclass.length === 1) {
					this.setDocumentClassExternal(this.docclass[0]);
					if (Array.isArray(this.docclass[0].documentyype) && this.docclass[0].documentyype.length === 1) {
						this.setDocumentTypeExternal(this.docclass[0].documentyype[0]);
					}
				}
				if (Array.isArray(this.docclass)) {
					this.docclass.forEach((elem) => {
						elem['id'] = elem.id_doc_class;
						elem['value'] = elem.id_doc_class;
						elem['label'] = elem.t_name;
					});
				}
				this.componentInitLoad();
			} else {
				this.showPermissionsRequired.emit(true);
			}
		} catch (err) {
			console.error(err);
		}
	}

	handleSelectFile(event) {
		this.numfiles = event.detail.length;
		this.ficheros = event.detail;
		this.fillFormDataMapFiles(this.ficheros, 'files');
		this.fileSelected = this.numfiles > 0 ? true : false;
		this.requiredMetadata();
	}

	// Viene de la modal de ecmv
	/**
	 *
	 * @param event
	 * @param label
	 * @param cardinality multi o simple
	 */
	//  { detail: {id: string; label:string;} | Array<{id: string; label:string;}> }
	fillFormDataMapSelect(event: any, label, cardinality: 'multi' | 'single') {
		let arrayValues = [];
		if (event) {
			if (cardinality === 'multi') {
				if (Array.isArray(event.detail) && event.detail[0]) {
					event.detail.forEach((element) => {
						arrayValues.push(element.id);
					});
					if (arrayValues.length > 1 && arrayValues.includes('NotInformed')) {
						arrayValues.shift();
					}
				} else {
					// multivalue is empty
					if (!event.detail || (Array.isArray(event.detail) && event.detail.length === 0)) {
						arrayValues = ['NotInformed'];
					}
				}
			} else {
				arrayValues.push(event.detail.id);
			}
			this.formDataMap[label] = arrayValues;
		} else {
			delete this.formDataMap[label];
		}
		this.formDataMap[label] = arrayValues;
		const arrayLabelsValues =
			this.dropdownOptions[label] && arrayValues?.length > 0 && !arrayValues.includes('NotInformed')
				? arrayValues.map((value) => this.dropdownOptions[label].find((option) => option.id === value)?.label)
				: ['Not Informed'];
		this.selectedFormLabelMap[label] = event.detail.label
			? event.detail.label
			: arrayLabelsValues?.length > 0
			? arrayLabelsValues.join(', ')
			: undefined;
	}

	async handleSelectDocumentType(event, label) {
		this.itemsMetadata = [];
		this.itemsAutomatic = [];
		if (event.detail) {
			this.selectedInnerDocuType = this.doctype.find((elem) => elem.id === event.detail || elem.label === event.detail);
			this.typeSelected = true;
			const metadatas = await EcmViewerAddFormFilesService.getAutoValuesByType(this.selectedInnerDocuType);
			this.itemsMetadata = metadatas.metadata;
			this.itemsAutomatic = metadatas.automaticMetadata;
			this.fillFormDataMapSelect({ detail: this.selectedInnerDocuType }, label, 'single');
			this.watchMetadataValues();
		} else if (!event.detail) {
			this.typeSelected = false;
			this.checkIsValid();
		}
	}

	handleSelect(event, label, cardinality) {
		if (label === 'DocumentOwner') {
			this.fillFormDataMapSelect(event, label, 'single');
			this.inputsToClear(['BusinessProcess', 'GDPR', 'ConfidentialityLevel']);
			const metadatas = EcmViewerAddFormFilesService.getUserAreaMetadatasValuesByDocumentOwner(this.formDataMap[label]);
			this.itemsMetadata = metadatas.metadata;
			this.itemsAutomatic = metadatas.automaticMetadata;
			this.watchMetadataValues();
		} else if (this.multiChoiceMetadata?.includes(label)) {
			this.fillFormDataMapSelect(event, label, 'multi');
		} else {
			this.fillFormDataMapSelect(event, label, cardinality);
		}
		this.requiredMetadata();
	}

	inputsToClear(inputsToClear: string[]) {
		if (inputsToClear && inputsToClear.length) {
			inputsToClear.forEach((label) => {
				delete this.formDataMap[label];
			});
		}
	}

	watchMetadataValues() {
		this.selectFormPreselected = [];
		this.itemsMetadata = this.itemsMetadata.filter((elem) => elem.id_doc_metadata !== 'DocumentType' && elem.id_doc_metadata !== 'GN_ID');
		if (this.itemsMetadata !== undefined && this.itemsMetadata.length > 0) {
			this.selectItem =
				this.itemsMetadata[0].documentmetadata !== undefined
					? this.itemsMetadata.filter(
							(elem) =>
								elem.documentmetadata?.t_type.toLowerCase() === 'string(valuelist)' ||
								elem.documentmetadata?.t_type.toLowerCase() === 'array'
					  )
					: this.itemsMetadata.filter((elem) => elem.t_type.toLowerCase() === 'string(valuelist)' || elem.t_type.toLowerCase() === 'array');
			this.inputItem =
				this.itemsMetadata[0].documentmetadata !== undefined
					? this.itemsMetadata.filter((elem) => elem.documentmetadata?.t_type.toLowerCase() === 'string')
					: this.itemsMetadata.filter((elem) => elem.t_type.toLowerCase() === 'string');
			this.dateItem =
				this.itemsMetadata[0].documentmetadata !== undefined
					? this.itemsMetadata.filter((elem) => elem.documentmetadata?.t_type.toLowerCase() === 'date')
					: this.itemsMetadata.filter((elem) => elem.t_type.toLowerCase() === 'date');
			this.selectItem.forEach((elem) => {
				let aux = [];
				if (
					(elem.b_automatic !== undefined && elem.b_automatic) ||
					(elem.documentmetadata !== undefined && elem.documentmetadata.b_automatic)
				) {
					this.itemsAutomatic.forEach((e) => {
						if (e.id_doc_metadata === elem.id_doc_metadata) {
							elem.automatic_value = e.display_value_metadata;
							aux.push(e.value_metadata);
							this.formDataMap[elem.id_doc_metadata] = aux;
						}
					});
				}
				if (elem.selectedDefaultId) {
					this.selectFormPreselected.push(elem);
				}
			});
			this.inputItem.forEach((elem) => {
				let aux = [];
				if (
					(elem.b_automatic !== undefined && elem.b_automatic) ||
					(elem.documentmetadata !== undefined && elem.documentmetadata.b_automatic)
				) {
					this.itemsAutomatic.forEach((e) => {
						if (e.id_doc_metadata === elem.id_doc_metadata) {
							elem.automatic_value = e.display_value_metadata;
							aux.push(e.id_metadata_autom);
							this.formDataMap[elem.id_doc_metadata] = aux;
						}
					});
				}
			});
			this.dateItem.forEach((elem) => {
				let aux = [];
				if (
					(elem.b_automatic !== undefined && elem.b_automatic) ||
					(elem.documentmetadata !== undefined && elem.documentmetadata.b_automatic)
				) {
					this.itemsAutomatic.forEach((e) => {
						if (e.id_doc_metadata === elem.id_doc_metadata) {
							elem.automatic_value = e.display_value_metadata;
							aux.push(e.id_metadata_autom);
							this.formDataMap[elem.id_doc_metadata] = aux;
						}
					});
				}
			});
			this.selectItem = this.removeDuplicates(this.selectItem);
			this.selectItem.forEach((selectItem) => {
				this._multiChoiceMetadata?.includes(selectItem.id_doc_metadata) ? (selectItem.multiselect = true) : (selectItem.multiselect = false);
			});
			this.inputItem = this.removeDuplicates(this.inputItem);
			this.dateItem = this.removeDuplicates(this.dateItem);

			this.handlePreselectedSelectData();
		} else {
			this.selectItem = [];
			this.inputItem = [];
			this.dateItem = [];
		}
		if (this.fileSelected && this.typeSelected && this.classSelected) {
			this.requiredMetadata();
		}
	}

	handlePreselectedSelectData() {
		if (this.selectFormPreselected) {
			this.selectFormPreselected.forEach((elem) => {
				const eventDetail = {
					detail: {
						active: true,
						id: elem.selectedDefaultId,
						label: elem.selectedDefaultLabel
					}
				};
				if (!this.formDataMap[elem.id_doc_metadata]) {
					this.fillFormDataMapSelect(eventDetail, elem.id_doc_metadata, 'single');
				}
			});
		}
	}

	removeDuplicates(array) {
		let hash = {};
		array = array.filter(function (current) {
			let exists = !hash[current.id_doc_metadata];
			hash[current.id_doc_metadata] = true;
			return exists;
		});
		return array;
	}

	requiredMetadata() {
		this.isValidated = true;
		let anyRequired;
		if (this.itemsMetadata && this.itemsMetadata.length > 0) {
			anyRequired = this.itemsMetadata.filter((elem) => elem.required === true);
			if (anyRequired.length === 0) {
				this.isValidated = true;
			}
			this.itemsMetadata.forEach((elem) => {
				if (elem.required === true) {
					if (!this.formDataMap[elem.id_doc_metadata] || this.formDataMap[elem.id_doc_metadata].length == 0) this.isValidated = false;
				}
			});
			this.checkIsValid();
		}
	}

	parseDocumentClassOrType(
		docu: (IECMVDocumentClassData & IECMVDocumentTypeValues)[],
		id: 'id_doc_class' | 'id_doc_type'
	): IUISelectOption[] | string {
		if (!Array.isArray(docu)) return;
		let dropdownOptionsListArray = [];
		if (docu.length >= 1) {
			dropdownOptionsListArray = docu
				.map((elem) => ({
					label: elem.t_name,
					id: elem[id],
					active: false,
					name: elem.t_name,
					value: elem.t_name,
					documentyype: elem.documentyype ? elem.documentyype : null
				}))
				.sort();
		}
		return JSON.stringify(dropdownOptionsListArray);
	}

	parseMetadataValuesAuto(text, idMetadata): IUISelectOption[] | string {
		if (!text) return;
		let dropdownOptionsListArray = [];
		if (text && text !== undefined) {
			const textSplitted = text.split('||');
			if (textSplitted.length >= 1) {
				textSplitted.forEach((elem) => {
					if (elem.split('#')[1] !== 'NotInformed') {
						const category2 = {
							label: elem.split('#')[0],
							id: elem.split('#')[1],
							active: false,
							name: elem.split('#')[0],
							value: elem.split('#')[0]
						};
						return (dropdownOptionsListArray = [...dropdownOptionsListArray, category2].sort());
					}
				});
			}
		}
		this.dropdownOptions[idMetadata] = [...dropdownOptionsListArray];
		return JSON.stringify(dropdownOptionsListArray);
	}

	fillFormDataMapFiles(event, label) {
		if (event.length > 0) {
			this.formDataMap[label] = event;
		} else {
			delete this.formDataMap[label];
		}
	}

	handleSelectDocumentClass(event, label, resetDocumentType = true) {
		if (event.detail) {
			this.selectedInnerDocuClass = this.docclass.find((elem) => elem.id_doc_class === event.detail || elem.label === event.detail);
			if (this.formDataMap[label] && this.formDataMap[label][0] !== this.selectedInnerDocuClass.id) {
				this.formDataMap = new Map<string, string[]>();
				this.selectedFormLabelMap = new Map();
				this.typeSelected = false;
				if (this.ficheros && this.ficheros.length > 0) {
					this.fillFormDataMapFiles(this.ficheros, 'files');
				}
			}
			const doctypeArray: IECMVDocumentTypeValues[] = [];

			this.classSelected = true;

			this.docclass.forEach((elem) => {
				if (elem.id_doc_class == this.selectedInnerDocuClass?.id_doc_class) {
					elem.documentyype.forEach((item) => {
						doctypeArray.push({
							t_name: item.t_name,
							id_doc_type: item.id_doc_type,
							t_description: item.t_description,
							id: item.id_doc_type,
							value: item.id_doc_type,
							label: item.t_name
						} as IECMVDocumentTypeValues);
					});
				}
			});
			this.doctype = doctypeArray;
			this.disableSelector = event.detail ? false : true;
			this.fillFormDataMapSelect({ detail: this.selectedInnerDocuClass }, label, 'single');
			if (resetDocumentType) {
				this.setDocumentTypeNull();
			}
		} else if (!event.detail) {
			this.classSelected = false;
			this.resetDocumentClass();
		}
		this.checkIsValid();
	}

	handleToMantainSelectedData(item) {
		let selectedSelectValue = item.automatic_value;
		if (this.formDataMap[item.id_doc_metadata]) {
			selectedSelectValue = this.selectedFormLabelMap[item.id_doc_metadata];
		} else {
			selectedSelectValue = item.selectedDefaultLabel;
		}
		return selectedSelectValue;
	}

	handleInputOrDate(event, label) {
		this.fillFormDataMapInputOrDate(event.detail, label);
		this.requiredMetadata();
	}

	fillFormDataMapInputOrDate(event, label) {
		let arrayValues = [];
		if (event !== '') {
			if (this.formDataMap[label]) {
				let currentValue = this.formDataMap[label];
				if (typeof currentValue === 'string' && currentValue !== event) {
					arrayValues.push(event);
				} else if (Array.isArray(currentValue)) {
					!currentValue.includes(event)
						? arrayValues.push(event)
						: Array.isArray(currentValue)
						? (arrayValues = currentValue)
						: arrayValues.push(currentValue);
				}
			} else {
				arrayValues.push(event);
			}
			this.formDataMap[label] = arrayValues;
			this.selectedFormLabelMap[label] = event;
		} else {
			delete this.formDataMap[label];
			delete this.selectedFormLabelMap[label];
		}
	}

	handleErrorFile(event) {
		this.fileError.emit(event.detail);
	}

	eventClickDeleteInput(event, item) {
		if (event.detail.length == 0) {
			this.formDataMap[item.id_doc_metadata] = [];
			this.requiredMetadata();
		}
	}

	cancelFile(e) {
		this.filesarray.forEach((item, index) => {
			if (item.name === e.name) {
				this.filesarray.splice(index, 1);
			}
		});
		const dt = new DataTransfer();
		this.filesarray.forEach((item: any) => {
			dt.items.add(item);
		});

		this.numfiles = this.filesarray.length;
		if (this.numfiles == 0) {
			this.fileSelected = false;
		} else {
			this.fileSelected = true;
		}
		this.checkIsValid();
		this.fillFormDataMapFiles(this.filesarray, 'files');
	}

	checkIsValid() {
		this.valid.emit(this.classSelected && this.typeSelected && this.fileSelected && this.isValidated);
	}

	getLabelIntup(item) {
		return !item.b_automatic ? (item.required ? item.t_name + ' *' : item.t_name) : item.t_name;
	}

	render() {
		return (
			<Host>
				<form id="modal-files-form" class="form-style" enctype="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
					<fieldset>
						<legend class="not-visible">Formulario para añadir uno o varios ficheros</legend>
						<div>
							<div class="select-group-style">
								<scib-ui-v2-select
									ref={(ref) => {
										this.selectClassRef = ref;
									}}
									label={this._dropdownclassheader}
									menuOptions={this.parseDocumentClassOrType(this.docclass as any[], 'id_doc_class')}
									value={this.selecteddocclass?.label}
									name="dropdown-list"
									onValueChange={($event) => {
										this.handleSelectDocumentClass($event, this.dropdownclassid);
									}}
								></scib-ui-v2-select>
							</div>
							<div class="select-group-style">
								<scib-ui-v2-select
									ref={(ref) => {
										this.selectTypeRef = ref;
									}}
									label={this._dropdowntypeheader}
									menuOptions={this.parseDocumentClassOrType(this.doctype as any[], 'id_doc_type')}
									value={this.selecteddoctype?.label}
									name="dropdown-list"
									disabled={(!Array.isArray(this.doctype) || !this.doctype?.length) && this.disableSelector}
									onValueChange={($event) => {
										if (this.selecteddoctype?.label !== $event.detail) {
											this.handleSelectDocumentType($event, this.dropdowntypeid);
										}
									}}
								></scib-ui-v2-select>
							</div>
						</div>
						<div class="files-selector-style">
							{!this._readMode && (
								<scib-ecmv-files-selector
									class={{
										'ecmv-fselector--big': true,
										'ecmv-fselector--multiple': this.filesarray && this.filesarray.length > 1,
										'ecmv-fselector--simple': this.filesarray && this.filesarray.length == 1
									}}
									titleselector={this._literals.dragFiles}
									errorFormat={this._fileExtensionError}
									maxfiles={this.maxfiles}
									maxSizeFiles={this.maxSizeFiles}
									// errorMaxFiles={this.errorMaxFiles}
									filesarray={this.filesarray}
									smallsize={false}
									onSelectValue={($event) => this.handleSelectFile($event)}
									onFileError={($event) => this.handleErrorFile($event)}
								></scib-ecmv-files-selector>
							)}
							{this.filesarray && this.filesarray.length > 0 ? (
								<scib-cdk-messages-attached-bar
									withEvents
									titleTxt={this._literals.documents}
									iscollapse={false}
									readMode={this._readMode}
									class={{
										'c-reply__files': !this._readMode,
										'c-reply__files--multiple': this.filesarray && this.filesarray.length > 1,
										'c-reply__files--simple': this.filesarray && this.filesarray.length == 1
									}}
									files={this.filesarray}
									numfiles={this.numfiles}
									onEventCancelFile={(ev: CustomEvent) => this.cancelFile(ev.detail)}
								></scib-cdk-messages-attached-bar>
							) : null}
						</div>

						<div class="separator">
							{this.fileSelected && this.typeSelected && this.classSelected && (
								<div
									class={{
										'metadatos-style': true,
										'not-visible': !this.fileSelected || !this.typeSelected || !this.classSelected
									}}
								>
									{/* <div class='metadatos-style'> */}
									{this.selectItem &&
										this.selectItem.map((item) => {
											return (
												<div class="select-group-style">
													<scib-ui-select
														label={item.required ? item.t_name + ' *' : item.t_name}
														noResult={'No results'}
														placeholder-select={item.required ? item.t_name + ' *' : item.t_name}
														minHeight={true}
														idSelect={item.id_doc_metadata}
														autocomplete
														name="dropdown-list"
														required={false}
														multiselect={false}
														debounce-time="300"
														options={this.parseMetadataValuesAuto(
															item.documentmetadata?.t_list_value || item.t_list_value,
															item.documentmetadata ? item.documentmetadata.id_doc_metadata : item.id_doc_metadata
														)}
														onListEventChange={($event) =>
															this.handleSelect($event, item.id_doc_metadata, item.t_cardinality)
														}
														multiselectV2={!item.b_automatic && item.multiselect}
														disabled={!!item.b_automatic}
														value={
															!item.b_automatic
																? item.selectedDefaultLabel || this.formDataMap[item.id_doc_metadata]
																	? this.handleToMantainSelectedData(item)
																	: item.automatic_value
																: item.automatic_value
														}
														valueAutoComplete={{
															name: !item.b_automatic
																? item.selectedDefaultLabel || this.formDataMap[item.id_doc_metadata]
																	? this.handleToMantainSelectedData(item)
																	: item.automatic_value
																: item.automatic_value,
															apply: true,
															detail: {
																value: !item.b_automatic
																	? item.selectedDefaultLabel || this.formDataMap[item.id_doc_metadata]
																		? this.handleToMantainSelectedData(item)
																		: item.automatic_value
																	: item.automatic_value
															}
														}}
														data-cy={!item.b_automatic && 'ecm-modal-files-fieldRequired'}
													></scib-ui-select>
												</div>
											);
										})}
									{this.inputItem &&
										this.inputItem.map((item) => (
											<div class="select-group-style">
												<scib-ui-input
													data-cy="ecm-moldal-form-input"
													required={true}
													label={this.getLabelIntup(item)}
													placeholder={!item.b_automatic ? item.t_name : item.automatic_value}
													disableEdit={!item.b_automatic ? false : true}
													onEventChange={($event) => {
														if (!item.b_automatic) {
															this.handleInputOrDate($event, item.id_doc_metadata);
														}
													}}
													onListEventChange={($event) => {
														if (!item.b_automatic) {
															this.eventClickDeleteInput($event, item);
														}
													}}
													idInput={!item.b_automatic ? item.id_doc_metadata : undefined}
													value={
														!item.b_automatic
															? this.formDataMap[item.id_doc_metadata]
																? this.formDataMap[item.id_doc_metadata]
																: ''
															: undefined
													}
												></scib-ui-input>
											</div>
										))}
									{this.dateItem &&
										this.dateItem.map((item) => (
											<div class="select-group-style">
												<scib-ui-date-picker
													id={item.id_doc_metadata}
													onSelectValue={($event) => this.handleInputOrDate($event, item.id_doc_metadata)}
													header={item.t_name}
													disabledselector={!item.b_automatic ? false : true}
													label={this.getLabelIntup(item)}
													value={
														!item.b_automatic
															? this.formDataMap[item.id_doc_metadata]
																? this.formDataMap[item.id_doc_metadata]
																: ''
															: item.automatic_value
													}
												></scib-ui-date-picker>
											</div>
										))}
								</div>
							)}
						</div>
					</fieldset>
				</form>
			</Host>
		);
	}
}
