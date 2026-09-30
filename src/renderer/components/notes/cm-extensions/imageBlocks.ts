import type { EditorState } from '@codemirror/state'
import { i18n } from '@/electron'
import { isMac } from '@/utils'
import { syntaxTree } from '@codemirror/language'
import { RangeSetBuilder, StateField } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  WidgetType,
} from '@codemirror/view'
import {
  classifyNoteAttachment,
  getNoteAttachmentExtension,
  isManagedNoteAttachmentUrl,
} from '~/shared/noteAttachments'
import {
  getDrawingIdFromUrl,
  openDrawingInSpace,
  renderDrawingEmbed,
} from './drawingEmbed'
import { editorFocusField, setEditorFocusEffect } from './editorFocus'
import { getRevealSelection, revealSelectionChanged } from './revealSelection'
import { isSelectionInsideRangeWithFocus } from './selectionRange'

interface ImageBlocksOptions {
  enabled?: boolean
  isDark?: boolean
  showSourceWhenSelectionInside?: boolean
}

interface ImageReference {
  alt: string
  url: string
}

function extractImageReference(
  state: EditorState,
  from: number,
  to: number,
): ImageReference | null {
  const text = state.sliceDoc(from, to)
  const match = /!\[([^\]]*)\]\(([^)]+)\)/.exec(text)
  if (!match)
    return null
  return { alt: match[1] || 'attachment', url: match[2] }
}

function isSelectionInsideRange(
  state: EditorState,
  from: number,
  to: number,
): boolean {
  const hasFocus = state.field(editorFocusField, false) ?? false

  for (const range of getRevealSelection(state).ranges) {
    if (
      isSelectionInsideRangeWithFocus(
        hasFocus,
        range.from,
        range.to,
        from,
        to,
        range.empty,
      )
    ) {
      return true
    }
  }

  return false
}

function attachmentFrame(): HTMLDivElement {
  const frame = document.createElement('div')
  frame.style.maxWidth = '100%'
  frame.style.border = '1px solid var(--border)'
  frame.style.borderRadius = '8px'
  frame.style.overflow = 'hidden'
  frame.style.background = 'var(--card)'
  return frame
}

function attachmentTitle(label: string): HTMLDivElement {
  const title = document.createElement('div')
  title.textContent = label
  title.style.padding = '8px 10px'
  title.style.fontSize = '12px'
  title.style.color = 'var(--muted-foreground)'
  title.style.borderBottom = '1px solid var(--border)'
  title.style.whiteSpace = 'nowrap'
  title.style.overflow = 'hidden'
  title.style.textOverflow = 'ellipsis'
  return title
}

