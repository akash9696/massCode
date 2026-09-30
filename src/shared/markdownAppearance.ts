export const MARKDOWN_APPEARANCE_PRESETS = [
  'akash',
  'github',
  'minimal',
  'nord',
  'custom',
] as const

export type MarkdownAppearancePreset =
  (typeof MARKDOWN_APPEARANCE_PRESETS)[number]

export interface MarkdownAppearanceValues {
  textColor: string
  strongColor: string
  emphasisColor: string
  strikeColor: string
  h1Color: string
  h2Color: string
  h3Color: string
  h4Color: string
  h5Color: string
  h6Color: string
  h1Size: number
  h2Size: number
  h3Size: number
  h4Size: number
  h5Size: number
  h6Size: number
  h1Weight: number
  h2Weight: number
  h3Weight: number
  h4Weight: number
  h5Weight: number
  h6Weight: number
  linkColor: string
  inlineCodeTextColor: string
  inlineCodeBackground: string
  inlineCodeBorderColor: string
  inlineCodeRadius: number
  codeBlockTextColor: string
  codeBlockBackground: string
  codeBlockBorderColor: string
  codeBlockRadius: number
  quoteTextColor: string
  quoteBackground: string
  quoteBorderColor: string
  quoteBorderWidth: number
  highlightTextColor: string
  highlightBackground: string
  listMarkerColor: string
  ruleColor: string
  checkboxColor: string
}

export interface MarkdownAppearanceSettings {
  preset: MarkdownAppearancePreset
  custom: MarkdownAppearanceValues
}

const HEADING_SIZES = {
  h1Size: 1.95,
  h2Size: 1.65,
  h3Size: 1.42,
  h4Size: 1.22,
  h5Size: 1.08,
  h6Size: 0.96,
}

const HEADING_WEIGHTS = {
  h1Weight: 700,
  h2Weight: 700,
  h3Weight: 650,
  h4Weight: 650,
  h5Weight: 600,
  h6Weight: 600,
}

function common(values: Partial<MarkdownAppearanceValues>): MarkdownAppearanceValues {
  return {
    textColor: 'var(--foreground)',
    strongColor: 'var(--foreground)',
    emphasisColor: 'var(--foreground)',
    strikeColor: 'var(--muted-foreground)',
    h1Color: 'var(--foreground)',
    h2Color: 'var(--foreground)',
    h3Color: 'var(--foreground)',
    h4Color: 'var(--foreground)',
    h5Color: 'var(--foreground)',
    h6Color: 'var(--foreground)',
    ...HEADING_SIZES,
    ...HEADING_WEIGHTS,
    linkColor: 'var(--primary)',
    inlineCodeTextColor: 'var(--foreground)',
    inlineCodeBackground: 'var(--muted)',
    inlineCodeBorderColor: 'var(--border)',
    inlineCodeRadius: 6,
    codeBlockTextColor: 'var(--foreground)',
    codeBlockBackground: 'var(--card)',
    codeBlockBorderColor: 'var(--border)',
    codeBlockRadius: 8,
    quoteTextColor: 'var(--foreground)',
    quoteBackground: 'var(--muted)',
    quoteBorderColor: 'var(--primary)',
    quoteBorderWidth: 3,
    highlightTextColor: '#1f2937',
    highlightBackground: 'var(--text-highlight)',
    listMarkerColor: 'var(--muted-foreground)',
    ruleColor: 'var(--border)',
    checkboxColor: 'var(--primary)',
    ...values,
  }
}

const AKASH = common({})

const GITHUB_LIGHT = common({
  textColor: '#24292f',
  strongColor: '#1f2328',
  emphasisColor: '#24292f',
  strikeColor: '#656d76',
  h1Color: '#1f2328',
  h2Color: '#1f2328',
  h3Color: '#1f2328',
  h4Color: '#1f2328',
  h5Color: '#1f2328',
  h6Color: '#656d76',
  linkColor: '#0969da',
  inlineCodeTextColor: '#24292f',
  inlineCodeBackground: '#f6f8fa',
  inlineCodeBorderColor: '#d0d7de',
  codeBlockTextColor: '#24292f',
  codeBlockBackground: '#f6f8fa',
  codeBlockBorderColor: '#d0d7de',
  quoteTextColor: '#57606a',
  quoteBackground: '#f6f8fa',
  quoteBorderColor: '#d0d7de',
  highlightTextColor: '#24292f',
  highlightBackground: '#fff8c5',
  listMarkerColor: '#656d76',
  ruleColor: '#d8dee4',
  checkboxColor: '#1f883d',
})

const GITHUB_DARK = common({
  textColor: '#c9d1d9',
  strongColor: '#f0f6fc',
  emphasisColor: '#c9d1d9',
  strikeColor: '#8b949e',
  h1Color: '#f0f6fc',
  h2Color: '#f0f6fc',
  h3Color: '#f0f6fc',
  h4Color: '#f0f6fc',
  h5Color: '#f0f6fc',
  h6Color: '#8b949e',
  linkColor: '#58a6ff',
  inlineCodeTextColor: '#c9d1d9',
  inlineCodeBackground: '#161b22',
  inlineCodeBorderColor: '#30363d',
  codeBlockTextColor: '#c9d1d9',
  codeBlockBackground: '#161b22',
  codeBlockBorderColor: '#30363d',
  quoteTextColor: '#8b949e',
  quoteBackground: '#0d1117',
  quoteBorderColor: '#30363d',
  highlightTextColor: '#f0f6fc',
  highlightBackground: '#6e5c00',
  listMarkerColor: '#8b949e',
  ruleColor: '#30363d',
  checkboxColor: '#3fb950',
})

