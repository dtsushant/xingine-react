import {
    Actions,
    CommissarBuilder, ConditionBuilder, FieldMetaBuilder,
    LayoutComponentDetailBuilder,
} from 'xingine';

/**
 * User Add Form Component - Proper Xingine Framework Pattern
 *
 * Uses proper withMeta FormRenderer with onInit actions for conditional rendering
 * instead of custom ConditionalFormBuilder or direct builder usage
 */
export const USER_ADD_FORM_COMMISSAR = CommissarBuilder.create()
  .path('/user/add')
  .wrapper()
  .className('min-h-full max-w-7xl mx-auto p-8 bg-gray-50')
  .addChildren([
    // Page Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 text-center')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h1 class="text-4xl font-bold text-gray-900 mb-4">👤 Create New User Profile</h1>')
          .build(),
      ])
      .build(),
    LayoutComponentDetailBuilder.create()
        .form()
        .fields([
                {
                    name: 'firstName',
                    label: 'First Name *',
                    inputType: 'input',
                    required: true,
                    properties: { placeholder: 'Enter your first name (e.g., John)' },
                    order: 1
                },
                {
                    name: 'lastName',
                    label: 'Last Name *',
                    inputType: 'input',
                    required: true,
                    properties: { placeholder: 'Enter your last name (e.g., Doe)' },
                    order: 2
                },
                {
                    name: 'email',
                    label: 'Email Address *',
                    inputType: 'input',
                    required: true,
                    properties: { placeholder: 'Enter your email (e.g., john.doe@company.com)' },
                    order: 3
                },
                {
                    name: 'hasCompanyInfo',
                    label: 'Provide Company Information',
                    inputType: 'checkbox',
                    required: false,
                    conditionalRender: {
                        condition: {
                            field: 'accountType',
                            operator: 'eq',
                            value: 'business'
                        }
                    },
                    order: 5
                },
                FieldMetaBuilder.create()
                .name('company')
                .label('Company Name')
                .inputType('object')
                .order(6)
                .properties({
                    fields: [
                        FieldMetaBuilder.create()
                            .name('name')
                            .label('Company Name *')
                            .inputType('input')
                            .required(true)
                            .properties({ placeholder: 'Enter company name' })
                            .build(),
                        FieldMetaBuilder.create()
                            .name('address')
                            .label('Address')
                            .inputType('input')
                            .properties({ placeholder: '123 Main St' })
                            .build(),
                        FieldMetaBuilder.create()
                            .name('city')
                            .label('City')
                            .inputType('input')
                            .properties({ placeholder: 'New York' })
                            .build(),
                    ],

                })
                    .withCondition(ConditionBuilder.
                    and(
                        ConditionBuilder.field('hasCompanyInfo')
                        .isTrue()
                        .build(),
                        ConditionBuilder.field('accountType')
                        .equals('business')
                        .build()
                    )
                    .build())
                .build(),
                {
                    name: 'accountType',
                    label: 'Account Type *',
                    inputType: 'select',
                    required: true,
                    properties: {
                        options: [
                            { value: 'individual', label: '👤 Individual User' },
                            { value: 'business', label: '🏢 Business Account' },
                            { value: 'admin', label: '🔧 Administrator' }
                        ]
                    },
                    order: 4
                },
            FieldMetaBuilder.create()
                .name('adminCode')
                .label('Admin Code *')
                .inputType('input')
                .required(true)
                .properties({ placeholder: 'Enter your Admin code' })
                .order(5)
                .showWhen('accountType', 'eq', 'admin')
                .build()
        ])
        .action('createUserProfile')
        .onLoad([
            Actions.apiCall('/api/fetch-user/:userId','GET',{userId:1})
                .then(
                    Actions.setFormData({setFromResult:true}).build(),
                )
                .build(),
        ])
        .showJsonEditor(true)
        .build(),
  ])
  .build();
