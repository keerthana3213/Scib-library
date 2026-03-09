import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { each } from 'lodash';
import { ICDKMessagesFile, ICDKMessagesLiterals } from '../../cdk-messages/models/cdk-messages.model';
import { CDKMessagesSendbarError } from '../fragments/cdk-messages-sendbar-error.fragment';

/**
 * Component description
 *
 * @slot attached-bar - Attached-bar slot content
 */
@Component({
	tag: 'scib-cdk-messages-sendbar',
	styleUrl: 'cdk-messages-sendbar.scss',
	shadow: false,
	scoped: true
})
export class CDKMessagesSendbar {
	$richEditorRef!: any;
	$richEditorMobileRef!: any;
	$errorDialog!: HTMLScibUiDialogElement;

	@State() _smallScreen: boolean = false;

	@Prop() sendButtonTxt: string;
	@Prop() literals: ICDKMessagesLiterals;
	@Prop() discardButtonTxt: string;
	@Prop() activeConversationId: string;
	@Prop() richEditorPlaceholderTxt: string;
	@Prop() loading: boolean;
	@Prop() reset: boolean;
	@Prop() totalHeight: boolean = false;
	@Prop() maxHeight: number = window.innerHeight / 2 - 96; // By default Window height / 2 and subtraction buttons reply container height
	@Prop() asSubmitButton: string;
	@Prop() attachedFiles: ICDKMessagesFile[];
	@Prop() emptyHeaderFields: boolean[];
	@Prop() bodyMessage: string = '';
	@Prop() hideDiscard: boolean = false;
	@Prop() isContextualMenuOpen: boolean = false;

	@Prop() isEmployee: boolean = false;
	@Prop() openWarnDialog: boolean;
	@Prop() selectedOptionsData: any;
	@Watch('isEmployee') parseIsEmployee(newVal: boolean) {
		this._isEmployee = newVal;
		this.parseOptionbuttons();
	}
	@State() _isEmployee: boolean;

	@Watch('activeConversationId') updateValue(newId: string) {
		const draftMsg = this._drafts[newId];
		this.$richEditorRef?.setValue(draftMsg || '');
		this.$richEditorMobileRef?.setValue(draftMsg || '');
	}

	@Watch('reset') listenResetChanges(newValue: boolean) {
		if (newValue) {
			if (!this.isMobile) {
				this.$richEditorRef.setValue('');
			} else {
				this.$richEditorMobileRef.setValue('');
			}
		}
	}

	@Watch('emptyHeaderFields') updateEmptyHeaderFields(newValue: boolean[]) {
		if (newValue) {
			this._emptyHeaderFields = newValue;
		}
	}

	@Watch('maxHeight') updateMaxHeight(newValue: number) {
		if (!this.totalHeight) {
			this._maxHeight = newValue;
		}
	}

	@Watch('bodyMessage') addDefaultMessage(newValue: string) {
		this._bodyMessage = newValue;

		// this.$richEditorRef.setValue(this._bodyMessage || '');
	}
	/** Borradores de mensaje guardados en cada conversación */
	@State() _drafts: { [key: string]: string } = {};

	/** Body actual */
	@State() _currentBody: string;

	/** Nombre del fichero con error */
	@State() _fileErrorName: string;
	@State() _emptyHeaderFields: boolean[];
	@State() _maxHeight: number;
	@State() _bodyMessage: string;

	/** Evento de descartar el mensaje para volver a la vista anterior */
	@Event() eventDiscard: EventEmitter;

	/** Evento de enviar un mensaje */
	@Event() eventSend: EventEmitter<string>;

	/** Evento de enviar un mensaje */
	@Event() eventAttach: EventEmitter<File>;

	/** Evento de escribir en el mensaje */
	@Event() eventChange: EventEmitter<string>;

	/** Evento al reintentar en el mensajes */
	@Event() eventRetryFile: EventEmitter<ICDKMessagesFile>;

	/** Evento al cancelar un archivo */
	@Event() eventCancelFile: EventEmitter<ICDKMessagesFile>;

	/** Evento al descargar una conversación */
	@Event() eventDownloadConversation: EventEmitter;

	/** Evento al enviar una conversación por email */
	@Event() eventSendConversationEmail: EventEmitter;

	/*Boolean to activate multiselect listing in mobile query*/
	@Prop({ reflect: false, mutable: true }) isHideTextSend: boolean;

	/*Boolean to hide/show buttons on mobile*/
	@Prop({ reflect: false, mutable: true }) isMobile: boolean;

