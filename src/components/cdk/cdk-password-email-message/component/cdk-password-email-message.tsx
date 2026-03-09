import { ICDKPasswordEmailMessageLiterals, ICDKPasswordEmailMessageLinks } from '../models/cdk-password-email-message.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Component, Host, h, Prop, Watch, State } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-password-email-message',
	styleUrl: 'cdk-password-email-message.scss',
	shadow: false,
	scoped: true,
})
export class CDKPasswordEmailMessage {
	@Prop() email: string;

	@Prop() literals: string;
	@Watch('literals')
	parseLiterals(newVal: string | ICDKPasswordEmailMessageLiterals) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: ICDKPasswordEmailMessageLiterals;

	@Prop() links: string;
	@Watch('links')
	parseLinks(newVal: string | ICDKPasswordEmailMessageLinks) {
		this._links = _parseProp(newVal);
	}
	@State() _links: ICDKPasswordEmailMessageLinks;

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseLinks(this.links);
	}

	render() {
		return (
			<Host>
				<section class="cdk-password-email-message">
					<a class="link-public-web" href={this._links.publicWebUrl}>
						{this._literals.publicWeb}
						<span role="image" class="u-icon c-icon icon-logout"></span>
					</a>
					<div class="cdk-password-email-message__box">
						<h2 class="cdk-password-email-message__main-title">{this._literals.mainTitle}</h2>
						<p class="cdk-password-email-message__text">
							{this._literals.textTopFirst}
							<span class="cdk-password-email-message__bold"> {this._literals.textTopSecond}</span>.
						</p>
						<p class="cdk-password-email-message__text">
							{this._literals.textBottomFirst}
							<span class="cdk-password-email-message__bold"> {this.email} </span>
							{this._literals.textBottomSecond}
						</p>
					</div>
				</section>
			</Host>
		);
	}
}