const MINIMAL_LIGHT = common({
  textColor: '#27272a',
  strongColor: '#09090b',
  emphasisColor: '#3f3f46',
  strikeColor: '#a1a1aa',
  h1Color: '#09090b',
  h2Color: '#18181b',
  h3Color: '#27272a',
  h4Color: '#3f3f46',
  h5Color: '#52525b',
  h6Color: '#71717a',
  linkColor: '#52525b',
  inlineCodeTextColor: '#27272a',
  inlineCodeBackground: '#f4f4f5',
  inlineCodeBorderColor: '#e4e4e7',
  codeBlockTextColor: '#27272a',
  codeBlockBackground: '#fafafa',
  codeBlockBorderColor: '#e4e4e7',
  quoteTextColor: '#52525b',
  quoteBackground: '#fafafa',
  quoteBorderColor: '#a1a1aa',
  highlightTextColor: '#27272a',
  highlightBackground: '#fef3c7',
  listMarkerColor: '#a1a1aa',
  ruleColor: '#e4e4e7',
  checkboxColor: '#52525b',
})

const MINIMAL_DARK = common({
  textColor: '#e4e4e7',
  strongColor: '#fafafa',
  emphasisColor: '#d4d4d8',
  strikeColor: '#71717a',
  h1Color: '#fafafa',
  h2Color: '#f4f4f5',
  h3Color: '#e4e4e7',
  h4Color: '#d4d4d8',
  h5Color: '#a1a1aa',
  h6Color: '#71717a',
  linkColor: '#d4d4d8',
  inlineCodeTextColor: '#e4e4e7',
  inlineCodeBackground: '#27272a',
  inlineCodeBorderColor: '#3f3f46',
  codeBlockTextColor: '#e4e4e7',
  codeBlockBackground: '#18181b',
  codeBlockBorderColor: '#3f3f46',
  quoteTextColor: '#a1a1aa',
  quoteBackground: '#18181b',
  quoteBorderColor: '#71717a',
  highlightTextColor: '#fef3c7',
  highlightBackground: '#713f12',
  listMarkerColor: '#71717a',
  ruleColor: '#3f3f46',
  checkboxColor: '#d4d4d8',
})

const NORD_LIGHT = common({
  textColor: '#2e3440',
  strongColor: '#2e3440',
  emphasisColor: '#3b4252',
  strikeColor: '#7b88a1',
  h1Color: '#2e3440',
  h2Color: '#3b4252',
  h3Color: '#434c5e',
  h4Color: '#4c566a',
  h5Color: '#5e81ac',
  h6Color: '#7b88a1',
  linkColor: '#5e81ac',
  inlineCodeTextColor: '#3b4252',
  inlineCodeBackground: '#e5e9f0',
  inlineCodeBorderColor: '#d8dee9',
  codeBlockTextColor: '#2e3440',
  codeBlockBackground: '#eceff4',
  codeBlockBorderColor: '#d8dee9',
  quoteTextColor: '#4c566a',
  quoteBackground: '#eceff4',
  quoteBorderColor: '#88c0d0',
  highlightTextColor: '#2e3440',
  highlightBackground: '#ebcb8b',
  listMarkerColor: '#81a1c1',
  ruleColor: '#d8dee9',
  checkboxColor: '#5e81ac',
})

const NORD_DARK = common({
  textColor: '#d8dee9',
  strongColor: '#eceff4',
  emphasisColor: '#e5e9f0',
  strikeColor: '#7b88a1',
  h1Color: '#eceff4',
  h2Color: '#e5e9f0',
  h3Color: '#d8dee9',
  h4Color: '#88c0d0',
  h5Color: '#81a1c1',
  h6Color: '#7b88a1',
  linkColor: '#88c0d0',
  inlineCodeTextColor: '#e5e9f0',
  inlineCodeBackground: '#3b4252',
  inlineCodeBorderColor: '#4c566a',
  codeBlockTextColor: '#d8dee9',
  codeBlockBackground: '#2e3440',
  codeBlockBorderColor: '#4c566a',
  quoteTextColor: '#d8dee9',
  quoteBackground: '#3b4252',
  quoteBorderColor: '#88c0d0',
  highlightTextColor: '#2e3440',
  highlightBackground: '#ebcb8b',
  listMarkerColor: '#81a1c1',
  ruleColor: '#4c566a',
  checkboxColor: '#88c0d0',
})

export function createCustomMarkdownAppearanceSeed(
  isDark: boolean,
): MarkdownAppearanceValues {
  return isDark
    ? {
        ...GITHUB_DARK,
        h5Color: '#c9d1d9',
        h6Color: '#8b949e',
      }
    : {
        ...GITHUB_LIGHT,
        h5Color: '#24292f',
        h6Color: '#656d76',
      }
}

export const MARKDOWN_APPEARANCE_DEFAULTS: MarkdownAppearanceSettings = {
  preset: 'akash',
  custom: createCustomMarkdownAppearanceSeed(false),
}

export function resolveMarkdownAppearance(
  settings: MarkdownAppearanceSettings,
  isDark: boolean,
): MarkdownAppearanceValues {
  switch (settings.preset) {
    case 'github':
      return { ...(isDark ? GITHUB_DARK : GITHUB_LIGHT) }
    case 'minimal':
      return { ...(isDark ? MINIMAL_DARK : MINIMAL_LIGHT) }
    case 'nord':
      return { ...(isDark ? NORD_DARK : NORD_LIGHT) }
    case 'custom':
      return { ...settings.custom }
    case 'akash':
    default:
      return { ...AKASH }
  }
}
