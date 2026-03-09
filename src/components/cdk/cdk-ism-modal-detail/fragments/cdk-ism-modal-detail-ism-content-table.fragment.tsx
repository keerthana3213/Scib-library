import { FunctionalComponent, h } from '@stencil/core';

export const CDKIsmModalDetailIsmContentTable: FunctionalComponent<{
	data: any;
	show: Array<any>;
	idBtn: number;
	resume: Array<any>;
	isSelected?: boolean[];
	size: number;
	showResume: (index: number, item: any) => void;
	sendData(element: string): void;
}> = props => {
	return (
		<div class="cdk-ism-content">
			<div class="cdk-ism-content-table">
				<table class="cdk-ism-content-table__table">
					<thead>
						<tr class="cdk-ism-content-table__headers">
							{props.data.tableHeaders.map(item => (
								<th>{item.toUpperCase()}</th>
							))}
							<th class={{ 'cdk-ism-content-headers__hide': props.size < 767 }}></th>
						</tr>
					</thead>
					<tbody>
						{props.data.content.map((item, index) => {
							return (
								<tr class={props.isSelected[index] ? 'cdk-ism-content-table__body cdk-ism-content-table__body--selected' : 'cdk-ism-content-table__body'}>
									{props.data.headers.map(elem => (
										<td>{item[elem]}</td>
									))}
									<td
										class={{
											'cdk-ism-content-table__buttons': true,
											'cdk-ism-content-table__buttons--selected': item.resume?.length > 0 && props.isSelected[index],
										}}
									>
										{item.resume && item.resume.length > 0 ? (
											<scib-ui-button
												icon={props.show[index] ? 'icon-eye-show' : 'icon-eye-hide'}
												hideTxt
												link
												onEventClick={() => {
													props.showResume(index, item.resume);
												}}
											></scib-ui-button>
										) : null}
									</td>

									{props.size < 767 && <td class="cdk-ism-content-table__void"></td>}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{props.show[props.idBtn] === false && props.resume != undefined ? (
				<div class="cdk-ism-content-table__hide">
					{props.resume.map(elem => (
						<p class={props.data.id === 'act_plans' ? 'cdk-ism-content-table__straight' : 'cdk-ism-content-table__staged'}>
							<span class="cdk-ism-content-table__hide--title">{elem.title}</span>
							{elem.content ? (
								elem.status ? (
									<a
										href="#"
										title={'Open ' + elem.content + ' detail'}
										target="_blank"
										rel="noopener noreferrer"
										onClick={event => {
											event.preventDefault();
											props.sendData(elem.content);
										}}
									>
										{elem.content}
									</a>
								) : (
									<span>{elem.content}</span>
								)
							) : (
								<span>-</span>
							)}
						</p>
					))}
				</div>
			) : (
				''
			)}
		</div>
	);
};
