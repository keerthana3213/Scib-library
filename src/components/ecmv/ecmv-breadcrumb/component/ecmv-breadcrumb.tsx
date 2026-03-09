import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { IECMVBreadcrumb, IECMVBreadcrumbArray } from '../models/ecmv-breadcrumb.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ecmv-breadcrumb',
	styleUrl: 'ecmv-breadcrumb.scss',
	shadow: false,
	scoped: false,
})
export class ECMVBreadcrumb {
	@Prop() breadcrumb: string;
	@Prop() smallTxt: boolean = false;
	@Prop() secondary: boolean = false;
	@Prop() tertiary: boolean = false;
	@State() breadcrumbArray: IECMVBreadcrumb[];
	@Event() navigatorEvents: EventEmitter<IECMVBreadcrumbArray>;

	componentDidLoad() {
		this.asignToArray();
	}

	@Watch('breadcrumb')
	asignToArray() {
		this.breadcrumbArray = JSON.parse(this.breadcrumb);
	}

	backInRoute(item: IECMVBreadcrumb) {
		const newArrayBreadcrumb: IECMVBreadcrumb[] = [];
		for (let index = 0; index < item.position; index++) {
			this.breadcrumbArray[index].active = index == item.position - 1;
			newArrayBreadcrumb.push(this.breadcrumbArray[index]);
		}
		this.breadcrumbArray = newArrayBreadcrumb;
		this.navigatorEvents.emit({ breadcrumbArray: this.breadcrumbArray });
	}

	render() {
		return (
			<nav aria-label="Breadcrumb" class="ecmv-breadcrum">
				<ol class="ecmv-breadcrum__list">
					{this.breadcrumbArray !== undefined &&
						this.breadcrumbArray.map(item => (
							<li class="ecmv-breadcrum__item">
								{!item.active ? (
									<a
										class={{
											'ecmv-breadcrum__link': true,
											'ecmv-breadcrum__link--small': this.smallTxt,
											'ecmv-breadcrum__link--secondary': this.secondary,
											'ecmv-breadcrum__link--tertiary': this.tertiary,
										}}
										title={item.tooltip}
										onClick={this.backInRoute.bind(this, item)}
									>
										{item.name}
									</a>
								) : (
									<span
										class={{
											'ecmv-breadcrum__txt': true,
											'ecmv-breadcrum__txt--small': this.smallTxt,
											'ecmv-breadcrum__txt--secondary': this.secondary,
											'ecmv-breadcrum__txt--tertiary': this.tertiary,
										}}
									>
										{item.name}
									</span>
								)}
							</li>
						))}
				</ol>
			</nav>
		);
	}
}
