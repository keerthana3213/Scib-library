import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Panel } from '../../../atoms/color-panel/models/color-panel.model';
import { keys } from 'lodash';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-molecules-step-status-info',
	styleUrl: 'step-status-info.scss',
	shadow: true,
})
export class MoleculesStepStatusInfo {
	@Element() _hostRef: HTMLElement;

	/**
	 * Property that pass the data that has to be printed
	 */

	@Prop() panels: Panel[] | string;
	@State() $panels: Panel[];
	@Watch('panels') _panelsHandler(newValue: Panel[] | string) {
		let panels = _parseProp<Panel[]>(newValue || []);
		this.$panels = this.groupPanelsByStep(panels);
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._panelsHandler(this.panels);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {}

	/**
	 * Ciclo de vida al eliminar la instancia del componente
	 */
	disconnectedCallback() {}

	/**
	 * Descripción del evento
	 */
	@Event() eventChange: EventEmitter;

	groupPanelsByStep(panels) {
		const panel = panels.reduce((acc, panel) => {
			const { step } = panel;

			if (step) {
				acc[step] = acc[step] ?? [];
				acc[step].push(panel);

				return acc;
			}
		}, {});

		return panel;
	}

	render() {
		return (
			<Host>
				<div class="step-status-info">
					{keys(this.$panels).map(step => {
						return (
							<div class="step-status-info__row">
								<div class="step-status-info__step-container">
									<h3 class="step-status-info__number">{step}</h3>
								</div>
								<div class="step-status-info__panels-container">
									<scib-atoms-color-panel panels={this.$panels[step]}></scib-atoms-color-panel>
								</div>
							</div>
						);
					})}
				</div>
			</Host>
		);
	}
}