function renderManagedAttachment(
  root: HTMLElement,
  reference: ImageReference,
) {
  const kind = classifyNoteAttachment(reference.url)

  if (kind === 'image') {
    const img = document.createElement('img')
    img.src = reference.url
    img.alt = reference.alt
    img.style.maxWidth = '100%'
    img.style.borderRadius = '8px'
    img.style.border = '1px solid var(--border)'
    img.style.display = 'block'
    img.setAttribute('draggable', 'false')
    root.append(img)
    return
  }

  const frame = attachmentFrame()
  frame.append(attachmentTitle(reference.alt))

  if (kind === 'pdf') {
    const embed = document.createElement('embed')
    embed.src = reference.url
    embed.type = 'application/pdf'
    embed.style.display = 'block'
    embed.style.width = '100%'
    embed.style.height = '560px'
    embed.dataset.noteAttachmentInteractive = 'true'
    frame.append(embed)
  }
  else if (kind === 'audio') {
    const audio = document.createElement('audio')
    audio.src = reference.url
    audio.controls = true
    audio.preload = 'metadata'
    audio.style.display = 'block'
    audio.style.boxSizing = 'border-box'
    audio.style.width = '100%'
    audio.style.padding = '10px'
    audio.dataset.noteAttachmentInteractive = 'true'
    frame.append(audio)
  }
  else if (kind === 'video') {
    const video = document.createElement('video')
    video.src = reference.url
    video.controls = true
    video.preload = 'metadata'
    video.style.display = 'block'
    video.style.width = '100%'
    video.style.maxHeight = '560px'
    video.style.background = '#000'
    video.dataset.noteAttachmentInteractive = 'true'
    frame.append(video)
  }
  else if (kind === 'text') {
    const pre = document.createElement('pre')
    pre.textContent = 'Loading preview…'
    pre.style.margin = '0'
    pre.style.maxHeight = '360px'
    pre.style.overflow = 'auto'
    pre.style.padding = '12px'
    pre.style.fontFamily = 'var(--notes-code-font, var(--font-mono))'
    pre.style.fontSize = '12px'
    pre.style.whiteSpace = 'pre-wrap'
    pre.style.wordBreak = 'break-word'
    pre.dataset.noteAttachmentInteractive = 'true'
    frame.append(pre)

    void fetch(reference.url)
      .then(response => response.ok ? response.text() : Promise.reject(new Error('Unavailable')))
      .then((text) => {
        pre.textContent = text.length > 50000
          ? `${text.slice(0, 50000)}\n\n…preview truncated…`
          : text
      })
      .catch(() => {
        pre.textContent = 'Preview unavailable'
      })
  }
  else {
    const body = document.createElement('div')
    body.style.display = 'flex'
    body.style.alignItems = 'center'
    body.style.gap = '10px'
    body.style.padding = '14px'
    body.style.color = 'var(--foreground)'

    const icon = document.createElement('span')
    icon.textContent = '📎'
    icon.style.fontSize = '20px'

    const details = document.createElement('div')
    const name = document.createElement('div')
    name.textContent = reference.alt
    name.style.fontWeight = '600'
    const extension = document.createElement('div')
    extension.textContent
      = getNoteAttachmentExtension(reference.url).slice(1).toUpperCase()
        || 'FILE'
    extension.style.fontSize = '11px'
    extension.style.color = 'var(--muted-foreground)'
    details.append(name, extension)
    body.append(icon, details)
    frame.append(body)
  }

  root.append(frame)
}

class ImageWidget extends WidgetType {
  constructor(
    readonly reference: ImageReference,
    readonly isDark: boolean,
    readonly activateSourceOnClick: boolean,
  ) {
    super()
  }

  eq(other: ImageWidget): boolean {
    return (
      this.reference.url === other.reference.url
      && this.reference.alt === other.reference.alt
      && this.isDark === other.isDark
      && this.activateSourceOnClick === other.activateSourceOnClick
    )
  }

  toDOM(view: EditorView): HTMLElement {
    const root = document.createElement('div')
    root.style.maxWidth = '100%'
    root.style.padding = '4px 0'

    if (this.activateSourceOnClick)
      root.style.cursor = 'text'

    const drawingId = getDrawingIdFromUrl(this.reference.url)

    if (drawingId) {
      const container = document.createElement('div')
      container.className
        = 'my-1 overflow-auto rounded-md border border-border p-4'
      container.title = `${i18n.t('spaces.drawings.openInSpace')} (${
        isMac ? '⌘' : 'Ctrl'
      }+Click)`
      root.append(container)
      void renderDrawingEmbed(container, drawingId, this.isDark)

      if (!this.activateSourceOnClick)
        root.style.cursor = 'pointer'
    }
    else if (isManagedNoteAttachmentUrl(this.reference.url)) {
      renderManagedAttachment(root, this.reference)
    }
    else {
      // Preserve ordinary Markdown image behavior for remote/local URLs that
      // are not managed AkashCode assets.
      const img = document.createElement('img')
      img.src = this.reference.url
      img.alt = this.reference.alt
      img.style.maxWidth = '100%'
      img.style.borderRadius = '8px'
      img.style.border = '1px solid var(--border)'
      img.style.display = 'block'
      img.setAttribute('draggable', 'false')
      root.append(img)
    }

    root.addEventListener('mousedown', (event) => {
      if (event.button !== 0)
        return

      const target = event.target as HTMLElement | null
      if (target?.closest('[data-note-attachment-interactive="true"]'))
        return

      if (drawingId) {
        const isNavigationClick = isMac ? event.metaKey : event.ctrlKey
        if (isNavigationClick || !this.activateSourceOnClick) {
          event.preventDefault()
          openDrawingInSpace(drawingId)
          return
        }
      }

      if (!this.activateSourceOnClick)
        return

      event.preventDefault()
      const blockFrom = view.posAtDOM(root, 0)
      view.dispatch({
        selection: { anchor: blockFrom },
        effects: setEditorFocusEffect.of(true),
        scrollIntoView: true,
      })
      view.focus()
    })

    return root
  }
}

