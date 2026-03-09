import { Component, Host, h, Element, Prop, State, Watch } from '@stencil/core';
import { LottieConfigs } from '../models/lottie-player.model';
import { parseProp } from '../../../../utils/helpers/common';
import lottie, { AnimationItem } from 'lottie-web';
import { get, isEmpty, isEqual, isNil } from 'lodash';

@Component({
	tag: 'scib-atoms-lottie-player',
	styleUrl: 'lottie-player.scss',
	shadow: true
})
export class AtomsLottiePlayer {
	private _resizeObserver: ResizeObserver;
	private _lottieInstance: AnimationItem;
	private _currentLottiePath: string;

	@Element() _hostRef: HTMLElement;

	/**
	 * When set to true, automatically plays the animation on loading it. Default value is true
	 */
	@Prop() autoplay: boolean = true;

	/**
	 *	When set to true, loops the animation. The count property defines the number of times to loop the animation.
	 *  Setting the count property to 0 and setting loop to true, loops the animation indefinitely.
	 */
	@Prop() loop: boolean = false;

	/**
	 *	Background color. By default, the background is transparent and will take the color of the parent container.
	 */
	@Prop() background: string;

	/**
	 * 	The animation to play, either Bodymovin JSON data or a URL to a JSON file.
	 *  This parameter is mandatory.
	 */
	@Prop() src: string | LottieConfigs;
	@State() $src: string | LottieConfigs;
	@Watch('src') _srcHandeler(newValue: string | LottieConfigs) {
		this.$src = parseProp(newValue, newValue);
	}

	/**
	 *
	 */
	componentWillLoad() {
		this._srcHandeler(this.src);
	}

	/**
	 * Called after every render()
	 */
	componentDidRender() {
		this._destroy();
		this._runLottie();
		this._resizeObserver = new ResizeObserver(() => this._runLottie());
		this._resizeObserver.observe(this._hostRef);
	}

	/**
	 * Called just after the component updates. It's never called during the first render()
	 */
	componentDidUpdate() {
		this._runLottie();
	}

	/**
	 *
	 */
	private _destroy() {
		if (this._resizeObserver && this._resizeObserver.unobserve) {
			this._resizeObserver.unobserve(this._hostRef);
		}
	}

	/**
	 * Lottie runner function
	 */
	private _runLottie() {
		if (!isEmpty(this.$src)) {
			const container = this._hostRef.shadowRoot.getElementById('container');
			if (!isNil(this.background) && !isEmpty(this.background)) {
				container.style.setProperty('--_atoms-lottie-player-background-color', this.background);
			}
			const { src, preserveAspectRatio } =
				typeof this.$src === 'string'
					? {
							src: this.$src,
							preserveAspectRatio: `xMidYMid ${window.innerWidth >= 980 ? 'slice' : 'meet'}`
					  }
					: this._getathFileByWidth();
			if (!isEqual(this._currentLottiePath, src)) {
				this._currentLottiePath = src;
				if (this._lottieInstance) {
					this._lottieInstance.destroy();
				}
				this._lottieInstance = lottie.loadAnimation({
					container: container,
					renderer: 'svg',
					path: this._currentLottiePath,
					autoplay: this.autoplay,
					loop: this.loop,
					rendererSettings: {
						hideOnTransparent: true,
						progressiveLoad: true,
						preserveAspectRatio
					}
				});
			}
		}
	}

	/**
	 *
	 */
	private _getathFileByWidth(): any {
		const windowWidth = window.innerWidth;
		const _defaultImage = get(this.$src, 'default');
		let preserveAspectRatio = 'xMidYMid slice';
		let src = _defaultImage;
		if (windowWidth < 768) {
			src = get(this.$src, 'sm', _defaultImage);
			preserveAspectRatio = 'xMidYMid meet';
		} else if (windowWidth >= 768 && windowWidth < 980) {
			src = get(this.$src, 'md', _defaultImage);
			preserveAspectRatio = 'xMidYMid meet';
		}
		return { src, preserveAspectRatio };
	}

	render() {
		return (
			<Host>
				<div class="lottie-container">
					<div id="container"></div>
				</div>
			</Host>
		);
	}
}
