import { FunctionalComponent, h } from '@stencil/core';

export const CDKContractCardSkeleton: FunctionalComponent<{
	literalSkeleton: string;
}> = props => {
	return (
		<svg role="img" width="100%" height="100%" viewBox="0 0 413 184">
			<title>{props.literalSkeleton}</title>
			<g id="Contract-Reviewer" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="Skeleton" transform="translate(-48.000000, -610.000000)">
					<g id="Group-40" transform="translate(48.000000, 610.000000)">
						<g id="Group-2-Copy-3">
							<rect id="Rectangle" fill="#DEEDF2" x="0" y="0" width="413" height="184" rx="8"></rect>
							<g id="Group-4" transform="translate(16.000000, 56.000000)" fill="#C3DEE7" fill-rule="nonzero">
								<g id="Group-7">
									<g id="Group-11" transform="translate(78.000000, 66.000000)">
										<path
											d="M19,0 L43,0 C53.4934102,-1.92760819e-15 62,8.50658975 62,19 C62,29.4934102 53.4934102,38 43,38 L19,38 C8.50658975,38 1.28507213e-15,29.4934102 0,19 C-1.28507213e-15,8.50658975 8.50658975,1.92760819e-15 19,0 Z"
											id="Rectangle"
										></path>
									</g>
									<g id="Group-11">
										<path
											d="M19,66 L43,66 C53.4934102,66 62,74.5065898 62,85 C62,95.4934102 53.4934102,104 43,104 L19,104 C8.50658975,104 1.28507213e-15,95.4934102 0,85 C-1.28507213e-15,74.5065898 8.50658975,66 19,66 Z"
											id="Rectangle"
										></path>
										<path
											d="M8,0 L92,0 C96.418278,-8.11624501e-16 100,3.581722 100,8 C100,12.418278 96.418278,16 92,16 L8,16 C3.581722,16 5.41083001e-16,12.418278 0,8 C-5.41083001e-16,3.581722 3.581722,8.11624501e-16 8,0 Z"
											id="Rectangle-Copy-6"
										></path>
									</g>
									<g id="Group-11" transform="translate(156.000000, 66.000000)">
										<path
											d="M19,0 L43,0 C53.4934102,-1.92760819e-15 62,8.50658975 62,19 C62,29.4934102 53.4934102,38 43,38 L19,38 C8.50658975,38 1.28507213e-15,29.4934102 0,19 C-1.28507213e-15,8.50658975 8.50658975,1.92760819e-15 19,0 Z"
											id="Rectangle"
										></path>
									</g>
								</g>
							</g>
						</g>
						<path
							d="M28,22 L291,22 C297.627417,22 303,27.372583 303,34 C303,40.627417 297.627417,46 291,46 L28,46 C21.372583,46 16,40.627417 16,34 C16,27.372583 21.372583,22 28,22 Z"
							id="Rectangle-Copy-3"
							fill="#C3DEE7"
							fill-rule="nonzero"
						></path>
					</g>
				</g>
			</g>
		</svg>
	);
};
