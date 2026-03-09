import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp } from '../../../../utils/helpers/common';
import { IconTabs } from '../models/icon-tabs.models';

@Component({
	tag: 'scib-atoms-icon-tabs',
	styleUrl: 'icon-tabs.scss',
	shadow: true
})
export class AtomsIconTabs {
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ mutable: true }) activeIndex: number;

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: true }) tabs: string | IconTabs[];
	@State() $tabs: IconTabs[];
	@Watch('tabs') parseTabs(newValue: string | IconTabs[]) {
		this.$tabs = parseProp(newValue);
	}

	/**
	 *
	 */
	@Event() eventTabChange: EventEmitter<string>;

	/**
	 *
	 */
	componentWillLoad() {
		this.parseTabs(this.tabs);
		if (!this.activeIndex && this.$tabs && this.$tabs.length > 0) {
			this.setTab(this.$tabs[0].id);
		}
	}

	/**
	 *
	 * @param tab
	 */
	setTab(tab: string) {
		if (tab != this.activeIndex.toString()) {
			this.activeIndex = Number(tab);
			this.eventTabChange.emit(this.activeIndex.toString());
		}
	}

	render() {
		return (
			<Host>
				<div class="tab-group">
					{this.$tabs?.map((tab) => (
						<button
							onClick={() => this.setTab(tab.id)}
							class={`tab ${tab.id == this.activeIndex?.toString() ? 'tab--active' : ''}`}
							type="button"
						>
							<span class="icon-container" style={{ '--icon-content': `var(--theme-scib-icon-${tab.icon})` }}>
								<i class="icon" />
							</span>
						</button>
					))}
				</div>
			</Host>
		);
	}
}
