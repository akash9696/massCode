export interface NoteFragment {
  id: string
  label: string
  content: string
}

export const DEFAULT_NOTE_FRAGMENT_LABEL = 'Fragment 1'

const MARKER_RE
  = /^<!-- masscode-note-fragment:([a-z0-9_-]+):([^>]*) -->$/gim

function decodeLabel(value: string): string {
  try {
    return decodeURIComponent(value)
  }
  catch {
    return value
  }
}

function marker(fragment: Pick<NoteFragment, 'id' | 'label'>): string {
  return `<!-- masscode-note-fragment:${fragment.id}:${encodeURIComponent(fragment.label)} -->`
}

export function parseNoteFragments(source: string): NoteFragment[] {
  const matches = [...source.matchAll(MARKER_RE)]

  // Existing notes stay completely untouched until a second fragment is added
  // (or the first fragment is renamed).
  if (!matches.length || matches[0].index !== 0) {
    return [
      {
        id: 'main',
        label: DEFAULT_NOTE_FRAGMENT_LABEL,
        content: source,
      },
    ]
  }

  return matches.map((match, index) => {
    let start = (match.index ?? 0) + match[0].length
    if (source.slice(start, start + 2) === '\r\n')
      start += 2
    else if (source[start] === '\n')
      start += 1

    const nextStart = matches[index + 1]?.index ?? source.length
    let content = source.slice(start, nextStart)

    // serializeNoteFragments() inserts one separator newline between fragments.
    // Remove only that separator so a fragment's own trailing newline survives.
    if (index < matches.length - 1 && content.endsWith('\n'))
      content = content.slice(0, -1)

    return {
      id: match[1],
      label: decodeLabel(match[2]) || `Fragment ${index + 1}`,
      content,
    }
  })
}

export function serializeNoteFragments(fragments: NoteFragment[]): string {
  if (!fragments.length)
    return ''

  if (
    fragments.length === 1
    && fragments[0].id === 'main'
    && fragments[0].label === DEFAULT_NOTE_FRAGMENT_LABEL
  ) {
    return fragments[0].content
  }

  return fragments
    .map(fragment => `${marker(fragment)}\n${fragment.content}`)
    .join('\n')
}

export function createNoteFragmentId(): string {
  return `fragment-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function getNextNoteFragmentLabel(fragments: NoteFragment[]): string {
  let maxIndex = 0

  for (const fragment of fragments) {
    const match = fragment.label.match(/^Fragment\s+(\d+)$/i)
    if (match)
      maxIndex = Math.max(maxIndex, Number(match[1]))
  }

  return `Fragment ${maxIndex + 1}`
}
