import { Skeleton, SkeletonImageBreakpoints, skeletonImages, SkeletonTypes } from '../models/skeleton.model';
import { Component, Host, h, Prop, Watch, State, Element, Event, EventEmitter } from '@stencil/core';
import { getPublicUrl, parseProp } from '../../../../utils/helpers/common';
import { get, isEmpty, trimEnd } from 'lodash';

@Component({
	tag: 'scib-atoms-skeleton',
	styleUrl: 'skeleton.scss',
	shadow: true
})
export class AtomsSkeleton {
	private _skeletonRef: HTMLElement;
	private _skeletonImageMap: Skeleton = skeletonImages;

	@Element() _hostRef: HTMLElement;

	/**
	 * Skeleton base path.
	 */
	@Prop({ mutable: true }) skeletonHostPath: string;
	@Watch('skeletonHostPath') _skeletonHostPathHandeler(newValue: string) {
		this.$skeletonHostPath = trimEnd(newValue || getPublicUrl(), '/');
	}

	/**
	 * Provide a custom skeleton config.
	 *
	 * {
	 * 	default: string;
	 *	md?: string;
	 *	sm?: string;
	 * }
	 */
	@Prop({ mutable: true }) customSkeleton: string | SkeletonImageBreakpoints;
	@Watch('customSkeleton') _customSkeletonHandeler(newValue: string | SkeletonImageBreakpoints) {
		this.$customSkeleton = parseProp<SkeletonImageBreakpoints>(newValue, null);
		this.$skeletonImage = this._getSkeletonImage(window.innerWidth);
	}

	/**
	 * Skeleton type.
	 */
	@Prop({ mutable: true }) skeletonType: SkeletonTypes;
	@Watch('skeletonType') _skeletonTypeHandeler(newValue: SkeletonTypes) {
		if (newValue) {
			this.$skeletonImage = this._getSkeletonImage(window.innerWidth, newValue);
		}
	}

	/**
	 *
	 */
	@State() $skeletonImage: string;

	/**
	 *
	 */
	@State() $skeletonHostPath: string;

	/**
	 *
	 */
	@State() $customSkeleton: SkeletonImageBreakpoints;

	/**
	 *
	 */
	@Event() skeletonReference: EventEmitter<any>;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._skeletonHostPathHandeler(this.skeletonHostPath);
		this._customSkeletonHandeler(this.customSkeleton);
		this._skeletonTypeHandeler(this.skeletonType);
	}

	/**
	 *
	 * @param windowWidth
	 * @param type
	 */
	private _getSkeletonImage(windowWidth: number, type?: SkeletonTypes): string {
		let image = get(this._skeletonImageMap, ['default', 'default'], '');
		let imageType = get(this._skeletonImageMap, [type]);
		let useCustomSkeleton = false;
		if (!isEmpty(this.$customSkeleton) && !type) {
			useCustomSkeleton = true;
			image = get(this.$customSkeleton, ['default'], '');
			imageType = this.$customSkeleton;
		}
		if (imageType) {
			if (windowWidth < 768 && imageType.sm) {
				image = imageType.sm;
			} else if (windowWidth >= 768 && windowWidth < 980 && imageType.md) {
				image = imageType.md;
			} else {
				image = imageType.default;
			}
		}
		if (useCustomSkeleton) {
			return image;
		}
		return `images/skeleton/${image}`;
	}

	/**
	 *
	 */
	private _skeletonAnimation() {
		const viewport = window.innerWidth;
		const xPosition = -this._skeletonRef.getBoundingClientRect().x;
		const animation = [{ transform: `translateX(${xPosition - 500}px)` }, { transform: `translateX(${xPosition + viewport}px)` }];
		this._skeletonRef.animate(animation, { duration: 1250, iterations: Infinity });
		this.skeletonReference.emit(this._skeletonRef);
	}

	render() {
		const imageUrl = isEmpty(this.$skeletonHostPath)
			? `assets/${this.$skeletonImage}`
			: `${this.$skeletonHostPath}/assets/${this.$skeletonImage}`;
		return (
			<Host>
				<div class="skeleton">
					<img onLoad={() => this._skeletonAnimation()} src={imageUrl} class="skeleton__image" />
					<div ref={(el) => (this._skeletonRef = el as HTMLElement)} class="skeleton__animation-box">
						<div class="skeleton__animation-box__gradient"></div>
					</div>
				</div>
			</Host>
		);
	}
}
