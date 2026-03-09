import { Component, Host, h, Prop, EventEmitter, Event, Listen, State, Watch } from '@stencil/core';
import { UIButtonLoading } from '../fragments/ui-button-loading.fragment';
import { UIButtonTooltip } from '../fragments/ui-button-tooltip.fragment';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-button',
	styleUrl: 'ui-button.scss',
	shadow: false,
	scoped: true
})
export class UIButton {
	$button!: HTMLButtonElement;

	/** Texto del Tooltip personalizado */
	@Prop({ reflect: true }) disabledTooltip: string;

	/** Clase específica para el tooltip personalizado */
	@Prop({ reflect: true }) classTooltip: string;

	/** Tooltip del navegador por defecto, no personalizado */
	@Prop({ reflect: true }) tooltip: string;

	/** Icono a la derecha */
	@Prop({ reflect: true }) icon: string;

	/** Type del button */
	@Prop({ reflect: true }) type: string;

	/** Oculta el texto salvo para accesibilidad */
	@Prop({ reflect: true }) hideTxt: boolean;

	/** Muestra el texto sólo a partir del breakpoint establecido */
	@Prop({ reflect: true }) showTextOn: 'mobile' | 'tablet' | 'desktop';

	/** Variante "primary" */
	@Prop({ reflect: true }) primary: boolean;

	/** Variante "secondary" */
	@Prop({ reflect: true }) secondary: boolean;

	/** Variante "tertiary" */
	@Prop({ reflect: true }) tertiary: boolean;

	/** Variante aspecto de "link" */
	@Prop({ reflect: true }) link: boolean;

	/** Variante "nobackground" */
	@Prop({ reflect: true }) nobackground: boolean;

	/** Muestra el botón a 32px en desktop */
	@Prop({ reflect: true }) small: boolean;

	/** Muestra el botón a 28px en desktop */
	@Prop({ reflect: true }) ultrasmall: boolean;

	/** Muestra el botón a 40px en desktop */
	@Prop({ reflect: true }) medium: boolean;

	/** Muestra el botón a 48px en desktop */
	@Prop({ reflect: true }) large: boolean;

	/** Muestra el texto del botón a 14px */
	@Prop({ reflect: true }) smallText: boolean;

	/** Muestra el botón como deshabilitado */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;
	@Watch('disabled') handleDisabled(newValue: boolean) {
		this._disabled = newValue;
	}
	@State() _disabled: boolean;

	/** Muestra el botón cargando */
	@Prop({ reflect: true }) loading: boolean;

	/** Deshabilita el min-width del botón */
	@Prop({ reflect: true }) disableMinWidth: boolean;

	/** Deshabilita el width del botón */
	@Prop({ reflect: true }) disableWidth: boolean;

	/** Deshabilita el padding izquierdo cuando se muestra icono a la derecha */
	@Prop({ reflect: true }) noPaddingLeft: boolean;

	/** Indica si se quiere añadir el icono a la izquierda */
	@Prop({ reflect: true }) iconLeft: boolean;

	/** Indica si se usa una imagen en vez de un icono */
	@Prop({ reflect: true }) image: boolean;

	/** Indica si la imagen se posiciona a la izq */
	@Prop({ reflect: true }) imageLeft: boolean;

	/** Ruta de la imagen */
	@Prop({ reflect: true, mutable: true }) imageSrc: string;

	/** Texto deciptivo de la imagen */
	@Prop({ reflect: true, mutable: true }) imageDescriptionText: string;

	/** Indica si se quiere evitar la propagación del evento click */
	@Prop({ reflect: true }) noEventPropagation: boolean;

	/** Muestra una bola sobre el icono del botón indicando que tiene nuevas notificaciones */
	@Prop({ reflect: true }) haveNotification: boolean;

	/** Adapta el botón para ser colocado en una label */
	@Prop({ reflect: true }) labelSize: boolean;

	/** Elimina el padding de izquierda y derecha del botón */
	@Prop({ reflect: true }) noLateralPadding: boolean;

	/** Set up styles for communication framework button */
	@Prop({ reflect: true }) communicationNew: boolean;

	/** Set up styles for set a red icon */
	@Prop({ reflect: true }) redIcon: boolean = false;

	/** función en formato string para evaluar **/
	@Prop({ reflect: true }) customData: string;

	/**  */
	@Event() eventClick: EventEmitter;

	@Event() eventClickWithData: EventEmitter;

	@Listen('click', { capture: true }) _clickHandler(event) {
		if (this._disabled) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	componentWillLoad() {
		this.handleDisabled(this.disabled);
	}

	render() {
		return (
			<Host>
				<button
					onClick={(e) => {
						if (!this.loading && this.customData) {
							this.eventClickWithData.emit(this.customData);
						} else if (!this.loading) {
							this.eventClick.emit(e);
						}
						if (this.noEventPropagation || this.loading) {
							e.stopPropagation();
						}
					}}
					disabled={this._disabled}
					type={this.type || 'button'}
					ref={(el) => (this.$button = el as HTMLButtonElement)}
					class={{
						'c-button': true,
						'--primary': this.primary,
						'--secondary': this.secondary,
						'--tertiary': this.tertiary,
						'--link': this.link,
						'--nobackground': this.nobackground,
						'--only-icon-right': Boolean(this.icon),
						'--only-one-icon': this.hideTxt,
						'--only-one-icon-tablet': this.showTextOn === 'tablet',
						'--only-one-icon-desktop': this.showTextOn === 'desktop',
						'--small': this.small,
						'--ultrasmall': this.ultrasmall,
						'--medium': this.medium,
						'--large': this.large,
						'--small-txt': this.smallText,
						'--loading': this.loading,
						'--no-padding-left': this.noPaddingLeft,
						'--have-notification': this.haveNotification,
						'--disableMinWidth': this.disableMinWidth,
						'--disableWidth': this.disableWidth,
						'--labelSize': this.labelSize,
						'--no-lateral-padding': this.noLateralPadding,
						'--communication': this.communicationNew,
						'--redIcon': this.redIcon,
						[this.classTooltip]: !!this.classTooltip
					}}
					title={this.tooltip}
				>
					{this.icon && this.iconLeft && <i class={{ 'u-icon c-icon --left': true, [this.icon]: true }}></i>}
					{this.image && this.imageLeft && !this.icon && (
						<img alt={this.imageDescriptionText ? this.imageDescriptionText : null} src={this.imageSrc ? this.imageSrc : null} />
					)}
					{this.loading && <UIButtonLoading />}
					{this._disabled && this.disabledTooltip && (
						<UIButtonTooltip classTooltip={this.classTooltip} text={this.disabledTooltip}></UIButtonTooltip>
					)}
					<span>
						<slot />
					</span>
					{this.icon && !this.iconLeft && <i class={{ 'u-icon c-icon --right': true, [this.icon]: true }}></i>}
				</button>
			</Host>
		);
	}
}
