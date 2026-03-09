import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Component, Prop, Listen, State, Watch } from '@stencil/core';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-highlight',
	styleUrl: 'highlight.scss',
	shadow: true
})
export class AtomsHighlight {
	/**
	 * Propiedad para identificar el componete por id.
	 */
	@Prop({ mutable: true, reflect: true }) idWidget: string;

	/**
	 * Cambia el valor de idWidget por un nuevo valor
	 */
	@State() $idWidget: string;
	@Watch('idWidget') _idWidgetHandler(newValue: string) {
		this.$idWidget = newValue;
	}

	@Prop({ mutable: true, reflect: true }) zIndex: string = '500';
	@State() $zIndex: string;
	@Watch('zIndex') _zIndexHandler(newValue: string) {
		// Siempre le agregamos 50 puntos
		this.$zIndex = String(Number(newValue) + 50);
	}

	/**
	 * ELemento original referenciado por el ID, el cual sera el que se clone.
	 */
	private element: HTMLElement;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._idWidgetHandler(this.idWidget);
		this._zIndexHandler(this.zIndex);
		this.element = document.getElementById(`${this.$idWidget}`);
	}

	/**
	 * Funcion para resetear los estilos de componentes levantados
	 */
	private modifyStyles(reset: boolean = false) {
		this.element.style.zIndex = reset ? '' : this.$zIndex;
		this.element.style.pointerEvents = reset ? '' : 'none';
		this.element.style.backgroundColor = reset ? '' : '#ffffff';
		this.element.style.boxShadow = reset ? '' : '0px 0px 5px 10px #ffffff';
	}

	/**
	 * Ciclo de vida al eliminar la instancia del componente
	 */
	disconnectedCallback() {
		this.modifyStyles(true);
	}

	/**
	 * bulletClick
	 */
	@Listen('bulletClick', { target: 'body' })
	public listenClickEvent(event: CustomEvent<string>) {
		if (this.$idWidget === event.detail) {
			this.modifyStyles(false);
		}
		event.detail === this.idWidget || this.modifyStyles(true);
	}

	/**
	 * closeCardTooltip
	 */
	@Listen('closeCardTooltip', { target: 'body' })
	public listenOnCloseModal(event: CustomEvent<{ id: string; close: boolean }>) {
		if (this.$idWidget === event.detail.id) {
			this.modifyStyles(true);
		}
	}
}
