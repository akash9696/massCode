import { editorScrollbarTheme } from '@/components/cm-extensions/scrollbarTheme'
import { EditorView } from '@codemirror/view'
import {
  MARKDOWN_APPEARANCE_DEFAULTS,
  resolveMarkdownAppearance,
} from '~/shared/markdownAppearance'

export interface NotesEditorThemeSettings {
  fontSize: number
  fontFamily: string
  codeFontFamily: string
  lineHeight: number
  limitWidth: boolean
  lineNumbers: boolean
  indentSize: number
  markdownAppearance?: import('~/shared/markdownAppearance').MarkdownAppearanceSettings
}


export function createMarkdownAppearanceCssVariables(
  notesSettings: NotesEditorThemeSettings,
  isDark: boolean,
) {
  const md = resolveMarkdownAppearance(
    notesSettings.markdownAppearance ?? MARKDOWN_APPEARANCE_DEFAULTS,
    isDark,
  )

  return {
    '--md-text-color': md.textColor,
    '--md-strong-color': md.strongColor,
    '--md-emphasis-color': md.emphasisColor,
    '--md-strike-color': md.strikeColor,
    '--md-h1-color': md.h1Color,
    '--md-h2-color': md.h2Color,
    '--md-h3-color': md.h3Color,
    '--md-h4-color': md.h4Color,
    '--md-h5-color': md.h5Color,
    '--md-h6-color': md.h6Color,
    '--md-h1-size': `${md.h1Size}em`,
    '--md-h2-size': `${md.h2Size}em`,
    '--md-h3-size': `${md.h3Size}em`,
    '--md-h4-size': `${md.h4Size}em`,
    '--md-h5-size': `${md.h5Size}em`,
    '--md-h6-size': `${md.h6Size}em`,
    '--md-h1-weight': String(md.h1Weight),
    '--md-h2-weight': String(md.h2Weight),
    '--md-h3-weight': String(md.h3Weight),
    '--md-h4-weight': String(md.h4Weight),
    '--md-h5-weight': String(md.h5Weight),
    '--md-h6-weight': String(md.h6Weight),
    '--md-link-color': md.linkColor,
    '--md-inline-code-text': md.inlineCodeTextColor,
    '--md-inline-code-bg': md.inlineCodeBackground,
    '--md-inline-code-border': md.inlineCodeBorderColor,
    '--md-inline-code-radius': `${md.inlineCodeRadius}px`,
    '--md-code-text': md.codeBlockTextColor,
    '--md-code-bg': md.codeBlockBackground,
    '--md-code-border': md.codeBlockBorderColor,
    '--md-code-radius': `${md.codeBlockRadius}px`,
    '--md-quote-text': md.quoteTextColor,
    '--md-quote-bg': md.quoteBackground,
    '--md-quote-border': md.quoteBorderColor,
    '--md-quote-border-width': `${md.quoteBorderWidth}px`,
    '--md-highlight-text': md.highlightTextColor,
    '--md-highlight-bg': md.highlightBackground,
    '--md-list-marker': md.listMarkerColor,
    '--md-rule-color': md.ruleColor,
    '--md-checkbox-color': md.checkboxColor,
  }
}

const CONTENT_PADDING = '10px 20px 28px'
const RAW_CONTENT_PADDING = '10px 20px 28px 4px'
export function createNotesEditThemeStyles(
  raw: boolean,
  notesSettings: NotesEditorThemeSettings,
  isDark = false,
): Parameters<typeof EditorView.theme>[0] {
  return {
    '&': {
      'height': '100%',
      ...createMarkdownAppearanceCssVariables(notesSettings, isDark),
      'fontSize': `${notesSettings.fontSize}px`,
      'backgroundColor': 'var(--background)',
      'color': 'var(--md-text-color)',
      '--notes-code-font': notesSettings.codeFontFamily,
    },
    '.cm-content': {
      fontFamily: notesSettings.fontFamily,
      padding: raw ? RAW_CONTENT_PADDING : CONTENT_PADDING,
      lineHeight: String(notesSettings.lineHeight),
      caretColor: 'var(--foreground)',
      // cm-content — flex-элемент scroller'а с min-width:auto: широкий
      // блок-виджет (таблица) не даёт ему сжаться, редактор получает
      // горизонтальную прокрутку, и reveal каретки сдвигает весь контент
      // влево. min-width:0 заставляет контент всегда вписываться в scroller,
      // а широкие таблицы скроллятся внутри своего виджета.
      minWidth: '0',
      ...(notesSettings.limitWidth
        ? { maxWidth: '700px', margin: '0 auto' }
        : {}),
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--foreground)',
    },
    '.cm-selectionBackground': {
      backgroundColor: 'var(--accent) !important',
    },
    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: 'var(--accent) !important',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--background)',
      borderRight: 'none',
      color: 'var(--muted-foreground)',
      fontFamily: notesSettings.fontFamily,
      lineHeight: String(notesSettings.lineHeight),
      ...(notesSettings.lineNumbers && raw ? {} : { display: 'none' }),
    },
    ...editorScrollbarTheme,
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-gutterElement': {
      fontFamily: notesSettings.fontFamily,
      lineHeight: String(notesSettings.lineHeight),
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 3px 0 5px',
      minWidth: '20px',
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
    '.cm-line': {
      padding: '0',
    },
    '.cm-widgetBuffer': {
      // Align to the line box: text-top can add a pixel to compact headings
      // while markup is hidden, shifting subsequent lines when it is revealed.
      verticalAlign: 'bottom',
    },
  }
}

export function createNotesEditTheme(
  raw: boolean,
  notesSettings: NotesEditorThemeSettings,
  isDark = false,
) {
  return EditorView.theme(
    createNotesEditThemeStyles(raw, notesSettings, isDark),
  )
}
