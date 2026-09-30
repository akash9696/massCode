import type {
  EditorSettings,
  HttpSettings,
  MarkdownSettings,
  MathSettings,
  NotesEditorSettings,
  PreferencesStore,
  TasksSettings,
} from '../types'
import { homedir, platform } from 'node:os'
import Store from 'electron-store'
import {
  AI_PROMPT_HISTORY_DEFAULT_LIMIT,
  AI_PROMPT_HISTORY_LIMITS,
} from '../../../shared/aiPromptHistory'
import { DATE_FORMATS, DEFAULT_DATE_FORMAT } from '../../../shared/dateFormat'
import {
  HTTP_HISTORY_DEFAULT_LIMIT,
  HTTP_HISTORY_LIMITS,
} from '../../../shared/httpHistory'
import { HTTP_PREVIEW_FORMATS } from '../../../shared/httpPreview'
import { httpTransportSchema } from '../../../shared/httpTransport'
import {
  MARKDOWN_APPEARANCE_DEFAULTS,
  MARKDOWN_APPEARANCE_PRESETS,
  type MarkdownAppearanceSettings,
} from '../../../shared/markdownAppearance'
import { EDITOR_DEFAULTS, NOTES_EDITOR_DEFAULTS } from '../constants'
import {
  asRecord,
  readEnum,
  readNullableString,
  readNumber,
  readString,
  replaceStoreIfChanged,
} from '../sanitize'

const isWin = platform() === 'win32'

const storagePath = isWin ? `${homedir()}\\massCode` : `${homedir()}/massCode`

const MATH_DEFAULTS: MathSettings = {
  locale: 'en-US',
  decimalPlaces: 6,
  dateFormat: 'numeric',
}

const HTTP_DEFAULTS: HttpSettings = {
  historyLimit: HTTP_HISTORY_DEFAULT_LIMIT,
  wrapLines: true,
  defaultPreviewFormat: 'http',
  autoSwitchToResponse: true,
  skipCertificateVerification: false,
}

const TASKS_DEFAULTS: TasksSettings = {
  autoCleanupCompleted: 'never',
}

const API_INTEGRATIONS_DEFAULTS: PreferencesStore['api']['integrations'] = {
  enabled: false,
  tokenHash: null,
  tokenPreview: null,
}

const PREFERENCES_DEFAULTS: PreferencesStore = {
  aiPromptHistoryLimit: AI_PROMPT_HISTORY_DEFAULT_LIMIT,
  appearance: {
    theme: 'auto',
    dockBadgeSource: 'none',
    dateFormat: DEFAULT_DATE_FORMAT,
  },
  updates: {
    autoUpdate: true,
  },
  localization: {
    locale: 'en_US',
  },
  api: {
    port: 4321,
    mcp: { enabled: false },
    integrations: API_INTEGRATIONS_DEFAULTS,
  },
  storage: {
    rootPath: storagePath,
    vaultPath: null,
  },
  editor: {
    code: EDITOR_DEFAULTS,
    notes: NOTES_EDITOR_DEFAULTS,
    markdown: {
      scale: 1,
    },
  },
  math: MATH_DEFAULTS,
  http: HTTP_DEFAULTS,
  tasks: TASKS_DEFAULTS,
}

function sanitizeApiIntegrationsSettings(
  value: unknown,
): PreferencesStore['api']['integrations'] {
  const source = asRecord(value)

  return {
    enabled:
      typeof source.enabled === 'boolean'
        ? source.enabled
        : API_INTEGRATIONS_DEFAULTS.enabled,
    tokenHash: readNullableString(
      source,
      'tokenHash',
      API_INTEGRATIONS_DEFAULTS.tokenHash,
    ),
    tokenPreview: readNullableString(
      source,
      'tokenPreview',
      API_INTEGRATIONS_DEFAULTS.tokenPreview,
    ),
  }
}

