import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IUITab } from '../models/ui-tabnav.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-tabnav',
	styleUrl: 'ui-tabnav.scss',
	shadow: false,
	scoped: true,
})
export class UITabnav {
	/** Indica el tab activo */
	@Prop({ mutable: true, reflect: true }) activeTab: string;

	/** Maximize width of tab buttons */
	@Prop({ mutable: true }) maximizeTab: boolean;

	/** Indicate small version */
	@Prop({ mutable: true }) small: boolean;

	/** Pestañas del tapnav */
	@Prop({ mutable: true, reflect: true }) tabs: string | IUITab[];
	@Watch('tabs') parseTabs(newVal: string | IUITab[]) {
		this._tabs = _parseProp(newVal);
	}
	@State() _tabs: IUITab[];

	/** Emite al setear la tab activa (incluído al inicio si no hay una) */
	@Event() eventTabChange: EventEmitter<string>;

	componentWillLoad() {
		this.parseTabs(this.tabs);
		if (!this.activeTab && this._tabs && this._tabs.length > 0) {
			this.setTab(this._tabs[0].id);
		}
	}

	setTab(tab: string) {
		if (tab !== this.activeTab) {
			this.activeTab = tab;
			this.eventTabChange.emit(this.activeTab);
		}
	}

	render() {
		return (
			<Host>
				<div class="ui-tabnav">
					{this._tabs?.map(tab => (
						<button
							onClick={() => this.setTab(tab.id)}
							class={{
								'ui-tabnav__item': true,
								'ui-tabnav__item--active': this.activeTab === tab.id,
								'ui-tabnav__item--max': this.maximizeTab,
								'ui-tabnav__item--small': this.small,
							}}
							aria-label={tab.label}
							disabled={tab.disabled}
							type="button"
						>
							{tab.icon && !tab.iconPosition ? (tab.iconPosition = 'left') : null}
							{tab.icon && tab.iconPosition === 'left' && (
								<div class={{ 'ui-tabnav__icon ui-tabnav__icon--left u-icon': true, [tab.icon]: true, 'ui-tabnav__icon--hideText': tab.hideText }}></div>
							)}
							{!tab.hideText && <span class="ui-tabnav__text">{tab.label}</span>}
							{tab.icon && tab.iconPosition === 'right' && (
								<div class={{ 'ui-tabnav__icon ui-tabnav__icon--right u-icon': true, [tab.icon]: true, 'ui-tabnav__icon--hideText': tab.hideText }}></div>
							)}
						</button>
					))}
				</div>
			</Host>
		);
	}
}
