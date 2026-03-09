import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { merge } from 'lodash';
import { parseProp } from '../../../../utils/helpers/common';
import { stateConfig } from '../models/ui-v2-states.model';

@Component({
	tag: 'scib-ui-v2-states',
	styleUrl: 'ui-v2-states.scss',
	shadow: true,
})
export class UI_V2States {
	/**
	 * Valores de estado
	 */
	@Prop() states: any;
	@State() $states: any[];
	@Watch('states') _statesHandler(newValue: any) {
		this.$states = parseProp<any[]>(newValue, []).map(state => {
			return merge({}, stateConfig[state.state] || stateConfig['default'], state);
		});
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this._statesHandler(this.states);
	}

	render() {
		return (
			<Host>
				<div class="state">
					{(this.$states || []).map(state => {
						return (
							<div class="state__group">
								<div class="figure">
									<figure class="figure state__figure" style={{ 'background': state.background, '--icon-content': `var(--theme-scib-icon-${state.icon})` }}>
										<i class="icon state__icon" style={{ color: state.color }} />
									</figure>
								</div>
								<span class="state__meta">{state.label}</span>
							</div>
						);
					})}
				</div>
			</Host>
		);
	}
}
