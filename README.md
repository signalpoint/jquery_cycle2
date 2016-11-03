# jquery_cycle2
The jQuery Cycle2 module for DrupalGap.

## Installation

Download the *jQuery Cycle2* plugin to your mobile application's root folder:

```
cd mobile-application
wget http://malsup.github.io/min/jquery.cycle2.min.js
```

Include the plugin in your `index.html` file before the closing `</head>`:

```
<!-- jQuery Cycle 2 -->
<script src="jquery.cycle2.min.js"></script>
```

Download the `jquery_cycle2` module for DrupalGap into your app's `modules` directory:

```
mobile-application/app/modules/jquery_cycle2/jquery_cycle2.js
```

Enable the `jquery_cycle2` module within DrupalGap in the `settings.js` file:

```
Drupal.modules.contrib['jquery_cycle2'] = {};
```

Next, [create a custom DrupalGap module](http://docs.drupalgap.org/7/Modules/Create_a_Custom_Module), enable it, then configure your image field(s) to be formatted using the `jquery_cycle2` module:

```
/**
 * Implements hook_services_postprocess().
 */
function my_module_services_postprocess(options, result) {
  if (options.service == 'system' && options.resource == 'connect') {

    // Take over the field formatter for field_image on article nodes.
    var display = drupalgap.field_info_instances.node.article.field_image.display.drupalgap;
    display.module = 'jquery_cycle2';
    display.settings = {
      'data-cycle-pager': '.my-module-jquery-cycle2-pager',
      'data-cycle-pager-template': "<a href='#'><img src='{{src}}' width=32 height=32></a>"
    };
    //display.prefix = '';
    //display.field_prefix = '';
    //display.field_suffix = '';
    display.suffix = '<div class="my-module-jquery-cycle2-pager"></div>';

  }
}
```

The example above is roughly equivalent to the *Advanced Custom Template* example mentioned here: http://jquery.malsup.com/cycle2/demo/pager.php

For more configuration options, utilize the examples found here http://jquery.malsup.com/cycle2/demo/, and place them into your `display.settings` configuration object mentioned above.

### Widget and Theme Layer

If we'd like to manually render a slideshow, that is possible too. In this example, we have an `items` array that can be made up of any number of Drupal file uri's, Views JSON image paths (aka absolute URLs), or images hosted within the application:

```
var items = [
  { uri: 'public://slide-1.jpg' }, // We can use one ore more Drupal file uris...
  { src: 'http://example.com/sites/default/files/slide-2.jpg' }, // absolute URLs...
  { path: 'app/modules/custom/my_module/images/slide-3.jpg' }, // or internal DrupalGap paths.
];
var settings = {
  'data-cycle-pager': '#' + drupalgap_get_page_id() +' .my-module-jquery-cycle2-pager',
  'data-cycle-pager-template': "<a href='#'><img src='{{src}}' width=32 height=32></a>"
};
var display = {
  suffix: '<div class="my-module-jquery-cycle2-pager"></div>'
};
```

Once the `items` array is built, we can then run it through as a render array (aka a widget), or run it through DrupalGap's theme layer:

#### Render Array (Widget)
```
var content = {};
content.slideshow = {
  theme: 'jquery_cycle2',
  items: items,
  settings: settings,
  display: display
};
return content;
```

### theme('jquery_cycle2', ...)
```
var html = theme('jquery_cycle2', {
  items: items,
  settings: settings,
  display: display
});
return html;
```

#### Extra options
```
withinPageshow: true, // defaults to false, set to true when using within a pageshow callback
```
