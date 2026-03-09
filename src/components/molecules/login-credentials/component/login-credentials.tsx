import { ICDKLoginFormLinks, ICDKLoginFormLiterals } from '../models/login-credentials.model';
import { Component, Host, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

@Component({
	tag: 'scib-molecules-login-credentials',
	styleUrl: 'login-credentials.scss',
	shadow: false,
	scoped: true,
})
export class MoleculesLoginCredentials {
	$formElement: HTMLFormElement;

	/** Default Value por input email */
	@Prop() emailValue: string = '';

	/** Default value for input password */
	@Prop() passwordValue: string = '';

	/** Type of password input*/
	@Prop() typeInputPassword: string = 'password';

	/** */
	@Prop({ mutable: true }) literals: string;
	@Watch('literals') parseLiterals(newVal: string | ICDKLoginFormLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKLoginFormLiterals;

	/** */
	@Prop({ mutable: true }) links: string;
	@Watch('links') parseLinks(newVal: string | ICDKLoginFormLinks) {
		this._links = _parseProp(newVal);
	}
	@State() _links: ICDKLoginFormLinks;

	/** */
	/* TODO: The captcha will be hidden until further notice */
	// @Prop({ mutable: true }) captcha: string | ICDKCaptcha;
	// @Watch('captcha') parseCaptcha(newVal: string | ICDKCaptcha) {
	// 	this._captcha = _parseProp(newVal);
	// }
	// @State() _captcha: ICDKCaptcha;

	@State() isFormValid: boolean = false;

	/**
	 * The refreshCaptcha attribute
	 */
	// @Prop({ mutable: true, reflect: true }) refreshCaptcha? = false;
	// @Watch('refreshCaptcha') parseRefreshCaptcha(newVal: boolean) {
	// 	this._refreshCaptcha = newVal;
	// }
	// @State() _refreshCaptcha: boolean;

	@Event() eventLogin: EventEmitter;

	@Event() forgotPassClickEvent: EventEmitter;

	@Event() recatpchaResponseEvent: EventEmitter;

	/*** LifeCycle Methods ***/

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseLinks(this.links);
		// this.parseCaptcha(this.captcha);
	}

	/*** Common Methods ***/

	getRecatpchaResponse(e) {
		this.recatpchaResponseEvent.emit(e);
	}

	selectForgotPassword(e) {
		e.preventDefault();
		e.stopPropagation();
		this.forgotPassClickEvent.emit(this._links.forgotPassUrl);
	}

	submitForm(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		this.eventLogin.emit({
			email: this.emailValue,
			password: this.passwordValue,
		});
	}

	setEmailvalue(event: CustomEvent & { detail: string }) {
		this.emailValue = event.detail;
		this.isFormValid = this.$formElement.checkValidity();
	}

	setPassValue(event: CustomEvent & { detail: string }) {
		this.passwordValue = event.detail;
		this.isFormValid = this.$formElement.checkValidity();
	}

	render() {
		return (
			<Host>
				<a class="login-credentials-header" href={this._links.publicWebUrl}>
					{this._literals?.publicWeb}
					<i class="icon" />
				</a>
				<div class="login-credentials-body">
					<h2 class="login-credentials-body__title">{this._literals?.mainTitle}</h2>

					<form class="login-credentials-body-form" ref={el => (this.$formElement = el as HTMLFormElement)}>
						{/* TODO: añadir cuando arreglen autocomplete
						<scib-ui-v2-text-field
							variant="white"
							label={this._literals?.emailLabel}
							type="email"
							invalid={false}
							disabled={false}
							read-only={false}
							onValueChange={e => this.setEmailvalue(e)}
						/> */}
						<scib-ui-input
							label={this._literals?.emailLabel}
							type="email"
							debounceTime={450}
							placeholder={this._literals?.emailPlaceholder}
							noIconRight={false}
							multiselect={false}
							onEventChange={e => this.setEmailvalue(e)}
							onEventPaste={e => this.setEmailvalue(e)}
						></scib-ui-input>
						{/* <input class="--display-none" type="email" value={this.emailValue} required /> */}
						<div class="login-credentials-body-form__passInput">
							{/* TODO: añadir cuando arreglen autocomplete
							<scib-ui-v2-text-field
								variant="white"
								label={this._literals?.passLabel}
								type="password"
								invalid={false}
								disabled={false}
								read-only={false}
								onValueChange={e => this.setPassValue(e)}
							/> */}
							<scib-ui-input
								label={this._literals?.passLabel}
								type="password"
								debounceTime={450}
								placeholder={this._literals?.passPlaceholder}
								isPasswordField={true}
								autocomplete={false}
								searchSimple={false}
								noIconRight={false}
								iconInnerRight="icon-open-eye"
								onEventChange={e => this.setPassValue(e)}
								onEventPaste={e => this.setPassValue(e)}
							></scib-ui-input>
							{/* <input class="--display-none" type="password" value={this.passwordValue} required /> */}
						</div>
						{this._literals?.textError && (
							<span class="login-credentials-body-form__inputsError">{this._literals.textError}</span>
						)}
						{/* TODO: The captcha will be hidden until further notice*/}
						{/* <div class="login-credentials-body-form__recaptcha">
							{this._captcha && this._captcha.displayCaptcha && (
								<scib-ui-recaptcha
									refresh={this._refreshCaptcha}
									sitekey={this._captcha.sitekey}
									onResponse={e => this.getRecatpchaResponse(e)}
								/>
							)}
						</div> */}
						<div class="login-credentials-body-form__buttons">
							{/* TODO: The captcha will be hidden until further notice*/}
							<scib-atoms-button
								onClick={e => this.submitForm(e)}
								text={this._literals.login}
								disabled={!this.isFormValid}
								// disabled={(this._captcha && !this._captcha.validateCaptcha) || !this.isFormValid}
							/>
							<a class="link-forgot-password" href="#" onClick={e => this.selectForgotPassword(e)}>
								{this._literals.forgotpass}
							</a>
						</div>
					</form>
					<a class="login-credentials-body__link-contact" href={this._links.contactUrl}>
						{this._literals.contact}
					</a>
				</div>
			</Host>
		);
	}
}
