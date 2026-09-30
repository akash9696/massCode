export const NOTE_ATTACHMENT_MAX_BYTES = 100 * 1024 * 1024

export const NOTE_ATTACHMENT_MIME_BY_EXTENSION: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json',
  '.csv': 'text/csv; charset=utf-8',
  '.zip': 'application/zip',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

export const NOTE_ATTACHMENT_EXTENSIONS = new Set(
  Object.keys(NOTE_ATTACHMENT_MIME_BY_EXTENSION),
)

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp'])
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov'])
const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.json', '.csv'])

export type NoteAttachmentKind =
  | 'image'
  | 'pdf'
  | 'audio'
  | 'video'
  | 'text'
  | 'file'

export function getNoteAttachmentExtension(value: string): string {
  const clean = value.split(/[?#]/, 1)[0] ?? value
  const dot = clean.lastIndexOf('.')
  return dot >= 0 ? clean.slice(dot).toLowerCase() : ''
}

export function isSupportedNoteAttachmentExtension(extension: string): boolean {
  return NOTE_ATTACHMENT_EXTENSIONS.has(extension.toLowerCase())
}

export function classifyNoteAttachment(value: string): NoteAttachmentKind {
  const extension = getNoteAttachmentExtension(value)
  if (IMAGE_EXTENSIONS.has(extension))
    return 'image'
  if (extension === '.pdf')
    return 'pdf'
  if (AUDIO_EXTENSIONS.has(extension))
    return 'audio'
  if (VIDEO_EXTENSIONS.has(extension))
    return 'video'
  if (TEXT_EXTENSIONS.has(extension))
    return 'text'
  return 'file'
}

export function isManagedNoteAttachmentUrl(value: string): boolean {
  return value.startsWith('masscode://notes-asset/')
}
