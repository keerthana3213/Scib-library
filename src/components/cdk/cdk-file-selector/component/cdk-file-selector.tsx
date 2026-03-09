import { formatFileSize as _formatFileSize, parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Component, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { ICDKFiles, ICDKFileSelectorLiterals, ICDKFileSelectorAlterFile } from '../models/cdk-file-selector.model';
import { cloneDeep } from 'lodash';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-file-selector',
	styleUrl: 'cdk-file-selector.scss',
	shadow: false,
	scoped: true,
})
export class CDKFileSelector {
	downloadUrlFile = [];
	extensionRejex = /(?:\.([^.]+))?$/;
	fixedDate = number => String(number).padStart(2, '0');

	@Element() public dropArea: HTMLElement;

	/** Name */
	@Prop({ reflect: true }) name: string = 'no-named-file-selector';
	/** Step Position for wizard modal form when required */
	@Prop({ reflect: true }) stepPosition?: number;
	/** Required */
	@Prop({ reflect: true }) required: boolean;
	/** Disabled */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** Size formater option */
	@Prop({ reflect: true }) formatFileSize?: boolean = false;
	@Prop({ reflect: true }) smallsize: boolean;
	@Prop({ reflect: true }) maxfiles: number;
	@Prop({ reflect: true }) filesarray: Array<any> = [];
	@Watch('filesarray') parseFileArray(newData: Array<any>) {
		this._filesArray = cloneDeep(newData);
	}
	@Watch('_filesArray') parse_FileArray(newData: Array<any>) {
		if (!!newData.length) {
			this.unSelectAllInstructions.emit();
			this._alterIndexActive = null;
		} else {
			this._alterFileList?.map(file => {
				file.disabled = false;
			});
		}
	}

	@Event() unSelectAllInstructions: EventEmitter;

	@Prop({ mutable: true }) filesValidated: Array<any> = [];
	@Prop({ reflect: true }) idelement: string = 'fileElem';
	@Prop() cardview: boolean = false;

	@Prop() showUploadFiles: boolean = false;
	@Prop() downloadFiles: boolean = false;
	@Prop() acceptedTypeFiles: string = '.xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf, .csv, .swift, .eml, image/tif, image/tiff, .tif, text/xml, .zip';
	@Prop() downloadableAndEvents: boolean = false;

	/** Literales */
	@Prop({ mutable: true, reflect: false }) literals?: any;
	@Watch('literals') parseLiterals(newLiterals: string) {
		if (typeof newLiterals == 'string') {
			try {
				this._literals = JSON.parse(newLiterals);
			} catch (e) {}
		} else {
			this._literals = newLiterals;
		}
	}
	@State() _literals: ICDKFileSelectorLiterals;

	/** Optional Alter file list functionality */
	@Prop({ reflect: true }) alterFileList: ICDKFileSelectorAlterFile[] | string;
	@Watch('alterFileList') parseAlterFileList(newData: ICDKFileSelectorAlterFile[] | string) {
		this._alterFileList = _parseProp(newData);
	}
	@State() _alterFileList: ICDKFileSelectorAlterFile[];
	@State() _alterIndexActive = null;

	/** Extensiones admitidas de los ficheros a subir */
	@Prop({ reflect: true }) allowedFilesExt: string | Array<any> = [
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
		'.zip',
	];

	@State() public _highlighted: boolean = false;
	@State() public _errorFile: boolean = false;
	@State() public _duplicatedFilename: boolean = false;
	@State() public _maxFileLimit: boolean = false;
	@State() _filesArray: any[] = [];

	@Event() eventDownloadUrl: EventEmitter;
	@Event() navigatorClicked: EventEmitter<ICDKFiles>;
	@Event({
		eventName: 'selectValue',
		bubbles: true,
		composed: true,
	})
	selectValue: EventEmitter<any>;

	@Event({
		eventName: 'currentUpload',
		bubbles: true,
		composed: true,
	})
	currentUpload: EventEmitter;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event({
		eventName: 'eventFormChange',
		bubbles: true,
		composed: true,
	})
	eventFormChange: EventEmitter;

	componentWillLoad() {
		this.parseFileArray(this.filesarray);
		this.formatSize();
		this.parseLiterals(this.literals);
		this.parseAlterFileList(this.alterFileList);
	}

	componentDidLoad() {
		['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
			this.dropArea.addEventListener(eventName, this.preventDefaults, false);
			document.body.addEventListener(eventName, this.preventDefaults, false);
		});

		['dragenter', 'dragover'].forEach(eventName => {
			this.dropArea.addEventListener(eventName, () => (this._highlighted = true), false);
		});

