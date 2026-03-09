import { Component, h, Prop, Watch, State, Listen, Element } from '@stencil/core';
import { Breakpoints } from '../../../../utils/helpers/styling-settings';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-column',
	styleUrl: 'ui-column.scss',
	shadow: false,
	scoped: false,
})
export class UIColumn {
	@Element() private column: HTMLElement;

	@Prop({ mutable: true, reflect: true }) colLg: number = 6;
	@Watch('colLg') resizeColLg(newColumnSize: number) {
		this._colConfig.colLg = newColumnSize;
		this.spanToFlex('lg');
	}
	@Prop({ mutable: true, reflect: true }) colMd: number;
	@Watch('colMd') resizeColMd(newColumnSize: number) {
		this._colConfig.colMd = newColumnSize;
		this.spanToFlex('md');
	}

	@Prop({ mutable: true, reflect: true }) colXs: number = 6;
	@Watch('colXs') resizeColXs(newColumnSize: number) {
		this._colConfig.colXs = newColumnSize;
		this.spanToFlex('xs');
	}
	@Prop({ mutable: true, reflect: true }) offsetLg: number = 0;
	@Watch('offsetLg') resizeOffsetLg(newOffsetSize: number) {
		this._colConfig.offsetLg = newOffsetSize;
		this.spanToFlex('lg');
	}

	@Prop({ mutable: true, reflect: true }) offsetMd: number;
	@Watch('offsetMd') resizeOffsetMd(newOffsetSize: number) {
		this._colConfig.offsetMd = newOffsetSize;
		this.spanToFlex('md');
	}

	@Prop({ mutable: true, reflect: true }) offsetXs: number = 0;
	@Watch('offsetXs') resizeOffsetXs(newOffsetSize: number) {
		this._colConfig.offsetXs = newOffsetSize;
		this.spanToFlex('xs');
	}
	@State() _mediaQuery;
	@State() _colConfig = {
		colXs: 0,
		colMd: 0,
		colLg: 0,
		offsetXs: 0,
		offsetMd: 0,
		offsetLg: 0,
	};

	@Listen('resize', { target: 'window' })
	handleResize() {
		this.resizeColXs(this.colXs);
		this.resizeColMd(this.colMd);
		this.resizeColLg(this.colLg);
		this.resizeOffsetXs(this.offsetXs);
		this.resizeOffsetMd(this.offsetMd);
		this.resizeOffsetLg(this.offsetLg);
		this.spanToFlex(this.calculateAlias(window.innerWidth));
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.resizeColXs(this.colXs);
		this.resizeColMd(this.colMd);
		this.resizeColLg(this.colLg);
		this.resizeOffsetXs(this.offsetXs);
		this.resizeOffsetMd(this.offsetMd);
		this.resizeOffsetLg(this.offsetLg);
		this.spanToFlex(this.calculateAlias(window.innerWidth));
	}

	calculateAlias(screenSize) {
		if (screenSize < Breakpoints.sm) {
			return 'xs';
		} else if (screenSize < Breakpoints.lg) {
			return 'md';
		} else {
			return 'lg';
		}
	}

	calcColspan(mqAlias: string, offset?: boolean) {
		if (mqAlias === 'xl' || mqAlias === 'lg' || mqAlias === 'md' || mqAlias === 'sm' || mqAlias === 'xs') {
			this._mediaQuery = mqAlias;
		}

		switch (this._mediaQuery) {
			case 'xl':
			case 'lg':
				return offset ? this._colConfig.offsetLg : this._colConfig.colLg;
			case 'md':
				return offset ? this._colConfig.offsetMd : this._colConfig.colMd;
			case 'sm':
			case 'xs':
				return offset ? this._colConfig.offsetXs : this._colConfig.colXs;
			default:
				return offset ? this._colConfig.offsetXs : this._colConfig.colXs;
		}
	}

	spanToFlex(mqAlias: string): void {
		const colspanPercent = (this.calcColspan(mqAlias) / 6) * 100;
		const offsetPercent = (this.calcColspan(mqAlias, true) / 6) * 100;
		const flexBasis = `${colspanPercent}%`;
		const offsetflexBasis = `${offsetPercent}%`;
		const flex = `0 0 ${flexBasis}`;
		const hostElement = this.column;
		hostElement.style.boxSizing = 'border-box';
		hostElement.style.flex = flex;
		hostElement.style.minWidth = flexBasis;
		hostElement.style.maxWidth = flexBasis;
		hostElement.style.marginLeft = offsetflexBasis;
	}

	render() {
		return (
			<div class="ui-column">
				<slot />
			</div>
		);
	}
}
