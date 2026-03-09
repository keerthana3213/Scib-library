import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Create Vdr',
	...getStoryConfig('scib-cdk-create-vdr'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open is-emitter>
            <scib-cdk-create-vdr literals='${args.literals}'>
                <scib-cdk-vdr-initial-form slot="fieldset" 
                    main-title="<h2>Create a New Virtual Data Room</h2>"
                    char-limit-name="35"
                    char-limit-description="90"
                    name="Name*"
                    placeholder="Enter name"
                    to-label-txt= "Add Owners*"
                    contacts-label-txt= "Contacts"
                    placeholder-select="Choose owners"
                    id-txtarea="vdr-name"
                    name-txtarea="vdr description"
                    label-txtarea="Description*"
                    placeholder-txtarea="Enter description..."
                    id-select="owners-id"
                    owners-label="Owners:"
                    owners-list='[
                        {
                            "id": "1234",
                            "email": "jcardenas@santander.es",
                            "name": "Jesús Cárdenas Vizcaíno",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1235",
                            "email": "jmartinez@santander.es",
                            "name": "Jeremías Martínez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1236",
                            "email": "jperez@santander.es",
                            "name": "Jerónimo Pérez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1237",
                            "email": "asanchez@santander.es",
                            "name": "Alba Sanchez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1238",
                            "email": "jmiguel@santander.es",
                            "name": "José Miguel Martínez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        }
                        ]' >
                </scib-cdk-vdr-initial-form>
                 <scib-cdk-vdr-final-form slot="fieldset"
                    main-title="<h2>Members</h2>"
                    to-label-txt= "Members*"
                    id-select="members-id"
                    placeholder-select="Choose members"
                    legend="<p>Invite members to participate in the Virtual Data Room. You can also add more members later.</p>
                    <p><strong>*Please be careful with invitations for data protection.</strong></p>"
                    members-label="Members:"
                    members-list='[
                        {
                            "id": "1234",
                            "email": "jcardenas@santander.es",
                            "name": "Jesús Cárdenas Vizcaíno",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1235",
                            "email": "jmartinez@santander.es",
                            "name": "Jeremías Martínez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1236",
                            "email": "jperez@santander.es",
                            "name": "Jerónimo Pérez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1237",
                            "email": "asanchez@santander.es",
                            "name": "Alba Sanchez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1238",
                            "email": "jmiguel@santander.es",
                            "name": "José Miguel Martínez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1239",
                            "email": "jcardenas@santander.es",
                            "name": "Jesús Cárdenas Vizcaíno",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1240",
                            "email": "jmartinez@santander.es",
                            "name": "Jeremías Martínez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1241",
                            "email": "jperez@santander.es",
                            "name": "Jerónimo Pérez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1242",
                            "email": "asanchez@santander.es",
                            "name": "Alba Sanchez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        },
                        {
                            "id": "1243",
                            "email": "jmiguel@santander.es",
                            "name": "José Miguel Martínez",
                            "avatar": {
                            "src": "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
                            "alt": "Jesús Cárdenas Vizcaíno"
                            }
                        }
                        ]'
                    >
                </scib-cdk-vdr-final-form>
            </scib-cdk-create-vdr>
        </scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: '{ "btnNext":"Next", "btnBack": "Back", "btnFinish": "Confirm", "notice": "*Required input"}'
	// Add default values here
};
