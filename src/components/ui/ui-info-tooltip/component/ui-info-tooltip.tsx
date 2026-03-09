import { Component, Host, h, Prop, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-info-tooltip',
	styleUrl: 'ui-info-tooltip.scss',
	shadow: false,
	scoped: true,
})
export class UIInfoTooltip {
	@Element() _hostRef: HTMLElement;
	/** Tooltip txt */
	@Prop({ mutable: true, reflect: true }) text: string;
	/** Tooltip title */
	@Prop({ mutable: true, reflect: true }) tooltipTitle: string;
	/** Hover activation*/
	@Prop({ mutable: true, reflect: true }) hover: boolean = false;
	/** Hide tooltip */
	@Prop({ mutable: true, reflect: true }) hide: boolean = false;
	/** Tooltip position */
	@Prop({ mutable: true, reflect: true }) tooltipPos: string = 'right';

	clickToolTip(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		let elem: any = e.target;
		let tooltipElement = elem.parentNode.childNodes[1];
		let classShow = 'ui-tooltip--active';
		let classHidden = 'ui-tooltip--unactive';
		if (this._hostRef && this._hostRef.querySelector('.' + classShow)) {
			let active = this._hostRef.querySelector('.' + classShow);
			active.classList.remove(classShow);
			active.classList.add(classHidden);
			if (active !== elem.parentNode.childNodes[1]) {
				tooltipElement.classList.remove(classHidden);
				tooltipElement.classList.add(classShow);
			}
		} else {
			tooltipElement.classList.remove(classHidden);
			tooltipElement.classList.add(classShow);
		}
	}

	render() {
		return (
			<Host>
				{!this.hide &&
					(!this.hover ? (
						<div class="ui-tooltip">
							<button
								class="ui-tooltip__btn icon-tooltip u-icon"
								title={this.tooltipTitle}
								onClick={e => this.clickToolTip(e)}
							></button>
							<div
								class={{
									'ui-tooltip__box': true,
									'ui-tooltip--unactive': true,
									'--top': this.tooltipPos === 'top',
									'--right': this.tooltipPos === 'right',
									'--bottom': this.tooltipPos === 'bottom',
									'--left': this.tooltipPos === 'left',
								}}
							>
								<p class="ui-tooltip__txt">{this.text}</p>
							</div>
						</div>
					) : (
						<div class="ui-tooltip">
							<slot />
							<div class={{ 'ui-tooltip__box-under ui-tooltip--show': true, '--from-mail': this.tooltipPos === 'top' }}>
								<p class="ui-tooltip__txt">{this.text}</p>
							</div>
						</div>
					))}
			</Host>
		);
	}
}