interface ImageBlocksFieldValue {
  decorations: DecorationSet
  blocks: { from: number, to: number }[]
}

function buildDecorations(
  state: EditorState,
  enabled: boolean,
  isDark: boolean,
  showSourceWhenSelectionInside: boolean,
): ImageBlocksFieldValue {
  if (!enabled)
    return { blocks: [], decorations: Decoration.none }

  const builder = new RangeSetBuilder<Decoration>()
  const blocks: { from: number, to: number }[] = []

  syntaxTree(state).iterate({
    enter(node) {
      if (node.name !== 'Image')
        return

      const reference = extractImageReference(state, node.from, node.to)
      if (!reference)
        return

      blocks.push({ from: node.from, to: node.to })

      if (
        showSourceWhenSelectionInside
        && isSelectionInsideRange(state, node.from, node.to)
      ) {
        return
      }

      builder.add(
        node.from,
        node.to,
        Decoration.replace({
          block: true,
          widget: new ImageWidget(
            reference,
            isDark,
            showSourceWhenSelectionInside,
          ),
        }),
      )
    },
  })

  return { blocks, decorations: builder.finish() }
}

export function getImageBlockRanges(
  state: EditorState,
): { from: number, to: number }[] {
  const ranges: { from: number, to: number }[] = []

  syntaxTree(state).iterate({
    enter(node) {
      if (node.name !== 'Image')
        return

      if (extractImageReference(state, node.from, node.to))
        ranges.push({ from: node.from, to: node.to })
    },
  })

  return ranges
}

export function createImageBlocks(options: ImageBlocksOptions = {}) {
  const {
    enabled = true,
    isDark = false,
    showSourceWhenSelectionInside = false,
  } = options

  return StateField.define<ImageBlocksFieldValue>({
    create(state) {
      return buildDecorations(
        state,
        enabled,
        isDark,
        showSourceWhenSelectionInside,
      )
    },
    update(value, transaction) {
      const focusChanged = transaction.effects.some(e =>
        e.is(setEditorFocusEffect),
      )
      const treeChanged
        = syntaxTree(transaction.startState) !== syntaxTree(transaction.state)

      if (transaction.docChanged || focusChanged || treeChanged) {
        return buildDecorations(
          transaction.state,
          enabled,
          isDark,
          showSourceWhenSelectionInside,
        )
      }

      if (
        showSourceWhenSelectionInside
        && (revealSelectionChanged(transaction)
          || !transaction.startState.selection.eq(transaction.state.selection))
        && value.blocks.some(
          block =>
            isSelectionInsideRange(
              transaction.startState,
              block.from,
              block.to,
            )
            !== isSelectionInsideRange(transaction.state, block.from, block.to),
        )
      ) {
        return buildDecorations(
          transaction.state,
          enabled,
          isDark,
          showSourceWhenSelectionInside,
        )
      }

      return value
    },
    provide: field =>
      EditorView.decorations.from(field, value => value.decorations),
  })
}
