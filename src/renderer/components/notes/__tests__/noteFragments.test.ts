import { describe, expect, it } from 'vitest'
import {
  parseNoteFragments,
  serializeNoteFragments,
} from '../noteFragments'

describe('noteFragments', () => {
  it('treats an existing markdown note as one legacy fragment', () => {
    const source = '# Existing note\n\nNothing special here.\n'
    const fragments = parseNoteFragments(source)

    expect(fragments).toEqual([
      {
        id: 'main',
        label: 'Fragment 1',
        content: source,
      },
    ])
    expect(serializeNoteFragments(fragments)).toBe(source)
  })

  it('round-trips multiple fragments without losing trailing newlines', () => {
    const fragments = [
      { id: 'main', label: 'Intro', content: '# Intro\n' },
      { id: 'fragment-2', label: 'API & Auth', content: '## API\nText' },
    ]

    expect(parseNoteFragments(serializeNoteFragments(fragments))).toEqual(
      fragments,
    )
  })

  it('encodes labels so marker syntax cannot be broken by normal text', () => {
    const fragments = [
      { id: 'main', label: 'A > B / notes', content: 'content' },
    ]

    expect(parseNoteFragments(serializeNoteFragments(fragments))).toEqual(
      fragments,
    )
  })
})
