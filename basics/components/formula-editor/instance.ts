import CodeMirror from 'codemirror';
import {options} from "./options";

const errorMessage: { [key: string]: H3.FormulaEditor.ErrorMessage } = {
  empty: {
    code: 'empty',
    message: '请输入公式'
  },
  negative: { 
    code: 'negative', 
    message: '无效的公式:'
  },
  invalid: {
    code: 'invalid',
    message: '公式存在无效的字段'
  }
};


export class FormulaEditorInstance {
  editor: CodeMirror;
  keywords: Array<string> | undefined;
  fields: Array<H3.FormulaEditor.Field> | undefined;
  change: Function | undefined;
  blur: Function | undefined;

  constructor(element: HTMLElement) {
    this.editor = CodeMirror(element, {
      textWrapping: true,
      lineWrapping: true,
      lineNumbers: false,
      matchBrackets: {maxScanLines: 2000, maxHighlightLineLength: 2000},
      specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/,
      scrollbarStyle: 'simple',
      mode: 'formula',
      hintOptions: {
        hint: this.formulaHint,
        completeSingle: false
      }
    });
    this.init();
  }

  private init() {
    if (options) {
      if (options.keywords) {
        this.keywords = options.keywords;
      }
      if (options.fields) {
        this.fields = options.fields;
      }
      if (options.change) {
        this.change = options.change;
      }
      if (options.blur) {
        this.blur = options.blur;
      }
    }
    this.registerEvent();
  }

  /**
   * 注册事件
   */
  private registerEvent() {
    this.editor.on('change', () => {
      this.editor.showHint();
      this.change && this.change(this.editor.getValue());
    });
    this.editor.on('blur', () => {
      this.blur && this.blur(this.editor.getValue());
    });
  }

  /**
   * 添加字段
   * @param field
   */
  public insertField(field: H3.FormulaEditor.Field) {
    //判断字段是否在字段配置里面
    if (
      !options.fields ||
      (options.fields instanceof Array &&
        !options.fields.find((oField: H3.FormulaEditor.Field) => oField.key == field.key))
    ) {
      this.editor.focus();
      return;
    }
    const form = this.editor.getCursor();
    this.editor.replaceSelection(field.title);
    const to = this.editor.getCursor();
    this.markFieldElement({form, to, field, invalid: false });
    this.editor.focus();
  }

  public insertFormula(formula: string) {
    if (options.keywords) {
      const index = options.keywords.findIndex((keyword) => keyword === formula.toUpperCase());
      if (index > -1) {
        this.editor.focus();
        const cur = this.editor.getCursor();
        // if (["OR", "AND"].includes(formula)) {
        //   this.editor.replaceSelection(formula + " ");
        // } else {
          this.editor.replaceSelection(formula + "()");
        //  }
        this.editor.setCursor({line: cur.line, ch: cur.ch + formula.length + 1});
      }
    }
  }

  /**
   * 设置值
   * @param formula
   */
  public setValue(formula: string): void {
    const lines = formula.split('\n');
    let lineStrList: Array<string>;
    const formulaArr: Array<string> = [];
    let markFieldArr: Array<H3.FormulaEditor.MarkField> = [];
    let formulaText: string = '';
    let form: any;
    let to: any;
    let field: H3.FormulaEditor.Field | undefined;
    lines.forEach((line: string, index: number) => {
      lineStrList = line.split(options.fieldRegex);
      formulaText = '';
      lineStrList.forEach((str: string) => {
        if (options.fieldRegex.test(str)) {
          if (options.fields) {
            field = options.fields.find((oFiled: H3.FormulaEditor.Field) => 
            oFiled.key === str.replace('@@', '') 
            );
            // field = options.fields.find((oField: H3.FormulaEditor.Field) => {
            //   const keyWithoutAt = str.replace('@@', '');
            //   if (oField.key.includes('$') && !str.includes('$')) {
            //     const newStringKey = str.replace('@@', '') + '$';
            //     return oField.key === newStringKey;
            //   }
            //   return oField.key === keyWithoutAt;
            // });
            if (!field) {
              field = {title: '无效字段', key: 'invalid', type: 'other'};
            }
            form = CodeMirror.Pos(index, formulaText.length);
            formulaText += field.title;
            to = CodeMirror.Pos(index, formulaText.length);
            markFieldArr.push({form, to, field, invalid: field.key === 'invalid'})
          }
        } else {
          formulaText += str;
        }
      });
      formulaArr.push(formulaText);
    });
    this.editor.setValue(formulaArr.join('\n'));
    markFieldArr.forEach((markField: H3.FormulaEditor.MarkField) => {
      this.markFieldElement(markField);
    });
  }
  public focus() {
    this.editor.focus();
  }
  public checkValidate() : H3.FormulaEditor.ErrorMessage{
    let message: H3.FormulaEditor.ErrorMessage | undefined;
    const characters = (this.editor.display.lineDiv as HTMLElement).querySelectorAll('.CodeMirror-line > span > span');
    
    if(this.editor.getValue() === '') {
      message = errorMessage.empty;
    }else {
      characters.forEach((character: HTMLSpanElement) => {
        if(!message) {
          if(character.classList.contains('cm-negative')) {
            message = Object.assign({}, errorMessage.negative);
            message.message = message.message + character.innerText;
          }
          if(!character.classList.contains('cm-negative') && character.classList.contains('cm-field-invalid')) {
            message = errorMessage.invalid;
          }
        }
      });
    }
    return message ? message : { code: 'success', message: '' };
  }
 
  /**
   * 获取值
   */
  public getValue() : string{
    const result: Array<string> = [];
    let str = '';
    const lines = (this.editor.display.lineDiv as HTMLElement).querySelectorAll('.CodeMirror-line > span');
    lines.forEach((line: HTMLSpanElement) => {
      str = '';
      const characters = line.childNodes;
      characters.forEach((character: HTMLSpanElement) => {
          if(character.classList.contains('cm-field')) {
            str+= '@@' + character.getAttribute('id');
          }else {
            str+= character.innerText;
          }
      });
      result.push(str);
    });
    return result.join('\n');
  }
  /**
   * 制作字段元素
   * @param markField
   */
  private markFieldElement(markField: H3.FormulaEditor.MarkField): void {
    const span = document.createElement('span');
    span.classList.add('cm-field-name');
    span.innerText = markField.field.title;
    const textMarker: CodeMirror.TextMarker = this.editor.markText(markField.form, markField.to, {
      handleMouseEvents: true,
      atomic: true,
      replacedWith: span
    });
    textMarker.widgetNode.classList.add('cm-field');
    if (markField.invalid) {
      textMarker.widgetNode.classList.add('cm-field-invalid');
    }
    textMarker.widgetNode.id = markField.field.key;
  }

  /**
   * 公式高亮
   * @param editor
   */
  private formulaHint(editor: CodeMirror) {
    const word: RegExp = /[\w$]+/;
    const cur = editor.getCursor();
    const curLine = editor.getLine(cur.line);
    const end = cur.ch;
    let start = end;
    while (start && word.test(curLine.charAt(start - 1))) {--start;}
    const curWord = start != end && curLine.slice(start, end);
    let list: any = [];
    if (curWord && options.keywords) {
      list = options.keywords.filter((keyword) => keyword.includes(curWord.toUpperCase()) && keyword !== curWord.toUpperCase());
    }
    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
  }
}
