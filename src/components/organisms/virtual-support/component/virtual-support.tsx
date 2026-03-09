import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { get, isEmpty, last, merge, orderBy } from 'lodash';
import { registerClickOutside } from 'stencil-click-outside';
import { assetUrl } from '../../../../utils/helpers/common';
import { OrganismsVirtualSupportButtons } from '../fragments/virtual-support-buttons.fragment';
import { OrganismsVirtualSupportContactCard } from '../fragments/virtual-support-contact-card.fragment';
import { OrganismsVirtualSupportInfoCard } from '../fragments/virtual-support-info-card.fragment';
import { OrganismsVirtualSupportMessageText } from '../fragments/virtual-support-message-text.fragment';
import { VirtualSupport } from '../mock/mock';
import { getCmsData } from '../services/virtual-support.service';

/**
 * Component description
 *
 * @status stable
 * @slot content
 */
@Component({
	tag: 'scib-organisms-virtual-support',
	styleUrl: 'virtual-support.scss',
	shadow: true
})
export class OrganismsVirtualSupport {
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop() breadcrumbs: { name: string; path: string }[];
	/**
	 *
	 */
	@State() showCard: boolean = false;
	@State() isClicked: boolean = false;
	@State() showChips: boolean = false;
	@State() $buttons: any[] = [];
	@State() $cardInfo: any[] = [];
	@State() $cardContact: any[] = [];
	@State() $messages: string;
	@State() $breadcrumbs: { name: string; path: any }[] = [];
	@State() $cmsData: any = { 'en-GB': {} };
	@State() initialWidth: number | null;
	@State() $currentLanguage: string;
	@State() $section: string;

	/**
	 *
	 */
	@Prop() apiUrl: string | undefined;
	@Watch('apiUrl') async handleApiUrl(url: string) {
		const _lang = this.$currentLanguage || navigator.language || 'en-GB';
		if (isEmpty(get(this.$cmsData, [_lang]))) {
			this.$cmsData[_lang] = await getCmsData(_lang, url);
		}
		this._updateTexts();
	}

