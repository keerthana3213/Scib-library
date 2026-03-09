import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKCaptcha, ICDKPhishingSource, ILiterals } from '../models/cdk-login-phishing-form.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-login-phishing-form',
	styleUrl: 'cdk-login-phishing-form.scss',
	shadow: false,
	scoped: false
})
export class CDKLoginPhishingForm {
	@Prop({ reflect: false }) emailInvalid: boolean = false;
	@Prop({ reflect: false }) codeInvalid: boolean = false;
	@Prop({ reflect: false }) focused: boolean = false;
	@Prop({ reflect: false }) email: string;
	@Prop({ reflect: false }) code: string;
	@Prop({ reflect: false }) stepCode: boolean = false;
	@Prop({ reflect: false }) expiredCode: boolean = false;
	@Prop({ reflect: false }) activeResendCode: boolean = true;

	@State() _validEmailFormat: boolean = true;
	@State() _validCodeFormat: boolean = true;
	@State() _validForm: boolean = false;

	/** Literals props */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}
	@State() _literals: ILiterals;

	/** Source links props */
	@Prop({ mutable: true, reflect: true }) source: ICDKPhishingSource | string;
	@Watch('source') parseSource(newVal: string | ICDKPhishingSource) {
		this._source = _parseProp(newVal);
	}
	@State() _source: ICDKPhishingSource;

	/** Captcha props */
	@Prop({ mutable: true, reflect: true }) captcha: string | ICDKCaptcha;
	@Watch('captcha') parseCaptcha(newVal: string | ICDKCaptcha) {
		this._captcha = _parseProp(newVal);
		this.stepCode ? this.checkCodeValidation() : this.checkValidation();
	}
	@State() _captcha: ICDKCaptcha;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseSource(this.source);
		this.parseCaptcha(this.captcha);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Events */
	@Event() userAction: EventEmitter;
	@Event() recatpchaResponseEvent: EventEmitter;

	/** Functions */
	getFocused(e) {
		this.focused = e.detail;
	}

	getEmailValue(event) {
		this.email = event.detail.value;
		this.checkValidation();
	}

	getCodeValue(event) {
		this.code = event.detail.value;
		this.checkCodeValidation();
	}

	confirmEmail() {
		this.userAction.emit({
			type: 'email',
			value: this.email
		});
	}

	confirmCode() {
		this.userAction.emit({
			type: 'code',
			value: this.code
		});
	}

	checkValidation() {
		const regexMatch = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);

		if (!!this.email && this.checkCaptcha() && regexMatch) {
			this._validForm = true;
		} else {
			this._validForm = false;
		}

		if (!!this.email && regexMatch) {
			this._validEmailFormat = true;
		} else {
			this._validEmailFormat = false;
		}
	}

	checkCodeValidation() {
		if (this.code && this.code.length === 6 && this.checkCaptcha()) {
			this._validForm = true;
		} else {
			this._validForm = false;
		}

		if (this.code && this.code.length === 6) {
			this._validCodeFormat = true;
		} else {
			this._validCodeFormat = false;
		}
	}

	checkCaptcha() {
		let captchaCheck = false;

		if (this._captcha && this._captcha.displayCaptcha) {
			if (this._captcha.validateCaptcha) {
				captchaCheck = true;
			} else {
				captchaCheck = false;
			}
		} else {
			captchaCheck = true;
		}

		return captchaCheck;
	}

	/** Event to manage Recaptcha token*/
	getRecatpchaResponse(e) {
		this.recatpchaResponseEvent.emit(e);
	}

	resendCode() {
		this.userAction.emit({
			type: 'resendCode',
			value: this.email
		});
	}

	render() {
		const checkValidFormat = this.stepCode
			? !this.codeInvalid && this._literals?.inputFormatError && !this._validCodeFormat && !this.focused && !!this.code
			: !this.emailInvalid && this._literals?.inputFormatError && !this._validEmailFormat && !this.focused && !!this.email;
		return (
			<Host>
				<div class="cdk-login-phishing-form">
					<a
						class="cdk-login-phishing-form__link cdk-login-phishing-form__link--public"
						id="link-public-web"
						href={this._source.publicWebUrl}
					>
						{this._literals.publicWeb}
						<span role="image" class="u-icon c-icon icon-logout"></span>
					</a>
					<div class="cdk-login-phishing-form__box">
						<h2 class="cdk-login-phishing-form__title">{this._literals.title}</h2>
						<div>
							<p class="cdk-login-phishing-form__description">
								{this._literals.description}
								{this.stepCode && this.email && (
									<span class="cdk-login-phishing-form__description cdk-login-phishing-form__description--bold">
										&nbsp;{this.email}
									</span>
								)}
							</p>
							<p
								class={{
									'cdk-login-phishing-form__description cdk-login-phishing-form__description--extra-p-b': true,
									'cdk-login-phishing-form__description--small cdk-login-phishing-form__description--italic': this.stepCode
								}}
							>
								{this._literals.description2}
							</p>
							<form class="cdk-login-phishing-form__form" autocomplete="off" method="POST">
								<scib-ui-input
									class={{
										'cdk-login-phishing-form__input': true,
										'cdk-login-phishing-form__input--code': this.stepCode,
										'no-validate': this.codeInvalid || this.emailInvalid || checkValidFormat || this.expiredCode
									}}
									name="alias"
									type={this.stepCode ? 'number' : 'text'}
									label={this._literals.emailLabel}
									placeholder={this._literals.emailPlaceholder}
									noIconRight={false}
									onEventFormChange={(e) => (this.stepCode ? this.getCodeValue(e) : this.getEmailValue(e))}
									onFocusCheckedEmitter={(e) => this.getFocused(e)}
								></scib-ui-input>
								{checkValidFormat && <span class="cdk-login-phishing-form__error">{this._literals.inputFormatError}</span>}
								{this._literals.inputError && (this.emailInvalid || this.codeInvalid) && (
									<span class="cdk-login-phishing-form__error">{this._literals.inputError}</span>
								)}
								{this._literals.inputExpiredCodeError && this.stepCode && this.expiredCode && (
									<span class="cdk-login-phishing-form__error">{this._literals.inputExpiredCodeError}</span>
								)}

								{this._captcha && this._captcha.displayCaptcha && (
									<div class="cdk-login-phishing-form__recaptcha">
										<scib-ui-recaptcha
											sitekey={this._captcha.sitekey}
											onResponse={(e) => this.getRecatpchaResponse(e)}
										></scib-ui-recaptcha>
									</div>
								)}

								<div
									class={{ 'cdk-login-phishing-form__buttons': true, 'cdk-login-phishing-form__buttons--less-m-b': this.stepCode }}
								>
									<scib-ui-button
										type="button"
										disabled={!this._validForm}
										primary
										large
										disableMinWidth
										onEventClick={() => (this.stepCode ? this.confirmCode() : this.confirmEmail())}
									>
										{this._literals.confirm}
									</scib-ui-button>
								</div>
							</form>
							{this.stepCode && (
								<div class="cdk-login-phishing-form__resend">
									<p class="cdk-login-phishing-form__resend-txt">
										<span class="u-icon icon-code cdk-login-phishing-form__resend-icon"></span>
										{this.activeResendCode ? this._literals.newCode : this._literals.newCodeWait}&nbsp;
										{this.activeResendCode && (
											<scib-ui-button
												type="button"
												no-lateral-padding
												link
												nobackground
												small
												disableMinWidth
												onEventClick={() => this.resendCode()}
											>
												{this._literals.newCodeLink}
											</scib-ui-button>
										)}
									</p>
								</div>
							)}
							<p>
								{this._literals.alreadyHaveAccount}{' '}
								<a class="cdk-login-phishing-form__link" href={this._source.login}>
									{this._literals.login}
								</a>
							</p>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
