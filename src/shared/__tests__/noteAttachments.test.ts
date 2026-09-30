import { describe, expect, it } from 'vitest'
import {
  classifyNoteAttachment,
  getNoteAttachmentExtension,
  isManagedNoteAttachmentUrl,
  isSupportedNoteAttachmentExtension,
} from '../noteAttachments'

describe('note attachments', () => {
  it('classifies managed media by extension', () => {
    expect(classifyNoteAttachment('masscode://notes-asset/a.pdf')).toBe('pdf')
    expect(classifyNoteAttachment('masscode://notes-asset/a.png')).toBe('image')
    expect(classifyNoteAttachment('masscode://notes-asset/a.mp3')).toBe('audio')
    expect(classifyNoteAttachment('masscode://notes-asset/a.mp4')).toBe('video')
    expect(classifyNoteAttachment('masscode://notes-asset/a.csv')).toBe('text')
    expect(classifyNoteAttachment('masscode://notes-asset/a.docx')).toBe('file')
  })

  it('normalizes extensions and strips query/hash suffixes', () => {
    expect(getNoteAttachmentExtension('file.PDF?x=1')).toBe('.pdf')
    expect(getNoteAttachmentExtension('file.png#preview')).toBe('.png')
  })

  it('allows supported extensions and identifies managed URLs', () => {
    expect(isSupportedNoteAttachmentExtension('.pdf')).toBe(true)
    expect(isSupportedNoteAttachmentExtension('.html')).toBe(false)
    expect(isManagedNoteAttachmentUrl('masscode://notes-asset/a.pdf')).toBe(true)
    expect(isManagedNoteAttachmentUrl('https://example.com/a.pdf')).toBe(false)
  })
})