	/**
	 *
	 */
	@Prop() language: string;
	@Watch('language') async handleLanguage(lang: string) {
		const _lang = lang || navigator.language || 'en-GB';
		this.$currentLanguage = _lang;
		if (isEmpty(get(this.$cmsData, [_lang]))) {
			this.$cmsData[_lang] = await getCmsData(_lang, this.apiUrl);
		}
		this._updateTexts();
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	async componentWillLoad() {
		this.handleLanguage(this.language);
		this._handleMessage();
	}

	/**
	 * Actualizaciónd e los textps cuando cambiamos de idioma
	 */
	private _updateTexts() {
		this._calcInitialWidth();
		this._handleMessage(this.$section);
		this._handleContactCard(this.$section);
		this._handleCardInfo(this.$section);
		this._handleButton(this.$section);
		this.handleBreadcrumbLiterals();
	}

	/**
	 *
	 */
	private getVirtualSupportData(path: string[], defaultValue: any = null) {
		const cmsData = get(this.$cmsData, [this.$currentLanguage]);
		const data = isEmpty(cmsData) ? VirtualSupport : cmsData;
		return get(data, path, defaultValue);
	}

	/**
	 *
	 */
	private _handleButton(section?: string) {
		this.$buttons = [];
		this.$section = section;
		const data = this.getVirtualSupportData([section || 'WELCOME']);
		if (!isEmpty(data)) {
			const keys = Object.keys(data).filter((key) => key.startsWith('button'));
			const buttons = [];
			keys.forEach((key) => {
				const type = /^button[._]\d+[._]text/.test(key) ? 'text' : 'actionType';
				const _idRegex = new RegExp(`button[._]`);
				const _splitRegex = new RegExp('[._]');
				let id = Number(get(last(key.split(_idRegex))?.split(_splitRegex), [0], 0));
				id = id > 0 ? id - 1 : id;
				buttons[id] = merge({}, get(buttons, id, {}), { id, [type]: get(data, key) });
			});
			this.$buttons = orderBy(buttons, ['id'], ['asc']);
		}
	}

	/**
	 *
	 */
	private _handleCardInfo(section?: string) {
		this.$cardInfo = [];
		this.$section = section;
		const data = this.getVirtualSupportData([section]);
		if (!isEmpty(data)) {
			const _filterRegex = new RegExp(`^contact[._]info`);
			const keys = Object.keys(data).filter((key) => _filterRegex.test(key));
			const cards = [];
			keys.forEach((key) => {
				const _titleRegex = new RegExp(`^contact[._]info[._]title`);
				const _infoRegex = new RegExp(`^contact[._]info[._]info`);
				const type = _titleRegex.test(key) ? 'title' : _infoRegex.test(key) ? 'info' : 'contact';
				const _detailRegex = new RegExp(`contact[._]info[._]${type}[._]`);
				const id = Number(get(key.split(_detailRegex), [1], 0));
				cards[id] = merge({}, get(cards, id, {}), { id, [type]: get(data, key) });
			});
			this.$cardInfo = orderBy(cards, ['id'], ['asc']);
		}
	}

	/**
	 *
	 * @param section
	 */
	private _handleContactCard(section?: string) {
		this.$cardContact = [];
		this.$section = section;
		const data = this.getVirtualSupportData([section]);
		if (!isEmpty(data)) {
			const _filterRegex = new RegExp(`^contact[._]card`);
			const keys = Object.keys(data).filter((key) => _filterRegex.test(key));
			const cards = [];
			keys.forEach((key) => {
				const _titleRegex = new RegExp(`^contact[._]card[._]title`);
				const type = _titleRegex.test(key) ? 'title' : 'info';
				const _detailRegex = new RegExp(`contact[._]card[._]${type}[._]`);
				const id = Number(get(key.split(_detailRegex), [1], 0));
				cards[id] = merge({}, get(cards, id, {}), { id, [type]: get(data, key) });
			});
			this.$cardContact = orderBy(cards, ['id'], ['asc']);
		}
	}

	/**
	 *
	 */
	private _handleMessage(section: string = 'WELCOME') {
		this.$section = section;
		const _sectionData = this.getVirtualSupportData([section]);
		const _messageTextRegex = new RegExp('message[._]text');
		const _key = Object.keys(_sectionData).find((key) => _messageTextRegex.test(key));
		this.$messages = (_key && get(_sectionData, _key, '')) || '';
	}

	/**
	 *
	 */
	handleClick = async () => {
		this._reset();
		this.isClicked = true;
		this.showCard = true;
	};

	/**
	 *
	 */
	handleCloseClick = () => {
		this.showCard = false;
		this.showChips = false;
		this.$breadcrumbs = [];
		this._initListeners();
		this._reset();
	};

	/**
	 *
	 * @param actionType
	 */
	handleButtonClicked = (actionType: string) => {
		this.$section = actionType;
		this.handleBreadcrumb({ name: this.getVirtualSupportData([actionType, 'title']) || '', path: actionType }, 'add');
		this._handleButton(actionType);
		this._handleCardInfo(actionType);
		this._handleContactCard(actionType);
		this._handleMessage(actionType);
	};

	/**
	 *
	 * @param breadcrumb
	 */
	handleBreadcrumb = (breadcrumb?: { name: string; path: string }, action?: 'add' | 'remove') => {
		if (action === 'add') {
			if (!breadcrumb.name || !breadcrumb.path) {
				console.error('Breadcrumb name or path is undefined');
				return;
			}
			this.$breadcrumbs = [...this.$breadcrumbs, breadcrumb];
		} else if (action === 'remove') {
			const index = this.$breadcrumbs.findIndex((bc) => bc.name === breadcrumb.name && bc.path === breadcrumb.path);
			if (index !== -1) {
				this.$breadcrumbs = this.$breadcrumbs.slice(0, index);
			} else {
				console.error('Breadcrumb not found');
			}
		}
		this.showChips = this.$breadcrumbs && this.$breadcrumbs.length > 0;
	};

	/**
	 *
	 * @param breadcrumbAction
	 */
	goToBreadcrumb = (breadcrumbAction: string) => {
		if (!breadcrumbAction) {
			console.error('BreadcrumbAction is undefined');
		} else {
			const currentSection = this.getVirtualSupportData([breadcrumbAction, 'backTo']);
			this.$section = currentSection;
			this._handleContactCard(currentSection);
			this._handleCardInfo(currentSection);
			this._handleMessage(currentSection);
			this._handleButton(currentSection);
			this.handleBreadcrumb({ name: this.getVirtualSupportData([breadcrumbAction, 'title']) || '', path: breadcrumbAction }, 'remove');
		}
	};

	/**
	 *
	 */
	handleBreadcrumbLiterals() {
		this.$breadcrumbs = this.$breadcrumbs.map((breadcrumb) => ({
			...breadcrumb,
			name: this.getVirtualSupportData([breadcrumb.path, 'title'])
		}));
	}

	/**
	 *
	 */
	handleRefresh() {
		this.$breadcrumbs = [];
		this.showChips = false;
		this.$section = '';
		this._reset();
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._initListeners();
		this._calcInitialWidth();
		this.handleRefresh();
		registerClickOutside(this, this._hostRef, () => this.handleCloseClick());
	}

	/**
	 *
	 */
	componentDidUpdate() {
		this._calcInitialWidth();
	}

	/**
	 * Ciclo de vida al eliminar la instancia del componente
	 */
	disconnectedCallback() {
		document.removeEventListener('click', this.handleClick);
		this._removeListeners();
	}

	/**
	 *
	 */
	private _reset() {
		this._handleButton();
		this._handleMessage();
		this._handleCardInfo();
		this._handleContactCard();
	}

	/**
	 *
	 */
	private _initListeners() {
		requestAnimationFrame(() => {
			const button: HTMLElement = this._hostRef.shadowRoot.querySelector('.virtual-support__button');
			button?.addEventListener('mouseleave', (event) => {
				event?.stopPropagation();
				event?.preventDefault();
				button.style.width = `${this.initialWidth}px`;
			});
			button?.addEventListener('mouseenter', (event) => {
				event?.stopPropagation();
				event?.preventDefault();
				requestAnimationFrame(() => {
					const welcomeText = this._hostRef.shadowRoot.querySelector('.virtual-support__button__hover-label');
					const width = welcomeText?.getBoundingClientRect().width;
					button.style.width = `${width + this.initialWidth + 7}px`;
				});
			});
		});
	}

	/**
	 *
	 */
	private _removeListeners() {
		const button = this._hostRef.shadowRoot.querySelector('.virtual-support__button');
		button?.removeEventListener('mouseleave', () => {});
		button?.removeEventListener('mouseenter', () => {});
	}

	/**
	 *
	 */
	private _calcInitialWidth() {
		requestAnimationFrame(() => {
			const button = this._hostRef.shadowRoot.querySelector('.virtual-support__button__text');
			const initialWidth = button?.getBoundingClientRect().width;
			this.initialWidth = initialWidth ? initialWidth + 52 : null;
		});
	}

	/**
	 *
	 * @returns
	 */
	render() {
		const _propsMessages = {
			handleButtonClicked: this.handleButtonClicked
		};
		return (
			<Host style={{ textAlign: 'center' }}>
				{!this.showCard && (
					<div>
						<span class="virtual-support" onClick={this.handleClick}>
							<span class="virtual-support__button" style={{ width: `${this.initialWidth}px` }}>
								<div class="virtual-support__button__text">
									<span class="virtual-support__button__hover-label">{this.getVirtualSupportData(['MAIN_TITLE', 'title'])}</span>
									<span class="virtual-support__button__label">
										{this.getVirtualSupportData(['MAIN_TITLE', 'virtual_support'])}{' '}
									</span>
								</div>
								<img
									class="virtual-support__button__img"
									src={assetUrl('assets/images/digital_asssistance.svg')}
									alt="Digital Assistance icon"
								/>
							</span>
						</span>
					</div>
				)}
				{this.showCard && (
					<div class="virtual-support-container">
						<div class="virtual-support-container__card">
							<div class="virtual-support-container__card__header">
								<h3 class="virtual-support-container__card__header__title">{this.getVirtualSupportData(['CARD_TITLE', 'title'])}</h3>
								<span
									class="virtual-support-container__card__header__close"
									style={{ '--icon-content': `var(--theme-scib-icon-close-thin)` }}
								>
									<i class="icon" onClick={() => this.handleCloseClick()}></i>
								</span>
							</div>
							{this.showChips && (
								<div class="virtual-support-container__header">
									<div class="virtual-support-container__card__chips">
										<span class="virtual-support-container__card__chips__subheader">
											{this.getVirtualSupportData(['REQUEST', 'title'])}
										</span>
										<span class="virtual-support-container__card__chips__refresh" onClick={() => this.handleRefresh()}>
											<i class="icon" style={{ '--icon-content': `var(--theme-scib-icon-refresh-reload-screen)` }}></i>
											<span>{this.getVirtualSupportData(['REQUEST', 'reset_request'])}</span>
										</span>
									</div>
									<scib-ui-v2-scroll-container
										class="scroll-container"
										options='{"scrollbarVisibility":"auto","horizontalScrollbarPosition":"bottom"}'
									>
										<div class="virtual-support-container__card__breadcrumbs">
											{this.$breadcrumbs.map((breadcrumb, index) => (
												<div
													class="virtual-support-container__card__breadcrumbs__bubbles"
													onClick={() => this.goToBreadcrumb(breadcrumb?.path)}
												>
													<span key={index}>
														<span class="virtual-support-container__card__breadcrumbs__bubbles__title">
															{breadcrumb?.name}
														</span>
													</span>
												</div>
											))}
										</div>
									</scib-ui-v2-scroll-container>
								</div>
							)}
							<div>
								<OrganismsVirtualSupportMessageText message={this.$messages}></OrganismsVirtualSupportMessageText>
							</div>
							<div class="virtual-support-container__card__container">
								<scib-ui-v2-scroll-container
									class="scroll-container"
									options='{"scrollbarVisibility":"auto","verticalScrollbarPosition":"right"}'
								>
									{this.$cardInfo && this.$cardInfo.length > 0 && (
										<OrganismsVirtualSupportInfoCard
											info={this.$cardInfo}
											section={this.$section}
										></OrganismsVirtualSupportInfoCard>
									)}
									{this.$cardContact && this.$cardContact.length > 0 && (
										<OrganismsVirtualSupportContactCard
											contact={this.$cardContact}
											{..._propsMessages}
										></OrganismsVirtualSupportContactCard>
									)}
									<OrganismsVirtualSupportButtons buttons={this.$buttons} {..._propsMessages} />
								</scib-ui-v2-scroll-container>
							</div>
						</div>
					</div>
				)}
			</Host>
		);
	}
}