function sanitizeCodeEditorSettings(value: unknown): EditorSettings {
  const source = asRecord(value)

  return {
    fontSize: readNumber(
      source,
      'fontSize',
      PREFERENCES_DEFAULTS.editor.code.fontSize,
    ),
    fontFamily: readString(
      source,
      'fontFamily',
      PREFERENCES_DEFAULTS.editor.code.fontFamily,
    ),
    wrap:
      typeof source.wrap === 'boolean'
        ? source.wrap
        : PREFERENCES_DEFAULTS.editor.code.wrap,
    tabSize: readNumber(
      source,
      'tabSize',
      PREFERENCES_DEFAULTS.editor.code.tabSize,
    ),
    trailingComma: readEnum(
      source,
      'trailingComma',
      ['all', 'none', 'es5'] as const,
      PREFERENCES_DEFAULTS.editor.code.trailingComma,
    ),
    semi:
      typeof source.semi === 'boolean'
        ? source.semi
        : PREFERENCES_DEFAULTS.editor.code.semi,
    singleQuote:
      typeof source.singleQuote === 'boolean'
        ? source.singleQuote
        : PREFERENCES_DEFAULTS.editor.code.singleQuote,
    highlightLine:
      typeof source.highlightLine === 'boolean'
        ? source.highlightLine
        : PREFERENCES_DEFAULTS.editor.code.highlightLine,
    matchBrackets:
      typeof source.matchBrackets === 'boolean'
        ? source.matchBrackets
        : PREFERENCES_DEFAULTS.editor.code.matchBrackets,
  }
}


function sanitizeMarkdownAppearanceSettings(
  value: unknown,
): MarkdownAppearanceSettings {
  const source = asRecord(value)
  const custom = asRecord(source.custom)
  const defaults = MARKDOWN_APPEARANCE_DEFAULTS.custom

  return {
    preset: readEnum(
      source,
      'preset',
      MARKDOWN_APPEARANCE_PRESETS,
      MARKDOWN_APPEARANCE_DEFAULTS.preset,
    ),
    custom: {
      textColor: readString(custom, 'textColor', defaults.textColor),
      strongColor: readString(custom, 'strongColor', defaults.strongColor),
      emphasisColor: readString(custom, 'emphasisColor', defaults.emphasisColor),
      strikeColor: readString(custom, 'strikeColor', defaults.strikeColor),
      h1Color: readString(custom, 'h1Color', defaults.h1Color),
      h2Color: readString(custom, 'h2Color', defaults.h2Color),
      h3Color: readString(custom, 'h3Color', defaults.h3Color),
      h4Color: readString(custom, 'h4Color', defaults.h4Color),
      h5Color: readString(custom, 'h5Color', defaults.h5Color),
      h6Color: readString(custom, 'h6Color', defaults.h6Color),
      h1Size: readNumber(custom, 'h1Size', defaults.h1Size),
      h2Size: readNumber(custom, 'h2Size', defaults.h2Size),
      h3Size: readNumber(custom, 'h3Size', defaults.h3Size),
      h4Size: readNumber(custom, 'h4Size', defaults.h4Size),
      h5Size: readNumber(custom, 'h5Size', defaults.h5Size),
      h6Size: readNumber(custom, 'h6Size', defaults.h6Size),
      h1Weight: readNumber(custom, 'h1Weight', defaults.h1Weight),
      h2Weight: readNumber(custom, 'h2Weight', defaults.h2Weight),
      h3Weight: readNumber(custom, 'h3Weight', defaults.h3Weight),
      h4Weight: readNumber(custom, 'h4Weight', defaults.h4Weight),
      h5Weight: readNumber(custom, 'h5Weight', defaults.h5Weight),
      h6Weight: readNumber(custom, 'h6Weight', defaults.h6Weight),
      linkColor: readString(custom, 'linkColor', defaults.linkColor),
      inlineCodeTextColor: readString(
        custom,
        'inlineCodeTextColor',
        defaults.inlineCodeTextColor,
      ),
      inlineCodeBackground: readString(
        custom,
        'inlineCodeBackground',
        defaults.inlineCodeBackground,
      ),
      inlineCodeBorderColor: readString(
        custom,
        'inlineCodeBorderColor',
        defaults.inlineCodeBorderColor,
      ),
      inlineCodeRadius: readNumber(
        custom,
        'inlineCodeRadius',
        defaults.inlineCodeRadius,
      ),
      codeBlockTextColor: readString(
        custom,
        'codeBlockTextColor',
        defaults.codeBlockTextColor,
      ),
      codeBlockBackground: readString(
        custom,
        'codeBlockBackground',
        defaults.codeBlockBackground,
      ),
      codeBlockBorderColor: readString(
        custom,
        'codeBlockBorderColor',
        defaults.codeBlockBorderColor,
      ),
      codeBlockRadius: readNumber(
        custom,
        'codeBlockRadius',
        defaults.codeBlockRadius,
      ),
      quoteTextColor: readString(
        custom,
        'quoteTextColor',
        defaults.quoteTextColor,
      ),
      quoteBackground: readString(
        custom,
        'quoteBackground',
        defaults.quoteBackground,
      ),
      quoteBorderColor: readString(
        custom,
        'quoteBorderColor',
        defaults.quoteBorderColor,
      ),
      quoteBorderWidth: readNumber(
        custom,
        'quoteBorderWidth',
        defaults.quoteBorderWidth,
      ),
      highlightTextColor: readString(
        custom,
        'highlightTextColor',
        defaults.highlightTextColor,
      ),
      highlightBackground: readString(
        custom,
        'highlightBackground',
        defaults.highlightBackground,
      ),
      listMarkerColor: readString(
        custom,
        'listMarkerColor',
        defaults.listMarkerColor,
      ),
      ruleColor: readString(custom, 'ruleColor', defaults.ruleColor),
      checkboxColor: readString(custom, 'checkboxColor', defaults.checkboxColor),
    },
  }
}

