import { Component, h, Prop, EventEmitter, State, Event, Element } from '@stencil/core';
import { humanFileSize } from '../../../cdk/cdk-signature-modal/utils/utils';
import { IECMVFiles } from '../models/ecmv-files-selector.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ecmv-files-selector',
	styleUrl: 'ecmv-files-selector.scss',
	shadow: false,
	scoped: false,
})
export class ECMVFilesSelector {
	@Element() public dropArea: HTMLElement;
	@Prop({ reflect: true }) titleselector: string;

	/*Maximum number of files message*/
	@Prop({ reflect: true }) errorMaxFiles: string;

	/*Unsupported file format message*/
	@Prop({ reflect: true }) errorFormat: string;

	/** Emite el bus de eventos */
	// @Event() navigatorEvents: EventEmitter<IECMVFiles>;
	@Event() navigatorClicked: EventEmitter<IECMVFiles>;
	// @Event() selectValue: EventEmitter<any>;

	@Event({
		eventName: 'selectValue',
		bubbles: true,
		composed: true,
	})
	selectValue: EventEmitter;

	@Event() fileError: EventEmitter<any>;

	@State() public highlighted: boolean = false;
	@Prop({ reflect: true }) smallsize: boolean;
	@Prop({ reflect: true }) maxfiles: number;
	@Prop() maxSizeFiles: number = null;
	@Prop({ reflect: true }) filesarray: Array<any> = [];
	@Prop() files: Array<any> = [];
	@Prop() filesValidated: Array<any> = [];
	@Prop() totalFiles: Array<any> = [];

	@Prop() fileelemid: string = 'fileElem';
	@Prop() cardview: boolean = false;
	@State() public errorFile: boolean = false;

	componentDidLoad() {
		['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
			this.dropArea.addEventListener(eventName, this.preventDefaults, false);
			document.body.addEventListener(eventName, this.preventDefaults, false);
		});

		['dragenter', 'dragover'].forEach(eventName => {
			// this.errorFile ? this.dropArea.addEventListener(eventName, ()=> this.errorFile = true, false)
			// : this.dropArea.addEventListener(eventName, ()=> this.highlighted = true, false)
			this.dropArea.addEventListener(eventName, () => (this.highlighted = true), false);
		});

		['dragleave', 'drop', 'dragenter'].forEach(eventName => {
			// this.dropArea.addEventListener(eventName, ()=> this.errorFile = false, false)
			this.dropArea.addEventListener(eventName, () => (this.highlighted = false), false);
		});

		// this.dropArea.addEventListener('dragenter', this.maxFilesDragenter, false)
		this.dropArea.addEventListener('drop', this.handleDrop, false);
	}

	preventDefaults(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	/** Maneja el click para acceder a la modal */
	_handleClick() {
		document.getElementById(this.fileelemid).click();
		this.navigatorClicked.emit({ isClicked: true });
	}

	handleDrop = e => {
		const dataTransfer = e.dataTransfer;
		this.files = this.maxFilesAllowed(dataTransfer.files);
		const sizeError = this.maxSizeFilesAllowed(dataTransfer.files);
		if (!sizeError) {
			this.totalFiles = this.files;
			this.handleFiles(this.files);
		} else {
			this.fileError.emit('File size is larger than maxFileSize');
		}
	};

	maxFilesAllowed(files: Array<any>) {
		let auxArray = this.filesarray;
		const initiallength = auxArray.length;

		if (files.length <= this.maxfiles - this.filesarray.length) {
			return files;
		} else {
			for (let elem = this.filesarray.length; elem < this.maxfiles; elem++) {
				initiallength == 0 ? (auxArray[elem] = files[elem]) : (auxArray[elem] = files[elem - 1]);
			}
			files = auxArray;

			return files;
		}
	}

	maxSizeFilesAllowed(files: Array<any>) {
		let sizeError = false;
		if (this.maxSizeFiles == null) {
			return sizeError;
		}
		let receivedFiles = Array.from(files);

		receivedFiles.find(rf => {
			if (rf.size > this.maxSizeFiles) {
				sizeError = true;
			}
		});

		return sizeError;
	}

	handleFiles = files => {
		files = [...files];

		if (this.filesarray.length != this.maxfiles) {
			this.filesValidated = this.filesarray;
			files.forEach(file => {
				if (this.validateFile(file)) {
					this.filesValidated.push(file);
				}
			});
			this.filesarray = this.filesValidated;
		}
		this.selectValue.emit(this.filesarray);
	};

	onSelectFile(e) {
		let dataTransfer = e.currentTarget.files;
		dataTransfer = [...dataTransfer];
		dataTransfer = this.maxFilesAllowed(dataTransfer);
		if (dataTransfer && Array.isArray(dataTransfer) && dataTransfer.length) {
			dataTransfer.forEach(file => {
				if (file && !file.formatedSize) {
					file['formatedSize'] = humanFileSize(file.size, true);
				}
			});
		}
		const sizeError = this.maxSizeFilesAllowed(dataTransfer);
		if (!sizeError) {
			if (this.filesarray.length != this.maxfiles) {
				this.filesValidated = this.filesarray;
				dataTransfer.forEach(file => {
					if (this.validateFile(file)) {
						this.filesValidated.push(file);
					}
				});
				this.filesarray = this.filesValidated;
			}
			this.selectValue.emit(this.filesarray);
			e.currentTarget.value = null;
		} else {
			this.fileError.emit('File size is larger than maxFileSize');
		}
	}

	validateFile(all) {
		const extensiones_permitidas = [
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
			'.jpg',
		];
		const rutayarchivo = all.name;
		const ultimo_punto = all.name.lastIndexOf('.');
		const extension = rutayarchivo.slice(ultimo_punto, rutayarchivo.length);
		all.extension = extension;
		if (extensiones_permitidas.indexOf(extension.toLowerCase()) == -1) {
			this.errorFile = true;
			setTimeout(() => {
				this.errorFile = false;
			}, 7000);
			return false;
		}
		return true;
	}

	render() {
		return (
			<section class={{ 'ecmv-fselector': true, 'ecmv-fselector--card': this.cardview }}>
				<div
					class={{ 'ecmv-fselector__draggdrop': true, 'ecmv-fselector__draggdrop--drop': this.highlighted, 'ecmv-fselector__draggdrop--big': !this.smallsize }}
					onClick={() => this._handleClick()}
				>
					<input
						class="accessibility"
						type="file"
						id={this.fileelemid}
						multiple
						accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.pdf, .csv, .swift, .eml, image/tif, image/tiff, .tif, text/xml, .msg, .txt, image/png, image/jpeg"
						onChange={$event => this.onSelectFile($event)}
					/>
					<span class="ecmv-fselector__txt">{this.titleselector}</span>
				</div>
				{this.files.length > 10 ? <span class="ecmv-fselector__error">{this.errorMaxFiles}</span> : ''}
				{this.errorFile ? <span class="ecmv-fselector__error">{this.errorFormat}</span> : ''}
			</section>
		);
	}
}
