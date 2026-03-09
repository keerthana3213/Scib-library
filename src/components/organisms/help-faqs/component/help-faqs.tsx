import { Component, Element, Fragment, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { get } from 'lodash';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IModalTutorial } from '../../../atoms/tutorial-modal/models/tutorial-modal.model';
import { TutorialDetails } from '../../../molecules/overlay-bullets-container/models/overlay-bullets-container.model';

@Component({
	tag: 'scib-organisms-help-faqs',
	styleUrl: 'help-faqs.scss',
	shadow: true
})
export class OrganismsHelpFaqs {
	@Element() _hostRef: HTMLElement;

	private _scroll: HTMLElement;
	private _coverHeader: HTMLDivElement;
	private _header: HTMLElement;

	/**
	 *  Dont Open the tutorial
	 */
	@Prop({ mutable: true, reflect: false }) skipTutorial: boolean;
	@State() $skipTutorial: boolean;
	@Watch('skipTutorial') _skipTutorialHandler(value: boolean) {
		this.$skipTutorial = value;
	}

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: false }) start: boolean;
	@State() $start: boolean;
	@Watch('start') _startHandler(newValue: boolean) {
		this.$start = newValue;
	}

	/**
	 * component array overlay.
	 */
	@Prop({ reflect: false }) components: any;
	@State() $components: TutorialDetails[];
	@Watch('components') _componentsHandler(newValue: TutorialDetails[]) {
		this.$components = _parseProp<TutorialDetails[]>(newValue);
	}

	/**
	 * modal object.
	 */
	@Prop({ reflect: false }) modal: any;
	@State() $modalObj: IModalTutorial;
	@Watch('modal') _modalObjHandler(newValue: IModalTutorial) {
		this.$modalObj = _parseProp<IModalTutorial>(newValue);
	}

	/**
	 * modal object.
	 */
	@Prop({ reflect: false }) footer: any;
	@State() $footerObj: any;
	@Watch('footer') _footerObjHandler(newValue: any) {
		this.$footerObj = _parseProp<any>(newValue);
	}

	/**
	 * Listen start tutorial click
	 */
	@Listen('startTutorialClick', { target: 'body' })
	todoCompletedHandler(event: CustomEvent<any>) {
		if (event) {
			// this.skipTutorial = true;
			this.start = false;
		}
	}

	/**
	 * Listen start tutorial click
	 */
	@Listen('skipTutorialClick', { target: 'body' })
	skipTutorialHandler(event: CustomEvent<boolean>) {
		if (event) {
			this.resetFn();
		}
	}

	connectedCallback() {
		window.addEventListener('popstate', this.resetFn);
		!!document.getElementsByTagName('sgcb-c-notifications-area').length &&
			((document.getElementsByTagName('sgcb-c-notifications-area')[0] as HTMLElement).style.display = 'none');
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._componentsHandler(this.components);
		this._skipTutorialHandler(this.skipTutorial);
		this._modalObjHandler(this.modal);
		this._footerObjHandler(this.footer);
		this._startHandler(this.$modalObj.start);
		this._scroll = document.body.querySelectorAll('scib-ui-v2-scroll-container')[0]?.shadowRoot?.querySelector('scrollable-component');
		const viewPort: HTMLElement = get(this._scroll, 'viewport');
		viewPort.scrollTo(0, 0);
		this._header =
			document.querySelector('scib-mf-dev-header') || document.querySelector('sgcb-c-header') || document.querySelector('.shell-header');
	}

	componentDidRender() {
		try {
			this._header.style.zIndex = '1';
			new ResizeObserver((entries) => {
				entries.forEach(() => {
					const { height, width } = this._header.getBoundingClientRect();
					this._coverHeader.style.height = `${height}px`;
					this._coverHeader.style.width = `${width}px`;
					this._coverHeader.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
					this._coverHeader.style.top = '0';
					this._coverHeader.style.zIndex = '99999';
					this._coverHeader.style.position = 'absolute';
				});
			}).observe(document.querySelector('html'));
		} catch (error) {
			console.error(error);
		}
	}

	private resetFn() {
		try {
			this._header.style.zIndex = '';
		} catch (error) {
			console.error(error);
		}
		!!document.querySelector('scib-organisms-help-faqs') && document.querySelector('scib-organisms-help-faqs').remove();
		!!document.getElementsByTagName('sgcb-c-notifications-area').length &&
			((document.getElementsByTagName('sgcb-c-notifications-area')[0] as HTMLElement).style.display = 'block');
		window.removeEventListener('popstate', this.resetFn);
	}

	/**
	 * Cliclo de vida ejecutado cuando se destruye el componente
	 */
	disconnectedCallback() {
		this.resetFn();
	}

	// Siguiente iteracion, mejorar la integracion con las header para que se vaya renderizando por partes

	render() {
		return (
			<Host>
				<div
					id="cover_header"
					style={{ display: this.$start ? 'none' : 'block' }}
					ref={(el) => (this._coverHeader = el as HTMLDivElement)}
				></div>
				<scib-atoms-tutorial-modal
					class={{
						animate__animated: this.$start,
						animate__fadeInDownBig: this.$start
					}}
					style={{
						width: '100vw',
						zIndex: '500',
						height: '100%',
						display: this.$start ? 'flex' : 'none'
					}}
					open={this.$start}
					img-src={this.$modalObj.imgSrc}
					modal-title={this.$modalObj.modalTitle}
					description={this.$modalObj.description}
					btn-text={this.$modalObj.btnText}
					chk-text={this.$modalObj.chkText}
					chk-value={this.$modalObj.chkValue}
					skip-tutorial={this.$skipTutorial}
				></scib-atoms-tutorial-modal>

				{!this.$start && (
					<Fragment>
						<scib-molecules-overlay-bullets-container
							components={this.$components}
							class={{
								animate__animated: !this.$start,
								animate__fadeInDownBig: !this.$start
							}}
						></scib-molecules-overlay-bullets-container>
						<scib-atoms-strip
							close-button-text={this.$footerObj.close}
							id="strip-tutorial"
							class={{
								animate__animated: this.$start,
								animate__fadeInDownBig: this.$start
							}}
						></scib-atoms-strip>
					</Fragment>
				)}
			</Host>
		);
	}
}
