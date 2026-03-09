import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { IUIAvatarImage, IUIAvatarData } from '../models/ui-avatar.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-avatar',
	styleUrl: 'ui-avatar.scss',
	shadow: false,
	scoped: true,
})
export class UIAvatar {
	/** Listado de imágenes serán mostradas en el avatar */
	@Prop({ mutable: true, reflect: true }) images: string | IUIAvatarImage[];

	@Watch('images') imagesChange(newVal: string | IUIAvatarImage[]) {
		if (typeof newVal === 'string') {
			try {
				this._images = JSON.parse(newVal || '[]');
			} catch (e) {
				console.error(e);
			}
		} else {
			this._images = newVal;
		}
	}

	@State() _images: IUIAvatarImage[];

	/** Rol del elemento para accesibilidad */
	@Prop({ mutable: true, reflect: true }) role: string = 'img';

	/** Etiqueta aria label para identificar el elemento en accesibilidad */
	@Prop({ mutable: true, reflect: true }) ariaLabel: string = 'avatar';

	/** Número a mostrar en el globo de notificación */
	@Prop({ mutable: true, reflect: true }) notifications: number = 0;

	/** Fuerza al globo a aparecer sin número */
	@Prop({ mutable: true, reflect: true }) showBubble: boolean;

	/** Indica si el usuario es empleado o no */
	@Prop({ mutable: true, reflect: true }) isEmployee: boolean;

	/** Show tooltip default browser */
	@Prop({ mutable: true, reflect: true }) tooltipTitle: string;

	/** Datos: Título a mostrar a la derecha del avatar y texto al pie */
	@Prop({ mutable: true, reflect: true }) data: string | IUIAvatarData;

	@Watch('data') dataChange(newVal: string | IUIAvatarData) {
		if (typeof newVal === 'string') {
			try {
				this._data = JSON.parse(newVal || '');
			} catch (e) {
				console.error(e);
			}
		} else {
			this._data = newVal;
		}
	}

	@State() _data: IUIAvatarData;

	/** Devuelve el icono avatar */
	_returnAvatarIcon(): string {
		return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 350 350' class='sc-scib-ui-avatar' style=' height: 100%25; width: 100%25; fill: %23b5b5b5;%0A'%3E%3Cg class='sc-scib-ui-avatar'%3E%3Cpath d='M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587 C104.535,132.855,136.084,171.173,175,171.173z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761 s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131 c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496 c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`;
	}

	componentWillLoad() {
		this.imagesChange(this.images);
		this.dataChange(this.data);
	}

	render() {
		/** Calcula el font size en base a la cantidad de imagenes  */
		const fontSize: { [key: number]: string } = {
			0: '1.25rem',
			1: '1.25rem',
			2: '1rem',
			3: '0.75rem',
			4: '0.75rem',
		};
		const avatarSRC: string = this._images[0].src;
		return (
			<Host
				class={{
					'--labels': !!this._data?.text || !!this._data?.title,
				}}
			>
				<div
					class={{
						'c-avatar__heading': true,
						'--labels': !!this._data?.text || !!this._data?.title,
					}}
					title={this.tooltipTitle}
				>
					<div
						class={{
							'c-avatar__photo': true,
							'--labels': !!this._data?.text || !!this._data?.title,
						}}
					>
						{this.notifications > 0 ? (
							<scib-atoms-badge
								variant={'red'}
								type="sm"
								text={this.notifications.toString()}
								class="badge"
							></scib-atoms-badge>
						) : (
							''
						)}

						<div
							class={{
								'c-avatar-container': true,
								'--is-employee': this.isEmployee,
							}}
							style={{
								'font-size': fontSize[this._images?.length] || '1rem',
							}}
						>
							{this._images?.slice(0, 4).map(avatar => (
								<div
									class={{
										'c-image': true,
										'c-image-fallback': !avatar.src && !avatar.alt,
									}}
									style={
										avatar.src && avatar.src !== 'null' // ¿por qué se seteó esto?
											? {
													'background-image': `url(${avatar.src}), ${this._returnAvatarIcon()}`,
											  }
											: {}
									}
								>
									{avatar?.src?.includes('base64') && <img src={avatarSRC}></img>}
									{!avatar.src && (
										<span>
											{avatar?.alt?.slice(0, 1).toUpperCase()}
											{avatar?.alt?.split(' ')[1]?.slice(0, 1).toUpperCase()}
										</span>
									)}
								</div>
							))}
							{!this._images && <div class="c-image c-image-fallback"></div>}
						</div>
					</div>
					{!!this._data?.title && <h4 class="c-avatar__title">{this._data?.title}</h4>}
				</div>
				{!!this._data?.text && <p class="c-avatar__text">{this._data?.text}</p>}
			</Host>
		);
	}
}
