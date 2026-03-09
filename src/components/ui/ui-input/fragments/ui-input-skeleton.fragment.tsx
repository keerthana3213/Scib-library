import { FunctionalComponent, h } from '@stencil/core';

export const UIInputSkeleton: FunctionalComponent<{
	literalSkeleton: string;
	viewBox: string;
}> = props => {
	return (
		<svg width="100%" height="100%" viewBox={props.viewBox} version="1.1" role="img">
			<title>{props.literalSkeleton}</title>
			<g id="MVP-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="Skeleton-VDR-avatar" transform="translate(-724.000000, -302.000000)">
					<g id="Group-3" transform="translate(290.000000, 100.000000)">
						<g id="Group-22" transform="translate(422.000000, 163.000000)">
							<g id="Group-16" transform="translate(12.000000, 41.000000)">
								<g id="Group-15">
									<g id="Group-20" transform="translate(0.000000, 31.000000)" fill="#DCDCDC">
										<polygon id="Rectangle" points="0 0 334 0 334 1 225.128326 1 0 1"></polygon>
									</g>
									<g id="Group-14" transform="translate(5.000000, 0.000000)" fill="#C3DEE7">
										<rect id="Rectangle" x="32" y="4" width="calc(100% - 40px)" height="16" rx="8"></rect>
										<circle id="Mask" stroke="#C3DEE7" stroke-width="2" cx="12" cy="12" r="13"></circle>
									</g>
								</g>
								<g id="Group-14-Copy" transform="translate(5.000000, 40.000000)" fill="#C3DEE7">
									<rect id="Rectangle" x="32" y="4" width="calc(100% - 40px)" height="16" rx="8"></rect>
									<circle id="Mask" stroke="#C3DEE7" stroke-width="2" cx="12" cy="12" r="13"></circle>
								</g>
								<g id="Group-31" transform="translate(0.000000, 72.000000)" fill="#DCDCDC">
									<rect id="Rectangle-Copy-6" x="0" y="0" width="334" height="1"></rect>
								</g>
								<g id="Group-31" transform="translate(0.000000, 113.000000)" fill="#DCDCDC">
									<rect id="Rectangle" x="0" y="0" width="334" height="1"></rect>
								</g>
								<g id="Group-14-Copy" transform="translate(5.000000, 81.000000)" fill="#C3DEE7">
									<rect id="Rectangle" x="32" y="4" width="calc(100% - 40px)" height="16" rx="8"></rect>
									<circle id="Mask" stroke="#C3DEE7" stroke-width="2" cx="12" cy="12" r="13"></circle>
								</g>
								<g id="Group-14-Copy-2" transform="translate(5.000000, 122.000000)" fill="#C3DEE7">
									<rect id="Rectangle" x="32" y="4" width="calc(100% - 40px)" height="16" rx="8"></rect>
									<circle id="Mask" stroke="#C3DEE7" stroke-width="2" cx="12" cy="12" r="13"></circle>
								</g>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
	);
};
