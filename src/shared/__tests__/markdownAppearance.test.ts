import { describe, expect, it } from 'vitest'
import {
  createCustomMarkdownAppearanceSeed,
  MARKDOWN_APPEARANCE_DEFAULTS,
  resolveMarkdownAppearance,
} from '../markdownAppearance'

describe('markdown appearance', () => {
  it('keeps the Akash preset tied to the app theme tokens', () => {
    const value = resolveMarkdownAppearance(MARKDOWN_APPEARANCE_DEFAULTS, false)

    expect(value.textColor).toBe('var(--foreground)')
    expect(value.linkColor).toBe('var(--primary)')
    expect(value.codeBlockBackground).toBe('var(--card)')
  })

  it('resolves GitHub colors differently for light and dark mode', () => {
    const settings = {
      ...MARKDOWN_APPEARANCE_DEFAULTS,
      preset: 'github' as const,
    }

    const light = resolveMarkdownAppearance(settings, false)
    const dark = resolveMarkdownAppearance(settings, true)

    expect(light.textColor).not.toBe(dark.textColor)
    expect(light.codeBlockBackground).not.toBe(dark.codeBlockBackground)
  })

  it('returns user custom values unchanged', () => {
    const custom = createCustomMarkdownAppearanceSeed(true)
    custom.linkColor = '#123456'
    custom.h1Size = 2.4

    const value = resolveMarkdownAppearance(
      { preset: 'custom', custom },
      true,
    )

    expect(value.linkColor).toBe('#123456')
    expect(value.h1Size).toBe(2.4)
  })
})