		['dragleave', 'drop', 'dragenter'].forEach(eventName => {
			this.dropArea.addEventListener(eventName, () => (this._highlighted = false), false);
		});
		this.eventFormChange.emit({
			name: this.name,
			value: this._filesArray,
			required: this.required,
			stepPosition: this.stepPosition,
		});
		this.dropArea.addEventListener('drop', this.handleDrop, false);
	}

	preventDefaults(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	/** Maneja el click para acceder a la modal */
	handleClick() {
		if (this.idelement) document.getElementById(this.idelement).click();
		else document.getElementsByName(this.name)[0].click();
		this.navigatorClicked.emit({ isClicked: true });
	}

	handleDrop = e => {
		const dataTransfer = e.dataTransfer;
		const files: any[] = this.maxFilesAllowed(dataTransfer.files);
		this.handleFiles(files);
	};

	handleCancelUploadedFile(e) {
		const newFilesArray = this._filesArray;
		if (e.detail.indexInFileList > -1) {
			newFilesArray.splice(e.detail.indexInFileList, 1);
		}
		this._filesArray = [...newFilesArray];
		this.eventFormChange.emit({
			name: this.name,
			value: this._filesArray,
			required: this.required,
			stepPosition: this.stepPosition,
		});
	}

	maxFilesAllowed(files: Array<any>) {
		const auxArray = cloneDeep(this._filesArray);
		const initialLength = auxArray.length;

		if (files.length <= this.maxfiles - this._filesArray.length) {
			this._maxFileLimit = false;
			return files;
		} else {
			const errorMessageDuration = 7000;
			this._maxFileLimit = true;
			setTimeout(() => {
				this._maxFileLimit = false;
			}, errorMessageDuration);
			for (let elem = this._filesArray.length; elem < this.maxfiles; elem++) {
				initialLength == 0 ? (auxArray[elem] = files[elem]) : (auxArray[elem] = files[elem - 1]);
			}
			files = auxArray;

			return files;
		}
	}

	formatSize = () => {
		if (this.formatFileSize) {
			const formatedFiles = [...this._filesArray];
			formatedFiles.map(file => {
				file.formatedSize = _formatFileSize(parseInt(file.size));
			});
			this._filesArray = formatedFiles;
		}
	};

	handleFiles = files => {
		let filesNotValid = [];
		let newValidatedFiles = [];
		if (this._filesArray.length != this.maxfiles) {
			this.filesValidated = this._filesArray;
			if (!Array.isArray(files)) {
				files = [...files];
			}
			files.forEach(file => {
				if (this.validateFile(file)) {
					this.filesValidated.push(file);
				} else {
					filesNotValid.push(file);
				}
			});
			newValidatedFiles = files.filter(file => {
				return !filesNotValid.includes(file);
			});
			this._filesArray = this.filesValidated;
		} else {
			newValidatedFiles = [];
		}
		this.formatSize();
		this.selectValue.emit(this._filesArray);
		this.eventFormChange.emit({
			name: this.name,
			value: this._filesArray,
			required: this.required,
			stepPosition: this.stepPosition,
		});

		this.emitCurrentUploads(newValidatedFiles);
	};

	onSelectFile(e) {
		this.downloadUrlFile = [];
		var dataTransfer = e.currentTarget.files;
		dataTransfer = [...dataTransfer];
		dataTransfer = this.maxFilesAllowed(dataTransfer);
		let filesNotValid = [];
		let newValidatedFiles = [];
		if (this._filesArray.length != this.maxfiles) {
			this.filesValidated = this._filesArray;
			dataTransfer.forEach(file => {
				if (this.validateFile(file)) {
					this.filesValidated.push(file);
					this.downloadUrlFile.push(URL.createObjectURL(file));
				} else {
					filesNotValid.push(file);
				}
			});
			this._filesArray = this.filesValidated;
			newValidatedFiles = dataTransfer.filter(file => {
				return !filesNotValid.includes(file);
			});
		} else {
			newValidatedFiles = [];
			// this._filesArray = [];
		}
		this.formatSize();
		this.selectValue.emit(this._filesArray);
		this.eventFormChange.emit({
			name: this.name,
			value: this._filesArray,
			required: this.required,
			stepPosition: this.stepPosition,
		});
		this.eventDownloadUrl.emit(this.downloadUrlFile);
		this.emitCurrentUploads(newValidatedFiles);
	}

	emitCurrentUploads(files) {
		let currentUploadsToEmit = [];
		if (files.length <= this.maxfiles) {
			for (const file of files) {
				currentUploadsToEmit.push({ file, url: URL.createObjectURL(file) });
			}
			this.currentUpload.emit(currentUploadsToEmit);
		}
	}

	validateFile(all) {
		var extensiones_permitidas = this.allowedFilesExt;
		var rutayarchivo = all.name;
		var ultimo_punto = all.name.lastIndexOf('.');
		var extension = rutayarchivo.slice(ultimo_punto, rutayarchivo.length);

		const errorMessageDuration = 7000;
		all.extension = extension;
		if (extensiones_permitidas.indexOf(extension.toLowerCase()) == -1) {
			this._errorFile = true;
			setTimeout(() => {
				this._errorFile = false;
			}, errorMessageDuration);
			return false;
		}

		this._duplicatedFilename = this.filesValidated.some(file => {
			return all.name === file.name;
		});
		if (this._duplicatedFilename) {
			setTimeout(() => {
				this._duplicatedFilename = false;
			}, errorMessageDuration);
			return false;
		}

		return true;
	}

	render() {
		return (
			<scib-ui-wrapper>
				<h3 class="cdk-fselector__title">
					<strong>{this._literals.fileListTitle}</strong>
				</h3>
				{!!this._alterFileList &&
					this._alterFileList.map((file, index) => (
						<scib-ui-row>
							<scib-ui-column colLg={0.3} colXs={0.3}>
								<scib-ui-checkbox
									isDisabled={this._filesArray.length > 0 || (this._alterIndexActive !== null && this._alterIndexActive !== index)}
									name={file.id.toString()}
									checked={file.checked}
									paddingBottom={true}
									onEventFormChange={e => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onCheckboxChange={e => {
										e.preventDefault();
										e.stopPropagation();
										if (e.detail) {
											this._alterIndexActive = index;
										} else {
											this._alterIndexActive = null;
										}
										this._alterFileList = [...this._alterFileList];
										this.eventFormChange.emit({
											name: this.name,
											value:
												this._alterIndexActive || this._alterIndexActive === 0
													? [
															{
																id: file.path.toString(),
																extension: `.${this.extensionRejex.exec(file.name)[1]}`,
																lastModified: new Date(file.updated_at).getTime(),
																lastModifiedDate: file.updated_at,
																name: file.name,
																size: file.size,
																type: file.mime_type,
																webkitRelativePath: '',
															},
													  ]
													: [],
											required: this.required,
											stepPosition: this.stepPosition,
										});
									}}
								></scib-ui-checkbox>
							</scib-ui-column>
							<scib-ui-column colLg={5.7} colXs={5.7}>
								<scib-ui-file-history
									literals={{ buttonLabelList: [this._literals.download] }}
									data={{
										id: file.path.toString(),
										fileName: file.name,
										fileExtension: this.extensionRejex.exec(file.name)[1],
										attributeList: [
											`${new Intl.DateTimeFormat('es-ES').format(Date.parse(file.updated_at))}`,
											`${this.fixedDate(new Date(Date.parse(file.updated_at)).getHours())}:${this.fixedDate(
												new Date(Date.parse(file.updated_at)).getMinutes(),
											)} | ${_formatFileSize(file.size).toString()}`,
										],
										buttonList: [
											{
												eventName: 'download',
												iconName: 'icon-download',
											},
										],
									}}
								></scib-ui-file-history>
							</scib-ui-column>
						</scib-ui-row>
					))}
				<scib-ui-row>
					<scib-ui-column colLg={this.showUploadFiles && this._filesArray.length > 0 ? 3 : 6}>
						{this._literals.labelSelector !== '' && (
							<div class="c-label sc-scib-ui-dropdown">
								<span class="sc-scib-ui-dropdown">{this._literals.labelSelector}</span>
							</div>
						)}
						<section
							class={{
								'cdk-fselector': true,
								'cdk-fselector--card': this.cardview,
								'cdk-fselector--disabled': this.disabled,
							}}
						>
							<div
								class={{
									'cdk-fselector__draggdrop': true,
									'cdk-fselector__draggdrop--drop': this._highlighted,
									'cdk-fselector__draggdrop--big': !this.smallsize,
								}}
								onClick={() => this.handleClick()}
							>
								<input
									class="accessibility"
									type="file"
									id={this.idelement}
									multiple
									accept={this.acceptedTypeFiles}
									onClick={$event => (($event.target as HTMLInputElement).value = null)}
									onChange={$event => this.onSelectFile($event)}
									name={this.name}
									disabled={this.disabled}
								/>
								<span
									class={{
										'cdk-fselector__txt': true,
										'cdk-fselector__txt--disabled': this.disabled,
									}}
								>
									<div>{this._literals.titleselector}</div>
								</span>
							</div>
							{this._maxFileLimit && <span class="cdk-fselector__error">{this._literals.errorMaxFiles}</span>}
							{this._errorFile && <span class="cdk-fselector__error">{this._literals.errorFormat}</span>}
							{this._duplicatedFilename && <span class="cdk-fselector__error">{this._literals.errorDuplicate}</span>}
						</section>
					</scib-ui-column>
					{this.showUploadFiles && this._filesArray.length > 0 && (
						<scib-ui-column colLg={3}>
							<scib-cdk-messages-attached-bar
								titleTxt={this._literals.fileSelectedText}
								withEvents={this.downloadableAndEvents ? this.downloadableAndEvents : !this.downloadFiles}
								files={this._filesArray}
								numfiles={this._filesArray.length}
								iscollapse={false}
								onEventCancelFile={e => this.handleCancelUploadedFile(e)}
								downloadable={this.downloadFiles}
								downloadFilesUrl={this.downloadFiles ? this.downloadUrlFile : []}
								downloadableAndEvents={this.downloadableAndEvents}
							></scib-cdk-messages-attached-bar>
						</scib-ui-column>
					)}
				</scib-ui-row>
			</scib-ui-wrapper>
		);
	}
}
