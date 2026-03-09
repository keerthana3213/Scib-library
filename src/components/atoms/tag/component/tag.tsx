import { Component, Host, h, Prop, State, Watch, Element } from '@stencil/core';
import { Types } from '../../../../shared/models';

@Component({
	tag: 'scib-atoms-tag',
	styleUrl: 'tag.scss',
	shadow: true
})
export class AtomsTag {
	@Element() _hostRef: HTMLElement;

	/**
	 * El type altera el valor de las custom properties
	 * para cambiar la apariencia del componente en base al tema
	 */
	@Prop({ reflect: true }) type: Types = 'success';

	/**
	 * Text inside tag component
	 */
	@Prop() text: string;

	/**
	 * Add a custom color to the tag. If customColor is a valid hexadecimal
	 * or rgb the type is invalidated and will have no effect on the color.
	 */
	@Prop({ reflect: true }) customColor: string = '';
	@State() $customBgColor: string | undefined = undefined;
	@Watch('customColor') _checkColorFormat(newValue: string) {
		if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
			this.$customBgColor = `${newValue}1A`;
		} else if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(newValue)) {
			const rgb = newValue.replace(/\s/g, '').slice(4, -1).split(',');
			this.$customBgColor = `rgba(${parseInt(rgb[0])}, ${parseInt(rgb[1])}, ${parseInt(rgb[2])}, 0.1)`;
		} else {
			this.$customBgColor = undefined;
		}
	}

	/**
	 * Life cycle executed before the first render
	 */
	componentWillLoad() {
		this._checkColorFormat(this.customColor);
	}

	render() {
		return (
			<Host>
				<div
					class="tag-figure"
					style={this.$customBgColor ? { '--_atoms-tag-bg-color': this.$customBgColor, '--_atoms-tag-color': this.customColor } : {}}
				>
					<span class="tag-figure__text">{this.text}</span>
				</div>
			</Host>
		);
	}
}
