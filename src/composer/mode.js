import 'ace-builds/src-noconflict/mode-text';

export class CustomHighlightRules extends window.ace.acequire('ace/mode/text_highlight_rules')
  .TextHighlightRules {
  constructor() {
    super();
    this.$rules = {
      start: [
        {
          token: 'comment',
          regex: '--.*$',
        },
        {
          token: 'comment',
          regex: '[1-9]',
        },
        {
          token: 'slash',
          regex: '[0]',
        },
        {
          token: 'danny',
          regex: 'f:|l:|g:|p:',
        },
        {
          token: 'slash',
          regex: '/',
        },
        {
          token: 'keyword',
          regex: '#',
        },
        {
          token: 'curly',
          regex: '{|}',
        },
        {
          token: 'bracket',
          regex: '\\[|\\]',
        },
        {
          token: 'pipe',
          regex: '\\|',
        },

        {
          token: 'keyword',
          regex: '>',
        },

        {
          token: 'curly',
          regex: '=',
        },
        {
          token: 'group_operation_other',
          regex: 'FitLength|ModulateBy',
        },

        {
          token: 'group_operation',
          regex: 'Sequence|Overlay|Seq|Repeat|Reverse',
        },

        {
          token: 'o_shortcut',
          regex: 'O',
        },

        {
          token: 'operation',
          regex: 'AsIs|Tm|Ta|PanA|PanM|Gain|Length',
        },
      ],
    };
  }
}

export default class WSCMode extends window.ace.acequire('ace/mode/text').Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
  }
}
