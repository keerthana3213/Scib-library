import { Component, Host, h, Element, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { HelperLevel, SizeTypes } from '../../../../shared/models';
import { MDCCircularProgress } from '@material/circular-progress';
import { MDCLinearProgress } from '@material/linear-progress';
import { isNull, isUndefined } from 'lodash';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-atoms-loading',
	styleUrl: 'loading.scss',
	shadow: true
})
export class AtomsLoading {
	_progressReference: MDCCircularProgress | MDCLinearProgress;

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ reflect: true }) level: HelperLevel = 'primary';

	/**
	 *
	 */
	@Prop({ reflect: true }) size: SizeTypes = 's';

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: 'linear' | 'circular' = 'circular';

	/**
	 * Value should be between 0 and 100. -1 for indeterminate
	 */
	@Prop() value?: number | undefined;
	@State() $value: number;
	@Watch('value') _valueHandler(newValue: number | undefined) {
		let _value = Number(newValue);
		const _validNumber = !isUndefined(_value) && !isNull(_value) && !isNaN(_value);
		if (_validNumber && _value > 100) {
			_value = 100;
		}
		this.$value = _value;
		this.$indeterminate = !_validNumber || _value < 0;
		this._setProgress();
	}

	/**
	 *
	 */
	@State() $indeterminate: boolean;

	/**
	 *
	 */
	componentWillLoad() {
		this._valueHandler(this.value);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		this._progressReference =
			this.variant === 'linear'
				? MDCLinearProgress.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-linear-progress'))
				: MDCCircularProgress.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-circular-progress'));
		this._setProgress();
	}

	/**
	 *
	 */
	private _destroy() {
		if (this._progressReference && this._progressReference.destroy) {
			this._progressReference.destroy();
		}
	}

	/**
	 *
	 */
	private _setProgress() {
		if (this._progressReference) {
			this._progressReference.progress = this.$indeterminate ? null : this.$value / 100 || null;
		}
	}

	render() {
		return (
			<Host>
				{this.variant === 'linear' && (
					<div
						role="progressbar"
						class={{ 'mdc-linear-progress': true, 'mdc-linear-progress--indeterminate': this.$indeterminate }}
						aria-valuemin="0"
						aria-valuemax="1"
						aria-valuenow={this.$value}
					>
						<div class="mdc-linear-progress__buffer">
							<div class="mdc-linear-progress__buffer-bar"></div>
							<div class="mdc-linear-progress__buffer-dots"></div>
						</div>
						<div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
							<span class="mdc-linear-progress__bar-inner"></span>
						</div>
						<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
							<span class="mdc-linear-progress__bar-inner"></span>
						</div>
					</div>
				)}

				{this.variant === 'circular' && (
					<div
						class={{ 'mdc-circular-progress': true, 'mdc-circular-progress mdc-circular-progress--indeterminate': this.$indeterminate }}
						role="progressbar"
						aria-valuemin="0"
						aria-valuemax="1"
						aria-valuenow={this.$value}
					>
						<div class="mdc-circular-progress__determinate-container">
							<svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
								<circle class="mdc-circular-progress__determinate-track" cx="16" cy="16" r="12.5" stroke-width="3" />
								<circle
									class="mdc-circular-progress__determinate-circle"
									cx="16"
									cy="16"
									r="12.5"
									stroke-dasharray="78.54"
									stroke-dashoffset="78.54"
									stroke-width="3"
								/>
							</svg>
						</div>
						<div class="mdc-circular-progress__indeterminate-container">
							<div class="mdc-circular-progress__spinner-layer">
								<div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
									<svg
										class="mdc-circular-progress__indeterminate-circle-graphic"
										viewBox="0 0 32 32"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3" />
									</svg>
								</div>
								<div class="mdc-circular-progress__gap-patch">
									<svg
										class="mdc-circular-progress__indeterminate-circle-graphic"
										viewBox="0 0 32 32"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="2.4" />
									</svg>
								</div>
								<div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
									<svg
										class="mdc-circular-progress__indeterminate-circle-graphic"
										viewBox="0 0 32 32"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3" />
									</svg>
								</div>
							</div>
						</div>
					</div>
				)}
			</Host>
		);
	}
}
