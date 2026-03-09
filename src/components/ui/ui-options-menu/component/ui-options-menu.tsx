import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals } from '../models/ui-options-menu.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-options-menu',
	styleUrl: 'ui-options-menu.scss',
	shadow: false,
	scoped: true,
})
export class UIOptionsMenu {
	/** Muestra el contenido del slot */
	@Prop({ reflect: true }) showSlot: boolean = false;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Propiedad que setea los estilos de la opción seleccionada del menu */
	@Prop({ mutable: true, reflect: true }) activeTab: string;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) buttons: Array<any> | string;

	@State() _buttons: Array<any>;

	@Watch('buttons') parsebuttons(newbuttons: Array<any> | string) {
		this._buttons = _parseProp<any>(newbuttons as string);
	}

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) idElem: number | string;
	@State() _idElem: string;
	@Watch('idElem') parseId(newid: number | string) {
		this._idElem = newid as string;
	}

	@Prop({ reflect: true }) isMobile: boolean = false;

	/** click button event */
	@Event() eventClickOptions: EventEmitter<any>;

	/** Evento emisor del item seleccionado */
	eventClick(eventId, id) {
		this.eventClickOptions.emit({ eventId, id });
	}

	@Event() eventCloseMobile: EventEmitter<any>;

	eventClose() {
		this.eventCloseMobile.emit();
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parsebuttons(this.buttons);
		this.parseId(this.idElem);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	render() {
		return (
			<div>
				<div
					class={{ '--overlay': true, '--is-mobile': this.isMobile }}
					onClick={() => {
						this.eventClose();
					}}
				/>
				<div class={{ 'ui-options-menu ui-options-menu__container': true, '--is-mobile': this.isMobile }}>
					{this.showSlot ? (
						<div class="ui-options-menu__slot">
							<slot />
							<scib-ui-separator></scib-ui-separator>
						</div>
					) : (
						''
					)}
					<div class="ui-options-menu__buttons">
						{this._buttons?.map(
							item =>
								item.active !== false && (
									<div
										class={{ 'ui-options-menu__item': true, 'separator': item.separator, '--is-mobile': this.isMobile }}
										onClick={() => {
											this.eventClick(item.eventId, this._idElem);
										}}
									>
										{item.icon && <i class={{ 'u-icon': true, [item.icon]: true }}></i>}
										<span>
											<span class={{ 'selected-section-bottom-border': this.activeTab === item.eventId }}>{item.text}</span>
											{item.separator}
										</span>
									</div>
								),
						)}
					</div>
				</div>
			</div>
		);
	}
}
