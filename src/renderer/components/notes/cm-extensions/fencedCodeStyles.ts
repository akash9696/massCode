import type { SyntaxNode } from '@lezer/common'

const fencedCodeBaseStyle = [
  'background:var(--md-code-bg)',
  'border-left:1px solid var(--md-code-border)',
  'border-right:1px solid var(--md-code-border)',
  'color:var(--md-code-text)',
  'font-family:var(--notes-code-font, var(--font-mono))',
  'font-size:13px',
  'line-height:1.2',
  'font-variant-ligatures:none',
  'padding-left:16px',
  'padding-right:16px',
].join(';')

export function isStandaloneFencedCode(node: SyntaxNode): boolean {
  return (
    node.name === 'FencedCode'
    && node.getChildren('CodeMark').length === 1
    && node.getChild('CodeText') === null
  )
}

export function buildFencedCodeLineStyle(
  lineNumber: number,
  startLineNumber: number,
  endLineNumber: number,
): string {
  let style = fencedCodeBaseStyle

  if (lineNumber === startLineNumber) {
    style
      += ';position:relative;border-top:1px solid var(--md-code-border);border-top-left-radius:var(--md-code-radius);border-top-right-radius:var(--md-code-radius);padding-top:10px'
  }

  if (lineNumber === endLineNumber) {
    style
      += ';border-bottom:1px solid var(--md-code-border);border-bottom-left-radius:var(--md-code-radius);border-bottom-right-radius:var(--md-code-radius);padding-bottom:10px'
  }

  return style
}
