import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { capitalize, isEmpty, size, toUpper } from 'lodash';
import { parseProp } from '../../../../utils/helpers/common';
import { TabLevels } from '../../../../shared/models';
import { MDCTabBar } from '@material/tab-bar';

@Component({
	tag: 'scib-ui-v2-tabs',
	styleUrl: 'ui-v2-tabs.scss',
	shadow: true
})
export class UI_V2Tabs {
	private _tabRef: MDCTabBar;

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop() fitContent: boolean = false;

	/**
	 *The time in ms to show the tooltip if applies
	 */
	@Prop() tooltipDelay: number;
	@State() $tooltipDelay: number;
	@Watch('tooltipDelay') _tooltipDelayHandler(newValue: number) {
		this.$tooltipDelay = newValue;
	}
	/**
	 *
	 */
	@Prop({ reflect: true }) level: TabLevels = 'primary';

	/**
	 *
	 */
	@Prop() disableFormat: boolean = false;

	/**
	 *
	 */
	@Prop({ mutable: true }) activeIndex: number;
	@Watch('activeIndex') _activeIndexHandler(newValue: number) {
		if (this._tabRef) {
			this._tabRef.activateTab(this._getTabIndex(newValue));
		}
	}

	/**
	 *
	 */
	@Prop({ mutable: true }) tabOptions: string | any[];
	@State() $tabOptions: any[];
	@Watch('tabOptions') _tabOptionsHandler(newValue: string | any[]) {
		this.$tabOptions = parseProp<any[]>(newValue, []);
		if (this._tabRef) {
			this._tabRef.activateTab(this._getTabIndex(this.activeIndex));
		}
	}

	/**
	 * Descripción del evento
	 */
	@Event() tabEventChange: EventEmitter;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._tabOptionsHandler(this.tabOptions);
		this._activeIndexHandler(this.activeIndex);
		this._tooltipDelayHandler(this.tooltipDelay);
	}

	/**
	 *
	 */
	componentDidUpdate() {
		if (this._tabRef) {
			this._reloadTadRef();
			this._tabRef.activateTab(this._getTabIndex(this.activeIndex));
		}
	}

	/**
	 *
	 */
	componentDidLoad() {
		this._destroy();
		this._tabRef = MDCTabBar.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-tab-bar'));
		this._tabRef.activateTab(this._getTabIndex(this.activeIndex));
		this._tabRef.listen('MDCTabBar:activated', (data) => {
			const detail = data['detail'];
			const target = this.$tabOptions[detail.index];
			if (target !== this.activeIndex) {
				this.tabEventChange.emit(target);
			}
		});
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._tabRef) && this._tabRef.destroy) {
			try {
				this._tabRef?.unlisten('MDCTabBar:activated', () => {});
				this._tabRef?.destroy();
			} catch (error) {}
		}
	}

	/**
	 *
	 */
	private _reloadTadRef() {
		this._tabRef?.destroy();
		this._tabRef = MDCTabBar.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-tab-bar'));
	}

	/**
	 *
	 * @param activeIndex
	 */
	private _getTabIndex(activeIndex: number) {
		const length = size(this.$tabOptions) - 1;
		return activeIndex > length || activeIndex <= 0 ? 0 : activeIndex;
	}

	/**
	 *
	 * @param value
	 * @returns
	 */
	getLabel(value) {
		return this.disableFormat ? value : this.level === 'primary' ? toUpper(value) : capitalize(value);
	}

	render() {
		return (
			<Host>
				<div class="mdc-tab-bar" role="tablist">
					<div class="mdc-tab-scroller">
						<div
							class={{
								'mdc-tab-scroller__scroll-area': true,
								'mdc-tab-scroller__scroll-area--adjust': !this.fitContent
							}}
						>
							<div
								class="mdc-tab-scroller__scroll-content"
								style={{
									'--tabs-with-content': `var(${this.fitContent ? '--tabs-full-with-content' : '--tabs-adjust-with-content'})`
								}}
							>
								{this.$tabOptions?.map((tab, index) => {
									return (
										<scib-atoms-tooltip-info
											key={tab.id}
											arrow={'bottom'}
											literalsTooltip={tab.tooltip}
											delay={this.$tooltipDelay}
										>
											<button class="mdc-tab" role="tab" aria-selected="true" tabindex={index} id={`tab_${index}`}>
												<div class="mdc-tab--mobile">
													<div class="mdc-tab__content--mobile">
														{(tab.icon || tab.badge) && (
															<div class="mdc-tab__content__badge-mobile">
																{tab.icon && (
																	<span
																		class="icon-container icon-container--handler"
																		style={{ '--icon-content': `var(--theme-scib-icon-${tab.icon})` }}
																	>
																		<i class="icon" />
																	</span>
																)}
																{tab.badge && <scib-atoms-badge text={tab.badge}></scib-atoms-badge>}
															</div>
														)}
														<div class="mdc-tab__text-label text-label-custom">{this.getLabel(tab.value)}</div>
													</div>
												</div>
												<div class="mdc-tab--desktop">
													<div class="mdc-tab__content">
														{tab.icon && (
															<span
																class="icon-container icon-container--handler"
																style={{ '--icon-content': `var(--theme-scib-icon-${tab.icon})` }}
															>
																<i class="icon" />
															</span>
														)}
														<span class="mdc-tab__text-label text-label-custom">{this.getLabel(tab.value)}</span>
														{tab.badge && <scib-atoms-badge text={tab.badge}></scib-atoms-badge>}
													</div>
												</div>
												<div class="mdc-tab-indicator">
													<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
												</div>
												<span class="mdc-tab__ripple"></span>
											</button>
										</scib-atoms-tooltip-info>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
