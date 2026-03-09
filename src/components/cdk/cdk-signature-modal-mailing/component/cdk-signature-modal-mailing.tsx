import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { VariantTypes } from '../../../../shared/models';
import { Literals, SignatureMessage, SignerRecipient } from '../models/cdk-signature-modal-mailing.model';
import { get } from 'lodash';
import { ICDKMessagesFile } from '../../../ecmv/ecmv-modal-files/models/ecmv-modal-files.model';
import { SignatureTypes } from '../../cdk-signature-modal/models/cdk-signature-modal.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-signature-modal-mailing',
	styleUrl: 'cdk-signature-modal-mailing.scss',
	shadow: false,
	scoped: false
})
export class CdkSignatureModalMailing {
	@Element() _hostRef: HTMLElement;

	@Prop({ reflect: true }) variant: VariantTypes = 'white';
	@Prop({ reflect: true }) selectedSignatureType: SignatureTypes;
	@Prop({ reflect: true }) daysToExpireSiganture: string;
	@Prop({ reflect: true }) filesUploaded: Array<ICDKMessagesFile>;
	@Prop({ reflect: true }) recipientsList: SignerRecipient[];
	@Prop({ reflect: true }) loadOnlyTemplates: boolean;

	/**
	 * Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse
	 */
	@Prop({ reflect: true }) literals: Literals;
	@State() _literals: Literals;
	@Watch('literals') parseLiterals(newLiterals: Literals) {
		if (typeof newLiterals === 'string') {
			this._literals = JSON.parse(newLiterals);
		} else {
			this._literals = newLiterals;
		}
	}

	@Prop({ reflect: true }) signatureMessage: SignatureMessage;
	@State() _signatureMessage: SignatureMessage;
	@Watch('signatureMessage') parseSignatureMessage(newMessage: SignatureMessage) {
		this._signatureMessage = newMessage;
	}

	@Prop() reset: boolean = false;
	@Watch('reset') parseResetStep(newData: boolean) {
		if (newData) {
			this.selectedSignatureType = null;
			this.daysToExpireSiganture = null;
			this.filesUploaded = [];
			this.recipientsList = [];
			this._signatureMessage = {
				subject: undefined,
				message: undefined
			};
		}
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseSignatureMessage(this.signatureMessage);
		this.parseResetStep(this.reset);
	}

	/**
	 * Descripción del evento
	 */
	@Event() validationRequiredEvent: EventEmitter<void>;
	@Event() mailingDataEvent: EventEmitter;

	_handleMessageSubject(ev): void {
		this._signatureMessage.subject = ev.detail;
		this.mailingDataEvent.emit(this._signatureMessage);
		this.validationRequiredEvent.emit();
	}

	_handleMessageTextarea(ev): void {
		this._signatureMessage.message = ev.detail;
		this.mailingDataEvent.emit(this._signatureMessage);
	}

	render() {
		return (
			<Host class="cdk-signature-modal-mailing">
				<h2 class="cdk-signature-modal-mailing__title">
					{!this.loadOnlyTemplates ? this._literals.dialog.confirmationTitle : this._literals.dialog.emailNotification}
				</h2>
				{!this.loadOnlyTemplates && (
					<section class="cdk-signature-modal-mailing__summary">
						<div class="cdk-signature-modal-mailing__summary-data">
							<div class="cdk-signature-modal-mailing__summary-options">
								<div class="cdk-signature-modal-mailing__summary-option">
									<span class="cdk-signature-modal-mailing__summary-title">{this._literals.dialog.resumeTitleSiganture}</span>
									<span class="cdk-signature-modal-mailing__summary-txt">{get(this.selectedSignatureType, 'label')}</span>
								</div>
								<div class="cdk-signature-modal-mailing__summary-option">
									<span class="cdk-signature-modal-mailing__summary-title">{this._literals.dialog.resumeTitleExpiry}</span>
									<span class="cdk-signature-modal-mailing__summary-txt">{this.daysToExpireSiganture}</span>
								</div>
								<div class="cdk-signature-modal-mailing__summary-option">
									<span class="cdk-signature-modal-mailing__summary-title">{this._literals.dialog.resumeTitleDoc}</span>
									<span class="cdk-signature-modal-mailing__summary-txt">{this.filesUploaded.length}</span>
								</div>
							</div>
							<div class="cdk-signature-modal-mailing__summary-files">
								<scib-cdk-messages-attached-bar
									// titleTxt={this._literals.dialog.fileSelectedText}
									// withEvents
									files={this.filesUploaded}
									numfiles={this.filesUploaded.length}
									iscollapse={false}
									// download-files-url={JSON.stringify(this._downloadFilesUrl)}
									// downloadable
									// onEventCancelFile={e => this.handleCancelUploadedFile(e)}
								></scib-cdk-messages-attached-bar>
							</div>
						</div>

						<div class="cdk-signature-modal-mailing__summary-recipients">
							<span class="cdk-signature-modal-mailing__summary-list-title">{this._literals.dialog.resumeRecipientListTitle}</span>
							<ul class="cdk-signature-modal-mailing__summary-list">
								{this.recipientsList.map((recipient) => (
									<li
										class="cdk-signature-modal-mailing__summary-list-item"
										title={recipient.typeLabel + ' - ' + recipient.name + ', ' + recipient.email}
									>
										<span>{recipient.typeLabel + ' - ' + recipient.name + ', ' + recipient.email}</span>
									</li>
								))}
							</ul>
						</div>
					</section>
				)}
				<div class="cdk-signature-modal-mailing__message">
					{!this.loadOnlyTemplates && (
						<span class="cdk-signature-modal-mailing__summary-list-title">{this._literals.dialog.resumeCustomizeMailTitle}</span>
					)}
					<scib-ui-v2-text-field
						variant="white"
						label={this._literals.dialog.resumeSubjectLabel}
						value={this._signatureMessage.subject}
						onValueChange={($event) => this._handleMessageSubject($event)}
					></scib-ui-v2-text-field>
					{this._signatureMessage?.subject?.length > 100 && (
						<span class="cdk-signature-modal-mailing__summary--error"> {this._literals.dialog.maxLengthError}</span>
					)}
					<scib-ui-v2-text-field
						id="siganture-message-textarea"
						name="siganture-message-textarea"
						variant="white"
						type="textarea"
						label={this._literals.dialog.resumeMessageLabel}
						value={this._signatureMessage.message}
						onValueChange={($event) => this._handleMessageTextarea($event)}
					></scib-ui-v2-text-field>
				</div>
			</Host>
		);
	}
}
