/**
 * Implements hook_field_formatter_view().
 */
function jquery_cycle2_field_formatter_view(entity_type, entity, field, instance, langcode, items, _display) {

  //console.log(entity_type);
  //console.log(entity);
  //console.log(field);
  //console.log(instance);
  //console.log(langcode);
  //console.log(items);
  //console.log(display);

  if (!items.length) { return ''; }

  // Make a copy of the incoming display so we don't overwrite the original.
  var display = {};
  $.extend(true, display, _display);

  // Set the default div class if one isn't already set.
  if (!display.settings.class) { display.settings.class = 'cycle-slideshow'; }

  // Prepare prefixes and suffixes.
  display.prefix = display.prefix ? display.prefix : '';
  display.field_prefix = display.field_prefix ? display.field_prefix : '';
  display.field_suffix = display.field_suffix ? display.field_suffix : '';
  display.suffix = display.suffix ? display.suffix : '';

  // Remove potential pager settings for single images, aka no pager for a single image slideshow.
  if (items.length == 1) {
    if (display.settings['data-cycle-pager']) { delete display.settings['data-cycle-pager']; }
    if (display.settings['data-cycle-pager-template']) { delete display.settings['data-cycle-pager-template']; }
  }

  // If there is one, make the pager selector specific to page.
  if (display.settings['data-cycle-pager']) {
    display.settings['data-cycle-pager'] = '#' + drupalgap_get_page_id() + ' ' + display.settings['data-cycle-pager'];
  }

  // We just imitate a single item when rendering the cycle.
  return { 0: {
    theme: 'jquery_cycle2',
    attributes: display.settings,
    entity_type: entity_type,
    entity: entity,
    items: items,
    display: display
  } };
}

/**
 * Implements hook_drupalgap_goto_preprocess().
 */
function jquery_cycle2_drupalgap_goto_preprocess(path) {
  $('.cycle-slideshow').cycle('stop');
}

/**
 * Themes a cycle.
 */
function theme_jquery_cycle2(variables) {

  // Set any defaults that weren't provided.
  var defaults = {
    display: {
      prefix: '',
      field_prefix: '',
      field_suffix: '',
      suffix: ''
    }
  };
  variables.display = $.extend({}, defaults.display, variables.display);
  if (variables.settings) {
    $.extend(true, variables.attributes, variables.settings);
  }
  if (variables.attributes.class.indexOf('cycle-slideshow') == -1) {
    variables.attributes.class += ' cycle-slideshow ';
  }

  // Open the cycle div container.
  var html = variables.display.prefix + '<div ' + drupalgap_attributes(variables.attributes) + '>' +
      variables.display.field_prefix;

  // Iterate over each item and render them. Try to figure out which path to use for the
  // image. We want to support Drupal core's "uri", Views JSON "src", and DrupalGap's
  // "path" variables for all to use.
  $.each(variables.items, function (delta, item) {
    var path = null;
    if (item.uri) { path = drupalgap_image_path(item.uri); }
    else if (item.src) { path = item.src; }
    else if (item.path) { path = item.path; }
    if (path) {
      var image = { path: path };
      html += theme('image', image);
    }
  });

  // Close the cycle div container.
  html += variables.display.field_suffix + '</div>' + variables.display.suffix;

  // Add a papeshow handler to initialize the cycle.
  var pageshowKey = variables.entity_type && variables.entity ?
    variables.entity_type + '-' + variables.entity[entity_primary_key(variables.entity_type)] :
    user_password();
  html += drupalgap_jqm_page_event_script_code({
    jqm_page_event_callback: 'jquery_cycle2_pageshow',
    jqm_page_event_args: JSON.stringify({})
  }, pageshowKey);

  return html;
}

function jquery_cycle2_pageshow(options) {
  $('#' + drupalgap_get_page_id() + ' .cycle-slideshow').cycle();
}
