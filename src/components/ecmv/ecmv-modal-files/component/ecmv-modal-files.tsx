import { Component, Host, h, Prop, EventEmitter, Event, State, Watch, Method } from '@stencil/core';
import { parseProp } from '../../../../utils/helpers/common';
import { AppsEcmvFormAddlFiles } from '../../../apps/ecmv-form-add-files/component/ecmv-form-add-files';
import {
	ISaveInFNResult,
	Languages,
	ILiterals as ILiteralsAddFileForm,
	LangLiterals
} from '../../../apps/ecmv-form-add-files/models/ecmv-form-add-files.model';
import { IECMVDocumentMetadata } from '../../../apps/ecmv-form-add-files/models/ecmv-service.model';
import { base64ToFile } from '../../../cdk/cdk-signature-modal/utils/utils';

/**
 * Component description
 */
@Component({
	tag: 'scib-ecmv-modal-files',
	styleUrl: 'ecmv-modal-files.scss',
	shadow: false,
	scoped: false
})
export class ECMVModalFiles {
	formAddFilesRef: AppsEcmvFormAddlFiles;
	showedOneTime;
	//Controls if the information is to be displayed or not
	showPermissionsRequiredModal: boolean = false;

	@State() openToaster = false;
	@State() showTooltipSailpoint = false;
	@Prop() sailpointUrl: string;
	@State() addFileValid = false;
	@Prop() checkDuplicate = true;
	@Prop() readMode: boolean = false;
	@State() _readMode: boolean;
	@Watch('readMode') setReadMode(newReadMode: boolean) {
		this._readMode = newReadMode;
	}
	//

	@Prop({ reflect: true }) titleselector: string;

	@Prop() maxfiles: number;
	@Prop() maxSizeFiles: number = null;

	@Prop() open: boolean = true;
	@Watch('open') setOpen(newValue: boolean) {
		if (newValue) {
			this.getUserPreference();
		}
	}

	@Prop({ reflect: true, mutable: true }) loadingSaveAndContinue: boolean = false;

	/** Emite el bus de cerrar */
	@Event() closeEvent: EventEmitter<boolean>;
	@Event() cancelEvent: EventEmitter<boolean>;
	/** Emite el bus de eventos */

	@Event() selectFilesData: EventEmitter<any>;
	@Event() clearFilesEvent: EventEmitter<any>;
	@Event() fileError: EventEmitter<any>;
	@Event() selectAction: EventEmitter<'SaveAndClose' | 'SaveAndContinue'>;

	// Literales de la modal
	@Prop({ reflect: true }) titlemodal: string;
	@Prop({ reflect: true }) requiredinputs: string;
	@Prop({ reflect: true }) buttoncancelname: string;
	@Prop({ reflect: true }) buttonclosename: string;
	@Prop({ reflect: true }) buttoncontinuename: string;

	// Literales del modal de status
	@Prop() titlemodalstatus: string = '';
	@Prop() messagemodalstatus: string = '';
	@Prop() submessagemodalstatus: string = '';
	@Prop() openmodalstatus: boolean = false;
	@Prop() continuemodalstatus: string = '';
	@Prop() cancelmodalstatus: string = '';
	@Prop() typemodalstatus: string = '';

	@Prop() language: Languages = 'en-GB';
	@State() _language: Languages;
	@Watch('language') setLang(language: Languages) {
		this._language = language;
	}

	@Prop() literlasForm: ILiteralsAddFileForm;
	@State() _literlasForm: LangLiterals;
	@Watch('literlasForm') setLiterlasForm(literlasForm: ILiteralsAddFileForm | string) {
		const l = {};
		l[this._language] = parseProp(literlasForm);
		this._literlasForm = l;
	}

	@Prop() currentSubsidiaryId: number;
	@State() _currentSubsidiaryId: number;
	@Watch('currentSubsidiaryId') setCurrentSubsidiaryId(value: number) {
		this._currentSubsidiaryId = value;
	}

	@Prop() receiveddocs: any;
	@State() _receiveddocs: any;
	@Watch('receiveddocs') setReceiveddocs(value: any) {
		if (value?.length > 0) {
			if (value[0].base64Data) {
				let docs: File[] = [];
				value.forEach((newReceiveddoc) => {
					docs.push(base64ToFile(newReceiveddoc).file);
					if (newReceiveddoc.hideMetadata) {
						docs[docs.length - 1]['hideMetadata'] = newReceiveddoc.hideMetadata;
					}
				});
				this._receiveddocs = docs;
			} else {
				this._receiveddocs = value;
			}
		}
	}

	@Prop() documentClassSelected: string;
	@State() _documentClassSelected: string;
	@Watch('documentClassSelected') setDocumentClassSelected(value: string) {
		this._documentClassSelected = value;
	}

