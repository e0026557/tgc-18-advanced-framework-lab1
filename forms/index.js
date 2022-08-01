// Import in caolan forms
const forms = require('forms');

// Create some shortcuts
const fields = forms.fields;
const widgets = forms.widgets;
const validators = forms.validators;

// Implement bootstrap helper function
const bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

  if (object.widget.classes.indexOf('form-control') === -1) {
    object.widget.classes.push('form-control');
  }

  var validationclass = object.value && !object.error ? 'is-valid' : '';
  validationclass = object.error ? 'is-invalid' : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  var label = object.labelHTML(name);
  var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group">' + label + widget + error + '</div>';
};

// Code to define a poster form
const createPosterForm = function (mediaProperties, tags) {
  return forms.create({
    title: fields.string({
      required: true,
      errorAfterField: true
    }),
    cost: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.integer(), validators.min(0)]
    }),
    description: fields.string({
      required: true,
      errorAfterField: true
    }),
    date: fields.date({
      required: true,
      errorAfterField: true,
      widget: widgets.date(),
      validators: [validators.date()]
    }),
    stock: fields.number({
      required: true,
      errorAfterField: true,
      widget: widgets.number(), // Only integer inputs allowed
      validators: [validators.min(0), validators.min(0), validators.digits()]
    }),
    height: fields.number({
      required: true,
      errorAfterField: true,
      validators: [validators.min(0)]
    }),
    width: fields.number({
      required: true,
      errorAfterField: true,
      validators: [validators.min(0)]
    }),
    media_property_id: fields.string({
      label: 'Media Property',
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: mediaProperties
    }),
    tags: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.multipleSelect(),
      choices: tags
    }),
    image_url: fields.string({
      widget: widgets.hidden()
    })
  })
}

const createRegistrationForm = function () {
  return forms.create({
    username: fields.string({
      required: true,
      errorAfterField: true
    }),
    email: fields.string({
      required: true,
      errorAfterField: true
    }),
    password: fields.password({
      required: true,
      errorAfterField: true
    }),
    confirm_password: fields.password({
      required: true,
      errorAfterField: true,
      validators: [validators.matchField('password')]
    })
  })
}

const createLoginForm = function() {
  return forms.create({
    email: fields.string({
      required: true,
      errorAfterField: true
    }),
    password: fields.password({
      required: true,
      errorAfterField: true
    })
  })
}

const createSearchForm = function(mediaProperties, tags) {
  return forms.create({
    title: fields.string({
      required: false, // Not a must to search by title
      errorAfterField: true
    }),
    min_cost: fields.number({
      required: false, // Not a must to search by min cost
      errorAfterField: false,
      validators: [validators.integer()]
    }),
    max_cost: fields.number({
      required: false, // Not a must to search by max cost
      errorAfterField: false,
      validators: [validators.integer()]
    }),
    min_width: fields.number({
      required: false,
      errorAfterField: true,
      validators: [validators.integer()]
    }),
    max_width: fields.number({
      required: false,
      errorAfterField: true,
      validators: [validators.integer()]
    }),
    min_height: fields.number({
      required: false,
      errorAfterField: true,
      validators: [validators.integer()]
    }),
    max_height: fields.number({
      required: false,
      errorAfterField: true,
      validators: [validators.integer()]
    }),
    media_property_id: fields.string({
      label: 'Media Property',
      required: false, // Not a must to search by media properties
      errorAfterField: true,
      choices: mediaProperties,
      widget: widgets.select()
    }),
    tags: fields.string({
      required: false, // Not a must to search by tags
      errorAfterField: true,
      choices: tags,
      widget: widgets.multipleSelect()
    })
  })
}

module.exports = {
  createPosterForm,
  createRegistrationForm,
  createLoginForm,
  createSearchForm,
  bootstrapField
}