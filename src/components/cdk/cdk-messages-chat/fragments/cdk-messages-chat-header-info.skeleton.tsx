import { FunctionalComponent, h } from '@stencil/core';

export const CDKMsgChatHeaderInfoSkeleton: FunctionalComponent<{}> = () => {
	return (
		<svg width="100%" height="100%" role="img">
			<title>Loading header info...</title>
			<defs>
				<path
					d="M4,0 L756,0 C758.209139,-4.05812251e-16 760,1.790861 760,4 L760,115 C760,117.209139 758.209139,119 756,119 L4,119 C1.790861,119 2.705415e-16,117.209139 0,115 L0,4 C-2.705415e-16,1.790861 1.790861,4.05812251e-16 4,0 Z"
					id="path-1"
				></path>
				<filter x="-6.4%" y="-21.0%" width="112.9%" height="182.4%" filterUnits="objectBoundingBox" id="filter-2">
					<feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
					<feOffset dx="0" dy="24" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
					<feGaussianBlur stdDeviation="12" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
					<feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>
					<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
				</filter>
				<circle id="path-3" cx="20" cy="13" r="16"></circle>
				<circle id="path-5" cx="16" cy="16" r="16"></circle>
				<circle id="path-7" cx="16" cy="16" r="16"></circle>
			</defs>
			<g id="Desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="Skeletone_Desktop">
					<g id="Group-13">
						<g id="Group-2">
							<g id="Group-8" transform="translate(16.000000, 15.000000)">
								<g id="Mask">
									<mask id="mask-4" fill="white">
										<circle id="path-3" cx="20" cy="13" r="16"></circle>
									</mask>
									<circle id="path-3" fill="#C3DEE7" cx="20" cy="13" r="16"></circle>
								</g>
								<text id="Barba-Moraleda-Maria" font-family="SantanderText-Regular, Santander Text" font-size="15" font-weight="normal" fill="#4C4C4C">
									<tspan x="50" y="15">
										Barba Moraleda María
									</tspan>
								</text>
							</g>
							<rect id="Rectangle" fill="#C3DEE7" x="64" y="15" width="175" height="24" rx="12"></rect>
							<g id="right">
								<rect id="Rectangle-Copy-15" fill="#C3DEE7" x="90%" y="15" width="24" height="24" rx="12"></rect>
								<rect id="Rectangle-Copy-4" fill="#C3DEE7" x="90%" transform="translate(-32.000000, 0.000000)" y="15" width="24" height="24" rx="12"></rect>
								<rect id="Rectangle-Copy-5" fill="#C3DEE7" x="90%" transform="translate(-64.000000, 0.000000)" y="15" width="24" height="24" rx="12"></rect>
							</g>
							<polygon id="Rectangle" fill="#EC0000" points="0 9 4 9 4 47 0 47"></polygon>
						</g>
					</g>
				</g>
			</g>
		</svg>
	);
};
