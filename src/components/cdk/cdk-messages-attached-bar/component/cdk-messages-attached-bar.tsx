import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, FunctionalComponent } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ECDKMessagesUserActions, ICDKMessagesFile } from '../../cdk-messages/models/cdk-messages.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-messages-attached-bar',
	styleUrl: 'cdk-messages-attached-bar.scss',
	shadow: false,
	scoped: true
})
export class CDKMessagesAttachedBar {
	$host!: HTMLElement;

	@Prop() withEvents: boolean;
	@Prop({ reflect: true }) iscollapse: boolean = false;
	@Prop() downloadableAndEvents: boolean;

	/** Apply specific class when component loads in cdk-ism-content */
	@Prop() islatest: boolean;
	@Watch('islatest') listenIslatestChanges(newIslatest: boolean) {
		this._islatest = newIslatest;
	}
	@State() _islatest: boolean;

	@Prop() downloadable: boolean;
	@Watch('downloadable') listenDownloadableChanges(newDownloadable: boolean) {
		this._downloadable = newDownloadable;
	}
	@State() _downloadable: boolean;

	@Prop() files: ICDKMessagesFile[] | string;
	@Watch('files') listenFilesChanges(newFiles: ICDKMessagesFile[] | string) {
		this._files = _parseProp(newFiles);
		setTimeout(() => {
			this.setAccordionHeight();
			this.scrollAttachedDocs();
		}, 0);
	}
	@State() _files: ICDKMessagesFile[];

	@Prop({ reflect: true }) titleTxt: string;
	@Prop({ reflect: true, mutable: true }) expanded: boolean = true;
	@Watch('expanded') listenExpandedChanges() {
		this.setAccordionHeight();
	}

	@Event({ bubbles: false }) eventRetryFile: EventEmitter;
	@Event({ bubbles: false }) eventCancelFile: EventEmitter;

	$contentElement!: HTMLElement;

	@State() accordionHeight: string;
	@Prop({ reflect: true, mutable: true }) numfiles: number;
	@Watch('numfiles') listenNumFilesChanges() {
		var total = this._files;
		this._files = [];
		this._files = total;
	}

	@Prop() downloadFilesUrl: string | Array<any>;
	@Watch('downloadFilesUrl') listenDownloadFilesUrl(newData: string | Array<any>) {
		this._downloadFilesUrl = _parseProp(newData);
	}
	@State() _downloadFilesUrl: Array<any>;

	@Prop() readMode: boolean = false;
	@State() _readMode: boolean;
	@Watch('readMode') setReadMode(newReadMode: boolean) {
		this._readMode = newReadMode;
	}

	/** Evento de acción del Usuario */
	@Event() userAction: EventEmitter;

	componentWillLoad() {
		this.listenDownloadFilesUrl(this.downloadFilesUrl);
		this._files = _parseProp(this.files);
		this.listenDownloadableChanges(this.downloadable);
		this.listenIslatestChanges(this.islatest);
		this.setReadMode(this.readMode);
		if (this.$contentElement) this.setAccordionHeight();
	}

	setAccordionHeight() {
		this.accordionHeight = this.expanded ? (this.$contentElement?.clientHeight || 0) + 'px' : '0px';
	}

	scrollAttachedDocs() {
		if (this.$contentElement) {
			this.$contentElement.scrollTop = this.$contentElement.clientHeight;
		}
	}

	_downloadFile(index) {
		const url = this._downloadFilesUrl[index];
		const elementLink = document.getElementById('link-' + index) as HTMLAnchorElement;
		elementLink.href = url;
		elementLink.click();
	}

	/** Fragmento de contenido de la pill */
	PillContent({ file }: { file: ICDKMessagesFile }): FunctionalComponent<{ file: ICDKMessagesFile }>[] {
		// Colores asociados a cada extensión del tipo "fichero"
		const fileColors: { [key: string]: string } = {
			xls: '#216f42',
			'.xlsx': '#216f42',
			csv: '#216f42',
			'.csv': '#216f42',
			doc: '#005298',
			'.doc': '#005298',
			docx: '#005298',
			'.docx': '#005298',
			ppt: '#ec4321',
			'.pptx': '#ec4321',
			pdf: '#c31530',
			'.pdf': '#c31530'
		};

		// Iconos asociados a cada extensión
		const icon: { [key: string]: string } = {
			jpg: 'icon-image',
			jpeg: 'icon-image',
			png: 'icon-image',
			tif: 'icon-image',
			mov: 'icon-video',
			odt: 'icon-video',
			avi: 'icon-video',
			wmv: 'icon-video',
			mpeg: 'icon-video',
			flv: 'icon-video',
			zip: 'icon-comprimir',
			rar: 'icon-comprimir'
		};

		const fileExtension: string = file.extension.toLowerCase();

		return [
			<div class="c-attachedbar-item-icon-container">
				<span
					class={{
						'c-attachedbar-item-icon u-icon': true,
						'icon-filepage': !icon[fileExtension],
						[icon[fileExtension]]: true
					}}
				></span>
				<span
					class="c-attachedbar-item-extension"
					style={{
						display: file.extension && !icon[fileExtension] ? 'block' : 'none',
						'border-color': fileColors[fileExtension],
						color: fileColors[fileExtension]
					}}
				>
					{file.extension}
				</span>
			</div>,
			<div class="c-attachedbar-item-textcontent">
				<p class="c-attachedbar-item-title">{file.name}</p>
				<p
					class={{
						'c-attachedbar-item-subtitle': true,
						'--error': Boolean(file.error)
					}}
				>
					{typeof file.error === 'string' ? file.error : file.formatedSize ? file.formatedSize : file.size}
				</p>
			</div>
		];
	}

