import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-header-mobile',
	styleUrl: 'cdk-header-mobile.scss',
	shadow: false,
	scoped: true,
})
export class CDKHeaderMobile {
	/** Oculta el contenido del slot */
	@Prop({ reflect: true }) hide: boolean;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	@Prop({ reflect: true }) literal: string;
	@State() _literal: string;
	@Watch('literal') parseLiterals(newLiterals: string) {
		this._literal = newLiterals as string;
	}

	/** Define el panel activo en mobile */
	@Event() eventDetailClose: EventEmitter;

	/** Define el panel activo en mobile */
	@Event() eventCloseComms: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literal);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	@Prop({ reflect: true }) hasSlot: boolean;

	render() {
		return (
			<Host>
				{this.hasSlot ? (
					<div id="header-black">
						<slot name="left-content" />
					</div>
				) : (
					<div id="header-black">
						<div class="left-content">
							<scib-ui-button class="c-panel-goback" nobackground small icon="icon-chrevron-right" hide-txt onEventClick={() => this.eventDetailClose.emit()}>
								""
							</scib-ui-button>
							<p>{this._literal}</p>
						</div>
						<div class="right-content">
							<scib-ui-button class="c-panel-close" nobackground small icon="icon-close" hide-txt onEventClick={() => this.eventCloseComms.emit()}>
								Close
							</scib-ui-button>
						</div>
					</div>
				)}
			</Host>
		);
	}
}