	@Prop({ reflect: true }) isAbsolute: boolean;

	private multiselectResponsive() {
		if (window.innerWidth <= 1215) {
			this.isHideTextSend = true;
		} else {
			this.isHideTextSend = false;
		}

		if (window.innerWidth < 1024) {
			!this.isMobile ? (this._currentBody = '') : null;
			this.isMobile = true;
			this.parseIsEmployee(this.isEmployee);
		} else {
			this.isMobile ? (this._currentBody = '') : null;
			this.isMobile = false;
			this.parseIsEmployee(this.isEmployee);
		}
	}

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.multiselectResponsive();
	}

	componentWillLoad() {
		this.updateEmptyHeaderFields(this.emptyHeaderFields);
		this.updateMaxHeight(this.maxHeight);
		this._checkWindowHeigth();
		this.addDefaultMessage(this.bodyMessage);
		this.parseIsEmployee(this.isEmployee);
		this.multiselectResponsive();
	}
	componentDidLoad() {
		if (this._bodyMessage) {
			this.$richEditorRef.setValue(this._bodyMessage || '');
			if (this.isMobile) {
				this.$richEditorMobileRef.setValue(this._bodyMessage || '');
			}
		}
	}

	@Listen('resize', { target: 'window' }) handleWindowSizeChanges() {
		this._checkWindowHeigth();
	}

	_checkWindowHeigth() {
		const smallScreen = window.innerHeight - 300;
		if (smallScreen < this.maxHeight) {
			this._maxHeight = smallScreen;
			this._smallScreen = true;
		} else if (!this.totalHeight) {
			this._maxHeight = this.maxHeight;
			this._smallScreen = false;
		}
	}

	handleEditorChanges(message?: string) {
		this._drafts = { ...this._drafts, [this.activeConversationId]: message };
		this._currentBody = message;
		this.eventChange.emit(message);
	}

	handleSend() {
		if (!this._currentBody && this.attachedFiles.length > 0) {
			this._currentBody = ' ';
		}
		this.eventSend.emit(this._currentBody);
	}

	handleAttachButtonClick() {
		let input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('id', 'file_input_1');
		input.setAttribute('className', 'accessibility');
		input.setAttribute('name', 'file_input_name_1');
		input.setAttribute('visibility', 'hidden');
		input.setAttribute(
			'accept',
			'.jpg, .jpeg, .png, .gif, .tif, .xls, .xlsx, .xlsm, .xlsb, .csv, .doc, .docx, .docm, .ppt, .pptx, .pptm, .mov, .pdf, .txt, .rtf, .odt, .avi, .wmv, .mpeg, .flv, .zip, .rar, .svg, .mp4, .sql'
		);
		input.onchange = (e) => {
			this.handleFileChanges(input, e);
		};
		input.click();
		document.body.appendChild(input);
		setTimeout(() => {
			document.body.removeChild(input);
		}, 3000);
	}

	handleOpenContextualMenu() {
		this.isContextualMenuOpen = !this.isContextualMenuOpen;
	}

	handleFileChanges(element: HTMLInputElement, ev?: Event) {
		const limitFiles = 38 * 1024 ** 2;
		const files = element.files ? element.files : (ev.target as any).files[0];
		each(files, (file) => {
			if (file?.size > limitFiles) {
				this.$errorDialog.setAttribute('open', '');
				this._fileErrorName = file.name;
			} else {
				this.eventAttach.emit(file);
			}
			element.value = '';
		});
	}

	@State() optionButtons: any = [
		{ id: 1, text: 'Download conversation', separator: false, icon: 'icon-download', eventId: 'downloadConversation' }
	];

	parseOptionbuttons() {
		if (!this.isMobile) {
			this.optionButtons = [
				{
					id: 1,
					text: this.literals?.downloadConversation || 'Download conversation',
					separator: false,
					icon: 'icon-download',
					eventId: 'downloadConversation'
				},
				{
					id: 2,
					text: this.literals?.sendConversation || 'Send conversation via email',
					separator: false,
					icon: 'icon-send',
					eventId: 'sendConversationEmail'
				}
			];
		} else {
			this.optionButtons = [
				{ id: 1, text: this.literals?.attachFileTxt || 'Attach file', separator: false, icon: 'icon-attach', eventId: 'attachFile' },
				{
					id: 2,
					text: this.literals?.downloadConversation || 'Download conversation',
					separator: false,
					icon: 'icon-download',
					eventId: 'downloadConversation'
				},
				{
					id: 3,
					text: this.literals?.sendConversation || 'Send conversation via email',
					separator: false,
					icon: 'icon-send',
					eventId: 'sendConversationEmail'
				}
			];
		}
	}

	eventOptionsClick(data) {
		const option = data.detail.eventId;
		switch (option) {
			case 'attachFile':
				this.handleAttachButtonClick();
				break;
			case 'downloadConversation':
				this.openWarnDialog = true;
				this.selectedOptionsData = data;
				break;
			case 'sendConversationEmail':
				this.eventSendConversationEmail.emit(data);
				break;
			default:
				console.error('no event matched');
				break;
		}
		this.handleOpenContextualMenu();
	}

	render() {
		const uploadingFiles = this.attachedFiles?.some((file) => file.uploading);
		const uploadFilesWithoutError = this.attachedFiles?.some((file) => file.error == null);

		return (
			<Host>
				<div class="c-sendbar">
					<div class="c-sendbar-footer">
						{this.isContextualMenuOpen ? (
							<scib-ui-options-menu
								isMobile={this.isMobile}
								class={{ '--right': this.isHideTextSend }}
								show-slot="false"
								id="1"
								buttons={this.optionButtons}
								onEventClickOptions={(data) => this.eventOptionsClick(data)}
								onEventCloseMobile={() => this.handleOpenContextualMenu()}
							></scib-ui-options-menu>
						) : null}
					</div>
					{this.isMobile ? (
						<scib-ui-rich-editor-mobile
							is-absolute={this.isAbsolute}
							class="c-rich-editor"
							name="rich-editor-body"
							ref={(el) => (this.$richEditorMobileRef = el as HTMLScibUiRichEditorMobileElement)}
							onEventChange={(event: CustomEvent) => this.handleEditorChanges(event.detail)}
							placeholder={this.richEditorPlaceholderTxt}
						>
							<scib-cdk-messages-attached-bar
								class={{ 'c-sendbar-attached-bar': true, 'c-sendbar-added-file': this.attachedFiles?.length != 0 }}
								slot="attached-bar"
								withEvents
								titleTxt={this.literals?.attachDocumentsTxt}
								files={this.attachedFiles}
								onEventRetryFile={(ev: CustomEvent) => this.eventRetryFile.emit(ev.detail)}
								onEventCancelFile={(ev: CustomEvent) => this.eventCancelFile.emit(ev.detail)}
								onUserAction={(ev: CustomEvent) => this.eventAttach.emit(ev.detail)}
							></scib-cdk-messages-attached-bar>

							<div class="add-button" slot="add-button">
								<scib-ui-button
									primary={this.isContextualMenuOpen}
									secondary={!this.isContextualMenuOpen}
									class={{ 'c-sendbar-footer-button': true, '--small': this.isHideTextSend }}
									hide-txt
									disabled={this.loading}
									onEventClick={() => (this.hideDiscard ? this.handleOpenContextualMenu() : this.handleAttachButtonClick())}
									icon={this.hideDiscard ? 'icon-add' : 'icon-attach'}
								>
									{!this.hideDiscard ? `${'[[attachDocumentsButtonTxt]]' || '[[attachDocumentsButtonTxt]]'}` : null}
									{!this.hideDiscard ? ' ' : null}
								</scib-ui-button>
							</div>

							<div class="send-button" slot="send-button">
								<scib-ui-button
									primary
									icon="icon-send"
									hideTxt
									type={this.asSubmitButton ? 'submit' : 'text'}
									loading={this.loading}
									disabled={
										this.loading ||
										(!this._currentBody?.replace(/<p>|<br>|\s|<\/p>/g, '') && !uploadFilesWithoutError) ||
										this._emptyHeaderFields?.some((field) => field === true) ||
										uploadingFiles
									}
									onEventClick={() => this.handleSend()}
								>
									{' '}
									{this.sendButtonTxt || '[[sendButtonTxt]]'}{' '}
								</scib-ui-button>
							</div>
						</scib-ui-rich-editor-mobile>
					) : (
						<scib-ui-rich-editor
							class="c-rich-editor"
							name="rich-editor-body"
							ref={(el) => (this.$richEditorRef = el as any)}
							onEventChange={(event: CustomEvent) => this.handleEditorChanges(event.detail)}
							style={{ 'max-height': this._maxHeight ? this._maxHeight + 'px' : 'auto' }}
							placeholder={this.richEditorPlaceholderTxt}
							smallScreen={this._smallScreen}
						>
							<scib-cdk-messages-attached-bar
								class="c-sendbar-attached-bar"
								slot="attached-bar"
								withEvents
								titleTxt={this.literals?.attachDocumentsTxt}
								files={this.attachedFiles}
								onEventRetryFile={(ev: CustomEvent) => this.eventRetryFile.emit(ev.detail)}
								onEventCancelFile={(ev: CustomEvent) => this.eventCancelFile.emit(ev.detail)}
							></scib-cdk-messages-attached-bar>

							<div class="c-sendbar-footer" slot="c-sendbar-footer">
								{this.hideDiscard && (
									<scib-ui-button
										primary={this.isContextualMenuOpen}
										secondary={!this.isContextualMenuOpen}
										class={{ 'c-sendbar-footer-button': true, '--small': this.isHideTextSend }}
										hide-txt
										medium
										disabled={this.loading}
										onEventClick={() => this.handleOpenContextualMenu()}
										icon="icon-menu"
									></scib-ui-button>
								)}

								{!this.isMobile && (
									<scib-ui-button
										secondary
										medium
										hide-txt
										class={{ 'c-sendbar-footer-button': true, '--small': this.isHideTextSend }}
										onEventClick={() => this.handleAttachButtonClick()}
										disabled={this.loading}
										icon="icon-attach"
									>
										{' '}
										{'[[attachDocumentsButtonTxt]]' || '[[attachDocumentsButtonTxt]]'}{' '}
									</scib-ui-button>
								)}

								{!this.hideDiscard && !this.isMobile && (
									<scib-ui-button
										secondary
										medium
										hide-txt
										icon="icon-delete"
										class={{ 'c-sendbar-footer-button --right': true, '--small': this.isHideTextSend }}
										disabled={this.loading}
										onEventClick={() => this.eventDiscard.emit()}
									>
										{' '}
										{this.discardButtonTxt || '[[discardButtonTxt]]'}{' '}
									</scib-ui-button>
								)}

								<scib-ui-button
									primary
									showTextOn="desktop"
									icon="icon-send"
									class={{
										'c-sendbar-footer-button --right-mobile': true,
										'--right': this.hideDiscard,
										'--small': this.isHideTextSend
									}}
									iconLeft
									hideTxt={this.isHideTextSend}
									medium
									type={this.asSubmitButton ? 'submit' : 'text'}
									loading={this.loading}
									disabled={
										this.loading ||
										(!this._currentBody?.replace(/<p>|<br>|\s|<\/p>/g, '') && !uploadFilesWithoutError) ||
										this._emptyHeaderFields?.some((field) => field === true) ||
										uploadingFiles
									}
									onEventClick={() => this.handleSend()}
								>
									{' '}
									{this.sendButtonTxt || '[[sendButtonTxt]]'}{' '}
								</scib-ui-button>
							</div>
						</scib-ui-rich-editor>
					)}
				</div>
				<scib-ui-dialog ref={(el) => (this.$errorDialog = el as any)}>
					<CDKMessagesSendbarError
						didntUploadTxt={this.literals?.didntUploadTxt || '[[didntUploadTxt]]'}
						maxLimitMsgTxt={this.literals?.maxLimitMsgTxt || '[[maxLimitMsgTxt]]'}
						theFileTxt={this.literals?.theFileTxt || '[[theFileTxt]]'}
						fileName={this._fileErrorName}
					/>
				</scib-ui-dialog>

				<scib-ui-dialog
					open={this.openWarnDialog}
					is-emitter
					absolute
					onEventCancelProcess={() => {
						this.openWarnDialog = false;
					}}
				>
					<div class="c-sendbar-warning-dialog">
						<h1 class="c-sendbar-warning-dialog__title">{this.literals?.warnDialogTxt}</h1>
						<p innerHTML={this.literals.warnDialogSubTxt}></p>
						<footer class="c-sendbar-warning-dialog__footer">
							<div class="c-sendbar-warning-dialog__buttons">
								<scib-ui-button
									secondary
									onClick={() => {
										this.openWarnDialog = false;
									}}
								>
									{this.literals?.closeBtnTxt}
								</scib-ui-button>

								<scib-ui-button
									primary
									onClick={() => {
										this.eventDownloadConversation.emit(this.selectedOptionsData);
										this.openWarnDialog = false;
									}}
								>
									{this.literals?.downloadConversation || 'Download conversation'}
								</scib-ui-button>
							</div>
						</footer>
					</div>
				</scib-ui-dialog>
			</Host>
		);
	}
}
