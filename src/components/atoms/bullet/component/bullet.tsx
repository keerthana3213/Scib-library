import { Component, h, EventEmitter, Event, Prop, Listen, State } from '@stencil/core';

// TODO: REVIEW

@Component({
	tag: 'scib-atoms-bullet',
	styleUrl: 'bullet.scss',
	shadow: false,
	scoped: false
})
export class AtomsBullet {
	/**
	 *  hide Bullet
	 */
	@Prop({ mutable: true, reflect: true }) hide: boolean = false;

	/**
	 *  Id Bullet
	 */
	@Prop({ reflect: true }) idBullet: string;

	/**
	 *  size Bullet
	 */
	@Prop({ reflect: true }) size?: 'small' | 'normal' | 'large' = 'normal';

	/**
	 *  position Bullet
	 */
	@Prop({ reflect: true }) position?: 'medium-left' | 'medium-right' | 'header' | 'left' | 'right' | 'top' | 'bottom' = 'left';

	/**
	 *  ELement
	 */
	@State() element: HTMLElement;

	/**
	 *  First Circle pixels
	 */
	@State() firstCirclePx: string = '13px';

	/**
	 *  Second Circle pixels
	 */
	@State() secondCirclePx: string = '26px';

	/**
	 *  Third Circle pixels
	 */
	@State() thirdCirclePx: string = '39px';

	/**
	 *  Sizes
	 */
	@State() sizes = {
		small: 11,
		normal: 13,
		large: 16
	};

	/**
	 *  Posicion en x
	 */
	@State() $posX: string;

	/**
	 *  Posicion en y
	 */
	@State() $posY: string;

	/**
	 *  Evento que se lanza cuando se pulsa en el boton burbuja
	 */
	@Event({ bubbles: true, composed: true }) bulletClick: EventEmitter<string>;
	private _onBulletClick(idBullet: string) {
		this.bulletClick.emit(idBullet);
	}

	/**
	 * Listen bullet Click
	 */
	@Listen('bulletClick', { target: 'body' })
	public hideBullet(event: CustomEvent<string>) {
		this.hide = event.detail === this.idBullet ? true : false;
	}

	/**
	 * Listen closeCardTooltip
	 */
	@Listen('closeCardTooltip', { target: 'body' })
	public closeModal(event: CustomEvent<{ id: string; close: boolean }>) {
		if (event.detail.id === this.idBullet) {
			this.hide = false;
		}
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this.element = document.getElementById(`${this.idBullet}`);
		this.responsive();
	}

	componentWillRender() {
		this._setSize();
	}

	private responsive() {
		const halfBullet = this.sizes[this.size] / 2;
		new ResizeObserver((entries) => {
			entries.forEach(() => {
				const { width, height, x, y } = this.element.getBoundingClientRect();
				switch (this.position) {
					case 'left':
						this.$posX = `${x - halfBullet}px`;
						this.$posY = `${y - halfBullet}px`;
						break;
					case 'right':
						this.$posX = `${width + x + halfBullet}px`;
						this.$posY = `${y - halfBullet}px`;
						break;
					case 'top':
						this.$posX = `${width / 2 + x + halfBullet}px`;
						this.$posY = `${y - halfBullet}px`;
						break;
					case 'bottom':
						this.$posX = `${width / 2 + x + halfBullet}px`;
						this.$posY = `${height + y - halfBullet}px`;
						break;
					case 'medium-left':
						this.$posX = `${x - width / 2 - halfBullet}px`;
						this.$posY = `${y + height / 2 - halfBullet}px`;
						break;
					case 'medium-right':
						this.$posX = `${width + x + halfBullet}px`;
						this.$posY = `${height / 2 + y - halfBullet}px`;
						break;
					case 'header':
						this.$posX = `${width / 2 + x - halfBullet}px`;
						this.$posY = `${height + y * 2 + halfBullet * 2}px`;
						break;
				}
			});
		}).observe(document.querySelector('html'));
	}

	/**
	 * Select pixels based on size and circle
	 */
	private _setSize(): void {
		this.firstCirclePx = `${this.sizes[this.size]}px`;
		this.secondCirclePx = `calc(${this.sizes[this.size]} * 2px)`;
		this.thirdCirclePx = `calc(${this.sizes[this.size]} * 3px)`;
	}

	render() {
		return (
			<div
				id={`bullet-${this.idBullet}`}
				class="balls"
				onClick={this._onBulletClick.bind(this, this.idBullet)}
				style={{
					display: this.hide ? 'none' : 'flex',
					left: this.$posX,
					top: this.$posY,
					padding: '0px',
					margin: '0px',
					borderRadius: '50%',
					borderStyle: 'none',
					position: 'absolute',
					width: this.firstCirclePx,
					height: this.firstCirclePx,
					background: 'var(--atoms-bullet-bg-color)',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignContent: 'space-between',
					cursor: 'pointer'
				}}
			>
				<div
					style={{
						content: '',
						borderRadius: '50%',
						position: 'absolute',
						// display: flex;
						width: this.secondCirclePx,
						height: this.secondCirclePx,
						opacity: '0.4',
						background: 'white',
						top: '-50%' //for firefox
					}}
				></div>
				<div
					style={{
						content: '',
						borderRadius: '50%',
						position: 'absolute',
						// display: flex;
						width: this.thirdCirclePx,
						height: this.thirdCirclePx,
						opacity: '0.2',
						background: 'white',
						top: '-100%' //for firefox
					}}
				></div>
			</div>
		);
	}
}
