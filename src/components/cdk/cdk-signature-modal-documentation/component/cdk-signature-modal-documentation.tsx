import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { DocumentsData, Literals, Template } from '../models/cdk-signature-modal-documentation.model';
import { ICDKMessagesFile } from '../../../ecmv/ecmv-modal-files/models/ecmv-modal-files.model';
import { isEmpty } from 'lodash';
import { SelectedTemplate } from '../../cdk-signature-template-folder-navigation/models/cdk-signature-template-folder-navigation.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-signature-modal-documentation',
	styleUrl: 'cdk-signature-modal-documentation.scss',
	shadow: false,
	scoped: false
})
export class CdkSignatureModalDocumentation {
	$draggableList!: HTMLElement;

	templateFolderNavigation: any;
	@Element() _hostRef: HTMLElement;

	@Prop() acceptedFiles: string = '.doc, .docx, .pdf';
	@Prop() useTemplates: boolean = true;

	@Prop({ mutable: true }) loadOnlyTemplates: boolean;
	@Watch('loadOnlyTemplates') parseLoadOnlyTemplates(newValue: boolean) {
		this.loadOnlyTemplates = newValue;
	}

	@Prop() filesUploaded: Array<ICDKMessagesFile> = [];
	@State() _filesUploaded: Array<ICDKMessagesFile> = [];
	@Watch('filesUploaded') parseFilesUpdated(newFiles: Array<ICDKMessagesFile>) {
		this._filesUploaded = newFiles;
	}

	@Prop() downloadFilesUrl: Array<string> = [];
	@State() _downloadFilesUrl: Array<string> = [];
	@Watch('downloadFilesUrl') parseDownloadFilesUrl(newFiles: Array<string>) {
		this._downloadFilesUrl = newFiles;
	}

	/**
	 * Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse
	 */
	@Prop({ reflect: true }) literals: Literals | any;
	@State() _literals: Literals;
	@Watch('literals') parseLiterals(newLiterals: Literals | any) {
		if (typeof newLiterals === 'string') {
			this._literals = JSON.parse(newLiterals);
		} else {
			this._literals = newLiterals;
		}
	}
	@Prop() existData: boolean = false;
	@State() _existData: boolean;
	@Watch('existData') parseExistData(newValue: boolean) {
		this._existData = newValue;
	}

	@Prop() reset: boolean = false;
	@Watch('reset') parseResetStep(newData: boolean) {
		if (newData) {
			this.checkedFile = false;
			this._asignedTemplate = null;
			this._isAsignedTemplate = false;
			this._filesUploaded = [];
			this._downloadFilesUrl = [];
			// this._loadingTemplates = false;
			this.templateFolderNavigation.reset();
		}
	}

	// @Prop() loadingTemplates: boolean;
	// @Watch('loadingTemplates') parseLoadingTemplates(newValue: boolean) {
	// 	this._loadingTemplates = newValue;
	// 	// if (this._loadingTemplates) {
	// 	// 	this.getFolders();
	// 	// 	if (this.$folderNav) {
	// 	// 		this.$folderNav.navigateBreadcrumbs([
	// 	// 			{
	// 	// 				name: this._folder.nameFolder,
	// 	// 				id: this._folder.idFolder,
	// 	// 				tooltip: this._folder.nameFolder,
	// 	// 				active: true,
	// 	// 				position: 1,
	// 	// 				indexPosition: [0],
	// 	// 			},
	// 	// 		]);
	// 	// 	}
	// 	// }
	// }
	// @State() _loadingTemplates: boolean;

	@State() _asignedTemplate: Template;
	@State() _isAsignedTemplate: boolean = false;

