import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-cdk-messages'),
	title: 'Design System/DEPRECATED/CDK/Messages',
	render: (args) => <scib-cdk-messages {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		activeTab: 'MSG',
		unreadMsg: 3,
		showNewButton: false,
		literals: {
			titleTxt: 'Messages',
			subtitleTxt: 'All messages',
			filterPlaceholderTxt: 'Search...',
			tab1Label: 'All messages',
			tab2Label: 'Santander CIB',
			tab3Label: 'Applications',
			repliesTxt: 'Replies',
			unreadFlagTxt: 'new unreaded',
			sendButtonTxt: 'Send',
			discardButtonTxt: 'Discard',
			replyButtonTxt: 'Reply',
			deleteButtonTxt: 'Delete',
			toLabelTxT: 'To',
			newMessageTxt: 'New message',
			subjectLabelTxt: 'Subject',
			disableRepliesLabelTxt: 'Disable replies',
			markImportantRepliesLabelTxt: 'Mark as important',
			newMessagePlaceholderTxt: 'Write your message...',
			downloadConversation: 'Download conversation',
			sendConversation: 'Send conversation via Emaigfl',
			downloadConversaionBtnTxt: 'Download conversation',
			closeBtnTxt: 'Close',
			warnDialogTxt: 'Are you sure you want to download the conversation?',
			warnDialogSubTxt: 'Please bear in mind this may contain confidential information and should be treated as such'
		},
		conversations: [
			{
				id: '1230',
				group: null,
				unread: true,
				notifications: 32,
				date: '18/4/20',
				important: true,
				avatar: [
					{
						src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
						alt: 'Jesús Cárdenas Vizcaíno'
					},
					{
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'<strong>Ángeles</strong>: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1231',
				group: null,
				unread: true,
				notifications: 32,
				date: '18/4/20',
				avatar: [
					{
						src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
						alt: 'Anabel Dominguez Santos'
					},
					{
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'<strong>Ángeles</strong>: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1232',
				group: null,
				unread: false,
				repliesNotAllowed: true,
				date: '18/4/20',
				avatar: [
					{
						src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
						alt: 'Anabel Dominguez Santos'
					},
					{
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'<strong>Ángeles</strong>: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1233',
				group: null,
				unread: false,
				date: '18/4/20',
				avatar: [
					{
						src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
						alt: 'Anabel Dominguez Santos'
					},
					{
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'<strong>Ángeles</strong>: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1234',
				group: null,
				unread: false,
				date: '18/4/20',
				avatar: [
					{
						src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
						alt: 'Anabel Dominguez Santos'
					},
					{
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				],
				subject: 'Refinamiento Backlog',
				important: true,
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'<strong>Ángeles</strong>: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1235',
				group: null,
				unread: false,
				date: '18/4/20',
				avatar: [
					{
						src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
						alt: 'Jesús Cárdenas'
					},
					{
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Jesús Cárdenas'
					},
					{
						src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
						alt: 'Jesús Cárdenas'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'Ángeles: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1236',
				group: null,
				unread: false,
				date: '18/4/20',
				avatar: [
					{
						src: 'https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg',
						alt: 'Jesús Cárdenas'
					},
					{
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Jesús Cárdenas'
					},
					{
						src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
						alt: 'Jesús Cárdenas'
					},
					{
						src: 'https://www.nutritelia.com/wp-content/uploads/2016/09/alimentos-ricos-acido-hilauronico1-1.jpg',
						alt: 'Jesús Cárdenas'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'Ángeles: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1237',
				group: null,
				unread: false,
				date: '18/4/20',
				avatar: [
					{
						alt: 'Walt Disney'
					},
					{
						alt: 'María'
					},
					{
						alt: 'Pepe'
					},
					{
						alt: 'Otro'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'Ángeles: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			},
			{
				id: '1238',
				group: null,
				unread: false,
				date: '18/4/20',
				avatar: [
					{
						alt: 'Walt Disney'
					}
				],
				subject: 'Refinamiento Backlog',
				subtitle: 'Ángeles, Jesús, +2',
				preview:
					'Ángeles: Buenas tardes, Esta convocatoria lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam pariatur, quidem nostrum inventore sunt, illo maxime optio dolorum vero ducimus recusandae, aliquam similique odio repudiandae nihil provident alias! Dignissimos, omnis!'
			}
		],
		toUserList: [
			{
				email: 'jcardenas@santander.es',
				name: 'Jesús Cárdenas Vizcaíno',
				avatar: {
					src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
					alt: 'Jesús Cárdenas Vizcaíno'
				}
			},
			{
				email: 'jmartinez@santander.es',
				name: 'Jeremías Martínez',
				avatar: {
					src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
					alt: 'Jesús Cárdenas Vizcaíno'
				}
			},
			{
				email: 'jmiguel@santander.es',
				name: 'José Miguel Martínez',
				avatar: {
					src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
					alt: 'Jesús Cárdenas Vizcaíno'
				}
			}
		],
		messages: [
			{
				author: {
					name: 'Naoko Yoshimitsu Martínez',
					avatar: {
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				},
				date: 'lunes, 20 de abril de 2020, 12:35',
				sender: false,
				unread: false,
				message:
					'<p>Buenos días,</p></br><p>Este es un ejemplo del primer mensaje. Stencil lo reconoce como tal al ser el primero pasado en el Array</br></br></p><p>Gracias!</p><p>Saludos, Ángeles</p>'
			},
			{
				author: {
					name: 'Naoko Yoshimitsu Martínez',
					avatar: {
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				},
				date: 'lunes, 20 de abril de 2020, 12:35',
				sender: false,
				unread: false,
				message: 'Ejemplo de una respuesta a un mensaje por parte de otro autor que ha sido leída por el usuario de la aplicación'
			},
			{
				author: {
					name: 'Jesús Cárdenas Vizcaíno',
					avatar: {
						src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
						alt: 'Jesús Cárdenas Vizcaíno'
					}
				},
				date: 'lunes, 20 de abril de 2020, 12:35',
				sender: true,
				message: 'Ejemplo de una respuesta del usuario que ha sido leída por el otro interviniente y por tanto tiene el flag de confirmación'
			},
			{
				author: {
					name: 'Naoko Yoshimitsu Martínez',
					avatar: {
						src: 'https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg',
						alt: 'Naoko Yoshimitsu Martínez'
					}
				},
				date: 'lunes, 20 de abril de 2020, 12:35',
				sender: false,
				unread: true,
				message: 'Ejemplo de respuesta del otro interviniente que no ha sido aun leída por el usuario'
			},
			{
				author: {
					name: 'Jesús Cárdenas Vizcaíno',
					avatar: {
						src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
						alt: 'Jesús Cárdenas Vizcaíno'
					}
				},
				date: 'lunes, 20 de abril de 2020, 12:35',
				sender: true,
				message: 'Ejemplo de respuesta del usuario que no ha sido aun leída por el otro interviniente'
			}
		],
		files: {
			tableId: 'chat-files',
			isDownloadable: true,
			paginationPageSize: 10,
			cellRenderer: true,
			literals: {
				totalRows: 'Total: 4 files'
			},
			topButtons: [{ text: 'Download' }],
			columns: [
				{ headerName: 'Name', field: 'name', sort: 'desc' },
				{ headerName: 'Owner', field: 'owner' },
				{ headerName: 'Last modification', field: 'modification' },
				{ headerName: 'Size', field: 'size' }
			],
			data: [
				{
					name: 'Signed - 019972346234726346.pdf',
					owner: 'Juan López García',
					modification: '18 aug. 2020 - Juan López García',
					size: '125 Kb'
				},
				{
					name: 'Signed - 019972346234726346.xls',
					owner: 'Juan López García',
					modification: '18 aug. 2020 - Juan López García',
					size: '125 Kb'
				},
				{
					name: 'Signed - 019972346234726346.ppt',
					owner: 'Juan López García',
					modification: '18 aug. 2020 - Juan López García',
					size: '125 Kb'
				},
				{
					name: 'Signed - 019972346234726346.doc',
					owner: 'Juan López García',
					modification: '18 aug. 2020 - Juan López García',
					size: '125 Kb'
				}
			]
		},
		tabs: [
			{
				id: 'MSG',
				label: 'Messages'
			},
			{
				id: 'FIL',
				label: 'Files'
			}
		],
		loadingSendMessage: true,
		isEmployee: true,
		filesTableConfig: {
			config: {
				paginationSizeSelector: [10, 20],
				paginationInitialPage: 1,
				paginationSize: 10,
				totalItems: 20
			},
			columns: [
				{
					formatter: 'rowSelection',
					titleFormatter: 'rowSelection',
					hozAlign: 'center',
					headerSort: false,
					width: 64
				},
				{
					title: `<?xml version="1.0" encoding="UTF-8"?>
				<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<title>987B6976-358D-4CA5-B616-268CFC67AF34</title>
					<g id="Styles" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="Icons" transform="translate(-1324.000000, -414.000000)" fill="#444444">
							<g id="atoms/ico/24/add-24-copy-20" transform="translate(1324.000000, 414.000000)">
								<path d="M15.8095238,7.875 L19.2380952,7.875 C19.6588836,7.875 20,7.53921356 20,7.125 L20,6 C19.9981984,5.80126899 19.9180158,5.61100383 19.776381,5.469375 L15.9668571,1.719375 C15.8240366,1.57894231 15.630438,1.5 15.4285714,1.5 L6.28571429,1.5 C5.02395832,1.50144652 4.00146948,2.50795897 4,3.75 L4,20.25 C4.00146948,21.492041 5.02395832,22.4985535 6.28571429,22.5 L17.7142857,22.5 C18.9760417,22.4985535 19.9985305,21.492041 20,20.25 L20,10.125 C20,9.71078644 19.6588836,9.375 19.2380952,9.375 C18.8173069,9.375 18.4761905,9.71078644 18.4761905,10.125 L18.4761905,20.25 C18.4761905,20.6642136 18.1350741,21 17.7142857,21 L6.28571429,21 C5.8649259,21 5.52380952,20.6642136 5.52380952,20.25 L5.52380952,3.75 C5.52380952,3.33578644 5.8649259,3 6.28571429,3 L13.5238095,3 L13.5238095,5.625 C13.525279,6.86704103 14.5477678,7.87355348 15.8095238,7.875 Z M18.4761905,6.3105 L18.4761905,6.375 L15.8095238,6.375 C15.3887354,6.375 15.047619,6.03921356 15.047619,5.625 L15.047619,3 L15.1131429,3 L18.4761905,6.3105 Z" id="Shape"></path>
							</g>
						</g>
					</g>
				</svg>`,
					field: 'mime_type',
					headerSort: false,
					formatter: 'extensionFile',
					hozAlign: 'center',
					headerHozAlign: 'center',
					width: 48
				},
				{ title: 'Name', field: 'name', width: 150 },
				{ title: 'Owner', field: 'owner', width: 150 },
				{
					title: 'Modification',
					field: 'modification',
					hozAlign: 'left',
					formatter: 'datetime',
					formatterParams: {
						inputFormat: 'yyyy-LL-dd',
						outputFormat: 'dd/LL/yyyy',
						invalidPlaceholder: '(invalid date)'
					}
				},
				{ title: 'Size', field: 'size', width: 150 }
			],
			rowData: [
				{
					hiddenId: 'id used to find the file',
					extensionType: 'pdf',
					mime_type: 'pdf',
					name: 'QA',
					owner: 'Leo',
					modification: '15/06/2023',
					size: '120kb'
				}
			]
		}
	}
};