function sanitizeNotesEditorSettings(value: unknown): NotesEditorSettings {
  const source = asRecord(value)

  return {
    fontSize: readNumber(
      source,
      'fontSize',
      PREFERENCES_DEFAULTS.editor.notes.fontSize,
    ),
    fontFamily: readString(
      source,
      'fontFamily',
      PREFERENCES_DEFAULTS.editor.notes.fontFamily,
    ),
    codeFontFamily: readString(
      source,
      'codeFontFamily',
      PREFERENCES_DEFAULTS.editor.notes.codeFontFamily,
    ),
    lineHeight: readNumber(
      source,
      'lineHeight',
      PREFERENCES_DEFAULTS.editor.notes.lineHeight,
    ),
    limitWidth:
      typeof source.limitWidth === 'boolean'
        ? source.limitWidth
        : PREFERENCES_DEFAULTS.editor.notes.limitWidth,
    wrapTables:
      typeof source.wrapTables === 'boolean'
        ? source.wrapTables
        : PREFERENCES_DEFAULTS.editor.notes.wrapTables,
    lineNumbers:
      typeof source.lineNumbers === 'boolean'
        ? source.lineNumbers
        : PREFERENCES_DEFAULTS.editor.notes.lineNumbers,
    indentSize: readNumber(
      source,
      'indentSize',
      PREFERENCES_DEFAULTS.editor.notes.indentSize,
    ),
    markdownAppearance: sanitizeMarkdownAppearanceSettings(
      source.markdownAppearance,
    ),
  }
}

function sanitizeMarkdownSettings(value: unknown): MarkdownSettings {
  const source = asRecord(value)

  return {
    scale: readNumber(
      source,
      'scale',
      PREFERENCES_DEFAULTS.editor.markdown.scale,
    ),
  }
}

function sanitizeMathSettings(value: unknown): MathSettings {
  const source = asRecord(value)

  const dateFormat = readString(source, 'dateFormat', MATH_DEFAULTS.dateFormat)
  const validDateFormats = ['numeric', 'short', 'long']

  return {
    locale: readString(source, 'locale', MATH_DEFAULTS.locale),
    decimalPlaces: readNumber(
      source,
      'decimalPlaces',
      MATH_DEFAULTS.decimalPlaces,
    ),
    dateFormat: validDateFormats.includes(dateFormat)
      ? (dateFormat as MathSettings['dateFormat'])
      : MATH_DEFAULTS.dateFormat,
  }
}

function sanitizeHttpSettings(value: unknown): HttpSettings {
  const source = asRecord(value)

  return {
    transport: httpTransportSchema.catch({}).parse(source.transport ?? {}),
    historyLimit: HTTP_HISTORY_LIMITS.includes(source.historyLimit as 20)
      ? (source.historyLimit as number)
      : HTTP_HISTORY_DEFAULT_LIMIT,
    wrapLines:
      typeof source.wrapLines === 'boolean'
        ? source.wrapLines
        : HTTP_DEFAULTS.wrapLines,
    defaultPreviewFormat: readEnum(
      source,
      'defaultPreviewFormat',
      HTTP_PREVIEW_FORMATS,
      HTTP_DEFAULTS.defaultPreviewFormat,
    ),
    autoSwitchToResponse:
      typeof source.autoSwitchToResponse === 'boolean'
        ? source.autoSwitchToResponse
        : HTTP_DEFAULTS.autoSwitchToResponse,
    skipCertificateVerification:
      typeof source.skipCertificateVerification === 'boolean'
        ? source.skipCertificateVerification
        : HTTP_DEFAULTS.skipCertificateVerification,
  }
}

