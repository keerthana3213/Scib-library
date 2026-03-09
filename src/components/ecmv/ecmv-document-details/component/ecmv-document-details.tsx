import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import _ from 'lodash';
import { ILiterals } from '../../../molecules/upload-files/models/upload-files.model';
import { IUISelectOption } from '../../../ui/ui-select/models/ui-select.model';
import { IECMVMetadataDetailValues, IECMVMetadataDetail, IECMVAdditionalDetailValues } from '../models/ecmv-document-details.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ecmv-document-details',
	styleUrl: 'ecmv-document-details.scss',
	shadow: false,
	scoped: true
})
export class ECMVDocumentDetails {
	@Prop({ reflect: true, mutable: true }) recentVersion: string;
	@Prop({ reflect: true, mutable: true }) fileName: string = '';
	@Prop({ reflect: true, mutable: true }) fileModificated: string = '';
	@Prop({ reflect: true, mutable: true }) fileSize: string = '';
	@Prop({ reflect: true, mutable: true }) additionalDetailInformation: IECMVAdditionalDetailValues;
	@Prop() editMode: boolean = false;
	@Prop() showEdit: boolean = true;
	@Prop() showDownload: boolean = true;
	@State() selectItem: any[];
	@State() selectItemAux: any[];
	@State() checkSelecItemAux: boolean;
	@State() dropdownOptions: any = {};
	@State() isValidated: boolean = false;
	@State() inputItem: any[];
	@State() dateItem: any[];
	@State() itemsMetadata: any[] = [];
	@State() resultMetadata: IECMVMetadataDetailValues[] = [];
	@State() itemsAutomatic: any[] = [];
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		if (typeof newLiterals == 'string') {
			try {
				this._literals = JSON.parse(newLiterals);
			} catch (e) {}
		} else {
			this._literals = newLiterals;
		}
	}
	@State() showUploadFiles: boolean = true;
	extensionRejex = /(?:\.([^.]+))?$/;
	@Prop() datafile: any;
	@Watch('datafile') parseDataFile() {
		const auxFileMetadata = [];
		const auxMetadata = [];
		this.resultMetadata = [];
		if (this.datafile !== undefined && this.datafile != '') {
			this.dataInfoFile = JSON.parse(this.datafile);
			this.dataInfoFile.metadatos.forEach((elem) => auxFileMetadata.push(elem));
			this.itemsMetadata = this.metadatavalues ? JSON.parse(this.metadatavalues) : [];
			this.itemsMetadata.forEach((elem) => auxMetadata.push(elem));
			auxFileMetadata.forEach((element) => {
				auxMetadata.forEach((item) => {
					if (element.nombre === item.id_doc_metadata) {
						const result = new IECMVMetadataDetail();

						// result
						result.id = element.nombre;
						result.nombre = item.documentmetadata === undefined ? item.t_name : item.documentmetadata.t_name;
						result.valor = element.valor;
						result.multi = element.multi;
						result.show = element.show !== undefined ? element.show : true;
						if (item.documentmetadata !== undefined) {
							if (item.documentmetadata.t_type == 'Date') {
								if (element.valor !== undefined && element.valor != '') {
									result.valor = element.valor.split('T')[0];
								}
							}
						} else {
							if (item.t_type == 'Date') {
								if (element.valor !== undefined && element.valor != '') {
									result.valor = element.valor.split('T')[0];
								}
							}
						}
						// item
						switch (typeof element.valor) {
							case 'string':
								if (element.valor) {
									item.value_metadata = element.valor.toString();
								}
								break;
							case 'boolean':
								item.value_metadata = String(element.valor);
								break;
							default:
								if (Array.isArray(element.valor)) {
									item.value_metadata = element.valor[0];
								}
								break;
						}
						const valueArray =
							item.documentmetadata === undefined ? item.t_list_value.split('||') : item.documentmetadata.t_list_value.split('||');
						valueArray.map((va_i) => {
							if (item.value_metadata && va_i.split('#')[1] === item.value_metadata) {
								item.display_value_metadata = va_i.split('#')[0];
								result.valor = va_i.split('#')[0];
							}
						});

						this.resultMetadata.push(result);
						// this.fileName = element.DocumentTitle;
						return false;
					}
				});
				if (element.nombre === 'DocumentTitle') {
					this.fileName = element.valor;
					this.fileExtension = this.extensionRejex.exec(this.fileName)[1];
				}
				if (element.nombre === 'DateLastModified') {
					this.fileModificated = new Date(element.valor.split('+')[0]).toLocaleDateString('en-US', {
						hour: 'numeric',
						minute: 'numeric'
					});
				}
				if (element.nombre === 'Size') {
					this.fileSize = element.valor;
				}
			});
			this.resultMetadata = this.removeMetadataDuplicates(this.resultMetadata);
			this.preFillEditForm(auxMetadata);
		}
	}
	@Prop() metadatavalues: any;
	@Watch('metadatavalues') parseMetadataValues() {
		this.parseDataFile();
	}

	@Prop() dataInfoFile: any = [];
	@Prop() isClosedModalDetail: boolean;
	@Watch('isClosedModalDetail') parseClosedModalDetail() {
		this.formDataMap = new Map();
		this.originFormDataMap = new Map();
		this.editMode = false;
		this.filesarray = [];
		this.selectedValue = { label: '', active: false };
	}
	@Event() formValues: EventEmitter<Map<string, any[]>>;
	@Event() isDownloadFile: EventEmitter;
	@Event() previewFileClick: EventEmitter;
	@Prop() formDataMap: Map<string, any[]> = new Map();
	@Prop() originFormDataMap: Map<string, any[]> = new Map();
	@State() selectedValue: any;
	@Prop() maxfiles: number; //1
	@Prop() numfiles: number = 0;
	@Prop() fileSelected: boolean = false;
	@Prop() ficheros: any;
	@Prop() filesarray: any[] = [];
	@Prop() customErrorMessage: string;
	@State() fileVersionValidation: boolean = true;
	@State() showError: boolean = false;
	@State() fileExtension: string;

	printedTitle: string;

	@Prop() extensiones_permitidas = [
		'.xlsx',
		'.xls',
		'.doc',
		'.docx',
		'.ppt',
		'.pptx',
		'.pdf',
		'.csv',
		'.swift',
		'.eml',
		'image/tif',
		'image/tiff',
		'.tif',
		'text/xml',
		'.msg',
		'.txt',
		'.jpeg',
		'.png',
		'.jpg'
	];
	@Prop() acceptedTypeFiles: string =
		'.xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf, .csv, .swift, .eml, image/tif, image/tiff, .tif, text/xml, .msg, .txt, .jpeg, .png, .jpg, .zip';

	@Prop() multiChoiceMetadata: string[] = [];

	preFillEditForm(array) {
		this.itemsAutomatic = array;
		this.selectItem =
			this.itemsAutomatic[0]?.t_type === undefined
				? this.itemsAutomatic.filter((elem) => elem.documentmetadata.t_type === 'String(ValueList)')
				: this.itemsAutomatic.filter((elem) => elem.t_type === 'String(ValueList)');
		this.inputItem =
			this.itemsAutomatic[0]?.t_type === undefined
				? this.itemsAutomatic.filter((elem) => elem.documentmetadata.t_type === 'String')
				: this.itemsAutomatic.filter((elem) => elem.t_type === 'String');
		this.dateItem =
			this.itemsAutomatic[0]?.t_type === undefined
				? this.itemsAutomatic.filter((elem) => elem.documentmetadata.t_type === 'Date')
				: this.itemsAutomatic.filter((elem) => elem.t_type === 'Date');

		this.selectItem.forEach((elem) => {
			const aux = [];
			elem.multiselect = this.multiChoiceMetadata?.includes(elem.id_doc_metadata) ? true : false;
			this.itemsAutomatic.filter((e) => {
				if (e.id_doc_metadata === elem.id_doc_metadata) {
					e.display_value_metadata ? (elem.automatic_value = e.display_value_metadata) : (elem.automatic_value = e.t_name);
					if (elem.automatic_value === undefined) {
						e.display_value_metadata
							? (elem.automatic_value = e.documentmetadata.display_value_metadata)
							: (elem.automatic_value = e.documentmetadata.t_name);
					}
					if (this.multiChoiceMetadata?.includes(elem.id_doc_metadata)) {
						elem.automatic_value = e.value_metadata;
						if (e.value_metadata && typeof e.value_metadata === 'string') {
							elem.documentmetadata.t_list_value.split('||').forEach((listValue) => {
								const labelValue = listValue.split('#')[0];
								const simbolicValue = listValue.split('#')[1];
								e.value_metadata.split(',').forEach((metadataLabel) => {
									if (metadataLabel.trim() === labelValue) {
										aux.push(simbolicValue);
									}
								});
							});
						}
					} else {
						aux.push(e.value_metadata);
					}
					this.formDataMap[elem.id_doc_metadata] = aux;
				}
			});
		});
		this.inputItem.forEach((elem) => {
			const aux = [];
			this.itemsAutomatic.filter((e) => {
				if (e.id_doc_metadata === elem.id_doc_metadata) {
					e.value_metadata ? (elem.automatic_value = e.value_metadata) : (elem.automatic_value = e.t_name);
					if (elem.automatic_value === undefined) {
						e.value_metadata
							? (elem.automatic_value = e.documentmetadata.value_metadata)
							: (elem.automatic_value = e.documentmetadata.t_name);
					}
					aux.push(e.value_metadata);
					this.formDataMap[elem.id_doc_metadata] = aux;
				}
			});
		});
		this.dateItem.forEach((elem) => {
			const aux = [];
			this.itemsAutomatic.filter((e) => {
				if (e.id_doc_metadata === elem.id_doc_metadata) {
					e.value_metadata ? (elem.automatic_value = e.value_metadata) : (elem.automatic_value = e.t_name);
					if (elem.automatic_value === undefined) {
						e.value_metadata
							? (elem.automatic_value = e.documentmetadata.value_metadata)
							: (elem.automatic_value = e.documentmetadata.t_name);
					}
					aux.push(e.value_metadata);
					this.formDataMap[elem.id_doc_metadata] = aux;
				}
			});
		});

		this.selectItem = this.removeDuplicates(this.selectItem);
		this.inputItem = this.removeDuplicates(this.inputItem);
		this.dateItem = this.removeDuplicates(this.dateItem);
		this.originFormDataMap = _.clone(this.formDataMap);
	}

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.printedTitle = this._literals.mainTitle;
		this.parseDataFile();
		this.fileExtension = this.extensionRejex.exec(this.fileName)[1];
	}

	componentDidRender() {
		if (this.checkSelecItemAux && this.selectItemAux?.length > 0) {
			this.selectItem = [...this.selectItemAux];
		}
	}

	removeMetadataDuplicates(array) {
		const hash = {};
		array = array.filter(function (current) {
			const exists = !hash[current.id];
			hash[current.id] = true;
			return exists;
		});
		return array;
	}

	removeDuplicates(array) {
		const hash = {};
		array = array.filter(function (current) {
			const exists = !hash[current.id_doc_metadata];
			hash[current.id_doc_metadata] = true;
			return exists;
		});
		return array;
	}

	toggleEditMode() {
		this.editMode = !this.editMode;
		if (this.editMode) {
			// EDIT MODE ON
			this.printedTitle = this._literals.editTitle;
		} else {
			// EDIT MODE OFF
			this.printedTitle = this._literals.mainTitle;
			// this.selectedValue = { label: "", active: false }
			// this.formDataMap = new Map();
			// this.filesarray = [];
			this.parseDataFile();
		}
	}

	eventClickDeleteInput(event, item) {
		if (event.detail.length == 0) {
			this.formDataMap[item.id_doc_metadata] = [];
			this.checkFileChangesValidation();
		}
	}

	buttonActions() {
		this.formValues.emit(this.formDataMap);
	}

	handleSelectFile(event) {
		this.fileVersionValidation = this.checkFileVersionValidation(event);
		if (this.fileVersionValidation) {
			this.numfiles = event.detail.length;
			this.ficheros = event.detail;
			this.fillFormDataMapFiles(this.ficheros, 'files');
			this.numfiles > 0 ? (this.fileSelected = true) : (this.fileSelected = false);
			this.checkFileChangesValidation();
		} else {
			this.handleErrorMessage();
		}
	}

	handleErrorMessage() {
		this.showError = true;
		setTimeout(() => {
			this.fileVersionValidation = true;
		}, 100);
		this.showErrorMessage();
	}

	showErrorMessage(elapsedTime: number = 7000) {
		setTimeout(() => {
			this.showError = false;
		}, elapsedTime);
	}

	checkFileVersionValidation(event): boolean {
		const file = event.detail;
		const checkNameValidation = this.fileName === file[0].name;
		const checkTypeValidation = this.fileExtension === file[0].extension.split('.')[1];
		return checkNameValidation && checkTypeValidation;
	}

	handleEventFormChange(event) {
		if (event && event.detail && event.detail.value && event.detail.value.length == 0) {
			this.cancelFile();
		}
		this.checkFileChangesValidation();
	}

	handleSelect(event, label, cardinality) {
		this.fillFormDataMapSelect(event, label, cardinality);
		this.checkFileChangesValidation();
	}

	handleInputOrDate(event, label) {
		this.fillFormDataMapInputOrDate(event.detail, label);
		this.checkFileChangesValidation();
	}

	fillFormDataMapFiles(event, label) {
		if (event.length > 0) {
			this.formDataMap[label] = event;
		} else {
			delete this.formDataMap[label];
		}
	}

	fillFormDataMapSelect(event, label, cardinality) {
		let arrayValues: any[] = [];
		const selectItemsCopy = [...this.selectItem];
		this.checkSelecItemAux = true;
		this.selectItemAux = [];
		if (this.formDataMap[label]) {
			const currentValue = this.formDataMap[label];
			if (cardinality === 'multi') {
				if (event.detail[0]) {
					event.detail.forEach((element) => {
						arrayValues.push(element.id);
					});
					if (arrayValues.length > 1 && arrayValues.includes('NotInformed')) {
						arrayValues.shift();
					}
					const arrayLabelsValues = arrayValues.map((value) => this.dropdownOptions[label].find((option) => option.id === value).label);
					selectItemsCopy.find((item) => item.id_doc_metadata === label).automatic_value = arrayLabelsValues.join(', ');
					selectItemsCopy.find((item) => item.id_doc_metadata === label).value_metadata = arrayLabelsValues.join(', ');
				} else {
					if (currentValue.indexOf(event.detail.id) != -1) {
						const index = currentValue.indexOf(event.detail.id, 0);
						if (index > -1) {
							currentValue.splice(index, 1);
						}
						arrayValues = currentValue;
					} else if (event.detail.id) {
						arrayValues = currentValue;
						arrayValues.push(event.detail.id);
					} else {
						arrayValues = ['NotInformed'];
						selectItemsCopy.find((item) => item.id_doc_metadata === label).automatic_value = 'Not Informed';
						selectItemsCopy.find((item) => item.id_doc_metadata === label).value_metadata = 'Not Informed';
					}
				}
			} else {
				if (currentValue != event.detail.id) {
					arrayValues.push(event.detail.id);
				} else {
					arrayValues = currentValue;
				}
			}
		} else {
			arrayValues.push(event.detail.id);
		}
		this.selectItemAux = [...selectItemsCopy];
		this.formDataMap[label] = arrayValues;
		this.checkSelecItemAux = false;
	}

	fillFormDataMapInputOrDate(event, label) {
		this.formDataMap[label] = [];
		this.formDataMap[label].push(event);
		// var arrayValues = [];
		// if (event != "") {
		//   if (this.formDataMap[label]) {
		// 	var currentValue = this.formDataMap[label];
		// 	  if (currentValue != event) {
		// 		arrayValues.push(event);
		// 	  }
		//   } else {
		// 	arrayValues.push(event);
		//   }
		//   this.formDataMap[label] = arrayValues;
		// } else {
		//   delete this.formDataMap[label];
		// }
	}

	checkFileChangesValidation() {
		this.isValidated = false;
		let isSameData: boolean = false;
		this.isValidated = this.fileSelected ? this.fileSelected : false;

		for (const property in this.formDataMap) {
			isSameData = `${property}: ${this.originFormDataMap[property]}` === `${property}: ${this.formDataMap[property]}`;
			if (!isSameData) {
				this.isValidated = this.requiredMetadata();
				return this.isValidated;
			}
		}
		return this.isValidated;
	}

	requiredMetadata() {
		this.isValidated = true;
		let anyRequired;
		if (this.itemsMetadata && this.itemsMetadata.length > 0) {
			anyRequired = this.itemsMetadata.filter((elem) => elem.required === true);
			if (anyRequired.length === 0) {
				this.isValidated = true;
			}
			this.itemsMetadata.map((elem) => {
				if (elem.documentmetadata.required === true && !this.formDataMap[elem.id_doc_metadata][0]) {
					this.isValidated = false;
				}
			});
		}
		return this.isValidated;
	}

	cancelFile() {
		this.fileSelected = false;
		if (this.ficheros) {
			this.ficheros.pop();
			this.numfiles = this.ficheros.length;
			this.fileSelected = !!this.numfiles;
			this.fillFormDataMapFiles(this.ficheros, 'files');
		}
	}

	downloadFile() {
		this.isDownloadFile.emit(this.dataInfoFile);
	}

	previewFileEmit() {
		this.previewFileClick.emit(this.dataInfoFile);
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
							icon: elem.icon,
							image: elem.image,
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

	render() {
		return (
			<section class="ecmv-details">
				<h3 class="ecmv-details__title">
					{this.printedTitle.length > 86 ? this.printedTitle.substring(0, 86) + '\n' + this.printedTitle.substring(86) : this.printedTitle}
				</h3>
				<span class="ecmv-details__label">{this.recentVersion}</span>
				{this.additionalDetailInformation && this.additionalDetailInformation.show ? (
					<div class="ecmv-details__group additional-info">
						<p class="ecmv-details__name">{this.additionalDetailInformation.title}</p>
						<ul class="additional-elements">
							{this.additionalDetailInformation.elements.map((item) =>
								item != null && item.length > 0 ? <li class="ecmv-addional-list">{item}</li> : null
							)}
						</ul>
					</div>
				) : null}
				<div class="ecmv-details__box">
					<div class="ecmv-details__file">
						<div class="ecmv-details__extension">
							<scib-ui-extension-icon fileextension={this.fileExtension}></scib-ui-extension-icon>
						</div>
						<div class="ecmv-details__group">
							<p class="ecmv-details__name">{this.fileName}</p>
							<p class="ecmv-details__meta">
								{this.fileModificated} - {this.fileSize}
							</p>
						</div>
					</div>
					<div class="ecmv-details__actions">
						{!this.editMode && this.showEdit ? (
							<scib-ui-button
								class="ui-table-button"
								type="button"
								icon="icon-edit-pencil"
								icon-left
								small
								link
								disableMinWidth
								nobackground
								onEventClick={() => this.toggleEditMode()}
							>
								{this._literals.editBtn}
							</scib-ui-button>
						) : null}
						{this.showDownload ? (
							<scib-ui-button
								class="ui-table-button"
								type="button"
								icon="icon-download"
								icon-left
								small
								link
								disableMinWidth
								nobackground
								onClick={() => this.downloadFile()}
							>
								{this._literals.downloadBtn}
							</scib-ui-button>
						) : null}
						{this.fileExtension === 'pdf' && this.showDownload ? (
							<scib-ui-button
								class="ui-table-button"
								type="button"
								icon="icon-previewDocument"
								icon-left
								small
								link
								disableMinWidth
								nobackground
								onClick={() => this.previewFileEmit()}
							>
								{this._literals.previewBtn}
							</scib-ui-button>
						) : null}
					</div>
				</div>
				<div class="body">
					{!this.editMode ? (
						<div class="static">
							{this.resultMetadata.map((item) =>
								item.valor != null && item.show ? (
									<div class="cols">
										<p class="small">{item.nombre}</p>
										<p class="big">{item.valor.toString()}</p>
									</div>
								) : null
							)}
						</div>
					) : (
						<div class="form">
							{/* <scib-ecmv-files-selector titleselector="Select or Drag Files">
								</scib-ecmv-files-selector> */}

							<div class="files-selector-style">
								<scib-molecules-upload-files
									class={{
										'div-selector__big': true,
										'div-selector__big--simple': this.ficheros && this.ficheros.length == 1
									}}
									maxfiles={this.maxfiles}
									literals={this._literals}
									allowedFilesExt={this.extensiones_permitidas}
									acceptedTypeFiles={this.acceptedTypeFiles}
									resetFiles={this.fileVersionValidation ? false : true}
									showUploadFiles={this.showUploadFiles}
									onEventFormChange={($event) => this.handleEventFormChange($event)}
									onSelectValue={($event) => this.handleSelectFile($event)}
								></scib-molecules-upload-files>
								{this.showError && <span class="files-selector-style__error">{this._literals.customErrorMessage}</span>}
							</div>

							<div class="metadata-info">
								<div class="metadatos-style">
									{this.selectItem.map((item) =>
										item.b_automatic !== undefined && !item.b_automatic ? (
											<div class="select-group-style">
												<scib-ui-select
													label={
														item.required
															? (item.documentmetadata ? item.documentmetadata.t_name : item.t_name) + ' *'
															: item.documentmetadata
															? item.documentmetadata.t_name
															: item.t_name
													}
													noResult={'No results'}
													placeholder-select={item.t_name}
													minHeight={true}
													idSelect={item.id_doc_metadata}
													valueAutoComplete={{
														name: item.automatic_value,
														apply: true,
														detail: {
															value: item.automatic_value
														}
													}}
													value={item.automatic_value}
													removedPosition={item.t_name}
													multiselectV2={item.multiselect}
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
														this.handleSelect(
															$event,
															item.documentmetadata ? item.documentmetadata.id_doc_metadata : item.id_doc_metadata,
															item.documentmetadata ? item.documentmetadata.t_cardinality : item.t_cardinality
														)
													}
												></scib-ui-select>
												{/* <scib-ui-dropdown
													onSelectValue={$event => this.handleSelect($event, item.id_doc_metadata, item.t_cardinality)}
													multipleselector={item.t_cardinality}
													metadatavalues={true}
													options={item.t_list_value}
													disabledselector={false}
													label={item.required ? item.t_name + ' *' : item.t_name}
													header={item.automatic_value}
													medium
													idselect={item.id_doc_metadata}
													selecteditem={this.selectedValue}
												></scib-ui-dropdown> */}
											</div>
										) : item.documentmetadata !== undefined &&
										  item.documentmetadata.b_automatic !== undefined &&
										  !item.documentmetadata.b_automatic ? (
											<div class="select-group-style">
												<scib-ui-select
													label={
														item.required
															? (item.documentmetadata ? item.documentmetadata.t_name : item.t_name) + ' *'
															: item.documentmetadata
															? item.documentmetadata.t_name
															: item.t_name
													}
													noResult={'No results'}
													placeholder-select={item.t_name}
													minHeight={true}
													idSelect={item.id_doc_metadata}
													valueAutoComplete={{
														name: item.automatic_value,
														apply: true,
														detail: {
															value: item.automatic_value
														}
													}}
													value={item.automatic_value}
													removedPosition={item.t_name}
													multiselectV2={item.multiselect}
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
														this.handleSelect(
															$event,
															item.documentmetadata ? item.documentmetadata.id_doc_metadata : item.id_doc_metadata,
															item.documentmetadata ? item.documentmetadata.t_cardinality : item.t_cardinality
														)
													}
												></scib-ui-select>
												{/* <scib-ui-dropdown
													onSelectValue={$event => this.handleSelect($event, item.documentmetadata.id_doc_metadata, item.documentmetadata.t_cardinality)}
													multipleselector={item.documentmetadata.t_cardinality}
													metadatavalues={true}
													options={item.documentmetadata.t_list_value}
													disabledselector={false}
													label={item.documentmetadata.required ? item.documentmetadata.t_name + ' *' : item.documentmetadata.t_name}
													header={item.automatic_value}
													medium
													idselect={item.documentmetadata.id_doc_metadata}
													selecteditem={this.selectedValue}
												></scib-ui-dropdown> */}
											</div>
										) : null
									)}
									{this.inputItem.map((item) =>
										item.b_automatic !== undefined && !item.b_automatic ? (
											item.t_name == item.automatic_value ? (
												<div class="select-group-style">
													<scib-ui-input
														label={item.required ? item.t_name + ' *' : item.t_name}
														placeholder={item.automatic_value}
														required={true}
														onEventChange={($event) => this.handleInputOrDate($event, item.id_doc_metadata)}
														medium
														disableEdit={false}
														onListEventChange={($event) => this.eventClickDeleteInput($event, item)}
													></scib-ui-input>
												</div>
											) : (
												<div class="select-group-style">
													<scib-ui-input
														label={item.required ? item.t_name + ' *' : item.t_name}
														value={item.automatic_value}
														placeholder={item.t_name}
														required={true}
														onEventChange={($event) => this.handleInputOrDate($event, item.id_doc_metadata)}
														medium
														disableEdit={false}
														onListEventChange={($event) => this.eventClickDeleteInput($event, item)}
													></scib-ui-input>
												</div>
											)
										) : item.documentmetadata !== undefined &&
										  item.documentmetadata.b_automatic !== undefined &&
										  !item.documentmetadata.b_automatic ? (
											item.documentmetadata.t_name == item.automatic_value ? (
												<div class="select-group-style">
													<scib-ui-input
														label={
															item.documentmetadata.required
																? item.documentmetadata.t_name + ' *'
																: item.documentmetadata.t_name
														}
														placeholder={item.automatic_value}
														required={true}
														onEventChange={($event) =>
															this.handleInputOrDate($event, item.documentmetadata.id_doc_metadata)
														}
														medium
														disableEdit={false}
														onListEventChange={($event) => this.eventClickDeleteInput($event, item)}
													></scib-ui-input>
												</div>
											) : (
												<div class="select-group-style">
													<scib-ui-input
														label={
															item.documentmetadata.required
																? item.documentmetadata.t_name + ' *'
																: item.documentmetadata.t_name
														}
														value={item.automatic_value}
														placeholder={item.documentmetadata.t_name}
														required={true}
														onEventChange={($event) =>
															this.handleInputOrDate($event, item.documentmetadata.id_doc_metadata)
														}
														medium
														disableEdit={false}
														onListEventChange={($event) => this.eventClickDeleteInput($event, item)}
													></scib-ui-input>
												</div>
											)
										) : null
									)}
									{this.dateItem.map((item) =>
										item.b_automatic !== undefined && !item.b_automatic ? (
											<div class="select-group-style">
												<scib-ui-date-picker
													id="prueba"
													onSelectValue={($event) => this.handleInputOrDate($event, item.id_doc_metadata)}
													label={item.required ? item.t_name + ' *' : item.t_name}
													header={item.automatic_value}
													disabledselector={false}
												></scib-ui-date-picker>
											</div>
										) : item.documentmetadata !== undefined &&
										  item.documentmetadata.b_automatic !== undefined &&
										  !item.documentmetadata.b_automatic ? (
											<div class="select-group-style">
												<scib-ui-date-picker
													id="prueba"
													onSelectValue={($event) => this.handleInputOrDate($event, item.documentmetadata.id_doc_metadata)}
													label={
														item.documentmetadata.required
															? item.documentmetadata.t_name + ' *'
															: item.documentmetadata.t_name
													}
													header={item.automatic_value}
													disabledselector={false}
												></scib-ui-date-picker>
											</div>
										) : null
									)}
								</div>
							</div>
							<footer>
								{/* <span class="required-inputs">* Required input</span> */}
								<div class="button-group">
									<div class="button-style">
										<scib-ui-button secondary onClick={() => this.toggleEditMode()}>
											{this._literals.buttoncancelname}
										</scib-ui-button>
									</div>
									{this.isValidated ? (
										<div class="button-style">
											<scib-ui-button primary onClick={() => this.buttonActions()}>
												{this._literals.buttonsavename}
											</scib-ui-button>
										</div>
									) : (
										<div class="button-style">
											<scib-ui-button primary disabled>
												{this._literals.buttonsavename}
											</scib-ui-button>
										</div>
									)}
								</div>
							</footer>
						</div>
					)}
				</div>
			</section>
		);
	}
}
