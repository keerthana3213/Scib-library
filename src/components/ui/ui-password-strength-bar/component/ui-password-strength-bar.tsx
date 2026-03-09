import { Component, Host, h, Prop, Watch, State } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-password-strength-bar',
	styleUrl: 'ui-password-strength-bar.scss',
	shadow: false,
	scoped: true,
})
export class UIPasswordStrengthBar {
	@Prop({ reflect: true }) password: string;
	@Prop() strength = {
		notValid: 'Not valid',
		bad: 'bad',
		weak: 'weak',
		strong: 'strong',
	};
	@Prop() strengthValues: Array<string>;
	@Prop() classStrength: string;
	@Prop() meter: string;
	@Prop({ reflect: true }) literal: string;

	@State() _literal: string;

	@Watch('literal')
	literalChange(newVal: string) {
		this._literal = newVal;
	}

	@Watch('password')
	passwordStrength() {
		let lengthPw = this.password.length;
		switch (lengthPw) {
			case 8:
			case 9:
				if (this.password.match(/^(?=\w*[a-z])(?=\w*[A-Z].*[A-Z])(?=\w*\d.*\d)\S{8,9}$/)) {
					this.meter = this.strength.weak;
					this.classStrength = 'weak';
					break;
				}
				if (this.password.match(/^(?=\w*[a-z])(?=\w*[A-Z])(?=\w*\d)\S{8,9}$/)) {
					this.meter = this.strength.bad;
					this.classStrength = 'bad';
				}
				break;
			case 10:
			case 11:
			case 12:
				if (this.password.match(/^(?=\w*[a-z])(?=\w*[A-Z])(?=\w*\d)\S{10,12}$/)) {
					this.meter = this.strength.weak;
					this.classStrength = 'weak';
				}
				break;
			case 13:
			case 14:
				if (this.password.match(/^(?=\w*[a-z])(?=\w*[A-Z].*[A-Z])(?=\w*\d.*\d)\S{13,14}$/)) {
					this.meter = this.strength.strong;
					this.classStrength = 'strong';
					break;
				}
				if (this.password.match(/^(?=\w*[a-z])(?=\w*[A-Z])(?=\w*\d)\S{13,14}$/)) {
					this.meter = this.strength.weak;
					this.classStrength = 'weak';
				}
				break;

			default:
				this.meter = this.strength.notValid;
				this.classStrength = '';
		}
	}

	loadStrengthValues() {
		if (this._literal) {
			this.strengthValues = this._literal.split(',');
			this.strength.notValid = this.strengthValues[0];
			this.strength.bad = this.strengthValues[1];
			this.strength.weak = this.strengthValues[2];
			this.strength.strong = this.strengthValues[3];
		}
	}

	componentDidLoad() {
		this.literalChange(this.literal);
		this.loadStrengthValues();
		this.passwordStrength();
	}

	render() {
		return (
			<Host>
				<div class="pass-str-bar">
					<div class="pass-bar">
						<meter id="pass-str-meter" class={'pass-bar-' + this.classStrength}></meter>
					</div>
					<label class="pass-bar-label">{this.meter}</label>
				</div>
			</Host>
		);
	}
}