	@Prop() documentTypeSelected: any;
	@State() _documentTypeSelected: any;
	@Watch('documentTypeSelected') setDocumentTypeSelected(value: any) {
		this._documentTypeSelected = value;
	}

	@Prop() literalsSteps: any;
	@State() _literalsSteps: any;
	@Watch('literalsSteps') setLiteralsSteps(value: any) {
		this._literalsSteps = value;
	}

	@Prop() literalsToasterAction: string;
	@State() _literalsToasterAction: any;
	@Watch('literalsToasterAction') setLiteralsToasterAction(value: any) {
		this._literalsToasterAction = value;
	}

	@Prop() fileExtensionError: any;
	@State() _fileExtensionError: any;
	@Watch('fileExtensionError') setFileExtensionError(value: any) {
		this._fileExtensionError = value;
	}

	@Prop() multiChoiceMetadata: string[] = [];

	@Method() async clearFiles() {
		this._receiveddocs = [];
		if (this.formAddFilesRef) {
			await this.formAddFilesRef.clearFiles();
		}
		this.clearFilesEvent.emit(true);
	}

	@Method() async sendFilesToFN(formDataMap, file): Promise<ISaveInFNResult> | undefined {
		return this.formAddFilesRef?.externalSendFileToFn(formDataMap, file);
	}

	@Method() async getMetadata(): Promise<IECMVDocumentMetadata[]> {
		return this.formAddFilesRef?.getMetadata();
	}

	componentWillRender() {
		if (this.open) {
			this.showedOneTime = true;
		}

		if (this.showedOneTime && this.open === false) {
			this.formAddFilesRef.setDocAndTypeAgain();
		}
	}

	componentWillLoad() {
		this.setReadMode(this.readMode);
		this.setReceiveddocs(this.receiveddocs);
		this.setDocumentClassSelected(this.documentClassSelected);
		this.setDocumentTypeSelected(this.documentTypeSelected);
		this.setLiterlasForm(this.literlasForm);
		this.setLiteralsSteps(this.literalsSteps);
		this.setLiteralsToasterAction(this.literalsToasterAction);
		this.setFileExtensionError(this.fileExtensionError);
	}

	componentDidLoad() {
		document.addEventListener('click', this.clickOutsideModal.bind(this));
		this.getUserPreference();
	}

	clickOutsideModal(event) {
		if (event.toElement?.getAttribute('id') === 'modal') {
			this.closeEvent.emit(true);
			this.closeModal();
		}
	}

	buttonActions(action) {
		if (action === 'Cancel') {
			this.openmodalstatus = true;
			this.titlemodalstatus = 'Attention!';
			this.messagemodalstatus = 'Are you sure you want to exit?';
			this.submessagemodalstatus = 'Entered data will be lost';
			this.continuemodalstatus = 'Exit';
			this.cancelmodalstatus = 'Cancel';
			this.typemodalstatus = 'alert';
		} else if (action === 'SaveAndClose') {
			this.selectAction.emit('SaveAndClose');
			this.formAddFilesRef.sendFilesToFN(this.checkDuplicate).finally(() => {
				this.closeModal();
			});
		} else {
			this.selectAction.emit('SaveAndContinue');
			this.formAddFilesRef.sendFilesToFN(this.checkDuplicate);
		}
	}

	closeModal() {
		this._receiveddocs = [];
		if (this.formAddFilesRef) {
			this.formAddFilesRef.resetForm().finally(() => {
				this.closeEvent.emit(true);
			});
		} else {
			this.closeEvent.emit(true);
		}
	}

	clearFormAddFiles() {
		if (this.formAddFilesRef) {
			this.formAddFilesRef.clearFiles();
		}
	}

	exitModalStatus(e) {
		if (e.detail == 'cancel') {
			this.openmodalstatus = false;
		} else {
			this.openmodalstatus = false;
			this.closeModal();
		}
	}

	showPermissionsRequired(detail: boolean) {
		this.showPermissionsRequiredModal = detail;
	}

	getUserPreference() {
		this.formAddFilesRef
			?.getUserPreference()
			.then((data: boolean) => {
				this.openToaster = !data;
				this.showTooltipSailpoint = data;
			})
			.catch((e) => {
				console.error(e);
			});
	}

	handleCheckbox(e: CustomEvent) {
		const isChecked = e.detail.checkboxValue === 'checked' ? true : false;

		this.formAddFilesRef
			?.setUserPreference(isChecked)
			.then(() => {})
			.catch((e) => {
				console.error(e);
			});
	}

