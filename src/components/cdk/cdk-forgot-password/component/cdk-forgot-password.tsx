import {
	ICDKForgotPasswordError,
	ICDKForgotPasswordProps,
	ICDKForgotPasswordLiterals,
	ICDKCaptcha,
} from '../models/cdk-forgot-password.model';
import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-forgot-password',
	styleUrl: 'cdk-forgot-password.scss',
	shadow: false,
	scoped: true,
})
export class CDKForgotPassword {
	@State() sendEmail: boolean = false;

	@Prop({ reflect: false }) showPassword: boolean;
	@Prop({ reflect: false }) email: string;
	@Prop({ reflect: false }) password: string;
	@Prop({ reflect: false }) typeInput: string;
	@Prop({ reflect: false }) sendEmailOk: boolean;
	@Prop({ reflect: false }) focused: boolean = false;
	@Prop({ mutable: true, reflect: true }) literals: ICDKForgotPasswordLiterals | string;
	@Watch('literals') parseLiterals(newVal: string | ICDKForgotPasswordLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKForgotPasswordLiterals;

	@Prop({ mutable: true, reflect: true }) error: ICDKForgotPasswordError | string;
	@Watch('error') parseError(newVal: string | ICDKForgotPasswordError) {
		this._error = _parseProp(newVal);
	}
	@State() _error: ICDKForgotPasswordError;

	@Prop({ mutable: true, reflect: true }) props: ICDKForgotPasswordProps | string;
	@Watch('props') parseProps(newVal: string | ICDKForgotPasswordProps) {
		this._props = _parseProp(newVal);
	}
	@State() _props: ICDKForgotPasswordProps;

	@Prop({ mutable: true, reflect: true }) captcha: string | ICDKCaptcha;
	@Watch('captcha') parseCaptcha(newVal: string | ICDKCaptcha) {
		this._captcha = _parseProp(newVal);
	}
	@State() _captcha: ICDKCaptcha;
	@State() _validForm: boolean = false;

	/**
	 * The refreshCaptcha attribute
	 */
	@Prop({ mutable: true, reflect: true }) refreshCaptcha? = false;
	@Watch('refreshCaptcha') parseRefreshCaptcha(newVal: boolean) {
		this._refreshCaptcha = newVal;
	}
	@State() _refreshCaptcha: boolean;

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseError(this.error);
		this.parseProps(this.props);
		this.parseCaptcha(this.captcha);
		this.email = '';
	}

	getFocused(e: CustomEvent) {
		this.focused = e.detail;
	}

	getEmailvalue(event: CustomEvent) {
		if (event.detail.value) {
			this._error.textError = '';
		}
		this.email = event.detail.value;
		this.checkValidation();
	}

	checkValidation() {
		const regexMatch = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
		if (!!this.email && regexMatch) {
			this._validForm = true;
		} else {
			this._validForm = false;
		}
	}

	@Event() eventLogin: EventEmitter;
	@Event() publicWebClickEvent: EventEmitter;
	@Event() contactClickEvent: EventEmitter;
	@Event() returnToLoginEvent: EventEmitter;
	@Event() recatpchaResponseEvent: EventEmitter;

	publicWebClick(e) {
		e.preventDefault();
		this.publicWebClickEvent.emit(this._props.publicWebUrl);
	}

	contactClick(e) {
		e.preventDefault();
		this.contactClickEvent.emit(this._props.contactUrl);
	}

	returnToLoginClick() {
		this.returnToLoginEvent.emit(true);
	}

	loginClick() {
		this.eventLogin.emit(this.email);
	}

	render() {
		return (
			<Host>
				<div class="cdk-forgot-form">
					<a id="link-public-web" href={this._props.publicWebUrl}>
						{this._literals.publicWeb}
						<span role="image" class="u-icon c-icon icon-logout"></span>
					</a>
					<div class="cdk-forgot-form__box">
						<h2 class="cdk-forgot-form__title">{this._literals.mainTitle}</h2>
						{this._props.sendEmailOk ? (
							<div>
								<p class="cdk-forgot-form__p">{this._literals.sendEmailparagraph}</p>
							</div>
						) : (
							<div>
								<p class="cdk-forgot-form__p">{this._literals.paragraph}</p>
								<form class="cdk-forgot-form__form" autocomplete="off" method="POST">
									<scib-ui-input
										class={{
											'no-validate': this._error.textError.length > 0 && !this.focused,
										}}
										name="alias"
										label={this._literals.emailLabel}
										placeholder={this._literals.emailPlaceholder}
										debounceTime={450}
										noIconRight={false}
										onEventFormChange={e => this.getEmailvalue(e)}
										onFocusCheckedEmitter={e => this.getFocused(e)}
									></scib-ui-input>
									{this._error.textError && !this.focused ? <span>{this._error.textError}</span> : null}

									<div class="recaptcha">
										{this._captcha && this._captcha.displayCaptcha ? (
											<scib-ui-recaptcha
												refresh={this._refreshCaptcha}
												sitekey={this._captcha.sitekey}
												onResponse={e => this.getRecatpchaResponse(e)}
											></scib-ui-recaptcha>
										) : (
											''
										)}
									</div>

									<div class="cdk-forgot-form__buttons">
										<scib-ui-button
											type="button"
											secondary
											large
											disableMinWidth
											onEventClick={() => this.returnToLoginClick()}
										>
											{this._literals.cancel}
										</scib-ui-button>
										<scib-ui-button
											type="button"
											disabled={!this._captcha?.validatedCaptcha || !this._validForm}
											primary
											large
											disableMinWidth
											onEventClick={() => this.loginClick()}
										>
											{this._literals.login}
										</scib-ui-button>
									</div>
								</form>
								<a id="link-contact" href={this._props.contactUrl}>
									{this._literals.contact}
								</a>
							</div>
						)}
					</div>
				</div>
			</Host>
		);
	}

	/** Event to manage Recaptcha token*/
	getRecatpchaResponse(e) {
		this.recatpchaResponseEvent.emit(e);
	}
}
