import { Component, Prop, Element, Event, Host, h, EventEmitter, Watch, State } from '@stencil/core';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-recaptcha',
	styleUrl: 'ui-recaptcha.scss',
	shadow: false,
	scoped: true,
})
export class UIRecaptcha {
	/**
	 * Your sitekey
	 *
	 * (Provided on registration -- see https://developers.google.com/re-captcha/intro)
	 */
	@Prop({ reflect: true }) sitekey!: string;
	@Watch('sitekey') parseSitekey(newVal: string) {
		this._sitekey = newVal;
	}
	@State() _sitekey: string;

	/**
	 * The type of re-captcha to serve
	 */
	@Prop({ reflect: true }) type?: 'image' | 'audio' = 'image';
	@Watch('type') parseType(newVal: string) {
		this._type = newVal;
	}
	@State() _type: string;

	/**
	 * The color theme of the widget
	 */
	@Prop({ reflect: true }) theme?: 'dark' | 'light' = 'light';
	@Watch('theme') parseTheme(newVal: 'dark' | 'light') {
		this._theme = newVal;
	}
	@State() _theme: 'dark' | 'light';

	/**
	 * The total time (in milliseconds) to wait for API loading
	 */
	@Prop({ reflect: true }) timeout? = 3000;
	@Watch('timeout') parseTimeout(newVal: string) {
		this._timeout = newVal;
	}
	@State() _timeout: string;

	/**
	 * re-captcha API URL
	 */
	@Prop({ reflect: true }) src? = 'https://www.google.com/recaptcha/enterprise.js';
	@Watch('src') parseSrc(newVal: string) {
		this._src = newVal;
	}
	@State() _src: string;

	/**
	 * The language attribute
	 */
	@Prop({ reflect: true }) language? = 'en';
	@Watch('language') parseLanguaje(newVal: string) {
		this._language = newVal;
	}
	@State() _language: string;

	/**
	 * The refresh attribute
	 */
	@Prop({ mutable: true, reflect: true }) refresh? = false;
	@Watch('refresh') parseRefresh(newVal: boolean) {
		this._refresh = newVal;
		if (newVal) {
			this.componentWillUpdate();
			this._refresh = false;
		}
	}
	@State() _refresh: boolean;

	/**
	 * Captcha response
	 */
	@Event() response: EventEmitter;

	/**
	 * Captcha expiration
	 */
	@Event() expire: EventEmitter;

	@Element()
	private el: HTMLElement;

	public async componentDidLoad() {
		await this.loadReCaptchaScript();
		await this.loadReCaptchaContainer();
	}

	public async componentWillUpdate() {
		await this.loadReCaptchaScript();
		await this.loadReCaptchaContainer();
	}

	public render() {
		return (
			<Host>
				<script />
				<div />
			</Host>
		);
	}

	// Helpers

	/**
	 * Create and inject script dependency
	 */
	private async loadReCaptchaScript() {
		const url = this.buildReCaptchaURL();
		const script = document.createElement('script');
		script.setAttribute('defer', '');
		script.setAttribute('async', '');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		this.el.replaceChild(script, this.el.querySelector('script'));
		await this.waitReCaptchaScript(script);
	}

	private buildReCaptchaURL() {
		if (!this._language) {
			return this.src;
		} else {
			return `${this.src}?hl=${this._language}`;
		}
	}

	/**
	 * Wait for the ReCatcha to finish async load
	 */
	private async waitReCaptchaScript(script: HTMLScriptElement) {
		if (this.isNavigatorOnline()) {
			await this.waitReCaptchaScriptLoad(script);
			await this.waitReCaptchaReadiness();
		} else {
			await this.rescheduleReCaptchaScriptLoad(script);
		}
	}

	/**
	 * Detect browser connectivity
	 */
	private isNavigatorOnline() {
		return 'navigator' in window && 'onLine' in window.navigator && window.navigator.onLine;
	}

	/**
	 * Wait for thes async script load
	 */
	private async waitReCaptchaScriptLoad(script: HTMLScriptElement) {
		await new Promise(resolve => {
			script.onload = () => {
				resolve({});
			};
		});
		script.onload = () => {};
	}

	/**
	 * Wait for the lib to load
	 */
	private async waitReCaptchaReadiness() {
		await new Promise(resolve => {
			window['grecaptcha'].enterprise.ready(() => {
				resolve({});
			});
		});
	}

	/**
	 * Reschedule load for next reconnection
	 */
	private async rescheduleReCaptchaScriptLoad(script: HTMLScriptElement) {
		await new Promise(resolve => {
			const listener = () => {
				resolve({});
			};

			window.addEventListener('online', listener, {
				once: true,
			});
		});
		this.waitReCaptchaScript(script);
	}

	/**
	 * Inject Captcha into the component DOM
	 */
	private async loadReCaptchaContainer() {
		const container = document.createElement('div');
		await window['grecaptcha'].enterprise.render(container, {
			'callback': this.responseHandler.bind(this),
			'expired-callback': this.expiredHandler.bind(this),
			'sitekey': this.sitekey,
			'tabindex': this.el.tabIndex,
			'theme': this._theme,
			'type': this.type,
		});
		this.el.replaceChild(container.querySelector('div'), this.el.querySelector('div'));
	}

	/**
	 * The `responseHandler` method will store the response and fire the captcha-response. At least
	 * it will dispatch a captcha-response event with the response
	 */
	private responseHandler(response: unknown) {
		this.response.emit(response);
	}

	/**
	 * The `expiredHandler` method fires the captcha-expired event.
	 *
	 *  @method expiredHandler
	 */
	private expiredHandler() {
		this.expire.emit();
	}
}