	render() {
		return (
			<Host>
				<div class="modal-status-style">
					<scib-ecmv-modal-status
						titleItem={this.titlemodalstatus}
						message={this.messagemodalstatus}
						submessage={this.submessagemodalstatus}
						open={this.openmodalstatus}
						buttonTextContinue={this.continuemodalstatus}
						buttonTextCancel={this.cancelmodalstatus}
						type={this.typemodalstatus}
						onClickEvent={(button) => this.exitModalStatus(button)}
					></scib-ecmv-modal-status>
				</div>
				<div id="modal" class={this.open ? 'modal-select-files modal-select-files--show' : 'modal-select-files modal-select-files--hide'}>
					<div class="modal-margin-select-files">
						<div class="div-style-header">
							<div class="div-style-header__title">
								<span>{this.titlemodal}</span>
								{this.open && this.showTooltipSailpoint && (
									<scib-atoms-tooltip-info literals-tooltip={this._literalsToasterAction.message}>
										<i class="u-icon icon-info"></i>
									</scib-atoms-tooltip-info>
								)}
							</div>
							<div
								class="div-style-header__close"
								onClick={() => {
									this.closeModal();
								}}
							>
								<i class="c-tab-icon u-icon icon-close"></i>
							</div>
						</div>
						{this.openToaster && (
							<div class="div-toaster-info-actions">
								<scib-atoms-toaster
									status="warning"
									variant="actions"
									description={this._literalsToasterAction.message}
									open={this.openToaster}
									time={-1}
								>
									<div class="toaster-info-actions" slot="actions">
										<scib-ui-v2-checkbox
											class="mdc-tutorial__checkbox"
											label={this._literalsToasterAction.doNotShowAgain}
											value="unchecked"
											onValueChange={($event) => this.handleCheckbox($event)}
										></scib-ui-v2-checkbox>
										<a id="link-go-to-sailpoint" href={this.sailpointUrl} target="_blank">
											{this._literalsToasterAction.goToSailPoint}
											<span role="image" class="u-icon icon-open-link"></span>
										</a>
									</div>
								</scib-atoms-toaster>
							</div>
						)}
						{!this.showPermissionsRequiredModal && (
							<scib-apps-ecmv-form-add-files
								ref={(ref: any) => {
									this.formAddFilesRef = ref as AppsEcmvFormAddlFiles;
								}}
								literals={this._literlasForm}
								language={this._language}
								currentSubsidiaryId={this._currentSubsidiaryId}
								maxfiles={this.maxfiles}
								maxSizeFiles={this.maxSizeFiles}
								onValid={(e) => (this.addFileValid = e.detail)}
								receiveddocs={this._receiveddocs}
								documentClassSelected={this._documentClassSelected}
								documentTypeSelected={this._documentTypeSelected}
								readMode={this._readMode}
								onShowPermissionsRequired={(event) => this.showPermissionsRequired(event.detail)}
								fileExtensionError={this._fileExtensionError}
								multiChoiceMetadata={this.multiChoiceMetadata}
							></scib-apps-ecmv-form-add-files>
						)}
						{!this.showPermissionsRequiredModal && (
							<footer class="footer-style">
								<span class="required-inputs">{this.requiredinputs}</span>
								<div class="button-group">
									{this.buttoncancelname && (
										<div class="button-style">
											<scib-ui-button
												secondary
												medium
												onClick={() => this.buttonActions('Cancel')}
												data-cy="ecm-modal-files-buttoncancel"
											>
												{this.buttoncancelname}
											</scib-ui-button>
										</div>
									)}
									{this.buttonclosename && (
										<div class="button-style">
											<scib-ui-button
												primary
												medium
												disabled={!this.addFileValid}
												onClick={() => this.buttonActions('SaveAndClose')}
												data-cy="ecm-modal-files-buttonclose"
											>
												{this.buttonclosename}
											</scib-ui-button>
										</div>
									)}
									{this.buttoncontinuename && (
										<div class="button-style">
											<scib-ui-button
												primary
												medium
												disabled={!this.addFileValid}
												loading={this.loadingSaveAndContinue}
												onClick={() => this.buttonActions('SaveAndContinue')}
												data-cy="ecm-modal-files-buttoncontinue"
											>
												{this.buttoncontinuename}
											</scib-ui-button>
										</div>
									)}
								</div>
							</footer>
						)}
						{this.showPermissionsRequiredModal && (
							<scib-molecules-step-info
								literals={this._literalsSteps.LITERALS}
								steps={this._literalsSteps.STEPS}
								icon="icon-info-circle"
							>
								<div class="permissions-required-actions" slot="actions">
									<scib-atoms-button
										text={this._literalsSteps.ACTIONS.cancel}
										size="s"
										level="secondary"
										type="button"
										onClick={() => this.buttonActions('Cancel')}
									></scib-atoms-button>
									<scib-atoms-button
										text={this._literalsSteps.ACTIONS.goToSailPoint}
										size="s"
										level="primary"
										type="button"
										onClick={() => window.open(this.sailpointUrl, '_blank')}
									></scib-atoms-button>
								</div>
							</scib-molecules-step-info>
						)}
					</div>
				</div>
			</Host>
		);
	}
}