	render() {
		const uploadingFiles = this._files?.some((file) => file.uploading);
		return (
			<Host ref={(el) => (this.$host = el as HTMLElement)} style={{ display: this._files?.length > 0 ? 'block' : 'none' }}>
				{this._files && (
					<div
						class={{
							'c-attachedbar-container--border-style': this.iscollapse,
							'c-attachedbar-container': !this.iscollapse
						}}
					>
						{/* Header */}
						<button
							aria-label={'expand'}
							type="button"
							class={{
								'c-attachedbar-header': this.iscollapse,
								'c-attachedbar-header--hidden': !this.iscollapse
							}}
							onClick={() => (this.expanded = !this.expanded)}
						>
							<p class="c-attachedbar-title">
								{this.titleTxt || '[[attachDocumentsTxt]]'} ({this._files.length})
							</p>
							<span class="c-attachedbar-chevron u-icon icon-chrevron-right"></span>
						</button>
						{this.titleTxt && (
							<span
								class={{
									hidden: this.iscollapse,
									'documents-title': !this.iscollapse
								}}
							>
								{this.titleTxt}:
							</span>
						)}
						{/* Body */}
						<div aria-hidden={!this.expanded} class="c-attachedbar-body" style={{ height: this.accordionHeight }}>
							<div class="c-attachedbar-content" ref={(el) => (this.$contentElement = el as HTMLElement)}>
								<ul
									class={{
										'c-attachedbar-list': true,
										'c-attachedbar-list-flex': this._islatest
									}}
								>
									{this._files &&
										this._files.map((file, index) => (
											<li
												class={{
													'c-attachedbar-item': true,
													'--loading': file.uploading
												}}
											>
												{file.path ? (
													((
														<a
															class="c-attachedbar-item-download"
															onClick={() => {
																this.userAction.emit({
																	type: 'download',
																	payload: file
																});
																fetch(file.path, {
																	method: 'GET',
																	credentials: 'include'
																})
																	.then((response: Response) => {
																		if (!response.ok) {
																			throw new Error(response.status.toString());
																		}
																		return response.blob();
																	})
																	.then((response) => {
																		const aElement = document.createElement('a');
																		const url = window.URL.createObjectURL(response);
																		aElement.href = url;
																		aElement.download = file.name;
																		aElement.click();
																		window.URL.revokeObjectURL(url);
																		this.userAction.emit({
																			type: 'downloadSuccess',
																			payload: file
																		});
																	})
																	.catch((err) => {
																		this.userAction.emit({
																			type: ECDKMessagesUserActions.failedDownloadAttachmentFile,
																			payload: err?.statusCode ? err?.statusCode : err
																		});
																	});
															}}
														>
															<this.PillContent file={file} />
														</a>
													) as any)
												) : (
													<span class="c-attachedbar-item-download">
														<this.PillContent file={file} />
													</span>
												)}
												{this.downloadableAndEvents === true && !this._readMode && (
													<div class="c-attachedbar-buttons-wrapper">
														<button
															class="c-attachedbar-button-download"
															type="button"
															onClick={(ev) => {
																if (!file.path) {
																	this.userAction.emit({
																		type: 'download',
																		payload: file
																	});
																	ev.stopPropagation();
																} else {
																	this._downloadFile(index);
																}
															}}
														>
															<span class="u-icon icon-download"></span>
														</button>
														<a id={'link-' + index} download={file.name} class="hidden"></a>
														{file.error ? (
															<button
																disabled={uploadingFiles}
																class="c-attachedbar-item-action"
																type="button"
																onClick={(e) => {
																	this.eventRetryFile.emit(file);
																	e.stopPropagation();
																}}
															>
																<span class="u-icon icon-retry"></span>
															</button>
														) : (
															<button
																disabled={uploadingFiles}
																class="c-attachedbar-item-action"
																type="button"
																onClick={(ev) => {
																	file.indexInFileList = index;
																	this.eventCancelFile.emit(file);
																	ev.stopPropagation();
																}}
															>
																<span class="u-icon icon-close"></span>
															</button>
														)}
													</div>
												)}
												{this.withEvents &&
													this.downloadableAndEvents !== true &&
													!this._readMode &&
													(file.error ? (
														<button
															disabled={uploadingFiles}
															class="c-attachedbar-item-action"
															type="button"
															onClick={(e) => {
																this.eventRetryFile.emit(file);
																e.stopPropagation();
															}}
														>
															<span class="u-icon icon-retry"></span>
														</button>
													) : (
														<button
															disabled={uploadingFiles}
															class="c-attachedbar-item-action"
															type="button"
															onClick={(ev) => {
																file.indexInFileList = index;
																this.eventCancelFile.emit(file);
																ev.stopPropagation();
															}}
														>
															<span class="u-icon icon-close"></span>
														</button>
													))}
												{this.withEvents && this.downloadableAndEvents !== true && (
													<div class="c-attachedbar-item-spinner"></div>
												)}
												{this._downloadable && this.downloadableAndEvents !== true && !this._readMode && (
													<div>
														<button
															class="c-attachedbar-button-download"
															type="button"
															onClick={(ev) => {
																if (!file.path) {
																	this.userAction.emit({
																		type: 'download',
																		payload: file
																	});
																	ev.stopPropagation();
																} else {
																	this._downloadFile(index);
																}
															}}
														>
															<span class="u-icon icon-download"></span>
														</button>
														<a id={'link-' + index} download={file.name} class="hidden"></a>
													</div>
												)}
											</li>
										))}
								</ul>
							</div>
						</div>
					</div>
				)}
			</Host>
		);
	}
}
