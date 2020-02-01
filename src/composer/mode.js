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
          token: 'number',
          regex: '[1-9]',
        },
        {
          token: 'zero',
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
          token: 'paren',
          regex: '\\(|\\)',
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
          token: 'dot',
          regex: '\\.',
        },
        {
          token: 'group_operation_other',
          regex: 'FitLength|ModulateBy|Reverse',
        },
        {
          token: 'repeat',
          regex: 'Repeat',
        },
        {
          token: 'group_operation',
          regex: 'Sequence|Overlay|Seq',
        },

        {
          token: 'o_shortcut',
          regex: 'O',
        },

        {
          token: 'operation',
          regex: 'AsIs|Tm|Ta|PanA|PanM|Gain|Length',
        },
        {
          token: 'letter',
          regex: '[a-z]',
        },
      ],
    };
  }
}

export default class WSCMode extends window.ace.acequire('ace/mode/text').Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
    this.lineCommentStart = '--';

    this.getNextLineIndent = function(state, line, tab) {
      var indent = this.$getIndent(line);

      var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
      var tokens = tokenizedLine.tokens;

      if (tokens.length && tokens[tokens.length - 1].type === 'comment') {
        return indent;
      }

      if (state === 'start') {
        var match = line.match(/^.*[{([]\s*$/);
        if (match) {
          indent += tab;
        }
      }

      return indent;
    };

    //this.checkOutdent = function(state, line, input) {
    //return this.$outdent.checkOutdent(line, input);
    //};

    //this.autoOutdent = function(state, doc, row) {
    //this.$outdent.autoOutdent(doc, row);
    //};
  }
}
