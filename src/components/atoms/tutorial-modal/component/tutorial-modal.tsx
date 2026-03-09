import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { trimEnd } from 'lodash';
import { assetUrl } from '../../../../utils/helpers/common';
import { CheckboxValue } from '../../../ui-v2/ui-v2-checkbox/models/ui-v2-checkbox.model';

@Component({
	tag: 'scib-atoms-tutorial-modal',
	styleUrl: 'tutorial-modal.scss',
	shadow: true
})
export class AtomsTutorialModal {
	@Element() _hostRef: HTMLElement;

	@Event() setSkipTutorial: EventEmitter<boolean>;

	/**
	 * Open Tutorial modal
	 */
	@Prop({ reflect: true, mutable: true }) open: boolean;
	@State() $open: boolean;
	@Watch('open') _openHandler(newValue: boolean) {
		this.$open = newValue;
	}

	/**
	 * Ruta de la imagen
	 */
	@Prop() imgSrc: string = assetUrl('/assets/images/portal-trade.svg');
	@State() $imgSrc: string;
	@Watch('imgSrc') _imgSrcHandler(newValue: string) {
		this.$imgSrc = assetUrl(newValue);
	}

	/**
	 * Img base path.
	 */
	@Prop() imgSrcHostPath: string;
	@State() $imgSrcHostPath: string;
	@Watch('imgSrcHostPath') _imgSrcHostPathHandler(newValue: string) {
		this.$imgSrcHostPath = trimEnd(newValue || '', '/');
	}

	/**
	 * Start Tutorial Click
	 */
	@Event({ composed: true }) startTutorialClick: EventEmitter<string>;
	private _onStartTutorialClick($event) {
		if (this.$chkValue === 'checked') {
			this.setSkipTutorial.emit(true);
		} else {
			this.setSkipTutorial.emit(false);
		}
		this.startTutorialClick.emit($event);
	}

	/**
	 * Skip Tutorial Click
	 */
	@Event({ composed: true }) skipTutorialClick: EventEmitter<boolean>;
	private _onSkipTutorialClick($event) {
		this.skipTutorialClick.emit($event);
	}

	/**
	 * Change tutorial modal title
	 */
	@Prop() modalTitle: string;
	@State() $modalTitle: string;
	@Watch('modalTitle') _modalTitleHandler(newValue: string) {
		this.$modalTitle = newValue;
	}

	/**
	 * Change tutorial modal description
	 */
	@Prop() description: string;
	@State() $description: string;
	@Watch('description') _descriptionHandler(newValue: string) {
		this.$description = newValue;
	}

	/**
	 * Change tutorial modal button start
	 */
	@Prop() btnText: string;
	@State() $btnText: string;
	@Watch('btnText') _btnTextHandler(newValue: string) {
		this.$btnText = newValue;
	}

	/**
	 * Change tutorial modal check label
	 */
	@Prop() chkText: string;
	@State() $chkText: string;
	@Watch('chkText') _chkTextHandler(newValue: string) {
		this.$chkText = newValue;
	}

	/**
	 * Change tutorial modal check label
	 */
	@Prop() chkValue: CheckboxValue = 'unchecked';
	@State() $chkValue: CheckboxValue;
	@Watch('chkValue') _chkValueHandler(newValue: CheckboxValue) {
		this.$chkValue = newValue;
	}

	@Prop({ reflect: true, mutable: true }) skipTutorial: boolean = false;
	@Watch('skipTutorial') _handlerSkipTutorial(value: boolean) {
		value == true ? (this.$chkValue = 'checked') : (this.$chkValue = 'unchecked');
	}

	/**
	 * Listen the change
	 */
	@Listen('valueChange', { target: 'body' })
	checkBoxChangeValue(event: CustomEvent<any>) {
		if (event) {
			this._chkValueHandler(event.detail.checkboxValue);
		}
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._modalTitleHandler(this.modalTitle);
		this._descriptionHandler(this.description);
		this._btnTextHandler(this.btnText);
		this._chkTextHandler(this.chkText);
		this._chkValueHandler(this.chkValue);
		this._handlerSkipTutorial(this.skipTutorial);
		this._openHandler(this.open);
		this._imgSrcHostPathHandler(this.imgSrcHostPath);
		this._imgSrcHandler(this.imgSrc);
	}

	/**
	 *
	 */
	@Method() async closeModal() {
		this._closeModal();
	}

	/**
	 *
	 */
	private _closeModal() {
		this.$open = false;
		if (this.$chkValue === 'checked') {
			this.setSkipTutorial.emit(true);
		} else {
			this.setSkipTutorial.emit(false);
		}
		this._onSkipTutorialClick(true);
	}

	render() {
		return (
			<Host>
				<div
					class="mdc-tutorial"
					style={{
						display: this.$open ? 'block' : 'none'
					}}
				>
					<div class="mdc-tutorial__container">
						<div class="mdc-tutorial__surface" role="alertdialog" aria-modal="true">
							<div class="mdc-tutorial__header" tabindex="0">
								<div class="mdc-tutorial__header__close">
									<span onClick={() => this._closeModal()}>Skip</span>
								</div>
							</div>
							<figure class="mdc-tutorial__figure">
								<img class="mdc-tutorial__img" src={this.$imgSrc} alt="image tutorial" />
							</figure>
							<div class="mdc-tutorial__title">{this.$modalTitle}</div>
							<div class="mdc-tutorial__description">{this.$description}</div>
							<div class="mdc-tutorial__button">
								<scib-atoms-button
									text={this.$btnText}
									size="m"
									level="primary"
									type="button"
									onClick={this._onStartTutorialClick.bind(this)}
								></scib-atoms-button>
							</div>
							<scib-ui-v2-checkbox class="mdc-tutorial__checkbox" label={this.$chkText} value={this.$chkValue}></scib-ui-v2-checkbox>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
