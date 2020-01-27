import ace from 'brace';

ace.define('ace/theme/wsc', ['require', 'exports', 'module', 'ace/lib/dom'], function(
  require,
  exports,
  module
) {
  exports.isDark = true;
  exports.cssClass = 'ace-wsc-theme';
  exports.cssText =
    // eslint-disable-next-line
    '.ace-wsc-theme .ace_gutter {\
background: #1a0005;\
color: steelblue\
}\
.ace-wsc-theme .ace_print-margin {\
width: 1px;\
background: #1a1a1a\
}\
.ace-wsc-theme {\
background-color: black;\
color: #DEDEDE\
}\
.ace-wsc-theme .ace_cursor {\
color: #9F9F9F\
}\
.ace-wsc-theme .ace_marker-layer .ace_selection {\
background: #424242\
}\
.ace-wsc-theme.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px black;\
}\
.ace-wsc-theme .ace_marker-layer .ace_step {\
background: rgb(0, 0, 0)\
}\
.ace-wsc-theme .ace_marker-layer .ace_bracket {\
background: #090;\
}\
.ace-wsc-theme .ace_marker-layer .ace_bracket-start {\
background: #090;\
}\
.ace-wsc-theme .ace_marker-layer .ace_bracket-unmatched {\
margin: -1px 0 0 -1px;\
border: 1px solid #900\
}\
.ace-wsc-theme .ace_marker-layer .ace_active-line {\
background: #2A2A2A\
}\
.ace-wsc-theme .ace_gutter-active-line {\
background-color: #2A112A\
}\
.ace-wsc-theme .ace_marker-layer .ace_selected-word {\
border: 1px solid #424242\
}\
.ace-wsc-theme .ace_invisible {\
color: #343434\
}\
.ace-wsc-theme .ace_keyword,\
.ace-wsc-theme .ace_meta,\
.ace-wsc-theme .ace_storage,\
.ace-wsc-theme .ace_storage.ace_type,\
.ace-wsc-theme .ace_support.ace_type {\
color: green\
}\
.ace-wsc-theme .ace_keyword.ace_operator {\
color: deeppink\
}\
.ace-wsc-theme .ace_constant.ace_character,\
.ace-wsc-theme .ace_constant.ace_language,\
.ace-wsc-theme .ace_constant.ace_numeric,\
.ace-wsc-theme .ace_keyword.ace_other.ace_unit,\
.ace-wsc-theme .ace_support.ace_constant,\
.ace-wsc-theme .ace_variable.ace_parameter {\
color: #E78C45\
}\
.ace-wsc-theme .ace_constant.ace_other {\
color: gold\
}\
.ace-wsc-theme .ace_invalid {\
color: yellow;\
background-color: red\
}\
.ace-wsc-theme .ace_invalid.ace_deprecated {\
color: #CED2CF;\
background-color: #B798BF\
}\
.ace-wsc-theme .ace_fold {\
background-color: #7AA6DA;\
border-color: #DEDEDE\
}\
.ace-wsc-theme .ace_entity.ace_name.ace_function,\
.ace-wsc-theme .ace_support.ace_function,\
.ace-wsc-theme .ace_variable {\
color: #7AA6DA\
}\
.ace-wsc-theme .ace_support.ace_class,\
.ace-wsc-theme .ace_support.ace_type {\
color: #E7C547\
}\
.ace-wsc-theme .ace_heading,\
.ace-wsc-theme .ace_string {\
color: #B9CA4A\
}\
.ace-wsc-theme .ace_entity.ace_name.ace_tag,\
.ace-wsc-theme .ace_entity.ace_other.ace_attribute-name,\
.ace-wsc-theme .ace_meta.ace_tag,\
.ace-wsc-theme .ace_string.ace_regexp,\
.ace-wsc-theme .ace_variable {\
color: #D54E53\
}\
.ace-wsc-theme .ace_comment {\
color: orangered\
}\
.ace-wsc-theme .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYLBWV/8PAAK4AYnhiq+xAAAAAElFTkSuQmCC) right repeat-y;\
}\
';

  var dom = require('../lib/dom');
  dom.importCssString(exports.cssText, exports.cssClass);
});
(function() {
  ace.require(['ace/theme/wsc'], function(m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m;
    }
  });
})();
