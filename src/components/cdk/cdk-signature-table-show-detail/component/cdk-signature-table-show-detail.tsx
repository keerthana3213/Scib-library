import {
	CDKISignatureTableEnvelope,
	CDKISignatureTableEnvelopeDocument,
	CDKISignatureTableEnvelopeRecipient,
	CDKISignatureTableEnvelopeStatus,
	CDKISignatureTableLiterals,
	CDKISignatureTableRecipientStatus,
	EditRecipientEmail
} from '../models/cdk-signature-table-show-detail.model';
import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element, Listen } from '@stencil/core';
import { parseProp as _parseProp, addDays as _addDays } from '../../../../utils/helpers/common';
import { IUIFileHistoryData, IUIFileHistoryLiterals } from '../../../ui/ui-file-history/models/ui-file-history.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-signature-table-show-detail',
	styleUrl: 'cdk-signature-table-show-detail.scss',
	shadow: true
})
export class CDKSignatureTableShowDetail {
	@Element() _hostRef: HTMLElement;

	resumeDataHtml: HTMLDivElement;
	signers: CDKISignatureTableEnvelopeRecipient[] = [];
	carbonCopies: CDKISignatureTableEnvelopeRecipient[] = [];
	documents: CDKISignatureTableEnvelopeDocument[] = [];

	@Prop({ reflect: false }) envelope: CDKISignatureTableEnvelope | string;
	@Watch('envelope') parseEnvelope(newVal: CDKISignatureTableEnvelope | string) {
		const envelope = _parseProp(newVal);
		this.signers = [];
		this.carbonCopies = [];
		this.documents = [];
		if (envelope) {
			this.tooltipTeam = envelope.team;
			this.tooltipCeco = envelope.ceco;
			this.tooltipSenderName = envelope.senderName;
			this.tooltipSignatureType = envelope.signatureTypeId?.name;
			if (Array.isArray(envelope.envelopeRecipient)) {
				envelope.envelopeRecipient.forEach((recipient) => {
					if (recipient.type === 'signer') {
						this.signers.push(recipient);
					} else {
						this.carbonCopies.push(recipient);
					}
				});
			}

			if (Array.isArray(envelope.envelopeDocument)) {
				envelope.envelopeDocument.map((document) => {
					this.documents.push(document);
				});
			}
		}

		this._envelope = envelope;
	}
	@State() _envelope: CDKISignatureTableEnvelope;