function sanitizeTasksSettings(value: unknown): TasksSettings {
  const source = asRecord(value)

  return {
    autoCleanupCompleted: readEnum(
      source,
      'autoCleanupCompleted',
      ['never', '1d', '7d', '30d'] as const,
      TASKS_DEFAULTS.autoCleanupCompleted,
    ),
  }
}

function sanitizePreferences(value: unknown): PreferencesStore {
  const source = asRecord(value)
  const appearanceSource = asRecord(source.appearance)
  const localizationSource = asRecord(source.localization)
  const apiSource = asRecord(source.api)
  const storageSource = asRecord(source.storage)
  const editorSource = asRecord(source.editor)
  const codeEditorSource
    = Object.keys(asRecord(editorSource.code)).length > 0
      ? asRecord(editorSource.code)
      : editorSource
  const notesEditorSource
    = Object.keys(asRecord(editorSource.notes)).length > 0
      ? asRecord(editorSource.notes)
      : asRecord(source.notesEditor)
  const markdownSource
    = Object.keys(asRecord(editorSource.markdown)).length > 0
      ? asRecord(editorSource.markdown)
      : asRecord(source.markdown)
  const mathSource = asRecord(source.math)
  const httpSource = asRecord(source.http)
  const tasksSource = asRecord(source.tasks)

  return {
    aiPromptHistoryLimit: AI_PROMPT_HISTORY_LIMITS.includes(
      source.aiPromptHistoryLimit as 20,
    )
      ? (source.aiPromptHistoryLimit as number)
      : AI_PROMPT_HISTORY_DEFAULT_LIMIT,
    appearance: {
      theme: readString(
        appearanceSource,
        'theme',
        readString(source, 'theme', PREFERENCES_DEFAULTS.appearance.theme),
      ),
      dateFormat: readEnum(
        appearanceSource,
        'dateFormat',
        DATE_FORMATS,
        DEFAULT_DATE_FORMAT,
      ),
      dockBadgeSource: readEnum(
        appearanceSource,
        'dockBadgeSource',
        ['none', 'codeInbox', 'notesInbox', 'tasksDue'] as const,
        PREFERENCES_DEFAULTS.appearance.dockBadgeSource,
      ),
    },
    updates: {
      autoUpdate:
        typeof asRecord(source.updates).autoUpdate === 'boolean'
          ? Boolean(asRecord(source.updates).autoUpdate)
          : PREFERENCES_DEFAULTS.updates.autoUpdate,
    },
    localization: {
      locale: readString(
        localizationSource,
        'locale',
        readString(
          source,
          'language',
          PREFERENCES_DEFAULTS.localization.locale,
        ),
      ),
    },
    api: {
      port: readNumber(
        apiSource,
        'port',
        readNumber(source, 'apiPort', PREFERENCES_DEFAULTS.api.port),
      ),
      mcp: { enabled: asRecord(apiSource.mcp).enabled === true },
      integrations: sanitizeApiIntegrationsSettings(apiSource.integrations),
    },
    storage: {
      rootPath: readString(
        storageSource,
        'rootPath',
        readString(
          source,
          'storagePath',
          PREFERENCES_DEFAULTS.storage.rootPath,
        ),
      ),
      vaultPath: readNullableString(
        storageSource,
        'vaultPath',
        PREFERENCES_DEFAULTS.storage.vaultPath,
      ),
    },
    editor: {
      code: sanitizeCodeEditorSettings(codeEditorSource),
      notes: sanitizeNotesEditorSettings(notesEditorSource),
      markdown: sanitizeMarkdownSettings(markdownSource),
    },
    math: sanitizeMathSettings(mathSource),
    http: sanitizeHttpSettings(httpSource),
    tasks: sanitizeTasksSettings(tasksSource),
  }
}

const preferencesStore = new Store<PreferencesStore>({
  name: 'preferences',
  cwd: 'v2',
})

replaceStoreIfChanged(
  preferencesStore,
  sanitizePreferences(preferencesStore.store),
)

export default preferencesStore
