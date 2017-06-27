/*************************************************
 * Copyright (c) 2017 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

/**
 * @ngdoc function
 * @name forms.function:Inventories
 * @description This form is for adding/editing an inventory
 */

export default ['i18n', 'InventoryCompletedJobsList',
function(i18n, InventoryCompletedJobsList) {

    var completed_jobs_object = {
        name: 'completed_jobs',
        index: false,
        basePath: "unified_jobs",
        include: "InventoryCompletedJobsList",
        title: i18n._('Completed Jobs'),
        iterator: 'completed_job',
        generateList: true,
        skipGenerator: true,
        search: {
            "or__job__inventory": ''
        }
    };
    let clone = _.clone(InventoryCompletedJobsList);
    completed_jobs_object = angular.extend(clone, completed_jobs_object);

    return {

        addTitle: i18n._('NEW INVENTORY'),
        editTitle: '{{ inventory_name }}',
        name: 'inventory',
        basePath: 'inventory',
        // the top-most node of this generated state tree
        stateTree: 'inventories',
        tabs: true,

        fields: {
            name: {
                realName: 'name',
                label: i18n._('Name'),
                type: 'text',
                required: true,
                capitalize: false,
                ngDisabled: '!(inventory_obj.summary_fields.user_capabilities.edit || canAdd)'
            },
            description: {
                realName: 'description',
                label: i18n._('Description'),
                type: 'text',
                ngDisabled: '!(inventory_obj.summary_fields.user_capabilities.edit || canAdd)'
            },
            organization: {
                label: i18n._('Organization'),
                type: 'lookup',
                basePath: 'organizations',
                list: 'OrganizationList',
                sourceModel: 'organization',
                sourceField: 'name',
                awRequiredWhen: {
                    reqExpression: "organizationrequired",
                    init: "true"
                },
                ngDisabled: '!(inventory_obj.summary_fields.user_capabilities.edit || canAdd) || !canEditOrg',
                awLookupWhen: '(inventory_obj.summary_fields.user_capabilities.edit || canAdd) && canEditOrg'
            },
            insights_credential: {
                label: i18n._('Insights Credential'),
                type: 'lookup',
                list: 'CredentialList',
                basePath: 'credentials',
                sourceModel: 'insights_credential',
                sourceField: 'name',
                search: {
                    credential_type: '13' //insights
                }
            },
            instance_groups: {
                label: i18n._('Instance Groups'),
                type: 'custom',
                awPopOver: "<p>" + i18n._("Select the Instance Groups for this Inventory to run on.") + "</p>",
                dataTitle: i18n._('Instance Groups'),
                dataPlacement: 'right',
                dataContainer: 'body',
                control: '<instance-groups-multiselect instance-groups="instance_groups"></instance-groups-multiselect>',
            },
            inventory_variables: {
                realName: 'variables',
                label: i18n._('Variables'),
                type: 'textarea',
                class: 'Form-formGroup--fullWidth',
                rows: 6,
                "default": "---",
                awPopOver: "<p>" + i18n._("Enter inventory variables using either JSON or YAML syntax. Use the radio button to toggle between the two.") + "</p>" +
                    "JSON:<br />\n" +
                    "<blockquote>{<br />&emsp;\"somevar\": \"somevalue\",<br />&emsp;\"password\": \"magic\"<br /> }</blockquote>\n" +
                    "YAML:<br />\n" +
                    "<blockquote>---<br />somevar: somevalue<br />password: magic<br /></blockquote>\n" +
                    '<p>' + i18n.sprintf(i18n._('View JSON examples at %s'), '<a href="http://www.json.org" target="_blank">www.json.org</a>') + '</p>' +
                    '<p>' + i18n.sprintf(i18n._('View YAML examples at %s'), '<a href="http://docs.ansible.com/YAMLSyntax.html" target="_blank">docs.ansible.com</a>') + '</p>',
                dataTitle: i18n._('Inventory Variables'),
                dataPlacement: 'right',
                dataContainer: 'body',
                ngDisabled: '!(inventory_obj.summary_fields.user_capabilities.edit || canAdd)' // TODO: get working
            }
        },

        buttons: {
            cancel: {
                ngClick: 'formCancel()',
                ngShow: '(inventory_obj.summary_fields.user_capabilities.edit || canAdd)'
            },
            close: {
                ngClick: 'formCancel()',
                ngShow: '!(inventory_obj.summary_fields.user_capabilities.edit || canAdd)'
            },
            save: {
                ngClick: 'formSave()',
                ngDisabled: true,
                ngShow: '(inventory_obj.summary_fields.user_capabilities.edit || canAdd)'
            }
        },
        related: {
            permissions: {
                name: 'permissions',
                awToolTip: i18n._('Please save before assigning permissions'),
                dataPlacement: 'top',
                basePath: 'api/v2/inventories/{{$stateParams.inventory_id}}/access_list/',
                type: 'collection',
                title: i18n._('Permissions'),
                iterator: 'permission',
                index: false,
                open: false,
                search: {
                    order_by: 'username'
                },
                actions: {
                    add: {
                        label: i18n._('Add'),
                        ngClick: "$state.go('.add')",
                        awToolTip: i18n._('Add a permission'),
                        actionClass: 'btn List-buttonSubmit',
                        buttonContent: '&#43; ADD',
                        ngShow: '(inventory_obj.summary_fields.user_capabilities.edit || canAdd)'

                    }
                },
                fields: {
                    username: {
                        key: true,
                        label: i18n._('User'),
                        linkBase: 'users',
                        class: 'col-lg-3 col-md-3 col-sm-3 col-xs-4'
                    },
                    role: {
                        label: i18n._('Role'),
                        type: 'role',
                        nosort: true,
                        class: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
                    },
                    team_roles: {
                        label: i18n._('Team Roles'),
                        type: 'team_roles',
                        nosort: true,
                        class: 'col-lg-5 col-md-5 col-sm-5 col-xs-4',
                    }
                }
            },
            groups: {
                name: 'groups',
                awToolTip: i18n._('Please save before creating groups'),
                dataPlacement: 'top',
                include: "GroupList",
                title: i18n._('Groups'),
                iterator: 'group',
                skipGenerator: true
            },
            hosts: {
                name: 'hosts',
                awToolTip: i18n._('Please save before creating hosts'),
                dataPlacement: 'top',
                include: "RelatedHostsListDefinition",
                title: i18n._('Hosts'),
                iterator: 'host',
                skipGenerator: true
            },
            inventory_sources: {
                name: 'inventory_sources',
                awToolTip: i18n._('Please save before defining inventory sources'),
                dataPlacement: 'top',
                title: i18n._('Sources'),
                iterator: 'inventory_source',
                skipGenerator: true
            },
            completed_jobs: completed_jobs_object
        },
        relatedButtons: {
            remediate_inventory: {
                ngClick: 'remediateInventory(id, name, insights_credential)',
                ngShow: 'insights_credential!==null',
                label: i18n._('Remediate Inventory'),
                class: 'Form-primaryButton'
            }
        }

    };}];