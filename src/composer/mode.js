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
          token: 'keyword',
          regex: 'f:|l:|g:|p:',
        },
        {
          token: 'keyword',
          regex: '/',
        },
        {
          token: 'keyword',
          regex: '#',
        },
        {
          token: 'keyword',
          regex: 'AsIs |Tm |Ta |PanA |PanM |Gain |Length |FitLength |O |Sequence |Overlay |Seq ',
        },
      ],
    };
  }
}

export default class CustomSqlMode extends window.ace.acequire('ace/mode/text').Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
  }
}
