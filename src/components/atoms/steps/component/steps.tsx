import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { VariantTypes } from '../../../../shared/models';
import { parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-steps',
	styleUrl: 'steps.scss',
	shadow: true
})
export class AtomsSteps {
	/**
	 * La variante altera el valor de las custom properties
	 * para cambiar la apariencia del componente en base al tema
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *
	 */
	@State() $currentStep: number = 1;

	/**
	 *
	 */
	@Prop() steps: string | any[];
	@State() $steps: any[];
	@Watch('steps') _stepsHandler(newValue: string | any[]) {
		this.$steps = parseProp<any[]>(newValue, []);
		const activeIndex = this.$steps.findIndex((i) => i.active === true);
		this.$currentStep = activeIndex > -1 ? activeIndex + 1 : activeIndex;
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._stepsHandler(this.steps);
	}

	render() {
		return (
			<Host>
				<div class="steps">
					{this.$steps.map((item, index) => (
						<span
							class={{
								steps__item: true,
								'steps__item--active': item.id <= this.$currentStep,
								'steps__item--current': item.active
							}}
						>{`${index + 1}. ${item.value}`}</span>
					))}
				</div>
			</Host>
		);
	}
}
