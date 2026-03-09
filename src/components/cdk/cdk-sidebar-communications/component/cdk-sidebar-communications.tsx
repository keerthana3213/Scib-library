import { ICDKSidecommProfile, ICDKSidecommTab, ECDKSidecommTabIds } from '../models/cdk-sidebar-communications.model';
import { CDKSidebarCommunicationsProfileBar } from '../fragments/cdk-sidebar-communications-profile-bar.fragment';
import { Component, Host, h, Prop, EventEmitter, Element, Watch, State, Event, Listen } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-sidebar-communications',
	styleUrl: 'cdk-sidebar-communications.scss',
	shadow: false,
	scoped: true,
})
export class CDKSidebarCommunications {
	hasSlot: boolean;

	/** Posiciona el componente como "fixed" */
	@Prop({ mutable: true, reflect: true }) fixed: boolean;

	/** Oculta la sidebar en mobile */
	@Prop({ mutable: true, reflect: true }) hideBarOnMobile: boolean;

	/** Establece la tab indicada como la activa y abierta. Asocia la animación a una propiedad independiente */
	@Prop({ mutable: true, reflect: true }) open: boolean;

	/** Bloquea el scroll en el body */
	@Watch('open') openChange(isOpen: boolean) {
		if (this.fixed) {
			document.body.style.overflow = isOpen ? 'hidden' : null;
			document.body.style.position = isOpen ? 'static' : null;
		}
		this.panelToggle.emit(this.open);
	}

	/** Establece la tab indicada como la activa y abierta */
	@Prop({ mutable: true, reflect: true }) activeTab: string;
	@Watch('activeTab') listenTabChange(newTab: string) {
		this.tabChange.emit(newTab);
		this.checkActiveTabData();
	}

	/** Emite un evento con la tab activa */
	@Event() tabChange: EventEmitter<string>;

	/** Emite un evento cuando se abre/cierra la ventana  */
	@Event() panelToggle: EventEmitter<boolean>;

	/** Tabs a mostrar en la barra */
	@Prop({ mutable: true, reflect: true }) tabs: string;
	@Watch('tabs') parseTabs(newTabs: string) {
		if (newTabs) {
			try {
				this._tabs = JSON.parse(newTabs);
			} catch (e) {
				console.error(e);
			}
		}
	}
	@State() _tabs: ICDKSidecommTab[];

	/** Tabs a mostrar en la barra */
	@Prop({ mutable: true, reflect: true }) profile: string;
	@Watch('profile') parseProfile(newProfile: string) {
		try {
			this._profile = JSON.parse(newProfile);
		} catch (e) {
			console.error(e);
		}
	}
	@State() _profile: ICDKSidecommProfile;

	/** Escucha los eventos de tecla */
	@Listen('keydown', { target: 'document' }) handleKeyDown(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			this.open = false;
		}
	}

	@Element() hostElement: HTMLStencilElement;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseTabs(this.tabs);
		this.parseProfile(this.profile);
		this.openChange(this.open);
		this.checkActiveTabData();
	}

	checkActiveTabData() {
		this._tabs?.map(tab => {
			if (tab.id === this.activeTab) {
				const tabId = 'tab-' + tab.id;
				this.hasSlot = this.hostElement.querySelector('[slot="' + tabId + '"]').hasChildNodes();
			}
		});
	}

	handleTabChange(tabId: ECDKSidecommTabIds) {
		this.activeTab = tabId;
	}

	togglePanel() {
		this.open = !this.open;
	}

	render() {
		return (
			<Host
				class={{
					'--fixed': this.fixed,
					'--open': this.open,
					'--close': !this.open,
					'--has-profile': Boolean(this._profile),
				}}
			>
				<div class="c-panel-overlay" onClick={this.togglePanel.bind(this)}></div>
				<div class="c-panel">
					<div class="c-panel-container">
						{this._tabs?.map(tab => (
							<div class={{ 'c-panel-content': true, '--active': tab.id === this.activeTab }}>
								<slot name={'tab-' + tab.id} />
							</div>
						))}
					</div>
					<header class="c-profile-wrapper">
						<CDKSidebarCommunicationsProfileBar
							onClose={this.togglePanel.bind(this)}
							name={this._profile.name}
							avatarSrc={this._profile?.avatar?.src}
							avatarAlt={this._profile?.avatar?.alt}
							hasEmptyData={this.hasSlot}
						/>
					</header>
				</div>
			</Host>
		);
	}
}
