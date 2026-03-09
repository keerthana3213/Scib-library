import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { cloneDeep, compact, isEmpty, isString } from 'lodash';
import { CommonSizeTypes, StyleVariant } from '../../../../shared/models';
import { formatFileSize as _formatFileSize, parseProp } from '../../../../utils/helpers/common';
import { MoleculesUploadFilesErrorsContent } from '../fragments/upload-files-errors-content.fragment';
import { MoleculesUploadFilesMinimalVariant } from '../fragments/upload-files-minimal-variant.fragment';
import { MoleculesUploadFilesStandardVariant } from '../fragments/upload-files-standard-variant.fragment';
import { ICDKFiles, IDocumentPreviewFile, ILiterals, LayoutMode } from '../models/upload-files.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-molecules-upload-files',
	styleUrl: 'upload-files.scss',
	shadow: true
})
export class MoleculesUploadFiles {
	downloadUrlFile = [];
	extensionRejex = /(?:\.([^.]+))?$/;
	fixedDate = (number) => String(number).padStart(2, '0');

	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ mutable: true }) styleVariant: StyleVariant = 'standard';

	/**
	 *
	 */
	@Prop({ mutable: true }) size: CommonSizeTypes = 'm';

	/**
	 * Name
	 */
	@Prop({ reflect: true, mutable: true }) name: string = 'no-named-file-selector';

	/**
	 * Required
	 */
	@Prop({ reflect: true, mutable: true }) required: boolean;

	/**
	 * Controls the layout mode of the document cards:
	 * - rows: Cards will flow in rows (one after another, default)
	 * - columns: Cards will be displayed in two columns
	 */
	@Prop({ mutable: true }) layoutMode: LayoutMode = 'columns';

	/**
	 * Size formater option
	 */
	@Prop({ mutable: true }) formatFileSize?: boolean = false;

	/**
	 *
	 */
	@Prop({ mutable: true }) maxfiles: number;

	/**
	 * Tamaño máximo del fichero expresado en MB
	 */
	@Prop({ mutable: true }) maxsize: number;

	/**
	 *
	 */
	@Prop({ mutable: true }) filesValidated: Array<any> = [];

	/**
	 *
	 */
	@Prop({ mutable: true }) acceptedTypeFiles: string =
		'.xlsx, .xls, .doc, .ppt, .pptx, .pdf, .csv, .swift, .eml, image/tif, image/tiff, .tif, text/xml, .zip';

	/**
	 *
	 */
	@Prop({ mutable: true }) idelement: string = 'fileElem';

	/**
	 *
	 */
	@Prop({ mutable: true }) showUploadFiles: boolean = false;

	/**
	 * If you want to download the initial files must be contain the url field
	 */
	@Prop({ mutable: true }) autoDownloadFiles: boolean = false;
	@Watch('autoDownloadFiles') _handlerAutoDownloadFiles(newValue: any) {
		this.autoDownloadFiles = !!newValue;
		this.$filesArray = this.$filesArray.map((file) => {
			file['downloable'] = this.autoDownloadFiles;
			if (this.autoDownloadFiles && file instanceof File) {
				file['url'] = URL.createObjectURL(file);
			} else if (isEmpty(file['url'])) {
				const newFile = new File([file.file], file.name, { type: file.type });
				const blob = new Blob([newFile], { type: newFile.type });
				file['url'] = URL.createObjectURL(blob);
			}
			return file;
		});
	}

	/**
	 * If you want to show/hide the remove file option
	 */
	@Prop({ mutable: true }) disableRemoveFile: boolean = false;
	@Watch('disableRemoveFile') _handlerdisableRemoveFile(newValue: any) {
		this.disableRemoveFile = !!newValue;
		this.$filesArray = this.$filesArray.map((file) => {
			file['disableRemoveFile'] = this.disableRemoveFile;
			return file;
		});
	}

	/**
	 *
	 */
	@Prop({ mutable: true }) disabled: boolean = false;

	/**
	 *
	 */
	@Prop({ mutable: true }) collapseLimit: number;

	/**
	 * Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse
	 */
	@Prop({ mutable: true }) literals: ILiterals | string;
	@State() $literals: ILiterals;
	@Watch('literals') parseLiterals(newValue: ILiterals | string) {
		this.$literals = parseProp(newValue);
	}

	/**
	 * Extensiones admitidas de los ficheros a subir
	 */
	@Prop({ mutable: true }) allowedFilesExt: string | string[];
	@State() $allowedFilesExt: string[];
	@Watch('allowedFilesExt') _handlerAllowedFilesExt(newExtensions: string | string[]) {
		const _extensions = parseProp(newExtensions, []);
		this.$allowedFilesExt = (isString(_extensions) ? _extensions.split(',') : _extensions).map((item) => item.trim().toLowerCase());
	}

	/**
	 * Archivos cargados al inicio por defecto
	 */
	@Prop({ reflect: true, mutable: true }) initialfiles: IDocumentPreviewFile[] | string;
	@Watch('initialfiles') _handlerInitialfiles(newValue: IDocumentPreviewFile[] | string) {
		this.reset();
		parseProp(newValue, []).forEach((file) => {
			this.onSelectFile({ currentTarget: { files: [file] } });
		});
	}

	/**
	 * DEPRECATED -> Use reset method
	 */
	@Prop({ mutable: true }) resetFiles: boolean = false;
	@Watch('resetFiles') _handlerResetFiles(newValue: any) {
		if (newValue === true) {
			this.reset();
		}
	}

	/**
	 *
	 */
	@State() $highlighted: boolean = false;

	/**
	 *
	 */
	@State() $errorFile: boolean = false;

	/**
	 *
	 */
	@State() $errorSize: boolean = false;

	/**
	 *
	 */
	@State() $duplicatedFilename: boolean = false;

	/**
	 *
	 */
	@State() $maxFileLimit: boolean = false;

	/**
	 *
	 */
	@State() $maxFileDisabled: boolean = false;

	/**
	 *
	 */
	@State() $filesArray: any[] = [];

	/**
	 *
	 */
	@Event() eventDownloadUrl: EventEmitter;

	/**
	 *
	 */
	@Event() navigatorClicked: EventEmitter<ICDKFiles>;

	/**
	 *
	 */
	@Event() selectValue: EventEmitter<any>;

	/**
	 *
	 */
	@Event() currentUpload: EventEmitter;

	/**
	 * Evento emitido al cambiar el valor para formulario
	 */
	@Event() eventFormChange: EventEmitter;

	/**
	 * This event emit when download button is clicked
	 */
	@Event() downloadFile: EventEmitter;

	/**
	 *
	 */
	@Method() async reset() {
		this.$filesArray = [];
		this.$maxFileDisabled = this.$filesArray.length >= this.maxfiles;
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this.formatSize();
		this.parseLiterals(this.literals);
		this._handlerInitialfiles(this.initialfiles);
		this._handlerAutoDownloadFiles(this.autoDownloadFiles);
		this._handlerAllowedFilesExt(this.allowedFilesExt);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		if (this.styleVariant !== 'minimal' && !this.disabled && !this.$maxFileDisabled) {
			['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
				this._hostRef.addEventListener(eventName, this.preventDefaults, false);
				document.body.addEventListener(eventName, this.preventDefaults, false);
			});

			['dragenter', 'dragover'].forEach((eventName) => {
				this._hostRef.addEventListener(eventName, () => (this.$highlighted = true), false);
			});

			['dragleave', 'drop', 'dragenter'].forEach((eventName) => {
				this._hostRef.addEventListener(eventName, () => (this.$highlighted = false), false);
			});
			this.eventFormChange.emit({
				name: this.name,
				value: this.$filesArray,
				required: this.required
			});
			this._hostRef.addEventListener('drop', this.handleDrop, false);
		}
	}

	/**
	 *
	 * @param event
	 */
	preventDefaults(event) {
		event?.preventDefault();
		event?.stopPropagation();
	}

	/**
	 * Maneja el click para acceder a la modal
	 */
	handleClick() {
		if (this.idelement) {
			this._hostRef.shadowRoot.getElementById(this.idelement).click();
		}
		this.navigatorClicked.emit({ isClicked: true });
	}

	/**
	 *
	 * @param event
	 */
	handleDrop = (event) => {
		const dataTransfer = event.dataTransfer;
		const files: any[] = this.maxFilesAllowed(dataTransfer.files);
		this.handleFiles(files);
	};

	/**
	 *
	 * @param event
	 */
	handleUserActionFile(event) {
		const newFilesArray = this.$filesArray;
		const { detail } = event;
		const { data } = detail;
		switch (detail.actionType) {
			case 'cancel':
				if (data.indexInFileList > -1) {
					newFilesArray.splice(data.indexInFileList, 1);
				}
				this.$filesArray = [...newFilesArray];
				this.$maxFileDisabled = this.$filesArray.length >= this.maxfiles;
				this.eventFormChange.emit({
					name: this.name,
					value: this.$filesArray,
					required: this.required
				});
				break;
			case 'download':
				this.downloadFile.emit(data);

				const link = document.createElement('a');
				link.href = data.url;
				link.download = data.name;
				link.click();

				break;

			default:
		}
	}

	/**
	 *
	 * @param files
	 */
	maxFilesAllowed(files: Array<any>) {
		const auxArray = cloneDeep(this.$filesArray);
		const initialLength = auxArray.length;
		this.$maxFileDisabled = files.length >= this.maxfiles - this.$filesArray.length;
		if (files.length <= this.maxfiles - this.$filesArray.length) {
			this.$maxFileLimit = false;
			return files;
		} else {
			const errorMessageDuration = 7000;
			this.$maxFileLimit = true;
			setTimeout(() => {
				this.$maxFileLimit = false;
			}, errorMessageDuration);
			for (let elem = this.$filesArray.length; elem < this.maxfiles; elem++) {
				initialLength == 0 ? (auxArray[elem] = files[elem]) : (auxArray[elem] = files[elem - 1]);
			}
			files = auxArray;
			return compact(files);
		}
	}

	/**
	 *
	 */
	formatSize = () => {
		if (this.formatFileSize) {
			const formatedFiles = [...this.$filesArray];
			formatedFiles.forEach((file) => {
				file.formatedSize = _formatFileSize(parseInt(file.size));
			});
			this.$filesArray = formatedFiles;
		}
	};

	/**
	 *
	 * @param files
	 */
	handleFiles = (files) => {
		let filesNotValid = [];
		let newValidatedFiles = [];
		if (this.$filesArray.length != this.maxfiles) {
			this.filesValidated = this.$filesArray;
			if (!Array.isArray(files)) {
				files = [...files];
			}
			files.forEach((file) => {
				if (this.validateFile(file)) {
					this.filesValidated.push(file);
				} else {
					filesNotValid.push(file);
				}
			});
			this.$filesArray = this.filesValidated;
			this.$maxFileDisabled = this.$filesArray.length >= this.maxfiles;
			newValidatedFiles = this.$filesArray.filter((file) => {
				return !filesNotValid.includes(file);
			});
		} else {
			newValidatedFiles = [];
		}
		this.formatSize();
		this.selectValue.emit(this.$filesArray);
		this.eventFormChange.emit({
			name: this.name,
			value: this.$filesArray,
			required: this.required
		});

		this.emitCurrentUploads(newValidatedFiles);
	};

	/**
	 *
	 * @param event
	 */
	onSelectFile(event) {
		this.downloadUrlFile = [];
		const { currentTarget } = event;
		let dataTransfer = currentTarget?.files || [];
		dataTransfer = [...dataTransfer];
		dataTransfer = this.maxFilesAllowed(dataTransfer);
		let filesNotValid = [];
		let newValidatedFiles = [];
		if (this.$filesArray.length != this.maxfiles) {
			this.filesValidated = this.$filesArray;
			dataTransfer.forEach((file) => {
				if (this.validateFile(file)) {
					file['downloable'] = this.autoDownloadFiles;
					file['disableRemoveFile'] = this.disableRemoveFile;
					this.filesValidated.push(file);
					let url = file['url'] || '';
					if (file instanceof File) {
						url = URL.createObjectURL(file);
						this.downloadUrlFile.push(url);
					} else if (isEmpty(url)) {
						const blob = new Blob([file.file], { type: file.type });
						url = URL.createObjectURL(blob);
					}
					if (this.autoDownloadFiles) {
						file['url'] = url;
					}
				} else {
					filesNotValid.push(file);
				}
			});
			this.$filesArray = this.filesValidated;
			this.$maxFileDisabled = this.$filesArray.length >= this.maxfiles;
			newValidatedFiles = dataTransfer.filter((file) => {
				return !filesNotValid.includes(file);
			});
		} else {
			newValidatedFiles = [];
		}
		this.formatSize();
		this.selectValue.emit(this.$filesArray);
		this.eventFormChange.emit({
			name: this.name,
			value: this.$filesArray,
			required: this.required
		});
		this.eventDownloadUrl.emit(this.downloadUrlFile);
		this.emitCurrentUploads(newValidatedFiles);
	}

	/**
	 *
	 * @param files
	 */
	emitCurrentUploads(files) {
		let currentUploadsToEmit = [];
		if (files.length <= this.maxfiles) {
			for (const file of files) {
				if (file instanceof File) {
					currentUploadsToEmit.push({ file, url: URL.createObjectURL(file) });
				}
			}
			this.currentUpload.emit(currentUploadsToEmit);
		}
	}

	/**
	 *
	 * @param all
	 */
	validateFile(all) {
		if (this.disabled) return false;
		const rutayarchivo = all.name;
		const ultimo_punto = all.name.lastIndexOf('.');
		const extension = rutayarchivo.slice(ultimo_punto, rutayarchivo.length);

		const errorMessageDuration = 7000;
		all.extension = extension;

		if (this.$allowedFilesExt && this.$allowedFilesExt.indexOf(extension.toLowerCase()) < 0) {
			this.$errorFile = true;
			setTimeout(() => {
				this.$errorFile = false;
			}, errorMessageDuration);
			return false;
		}

		this.$duplicatedFilename = this.filesValidated.some((file) => {
			return all.name === file.name;
		});
		if (this.$duplicatedFilename) {
			setTimeout(() => {
				this.$duplicatedFilename = false;
			}, errorMessageDuration);
			return false;
		}

		const maxsize: number = this.maxsize ? this.maxsize * 1024 * 1024 : 0;
		if (maxsize > 0 && parseInt(all.size) > maxsize) {
			this.$errorSize = true;
			setTimeout(() => {
				this.$errorSize = false;
			}, errorMessageDuration);
			return false;
		}

		return true;
	}

	/**
	 *
	 */
	renderStandardVariant() {
		return (
			<MoleculesUploadFilesStandardVariant
				maxFileLimit={this.$maxFileLimit}
				errorFile={this.$errorFile}
				duplicatedFilename={this.$duplicatedFilename}
				errorSize={this.$errorSize}
				literals={this.$literals}
				handleClick={this.handleClick.bind(this)}
				showUploadFiles={this.showUploadFiles}
				filesArray={this.$filesArray}
				idelement={this.idelement}
				acceptedTypeFiles={this.acceptedTypeFiles}
				onSelectFile={this.onSelectFile.bind(this)}
				name={this.name}
				highlighted={this.$highlighted}
				disabled={this.disabled || this.$maxFileDisabled}
			></MoleculesUploadFilesStandardVariant>
		);
	}

	/**
	 *
	 */
	renderMinimalVariant() {
		return (
			<MoleculesUploadFilesMinimalVariant
				literals={this.$literals}
				handleClick={this.handleClick.bind(this)}
				idelement={this.idelement}
				acceptedTypeFiles={this.acceptedTypeFiles}
				onSelectFile={this.onSelectFile.bind(this)}
				name={this.name}
				disabled={this.disabled || this.$maxFileDisabled}
			></MoleculesUploadFilesMinimalVariant>
		);
	}

	/**
	 *
	 */
	renderByStyleVariant() {
		let content;
		switch (this.styleVariant) {
			case 'minimal':
				content = this.renderMinimalVariant();
				break;
			default:
				content = this.renderStandardVariant();
				break;
		}
		return content;
	}

	render() {
		return (
			<Host>
				<scib-ui-wrapper>
					<scib-ui-row>
						{this.$literals.fileListTitle !== '' && (
							<h3 class="upload-files__title">
								<strong>{this.$literals.fileListTitle}</strong>
							</h3>
						)}
						<div class={{ 'upload-files__container': true, '--layout-mode': true, [`--${this.layoutMode}`]: true }}>
							<div class="upload-files__controls-container">{this.renderByStyleVariant()}</div>
							{this.showUploadFiles && this.$filesArray.length > 0 && (
								<div class="upload-files__preview-container">
									<scib-molecules-document-preview
										styleVariant={this.styleVariant}
										files={this.$filesArray}
										onUserAction={(e) => this.handleUserActionFile(e)}
										collapseLimit={this.collapseLimit}
										literals={this.$literals?.documentPreview}
										layoutMode={this.layoutMode}
									></scib-molecules-document-preview>
								</div>
							)}
						</div>
						{this.styleVariant === 'minimal' && (
							<div class="upload-files__errors-container">
								<MoleculesUploadFilesErrorsContent
									styleVariant={this.styleVariant}
									maxFileLimit={this.$maxFileLimit}
									errorFile={this.$errorFile}
									duplicatedFilename={this.$duplicatedFilename}
									errorSize={this.$errorSize}
									literals={this.$literals}
									disabled={this.disabled}
								></MoleculesUploadFilesErrorsContent>
							</div>
						)}
					</scib-ui-row>
				</scib-ui-wrapper>
			</Host>
		);
	}
}
