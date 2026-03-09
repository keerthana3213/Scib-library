import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { ICDKDialogProcessLiterals } from '../models/cdk-dialog-process.model';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot form - Form slot content
 */
@Component({
	tag: 'scib-cdk-dialog-process',
	styleUrl: 'cdk-dialog-process.scss',
	shadow: false,
	scoped: false
})
export class CDKDialogProcess {
	_hasExtraButton: boolean = false;

	/** Deshabilita el botón de finalizar */
	@Prop({ reflect: true }) disabledFinish: boolean = false;

	/** Estilo de texto alternativo */
	@Prop({ reflect: true }) altText: boolean = false;

	/** Optional icon for extra button */
	@Prop({ reflect: true }) iconExtraBtn: string;

	/** Desactivate the footer buttons */
	@Prop({ mutable: true, reflect: true }) noButtons: boolean = false;

	/**Literals */
	@Prop({ reflect: true }) literals: ICDKDialogProcessLiterals | string;

	@Watch('literals') literalsChange(newVal: ICDKDialogProcessLiterals | string) {
		this._literals = _parseProp(newVal);

		if (this._literals.extraBtn) {
			this._hasExtraButton = true;
		} else {
			this._hasExtraButton = false;
		}
	}

	@State() _literals: ICDKDialogProcessLiterals;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
	}

	/** Single action event (e.g. success) */
	@Event() eventSingleActionhProcess: EventEmitter;

	/** Single button end process emitter function */
	_handleSingleAction() {
		this.eventSingleActionhProcess.emit();
	}

	/** Event at the end of the process */
	@Event() eventFinishProcess: EventEmitter;

	/** Final process emitter function */
	_handleFinish() {
		this.eventFinishProcess.emit();
	}

	/** Event for the counteraction of the final button */
	@Event() eventContractionProcess: EventEmitter;

	/** Emitter function of the shrinking process */
	_handleContraction() {
		this.eventContractionProcess.emit();
	}

	/** Event for the extra button funtionality */
	@Event() eventExtraButtonProcess: EventEmitter;

	_handleExtraButtonAction() {
		this.eventExtraButtonProcess.emit();
	}

	getImageUrl(): string {
		switch (this._literals.typeDialog) {
			case 'success':
				return `url(${assetUrl('/assets/images/i-success_dialog.svg')})`;
			case 'attention':
				return `url(${assetUrl('/assets/images/i-attention_dialog.svg')})`;
			case 'error':
				return `url(${assetUrl('/assets/images/i-error_dialog.svg')})`;
			case 'loading':
				return `url(${assetUrl('/assets/images/spinner.gif')})`;
			case 'information':
				return `url(${assetUrl('/assets/images/i-information-dialog.svg')})`;
			default:
				return `url('')`;
		}
	}

	render() {
		const checkOnlyBtnLoadingType = this._literals.typeDialog === 'loading';
		return (
			<section class="cdk-dprocess__box" style={{ '--status-image-url': this.getImageUrl() }}>
				<h2 class="cdk-dprocess__title">
					<strong class="cdk-dprocess__strong">{this._literals.mainTitle}</strong>
				</h2>
				<p
					class={{
						'cdk-dprocess__paragraph': true,
						'cdk-dprocess__paragraph--alt': this.altText,
						'cdk-dprocess__paragraph--smb': this._hasExtraButton
					}}
				>
					{this._literals.message}
					{this._literals.ldapUid && <p class={{ 'cdk-dprocess__paragraph--alt': this.altText }}>{this._literals.ldapUid}</p>}
				</p>

				{this._literals.message2 ? (
					<p class={{ 'cdk-dprocess__paragraph': true, 'cdk-dprocess__paragraph--smb': this._hasExtraButton }}>{this._literals.message2}</p>
				) : (
					''
				)}
				<slot name="form" />
				{this._hasExtraButton && (
					<scib-ui-button icon-left link icon={this.iconExtraBtn} onEventClick={() => this._handleExtraButtonAction()}>
						{this._literals.extraBtn}
					</scib-ui-button>
				)}
				{this.noButtons !== true &&
					(this._literals.onlyBtn ? (
						<footer class="cdk-dprocess__footer">
							<scib-ui-button
								primary={!checkOnlyBtnLoadingType}
								secondary={checkOnlyBtnLoadingType}
								onEventClick={() => this._handleSingleAction()}
							>
								{this._literals.onlyBtn}
							</scib-ui-button>
						</footer>
					) : this._literals.invertStyleBtn ? (
						<footer class="cdk-dprocess__footer cdk-dprocess__footer--double">
							<scib-ui-button primary onEventClick={() => this._handleContraction()}>
								{this._literals.btnLeft}
							</scib-ui-button>
							<scib-ui-button secondary onEventClick={() => this._handleFinish()} disabled={this.disabledFinish}>
								{this._literals.btnRight}
							</scib-ui-button>
						</footer>
					) : (
						<footer class="cdk-dprocess__footer cdk-dprocess__footer--double">
							<scib-ui-button secondary onEventClick={() => this._handleContraction()}>
								{this._literals.btnLeft}
							</scib-ui-button>
							<scib-ui-button primary onEventClick={() => this._handleFinish()} disabled={this.disabledFinish}>
								{this._literals.btnRight}
							</scib-ui-button>
						</footer>
					))}
			</section>
		);
	}
}