	/**It's use to say if the checkbox's files is marked */
	@State() checkedFile: boolean = false;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseExistData(this.existData);
		this.parseDownloadFilesUrl(this.downloadFilesUrl);
		this.parseFilesUpdated(this.filesUploaded);
		this.parseResetStep(this.reset);
		this.parseLoadOnlyTemplates(this.loadOnlyTemplates);
		// this.parseLoadingTemplates(this.loadingTemplates);
	}

	_selectValueHandler(event: CustomEvent): void {
		if (event.detail.length > 0) {
			let files: ICDKMessagesFile[] = [];
			let urls: string[] = [];
			event.detail.forEach((item) => {
				urls.push(item.url);
				if (this._filesUploaded.some((file) => file.active === true)) {
					item.file.active = false;
					item.file.disabled = true;
				} else {
					item.file.active = false;
					item.file.disabled = false;
				}
				files.push(item.file);
			});
			this._filesUploaded = [...this._filesUploaded, ...files];
			this._downloadFilesUrl = [...this._downloadFilesUrl, ...urls];
		}
		// this._selectValueHandler()
		this.emitSelectedDocumentsData();
	}

	_handleDeleteDoc(filename, index): void {
		const filesArray: ICDKMessagesFile[] = [...this._filesUploaded];
		const urlsArray: string[] = [...this._downloadFilesUrl];
		this._filesUploaded.map((file, i) => {
			if (file.name === filename && i === index) {
				filesArray.splice(index, 1);
				urlsArray.splice(index, 1);
				if (file.active === true) {
					if (filesArray.length) {
						if (filesArray.length <= index) {
							index--;
						}
						filesArray[index].active = true;
						filesArray[index].disabled = false;
						filesArray[index].templateId = file.templateId;
						this._isAsignedTemplate = true;
						this.templateFolderNavigation.clearFolder(false);
					} else {
						this.checkedFile = false;
						file.templateId = null;
						this._asignedTemplate = null;
						this._isAsignedTemplate = false;
						this.templateFolderNavigation.clearFolder(true);
					}
				}
			}
		});
		this._filesUploaded = filesArray;
		this._downloadFilesUrl = urlsArray;
		this.emitSelectedDocumentsData();
	}

	_handleTemplateSearch(event: CustomEvent, doc: ICDKMessagesFile): void {
		const isChecked: boolean = event.detail.checkboxValue === 'checked' ? true : false;
		this.checkedFile = isChecked;
		this._filesUploaded.map((file: ICDKMessagesFile) => {
			if (this.checkedFile) {
				if (file.name === doc.name && file.size === doc.size) {
					file.active === true ? (file.active = false) : (file.active = true);
					file.disabled = false;
					if (!isEmpty(this._asignedTemplate)) {
						this._isAsignedTemplate = true;
						this.existData = false;
					}
				} else {
					file.active = false;
					file.disabled = true;
				}
			} else {
				file.active = false;
				file.disabled = false;
				this._isAsignedTemplate = false;
			}
		});
		if (!this._isAsignedTemplate && !this.checkedFile) {
			this._asignedTemplate = null;
			this.templateFolderNavigation.clearFolder(true);
			this.templateFolderNavigation.resetNavigation();
		}

		this.emitSelectedDocumentsData();
	}

	emitSelectedDocumentsData() {
		this.documentationDataEvent.emit({
			filesUploaded: this._filesUploaded,
			downloadFilesUrl: this._downloadFilesUrl,
			isAsignedTemplate: this._isAsignedTemplate,
			asignedTemplate: this._asignedTemplate,
			checkedFile: this.checkedFile
		});
		this.validationRequiredEvent.emit();
	}

	/**
	 * Descripción del evento
	 */
	@Event() validationRequiredEvent: EventEmitter<void>;
	@Event() documentationDataEvent: EventEmitter<DocumentsData>;

	render() {
		return (
			<Host class="cdk-signature-modal-documentation">
				<h2
					class={{
						'cdk-signature-modal-documentation__title': true,
						'cdk-signature-modal-documentation__title--no-selector': this.loadOnlyTemplates
					}}
				>
					{this.loadOnlyTemplates ? this._literals.dialog.documentationTemplateTitle : this._literals.dialog.documentationTitle}
				</h2>
				{!this.loadOnlyTemplates ? (
					<div class="cdk-signature-modal-documentation">
						<scib-cdk-file-selector
							maxfiles={10}
							format-file-size={true}
							accepted-type-files={this.acceptedFiles}
							literals={JSON.stringify({
								titleselector: this._literals.dialog.selectorFilesTitle,
								errorMaxFiles: this._literals.dialog.selectorFilesMaxError,
								errorFormat: this._literals.dialog.selectorFilesFormatError,
								errorDuplicate: this._literals.dialog.selectorFilesDuplicatedError,
								fileSelectedText: this._literals.dialog.selectorFilesAttached
							})}
							filesarray={this._filesUploaded}
							onCurrentUpload={(ev) => this._selectValueHandler(ev)}
						></scib-cdk-file-selector>
						{this._filesUploaded.length > 0 ? (
							<div class="cdk-signature-modal-documentation__file-container">
								<ul ref={(el) => (this.$draggableList = el as HTMLElement)} class="cdk-signature-modal-documentation__file-list">
									{this._filesUploaded.map((file, index) => (
										<li class="cdk-signature-modal-documentation__file">
											<div class="cdk-signature-modal-documentation__file-section">
												<scib-ui-extension-icon fileextension={file.extension.split('.')[1]}></scib-ui-extension-icon>
												<span class="cdk-signature-modal-documentation__file-name">
													<strong>
														<pre class="cdk-signature-modal-documentation__file-name-doc">
															{this._literals.dialog.documentTxt}&#32;
														</pre>
														{index + 1}
													</strong>{' '}
													- {file.name}
												</span>
											</div>
											<div class="cdk-signature-modal-documentation__file-section cdk-signature-modal-documentation__file-section--right">
												<scib-atoms-button
													icon="delete"
													size="s"
													level="tertiary"
													variant="icon"
													type="button"
													onClick={() => this._handleDeleteDoc(file.name, index)}
												></scib-atoms-button>
											</div>
											<div class="cdk-signature-modal-documentation__file-section cdk-signature-modal-documentation__file-section--bottom">
												{this.useTemplates && (
													<scib-ui-row class="file-section file-section__top">
														<scib-ui-v2-checkbox
															disabled={file.disabled}
															value={file.disabled ? 'indeterminate' : this.checkedFile ? 'checked' : 'unchecked'}
															label={this._literals.dialog.addTemplate}
															onValueChange={(e) => {
																this._handleTemplateSearch(e, file);
															}}
														></scib-ui-v2-checkbox>

														{file.active && this._isAsignedTemplate && (
															<scib-atoms-button
																text={this._literals.dialog.btnClearSelection}
																size="s"
																level="tertiary"
																onClick={() => {
																	file.templateId = null;
																	this._asignedTemplate = null;
																	this._isAsignedTemplate = false;
																	this.templateFolderNavigation.clearFolder(true);
																	this.emitSelectedDocumentsData();
																}}
															></scib-atoms-button>
														)}
													</scib-ui-row>
												)}

												<scib-ui-row
													class={{
														'file-section file-section__folder': true,
														active: file.active
													}}
												>
													<scib-cdk-signature-template-folder-navigation
														ref={(el) => (this.templateFolderNavigation = el)}
														literals={this._literals.dialog.folderEmptyState}
														onSelectedTemplateEvent={(selectedTemplate: CustomEvent<SelectedTemplate>) => {
															this._asignedTemplate = selectedTemplate.detail.asignedTemplate;
															this._isAsignedTemplate = true;
															this.emitSelectedDocumentsData();
														}}
													></scib-cdk-signature-template-folder-navigation>
												</scib-ui-row>
											</div>
										</li>
									))}
								</ul>
							</div>
						) : (
							<span class="cdk-signature-modal-documentation__documentation-txt">{this._literals.dialog.selectorTextDescription}</span>
						)}
					</div>
				) : (
					<scib-ui-row class="file-section file-section__folder file-section__only-folder">
						{this._isAsignedTemplate && (
							<scib-atoms-button
								text={this._literals.dialog.btnClearSelection}
								size="s"
								level="tertiary"
								onClick={() => {
									this._asignedTemplate = null;
									this._isAsignedTemplate = false;
									this.templateFolderNavigation.clearFolder(true);
									this.emitSelectedDocumentsData();
								}}
							></scib-atoms-button>
						)}
						<scib-cdk-signature-template-folder-navigation
							ref={(el) => (this.templateFolderNavigation = el)}
							literals={this._literals.dialog.folderEmptyState}
							onSelectedTemplateEvent={(selectedTemplate: CustomEvent<SelectedTemplate>) => {
								this._asignedTemplate = selectedTemplate.detail.asignedTemplate;
								this._isAsignedTemplate = true;
								this.emitSelectedDocumentsData();
							}}
						></scib-cdk-signature-template-folder-navigation>
					</scib-ui-row>
				)}
			</Host>
		);
	}
}
