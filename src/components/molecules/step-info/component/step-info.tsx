import { Component, Host, h, Prop, Watch, State, Element } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { IUIStepInfoLiterals, Step } from '../models/step-info.model';
import { isEmpty } from 'lodash';
/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-molecules-step-info',
	styleUrl: 'step-info.scss',
	shadow: true
})
export class MoleculesStepInfo {
	image: string = '';

	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	/**
	 * Propiedad para mostrar la imagen según el status que se reciba
	 */
	@Prop({ mutable: true }) status: 'success' | 'attention' | 'error' | 'information' | 'loading';

	/**
	 *
	 */
	@Prop({ mutable: true }) icon: string;

	/**
	 * Property that pass the data that has to be printed
	 */
	@Prop({ mutable: true }) steps: Step[] | string;
	@Prop({ mutable: true }) $steps: Step[];
	@Watch('steps') _stepsHandler(newValue: Step[] | string) {
		this.$steps = _parseProp<Step[]>(newValue || []);
	}

	/**
	 * Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse
	 */
	@Prop({ mutable: true }) literals: IUIStepInfoLiterals | string;
	@State() _literals: IUIStepInfoLiterals;
	@Watch('literals') parseLiterals(newLiterals: IUIStepInfoLiterals | string) {
		this._literals = _parseProp<IUIStepInfoLiterals>(newLiterals as string, {});
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._stepsHandler(this.steps);
		this.parseLiterals(this.literals);
	}

	/**
	 *
	 */
	showImage() {
		switch (this.status) {
			case 'success':
				this.image = '/assets/images/i-success_dialog.svg';
				break;
			case 'attention':
				this.image = '/assets/images/i-attention_dialog.svg';
				break;
			case 'error':
				this.image = '/assets/images/i-error_dialog.svg';
				break;
			case 'information':
				this.image = '/assets/images/i-information-dialog.svg';
				break;
			case 'loading':
				this.image = '/assets/images/spinner.gif';
				break;
			default:
				this.image = '/assets/images/i-attention_dialog.svg';
				break;
		}
		return assetUrl(this.image);
	}

	render() {
		return (
			<Host>
				<div class="step-info">
					<div class="step-info__header">
						<div class="step-info__header--image">
							<img src={this.showImage()}></img>
						</div>
						<h1>{this._literals.title}</h1>
						<span>{this._literals.subtitle}</span>
					</div>
					<div class="step-info__content">
						{!isEmpty(this.$steps) && (
							<div class="step-info__steps">
								{this.$steps.map((step: Step, index) => {
									return (
										<div class="step-info__step">
											<div class="step-info__step--number">
												<h1>{index + 1}</h1>
											</div>
											<div class="step-info__step--text">
												<h3>{step.title}</h3>
												<span>{step.description}</span>
											</div>
										</div>
									);
								})}
							</div>
						)}
						<div class="step-info__information">
							<span class="step-info__information--icon" style={{ '--icon-content': `var(--theme-scib-${this.icon})` }}>
								<i class="icon" />
							</span>
							<span>{this._literals.infoText}</span>
						</div>
					</div>
					<div class="step-info__actions">
						<slot name="actions" />
					</div>
				</div>
			</Host>
		);
	}
}
