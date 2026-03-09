import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { CounterPanelData, CounterPanels, defaultPanels } from '../models/ui-v2-counter-panel.model';
import { UiV2CounterPanelCardS } from '../fragments/ui-v2-counter-panel-card-s.fragment';
import { UiV2CounterPanelCardM } from '../fragments/ui-v2-counter-panel-card-m.fragment';
import { parseProp } from '../../../../utils/helpers/common';
import { CommonSizeTypes } from '../../../../shared/models';
import { get, isEmpty, merge, isNaN } from 'lodash';

@Component({
	tag: 'scib-ui-v2-counter-panel',
	styleUrl: 'ui-v2-counter-panel.scss',
	shadow: true
})
export class UI_V2CounterPanel {
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@State() $activeIds: number[] = [];

	/**
	 * Property for select the single or multiple selection filter
	 */
	@Prop() singleSelection: boolean = false;

	/**
	 *
	 */
	@Prop({ reflect: true }) size: CommonSizeTypes = 'm';

	/**
	 * Property that pass the data that has to be printed
	 */
	@Prop() panels: string | CounterPanels;
	@State() $panels: CounterPanels;
	@Watch('panels') _panelsHandler(newValue: string | CounterPanels) {
		const _activeIds = [];
		this.$panels = parseProp<CounterPanels>(newValue, []).map((panel, id) => {
			const { status, active } = panel;
			if (active) {
				_activeIds.push(id);
			}
			return merge({}, { color: get(defaultPanels, status) }, panel);
		});
		this.$activeIds = _activeIds;
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._panelsHandler(this.panels);
	}

	/**
	 * Descripción del evento
	 */
	@Event() panelClick: EventEmitter<CounterPanels>;

	/**
	 *
	 * @param event
	 * @param id
	 */
	handlerClick(event: Event, id: number) {
		event.stopPropagation();
		event.stopPropagation();
		const exists = this.$activeIds.indexOf(id) > -1;
		if (exists) {
			this.$activeIds = this.$activeIds.filter((item) => item !== id);
		} else {
			if (this.singleSelection) {
				this.$activeIds = [id];
			} else {
				this.$activeIds = [...this.$activeIds, id];
			}
		}
		const panels = this.$activeIds.map((activeId) => this.$panels[activeId]);
		this.panelClick.emit(panels);
	}

	/**
	 *
	 * @param panel
	 */
	getPanelIndicator(panel: CounterPanelData): string | number {
		const { counter, limit } = panel;
		if (isNaN(Number(counter))) {
			return counter;
		} else {
			return limit && counter > limit ? `${limit}+` : counter;
		}
	}

	render() {
		return (
			<Host>
				{!isEmpty(this.$panels) && (
					<div
						class={{
							'counter-panel': true,
							'counter-panel--small': this.size === 's'
						}}
					>
						{this.$panels.map((panel: CounterPanelData, id: number) => {
							const params = {
								id,
								panel,
								activeIds: this.$activeIds,
								handlerClick: this.handlerClick.bind(this),
								getPanelIndicator: this.getPanelIndicator.bind(this)
							};
							return this.size === 's' ? <UiV2CounterPanelCardS {...params} /> : <UiV2CounterPanelCardM {...params} />;
						})}
					</div>
				)}
			</Host>
		);
	}
}
