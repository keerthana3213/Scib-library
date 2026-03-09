import { Component, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Panel, PanelStatus } from '../models/color-panel.model';
import { isEmpty } from 'lodash';
import { IconsName } from '../../color-icon/models/color-icon.model';

/**
 * Component description
 *
 * @slot title - Slot custom title
 * @slot description - Slot custom description
 */
@Component({
	tag: 'scib-atoms-color-panel',
	styleUrl: 'color-panel.scss',
	shadow: true
})
export class AtomsColorPanel {
	@Element() _hostRef: HTMLElement;

	/**
	 * Default property where the specific configuration of the component is received.
	 */
	@Prop() panels: Panel[] | string;
	@State() $panels: Panel[];
	@Watch('panels') _panelsHandler(newValue: Panel[] | string) {
		this.$panels = _parseProp<Panel[]>(newValue || []);
	}

	/**
	 *  Event emitted when the defined action is clicked.
	 */
	@Event() actionLink: EventEmitter;

	componentWillLoad() {
		this._panelsHandler(this.panels);
	}

	getColorSchema(panel: Panel) {
		switch (panel.status) {
			case PanelStatus.INFO:
				return ['var(--_ui-v2-color-panel-card-info-bg-color)', 'information'];
			case PanelStatus.SUCCESS:
				return ['var(--_ui-v2-color-panel-card-sucess-bg-color)', 'checkmark'];
			case PanelStatus.WARNING:
				return ['var(--_ui-v2-color-panel-card-warning-bg-color)', 'warning'];
			case PanelStatus.ERROR:
				return ['var(--_ui-v2-color-panel-card-error-bg-color)', 'error'];
			default:
				return [panel.color, `var(--theme-scib-icon-${panel.icon})`];
		}
	}

	/**
	 * Checks the color format of the panel and returns the appropriate color with opacity.
	 *
	 * @param {Panel} panel - The panel object containing color information.
	 * @returns {string} The color with opacity.
	 */
	checkColorFormat(panel: Panel): string {
		let colorOpacity = this.getColorSchema(panel)[0];
		if (!panel.status) {
			// Hexadecimal color
			if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(panel.color)) {
				colorOpacity = `${panel.color}1A`;
			}

			// RGB color
			if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(panel.color)) {
				const rgbValues = panel.color.replace(/\s/g, '').slice(4, -1).split(',');

				const red = parseInt(rgbValues[0], 10);
				const green = parseInt(rgbValues[1], 10);
				const blue = parseInt(rgbValues[2], 10);
				// RGBA
				colorOpacity = `rgba(${red}, ${green}, ${blue}, 0.1)`;
			}
		}

		return colorOpacity;
	}

	private _deletePanel(i) {
		this.$panels.splice(i, 1);
		this.$panels = [...this.$panels];
	}

	private _actionLink() {
		this.actionLink.emit();
	}

	render() {
		return (
			<Host>
				{!isEmpty(this.$panels) && (
					<div class="color-panel">
						{this.$panels.map((panel, index) => (
							<div
								class={{
									'color-panel__card': true,
									'color-panel__border': !!panel?.status
								}}
								style={{
									'--_ui-v2-color-panel-card-bg-color': this.checkColorFormat(panel)
								}}
							>
								{panel?.icon && (
									<div class="color-panel__icon">
										<i
											class={`icon u-icon c-icon`}
											style={{
												'--icon-content': this.getColorSchema(panel)[1],
												color: this.getColorSchema(panel)[0]
											}}
										/>
									</div>
								)}
								{panel?.status && (
									<scib-atoms-color-icon class="icons" name={this.getColorSchema(panel)[1] as IconsName}></scib-atoms-color-icon>
								)}
								<div class="color-panel__content">
									{panel?.title && (
										<h2
											class={{
												'color-panel__title': true,
												'color-panel__separation': panel?.title && (panel?.description || panel?.action) ? true : false
											}}
										>
											{panel?.title}
										</h2>
									)}

									<slot name="title" />
									{panel?.description && (
										<p
											class={{
												'color-panel__description': true,
												'color-panel__separation': panel?.action ? true : false
											}}
										>
											{panel?.description}
										</p>
									)}

									<slot name="description" />
									<p class="color-panel__action" onClick={() => this._actionLink()}>
										{panel?.action}
									</p>
								</div>
								{panel?.showClose && (
									<div class="color-panel__delete">
										<i class="icon" onClick={() => this._deletePanel(index)} />
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</Host>
		);
	}
}
