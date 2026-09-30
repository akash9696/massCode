import type { BrowserWindow } from 'electron'
import type { NoteAttachmentPickerResult } from './types/ipc'
import { extname } from 'node:path'
import { dialog } from 'electron'
import { lstat, readFile } from 'fs-extra'
import { z } from 'zod'
import {
  NOTE_ATTACHMENT_EXTENSIONS,
  NOTE_ATTACHMENT_MAX_BYTES,
} from '../shared/noteAttachments'
import {
  getNotesPaths,
  writeNotesAsset,
} from './storage/providers/markdown/notes/runtime'
import { getVaultPath } from './storage/providers/markdown/runtime'
import { ensureFlatSpacesLayout } from './storage/providers/markdown/runtime/spaces'

const inputSchema = z
  .object({
    vault: z.string().max(8192),
  })
  .strict()

export async function pickNoteAttachment(
  input: unknown,
  parent?: BrowserWindow,
): Promise<NoteAttachmentPickerResult> {
  const { vault } = inputSchema.parse(input)
  if (getVaultPath() !== vault)
    return { status: 'stale' }

  const options = {
    properties: ['openFile'] as ['openFile'],
    filters: [
      {
        name: 'Supported attachments',
        extensions: [...NOTE_ATTACHMENT_EXTENSIONS].map(ext => ext.slice(1)),
      },
    ],
  }

  const selected = parent
    ? await dialog.showOpenDialog(parent, options)
    : await dialog.showOpenDialog(options)

  if (selected.canceled || selected.filePaths.length !== 1)
    return { status: 'cancelled' }

  if (getVaultPath() !== vault)
    return { status: 'stale' }

  try {
    const filePath = selected.filePaths[0]
    const stat = await lstat(filePath)
    if (
      !stat.isFile()
      || stat.isSymbolicLink()
      || stat.size > NOTE_ATTACHMENT_MAX_BYTES
    ) {
      return { status: 'failed' }
    }

    const ext = extname(filePath).toLowerCase()
    if (!NOTE_ATTACHMENT_EXTENSIONS.has(ext))
      return { status: 'failed' }

    const bytes = await readFile(filePath)
    if (bytes.length > NOTE_ATTACHMENT_MAX_BYTES)
      return { status: 'failed' }

    if (getVaultPath() !== vault)
      return { status: 'stale' }

    ensureFlatSpacesLayout(vault)
    const payload = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer
    const url = await writeNotesAsset(getNotesPaths(vault), payload, ext)

    return getVaultPath() === vault
      ? {
          status: 'saved',
          url,
          bytes: bytes.length,
          name: filePath.split(/[\\/]/).pop() ?? 'attachment',
        }
      : { status: 'stale' }
  }
  catch {
    return { status: 'failed' }
  }
}
