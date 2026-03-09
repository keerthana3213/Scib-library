import { FunctionalComponent, h } from '@stencil/core';

export const CDKIsmContentInfoCard: FunctionalComponent<{
	/** Ejemplo de prop declarada */
	example: string;
	data: any;
	type: string;
	fullWidth?: boolean;
	literals: any;
}> = props => {
	return (
		<div
			class={{
				'cdk-ism__legend': true,
				'cdk-ism__legend--width': props.type != 'issues' || props.fullWidth,
				'cdk-ism__legend--height': props.type != 'contacts',
			}}
		>
			{props.type == 'issues' ? (
				<div>
					<div class="cdk-ism__legend--content">
						{props.data.legend.map(item => (
							<div class="cdk-ism__content--item">
								<h3>{item.title}</h3>
								<div class="c-content__legend">
									{item.legend.map(_legend => {
										return (
											<scib-ui-color-panel class="c-legend" top-label={_legend.title} status={_legend.status}>
												<div class="c-legend-text" slot="dataContent">
													{_legend.data}
												</div>
											</scib-ui-color-panel>
										);
									})}
								</div>
								<span class="cdk-ism__span cdk-ism__span--bold">
									{props.literals.dataLiterals.infoLiteral}
									<span class="cdk-ism__span cdk-ism__span--data">{item.info}</span>
								</span>
							</div>
						))}
					</div>
					<span class="cdk-ism__span cdk-ism__span--bold">{props.literals.dataLiterals.listLiteral}</span>

					<ul>
						{props.data.list.map(_list => {
							return (
								<li class="cdk-ism__li">
									{_list.criticality ? (
										<p>
											<span class={{ 'c-li__dot': true, ['--' + _list.criticality.toLowerCase()]: true, '--p3-plus': _list.criticality === 'P3+' }}></span>
											<span>{_list.criticality}</span>
										</p>
									) : _list.status ? (
										<span class={{ 'c-li__dot': true, ['--' + _list.status.toLowerCase().split(' ').join('-')]: true }}></span>
									) : null}
									<span class="cdk-ism__li--title">{_list.title}</span>
								</li>
							);
						})}
					</ul>
				</div>
			) : props.type == 'contacts' ? (
				<div>
					<span class="cdk-ism__span cdk-ism__span--subtitle">{props.literals.dataLiterals.title}</span>
					<ul class="cdk-ism__contacts">
						{props.data.list.map(_list => {
							return (
								<li class="cdk-ism__contacts--li">
									<scib-ui-avatar is-employee="true" images={[{ src: _list.img, alt: _list.name }]}></scib-ui-avatar>
									<div class="user-info">
										<span class="user-name">{_list.name}</span>
										<div class="user-contact">
											<span>{_list.email}</span>
											<p>
												<span>{_list.phone}</span>
												{_list.showTag ? <span class="user-info__tag">{_list.tagText}</span> : ''}
											</p>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			) : (
				<div class="cdk-ism__status">
					<div class="cdk-ism__legend-content cdk-ism__legend-status">
						{props.data.legend.map(_legend => {
							return (
								<scib-ui-color-panel class="c-legend" top-label={_legend.title} status={_legend.status}>
									{' '}
									{/* iterar esto */}
									<div class="c-legend-text" slot="dataContent">
										{_legend.data}
									</div>
								</scib-ui-color-panel>
							);
						})}
					</div>
					<span class="cdk-ism__span">{props.data.list.title}</span>

					<scib-cdk-messages-attached-bar titleTxt="" downloadable={false} islatest={true} files={props.data.list.data}></scib-cdk-messages-attached-bar>
				</div>
			)}
		</div>
	);
};
