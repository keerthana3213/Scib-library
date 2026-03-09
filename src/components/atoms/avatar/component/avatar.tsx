import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { VariantTypes } from '../../../../shared/models';

@Component({
	tag: 'scib-atoms-avatar',
	styleUrl: 'avatar.scss',
	shadow: true
})
export class AtomsAvatar {
	@Element() _hostRef: HTMLElement;

	/**
	 * La variante altera el valor de las custom properties
	 * para cambiar la apariencia del componente en base al tema
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *
	 */
	@Prop({ reflect: true }) type: 'sm' | 'md';

	/**
	 * Propiedad para reflejar las iniciales
	 */
	@State() $text: string;
	@Prop() text: string;
	@Watch('text') _textHandler(newValue: string) {
		this.$text = !!newValue ? newValue.slice(0, 2).toUpperCase() : '';
	}

	/**
	 * Propiedad de imagen
	 */
	@State() $img: string;
	@Prop() img: string;
	@Watch('img') _imgHandler(newValue: string) {
		this.$img = newValue;
	}

	/**
	 * Propiedad de badge
	 */
	@Prop({ reflect: true }) badge: string = '';

	@Prop({ reflect: true }) alt: string = '';

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._textHandler(this.text);
		this._imgHandler(this.img);
	}

	render() {
		const innerAvatar = !!this.$text ? (
			<span class="avatar__letters">{this.$text}</span>
		) : (
			<img src={this.$img} class="avatar__img avatar__border" alt={this.alt ?? ''} />
		);

		return (
			<Host>
				<div class={{ avatar: true, avatar__border: !!this.$text }}>
					{innerAvatar}
					{this.badge ? <scib-atoms-badge variant={this.variant} type="sm" text={this.badge} class="badge"></scib-atoms-badge> : ''}
				</div>
			</Host>
		);
	}
}
