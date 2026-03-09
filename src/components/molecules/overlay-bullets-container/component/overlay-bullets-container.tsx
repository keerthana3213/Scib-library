import { Component, Element, Event, EventEmitter, Fragment, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { get } from 'lodash';
import { parseProp } from '../../../../utils/helpers/common';
import { setSelector, setWindowLocationPath } from '../../../../utils/helpers/helpFaqs';
import { ILiterals, TutorialDetails } from '../models/overlay-bullets-container.model';

@Component({
	tag: 'scib-molecules-overlay-bullets-container',
	styleUrl: 'overlay-bullets-container.scss',
	shadow: true
})
export class MoleculesOverlayBulletsContainer {
	private _container: HTMLElement;
	private _subheader: HTMLElement;
	private _scroll: HTMLElement;
	private zIndex: string = '400';
	private overlay: HTMLDivElement;

	@Element() el: HTMLElement;

	@Event() closeTutorialEvent: EventEmitter;

	/**
	 * Valores de estado
	 */
	@Prop({ mutable: true, reflect: false }) components: string | TutorialDetails[];
	@State() $components: TutorialDetails[];
	@Watch('components') _componentsHandler(newValue: string | TutorialDetails[]) {
		this.parseComponents(parseProp<TutorialDetails[]>(newValue, []));
	}

	/**
	 * Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse
	 */
	@Prop({ reflect: false }) literals: ILiterals | string;
	@State() $literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this.$literals = parseProp<ILiterals>(newLiterals as string);
	}

	/**
	 *  Ajuste de la altura del overlay
	 */
	@State() $heightOverlay: string;
	@Watch('$heightOverlay') _handlerHeightOverlay(newHeigth: string) {
		this.$heightOverlay = newHeigth;
	}

	/**
	 *  Ajuste de la altura del overlay
	 */
	@State() $heightAdjustment: string;
	@Watch('$heightAdjustment') _handlerHeightAdjustment(newHeigth: string) {
		this.$heightAdjustment = newHeigth;
	}

	/**
	 * Introduce un link de navegación para proveer mas información al usuario
	 * TODO: Esto por el momento no se usa.
	 */
	// @Prop() linkMoreInfo: string;
	// @State() $linkMoreInfo: string;
	// @Watch('linkMoreInfo') _linkMoreInfoHandler(newValue: string) {
	// 	this.$linkMoreInfo = newValue;
	// }

	/**
	 * Funcion para borrar elementos que no aparecen en el DOM
	 */
	private parseComponents(components: TutorialDetails[]) {
		let count = 0;
		let idx = 0;
		const checkNext = (components, index) => {
			count++;
			if (index < components.length - 1) {
				return this.checkNode(components[index + 1].idBullet)
					? [{ next: components[index + 1].idBullet, prev: components[index - count].idBullet }, count]
					: checkNext(components, index + 1);
			} else {
				return [{}];
			}
		};
		components.forEach((item, index) => {
			const el = this.checkNode(item.idBullet);
			if (!el && index > 0 && index < components.length && this.matchPath(item)) {
				count = 0;
				const [{ next, prev }, i] = checkNext(components, index);
				if (idx === 0) {
					idx = i + index;
				}

				if (this.checkNode(prev)) {
					components[index - 1].contentCard.next = next;
					components[idx].contentCard.prev = prev;
					components.splice(index, i);
					idx = 0;
				}
			}
		});

		this.$components = components;
	}

	/**
	 * Funcion para saber si un nodo existe en el DOM
	 */
	private checkNode(item: string) {
		// cambiar por document.body.contains(item)
		return Boolean(document.getElementById(item));
	}

	/**
	 * Funcion para eliminar el scroll y tipearlo arriba
	 */
	private styleOverflow(display: 'auto' | 'none') {
		this._scroll?.style.setProperty('--viewport-overflow-x', display);
		this._scroll?.style.setProperty('--viewport-overflow-y', display);
	}

	/**
	 * Funcion para eliminar el scroll y tipearlo arriba
	 */
	private styleHeader() {
		const newSubHeader = document.querySelector('.shell-sub-header') as any;
		this._subheader?.style.setProperty('position', 'static');
		this._subheader?.style.setProperty('margin', '-86.72px 0 29.6px');
		// this._subheader?.style.setProperty('padding', '0 88px');
		newSubHeader?.style.setProperty('display', 'none');
	}
	/**
	 * Funcion para eliminar el scroll y tipearlo arriba
	 */
	private styleReset() {
		const newSubHeader = document.querySelector('.shell-sub-header') as any;
		this._subheader?.style.removeProperty('position');
		this._subheader?.style.removeProperty('margin');
		// this._subheader?.style.removeProperty('padding');
		newSubHeader?.style.removeProperty('display');
	}

	connectedCallback() {
		document.documentElement?.classList.remove('mf-app-active');
	}

	disconnectedCallback() {
		// Clase que modifica la cabecera (CORE)
		document.documentElement?.classList.add('mf-app-active');
		// reset de todos los estilos. Esto es necesario cuando interactua con otros componentes
		this.styleReset();
		this.styleOverflow('auto');
		!!document.getElementById('overlay') && document.getElementById('overlay').remove();
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._subheader = document.body.querySelectorAll('section.sgcb-subheader.sgcb-subheader--person')[0] as HTMLElement;

		this._container =
			document.body.querySelector('scib-ui-v2-scroll-container#shell-app-scroll-container') ||
			document.body.querySelector('scib-ui-v2-scroll-container.app-wrapper__content__scroller');
		this._scroll = this._container?.shadowRoot?.querySelector('scrollable-component');
		this.styleHeader();
		this._componentsHandler(this.components);
	}

	componentDidRender() {
		this._overlayScrollable();
		const initElement = this.$components.find((item) => item.urlPath == setWindowLocationPath()).idBullet;
		this.bulletClick.emit(initElement);
	}

	/**
	 *  Evento que se lanza cuando se pulsa en el boton burbuja
	 */
	@Event({ bubbles: true, composed: true }) bulletClick: EventEmitter<string>;

	/**
	 * Listen openInfo
	 */
	@Listen('openInfo', { target: 'body' })
	public listenOpenInfo(event: CustomEvent<string>) {
		if (event.detail) {
			this.bulletClick.emit(event.detail);
		}
	}

	/**
	 * Listen closeTutorial
	 */
	@Listen('eventClose', { target: 'body' })
	@Listen('closeTutorial', { target: 'body' })
	public listenCloseTutorial() {
		this.styleReset();
		this.closeTutorialEvent.emit();
	}

	private searchId(bullet: TutorialDetails): boolean {
		const existID = this.checkNode(bullet.idBullet);
		const path = this.matchPath(bullet);
		return Boolean(existID && path);
	}

	private matchPath(bullet: TutorialDetails): boolean {
		const path = setWindowLocationPath();
		return Boolean(path == bullet.urlPath);
	}

	// private openLink() {
	// 	console.log('Navega a... ');
	// TODO: Cuando se active la opcion de navegar
	// }

	private _overlayScrollable() {
		// Cuando se arregle integracion de las cabeceras del componente hep&faqs
		// const heightFooter = this._stripFooter.getBoundingClientRect().height - 1;
		const heightFooter = 73;

		const nativeElement: HTMLElement = get(this._scroll, 'viewport');

		let componentSelector = setSelector();
		const viewPage = document.body.querySelectorAll(componentSelector)[0];

		this.overlay.addEventListener('scroll', function () {
			nativeElement.scrollTop = this.scrollTop;
		});

		this.styleOverflow('auto');

		new ResizeObserver((entries) => {
			entries.forEach(() => {
				this.overlay.scrollTop = nativeElement.scrollTop;
				this.$heightOverlay = window.innerHeight - heightFooter + 'px';
				this.$heightAdjustment = viewPage?.getBoundingClientRect()?.height + 'px';
				requestAnimationFrame(() => (this.overlay.scrollTop = 0));
			});
		}).observe(document.querySelector('html'));
	}

	private showHighlight(bullet: TutorialDetails) {
		if (bullet.bulletPosition !== 'header') {
			return <scib-atoms-highlight id-widget={bullet.idBullet} z-index={this.zIndex} />;
		}
	}

	render() {
		return (
			<Host>
				<div
					id="overlay"
					style={{
						position: 'fixed',
						width: '100vw',
						height: this.$heightOverlay,
						top: '0',
						left: '0',
						boxSizing: 'border-box',
						backgroundColor: 'rgba(0, 0, 0, 0.32)',
						zIndex: this.zIndex,
						overflowX: 'hidden',
						overflowY: 'auto'
					}}
					class="overlay-scroll"
					ref={(el) => (this.overlay = el as HTMLDivElement)}
				>
					<div class="container" style={{ height: this.$heightAdjustment, position: 'relative' }}>
						{this.$components.map(
							(bullet) =>
								!!this.searchId(bullet) && (
									<Fragment>
										{this.showHighlight(bullet)}
										<scib-atoms-bullet
											id-bullet={bullet.idBullet}
											size={bullet.size}
											position={bullet.bulletPosition}
										></scib-atoms-bullet>
										<scib-atoms-tooltip-card
											id-bullet={bullet.idBullet}
											link-title={bullet.contentCard.linkTitle}
											tooltip-card-title={bullet.contentCard.tooltipCardTitle}
											arrow-position={bullet.contentCard.arrowPosition}
											prev={bullet.contentCard.prev}
											next={bullet.contentCard.next}
											content={bullet.contentCard.content}
											disable-link={bullet.contentCard.disableLink}
											z-index={this.zIndex}
											btn-title={bullet.contentCard.btnTitle}
											width-card={bullet.contentCard.widthCard}
										/>
									</Fragment>
								)
						)}
					</div>
				</div>
			</Host>
		);
	}
}
