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
.ace-wsc-theme { background-color: black;\
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
.ace-wsc-theme .ace_invisible {\
color: #343434\
}\
.ace-wsc-theme .ace_operation {\
color: green\
}\
.ace-wsc-theme .ace_danny {\
color: deeppink\
}\
.ace-wsc-theme .ace_group_operation {\
color: orangered\
}\
.ace-wsc-theme .ace_group_operation_other {\
color: #E7C547\
}\
.ace-wsc-theme .ace_o_shortcut {\
color: #E78C45\
}\
.ace-wsc-theme .ace_pipe {\
color: #D54E53\
}\
.ace-wsc-theme .ace_bracket {\
color: #7AA6DA\
}\
.ace-wsc-theme .ace_curly {\
color: tomato\
}\
.ace-wsc-theme .ace_comment {\
color: grey\
}\
.ace-wsc-theme .ace_slash {\
color: #E7C547\
}\
.ace-wsc-theme .ace_string {\
color: #B9CA4A\
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