	@Prop() literals: CDKISignatureTableLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: CDKISignatureTableLiterals | string) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: CDKISignatureTableLiterals;

	@Prop() withoutActions: boolean = false;
	@Prop() withoutDocuments: boolean = false;
	@Prop() modalDetailStyle: boolean = false;

	@State() tooltipTeam: string = '';
	@State() tooltipCeco: string = '';
	@State() tooltipSenderName: string = '';
	@State() tooltipSignatureType: string = '';

	@Event() eventDownloadActionDetail: EventEmitter;
	@Event() editRecipientEmail: EventEmitter<EditRecipientEmail>;

	@State() _resizeView: number = window.innerWidth;
	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.setTableDirection();
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseEnvelope(this.envelope);
	}

	componentDidRender() {
		if (this.resumeDataHtml) {
			this.renderTooltip(this.resumeDataHtml);
		}
		this.setTableDirection();
	}

	private setDateFormat(data): any {
		for (const key in data) {
			if ((key.includes('date_') && data[key]) || (data.status === 'NotValidEmail' && key.includes('updated_at') && data[key])) {
				const date = data[key].slice(0, 10).split('-').reverse().toString().replaceAll(',', '/');
				const dateFormated = new Date(data[key]);
				const hours = ((dateFormated.getHours() + 11) % 12) + 1;
				const time = `${hours}:${dateFormated.getMinutes()}:${dateFormated.getSeconds()} ${dateFormated.getHours() >= 12 ? 'pm' : 'am'}`;
				data[key] = date + ' ' + time;
			}
		}
		return data;
	}

	private renderTooltip(item: HTMLDivElement): void {
		const element = item.children;
		let dataElements = [];
		if (element && element.namedItem && typeof element.namedItem === 'function') {
			dataElements = [
				element?.namedItem('team'),
				element?.namedItem('ceco'),
				element?.namedItem('created-by'),
				element?.namedItem('signature-type')
			];
		}

		for (let i = 0; i < dataElements.length; i++) {
			if (dataElements[i]) {
				const result = dataElements[i].children[1].children[0] as HTMLElement;
				if (result.offsetWidth < result.scrollWidth) {
					const literal = dataElements[i].getAttribute('id').toString();
					let textTooltip = '';
					switch (literal) {
						case 'team':
							textTooltip = this.tooltipTeam;
							break;
						case 'ceco':
							textTooltip = this.tooltipCeco;
							break;
						case 'created-by':
							textTooltip = this.tooltipSenderName;
							break;
						case 'signature-type':
							textTooltip = this.tooltipSignatureType;
							break;
						default:
							break;
					}
					const ellipsis = document.createElement('scib-ui-info-tooltip');
					ellipsis.setAttribute('tooltip-pos', 'right');
					ellipsis.setAttribute('class', 'tooltip');
					ellipsis.setAttribute('title', 'Click to see complete data');
					ellipsis.setAttribute('text', textTooltip);
					dataElements[i].children[1].appendChild(ellipsis);
				}
			}
		}
	}

	renderCcRecipient() {
		return this.carbonCopies.map((recipient) => {
			return (
				<div class="recipient" style={{ order: recipient.order }}>
					<div class="recipient__col-left">
						<span
							class={`u-icon ${
								recipient.status === CDKISignatureTableRecipientStatus.signed
									? 'icon-check'
									: recipient.status === CDKISignatureTableRecipientStatus.pending
									? 'icon-clock'
									: recipient.status === CDKISignatureTableRecipientStatus.rejected && 'icon-close'
							}`}
						></span>
						<p>
							<strong class="full-name">{recipient.name}</strong>
							<span class="email">{recipient.email}</span>
						</p>
					</div>
				</div>
			);
		});
	}

	getIconRecipientStatus(recipientStatus) {
		switch (recipientStatus) {
			case CDKISignatureTableRecipientStatus.signed:
			case CDKISignatureTableRecipientStatus.completed:
				return 'icon-check';
			case CDKISignatureTableRecipientStatus.notValidEmail:
				return 'icon-awarness awarness-color';
			case CDKISignatureTableRecipientStatus.sent:
			case CDKISignatureTableRecipientStatus.delivered:
			case CDKISignatureTableRecipientStatus.pending:
				return 'icon-clock';
			case CDKISignatureTableRecipientStatus.rejected:
			case CDKISignatureTableRecipientStatus.declined:
				return 'icon-close';
			default:
				return '';
		}
	}

	getIconSignStatus(recipientStatus) {
		switch (recipientStatus) {
			case CDKISignatureTableRecipientStatus.signed:
			case CDKISignatureTableRecipientStatus.completed:
				return 'icon-sign';
			case CDKISignatureTableRecipientStatus.delivered:
				return 'icon-read-24';
			case CDKISignatureTableRecipientStatus.sent:
				return 'icon-unread-24';
			default:
				return '';
		}
	}

	getTextRecipientStatus(recipientStatus) {
		switch (recipientStatus) {
			case CDKISignatureTableRecipientStatus.signed:
			case CDKISignatureTableRecipientStatus.completed:
				return this._literals.accordionInfo.signed;
			case CDKISignatureTableRecipientStatus.notValidEmail:
				return this._literals.accordionInfo.notValidEmail;
			case CDKISignatureTableRecipientStatus.sent:
				return this._literals.accordionInfo.sent;
			case CDKISignatureTableRecipientStatus.delivered:
				return this._literals.accordionInfo.delivered;
			default:
				return '';
		}
	}

	getDateEnvelope(recipientStatus, recipientElem) {
		switch (recipientStatus) {
			case CDKISignatureTableEnvelopeStatus.signed:
			case CDKISignatureTableEnvelopeStatus.completed:
				return recipientElem.date_signed;
			case CDKISignatureTableEnvelopeStatus.notValidEmail:
				return recipientElem.updated_at;
			case CDKISignatureTableEnvelopeStatus.sent:
				return '-';
			case CDKISignatureTableEnvelopeStatus.delivered:
				return recipientElem.date_delivered;
			default:
				return '';
		}
	}

	renderSignerRecipient() {
		let reorder: boolean = !(this.signers.filter((elem) => elem.order === '1').length > 1);

		return this.signers.map((recipient, index) => {
			const recipientElem = this.setDateFormat(recipient);

			return (
				<div class="recipient" style={{ order: recipient.order }}>
					<div class="recipient__col-left">
						<span class={` u-icon ${this.getIconRecipientStatus(recipient.status)}`}></span>
						<p>
							<strong class="full-name">
								{this.modalDetailStyle ? recipient.name : (reorder ? recipient.order : index + 1) + '. ' + recipient.name}
							</strong>
							<span class={`email ${recipient.status === CDKISignatureTableRecipientStatus.notValidEmail ? 'awarness-color' : ''}`}>
								{recipient.email}
							</span>
						</p>
					</div>
					<div class="recipient__col-right">
						<p>
							<span class="envelope-status">
								<span class={`u-icon ${this.getIconSignStatus(recipient.status)}`}></span>
								{recipient.status === CDKISignatureTableRecipientStatus.notValidEmail ? (
									<scib-ui-info-tooltip
										tooltip-pos="top"
										class="tooltip margin-tooltip"
										title="Click to see complete data"
										text={this._literals.accordionInfo.tooltipWrongEmail}
									></scib-ui-info-tooltip>
								) : null}
								<span class="envelope-status__text">{this.getTextRecipientStatus(recipient.status)}</span>
							</span>
							<span class="date">{this.getDateEnvelope(recipient.status, recipientElem)}</span>
						</p>
					</div>
					{!this.withoutActions && (
						<div class="image-pencil">
							<span
								class={`u-icon ${this.checkShowPencilToEditEmail(recipient.status) ? 'icon-edit margin-data' : ''}
									awarness-color `}
								onClick={() => {
									if (this.checkShowPencilToEditEmail(recipient.status)) {
										const recipientsToModifyEmail: CDKISignatureTableEnvelopeRecipient[] =
											this._envelope.envelopeRecipient.filter(
												(recipient) => this.checkShowPencilToEditEmail(recipient.status) && recipient.type === 'signer'
											);
										const dataEdit: {
											envelopeId: string;
											allRecipients: Array<CDKISignatureTableEnvelopeRecipient>;
											recipientsToModifyEmail: Array<CDKISignatureTableEnvelopeRecipient>;
										} = {
											envelopeId: this._envelope.envelopeId,
											allRecipients: this._envelope.envelopeRecipient,
											recipientsToModifyEmail: recipientsToModifyEmail
										};
										this.editRecipientEmail.emit(dataEdit);
									}
								}}
							></span>
						</div>
					)}
				</div>
			);
		});
	}

	checkShowPencilToEditEmail(status: string) {
		return (
			this._envelope.envelopeStatus !== CDKISignatureTableEnvelopeStatus.declined &&
			(status === CDKISignatureTableEnvelopeStatus.notValidEmail ||
				this._envelope.envelopeStatus === CDKISignatureTableEnvelopeStatus.draft ||
				(this._envelope.envelopeStatus === CDKISignatureTableEnvelopeStatus.sent &&
					status !== CDKISignatureTableEnvelopeStatus.signed &&
					status !== CDKISignatureTableEnvelopeStatus.completed) ||
				status === CDKISignatureTableEnvelopeStatus.delivered) &&
			this._envelope.envelopeStatus !== CDKISignatureTableEnvelopeStatus.voided
		);
	}

	renderFileHistory() {
		// Se comprueba que tenga documentos
		return Array.isArray(this.documents) && this.documents.length > 0
			? this.documents.map((document) => {
					const data: IUIFileHistoryData = {
						fileName: document.name.substring(0, document.name.length - (document.extension.length + 1)),
						fileExtension: 'pdf',
						attributeList: [
							new Date(document.created_at).toLocaleDateString() + ' ' + new Date(document.created_at).toLocaleTimeString(),
							document.size
						],
						buttonList: [
							{
								eventName: 'download',
								iconName: 'icon-download'
							}
						],
						id: JSON.stringify([this._envelope.envelopeId, document.order])
					};
					return (
						<scib-ui-file-history
							literals={this._literals.accordionInfo as IUIFileHistoryLiterals}
							custom-data={{
								type: 'downloadDocument',
								payload: JSON.stringify([this._envelope.envelopeId, document.order])
							}}
							data={data}
							onUserAction={(e) => {
								this.eventDownloadActionDetail.emit(JSON.parse(e.detail.payload));
							}}
						></scib-ui-file-history>
					);
			  })
			: null;
	}

	setTableDirection(): void {
		const tableDiv = this._hostRef.shadowRoot.querySelector('.cdk-signature-table__signature-data');
		if (tableDiv) {
			if (tableDiv.clientWidth < 1024 && !tableDiv.classList.contains('table-column')) {
				tableDiv.classList.add('table-column');
			} else if (tableDiv.clientWidth > 1024 && tableDiv.classList.contains('table-column')) {
				tableDiv.classList.remove('table-column');
			}
		}
	}

	render() {
		return (
			<Host>
				<div class={`cdk-signature-table__signature-data cdk-signature-table__signature-data--${this._envelope.envelopeStatus}`}>
					<div class="signature-data__left-col">
						{Array.isArray(this.signers) && this.signers.length > 0 && (
							<div class="signature-data__left-col--signer">
								<h4 class="title">
									<strong>{this._literals.accordionInfo.signerTitle}</strong>
								</h4>
								{this.renderSignerRecipient()}
							</div>
						)}
						{Array.isArray(this.carbonCopies) && this.carbonCopies.length > 0 && (
							<div class="signature-data__left-col--cc">
								<h4 class="title">
									<strong>{this._literals.accordionInfo.ccTitle}</strong>
								</h4>
								{this.renderCcRecipient()}
							</div>
						)}
					</div>
					<div class="signature-data__right-col">
						<div class="signature-data__resume">
							<h4 class="title">
								<strong>{this._literals.accordionInfo.resumeTitle}</strong>
							</h4>
							<div class="data" ref={(elem) => (this.resumeDataHtml = elem)}>
								<div class="data__fields" id="team">
									<p class="sub-title">{this._literals.accordionInfo.team}</p>
									<p class="data__fields--value">
										<span>
											{this._envelope.team == null || this._envelope.team == '' || this._envelope.team.includes(`### No team`)
												? '-'
												: this._envelope.team}
										</span>
									</p>
								</div>
								{!this.modalDetailStyle && (
									<div class="data__fields" id="ceco">
										<p class="sub-title">{this._literals.accordionInfo.ceco}</p>
										<p class="data__fields--value">
											<span>
												{this._envelope.ceco == null || this._envelope.ceco == '' || this._envelope.ceco.includes(`No team`)
													? '-'
													: this._envelope.ceco}
											</span>
										</p>
									</div>
								)}
								<div class="data__fields" id="created-by" style={{ 'grid-column': this.modalDetailStyle ? '2' : '3 / span 4' }}>
									<p class="sub-title">{this._literals.accordionInfo.createdBy}</p>
									<p class="data__fields--value">
										<span>
											{this._envelope.senderName == null || this._envelope.senderName == '' ? '-' : this._envelope.senderName}
										</span>
									</p>
								</div>
								<div class="data__fields" id="signature-type">
									<p class="sub-title">{this._literals.accordionInfo.resumeSignatureType}</p>
									<p class="data__fields--value">
										<span>
											{this._envelope.signatureTypeId == null || this._envelope.signatureTypeId.name == ''
												? '-'
												: this._envelope.signatureTypeId.name}
										</span>
									</p>
								</div>
								<div class="data__fields" id="create-date">
									<p class="sub-title">{this._literals.accordionInfo.resumeCreatedOn}</p>
									<p class="data__fields--value">{new Date(this._envelope.created_at).toLocaleDateString()}</p>
								</div>
								<div class="data__fields" id="sent-on">
									<p class="sub-title">{this._literals.accordionInfo.resumeSentOn}</p>
									<p class="data__fields--value">
										{this._envelope.mailSent == null || this._envelope.mailSent == ''
											? '-'
											: new Date(this._envelope.mailSent).toLocaleDateString()}
									</p>
								</div>
								<div class="data__fields" id="expire-date">
									<p class="sub-title">{this._literals.accordionInfo.resumeExpireDate}</p>
									<p class="data__fields--value">
										{new Date(_addDays(this._envelope.created_at, parseInt(this._envelope.expirationDays))).toLocaleDateString()}
									</p>
								</div>
							</div>
						</div>
						{!this.withoutDocuments && (
							<div class="signature-data__docs">
								<div class="signature-data__docs--title">
									<h4 class="title">
										<strong>{this._literals.accordionInfo.documentsTitle}</strong>
									</h4>
									{this._envelope?.saved_in_filenet === false && (
										<scib-ui-info-tooltip
											tooltip-pos="top"
											title="Click to see complete data"
											text={this._literals.accordionInfo.tooltipPendingSaveFilenet}
										></scib-ui-info-tooltip>
									)}
								</div>
								{this.renderFileHistory()}
							</div>
						)}
					</div>
				</div>
			</Host>
		);
	}
}
