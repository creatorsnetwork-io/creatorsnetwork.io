/**
 * Custom Sanity Studio input component.
 *
 * Wraps the standard object input (sourceType + videoUrlOrId + whatever
 * sibling fields the parent object defines — caption, clientName, title,
 * active, etc.) with a drag/drop + click-to-upload zone on top. Selecting
 * a file:
 *   1. Asks our Netlify function for a one-time Cloudflare Stream upload URL
 *   2. Uploads the file directly to Cloudflare (resumable, via tus)
 *   3. Sets sourceType = "cloudflare" and videoUrlOrId = <the new video UID>
 *
 * Manual entry (pasting a YouTube/Vimeo/Instagram link into videoUrlOrId,
 * picking a different sourceType) still works exactly as before — this is
 * additive, not a replacement of the existing fields.
 */
import React, {useCallback, useRef, useState} from 'react'
import {Stack, Card, Button, Text, Flex, Box} from '@sanity/ui'
import {UploadIcon} from '@sanity/icons'
import {PatchEvent, set} from 'sanity'
import * as tus from 'tus-js-client'

// Same-origin Netlify function on the main site. Change if the function
// ever moves to a different deployed origin.
const UPLOAD_FUNCTION_URL = 'https://creatorsnetwork.io/.netlify/functions/cloudflare-stream-upload-url'

// Light abuse-deterrent shared with the Netlify function's env var
// (STUDIO_UPLOAD_SECRET). Not a real security boundary on its own — Studio
// access is already gated behind Sanity login. The actual sensitive
// credential (the Cloudflare API token) lives only in the function's
// environment and never reaches this bundle.
const STUDIO_UPLOAD_SECRET = '538bf5bc52b583404243885909bf27f6332093a716c488e4'

export function CloudflareVideoUpload(props) {
  const {renderDefault, onChange} = props
  const [status, setStatus] = useState('idle') // idle | requesting | uploading | done | error
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFile = useCallback(
    async (file) => {
      if (!file) return
      if (!file.type.startsWith('video/')) {
        setStatus('error')
        setErrorMsg('That is not a video file.')
        return
      }

      setStatus('requesting')
      setErrorMsg('')
      setProgress(0)

      try {
        const res = await fetch(UPLOAD_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Studio-Secret': STUDIO_UPLOAD_SECRET,
          },
          body: JSON.stringify({fileName: file.name, maxDurationSeconds: 300}),
        })

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}))
          throw new Error(errBody.error || `Could not get an upload URL (status ${res.status})`)
        }

        const {uploadURL, uid} = await res.json()
        if (!uploadURL || !uid) throw new Error('Server did not return an upload URL')

        setStatus('uploading')

        const upload = new tus.Upload(file, {
          uploadUrl: uploadURL,
          chunkSize: 50 * 1024 * 1024,
          retryDelays: [0, 3000, 5000, 10000],
          onError: (err) => {
            setStatus('error')
            setErrorMsg(err.message || 'Upload failed')
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            setProgress(Math.round((bytesUploaded / bytesTotal) * 100))
          },
          onSuccess: () => {
            setStatus('done')
            onChange(
              PatchEvent.from([set('cloudflare', ['sourceType']), set(uid, ['videoUrlOrId'])])
            )
          },
        })
        upload.start()
      } catch (err) {
        setStatus('error')
        setErrorMsg(err.message || 'Something went wrong')
      }
    },
    [onChange]
  )

  const busy = status === 'requesting' || status === 'uploading'

  return (
    <Stack space={3}>
      <Card
        padding={3}
        radius={2}
        tone={status === 'error' ? 'critical' : isDragOver ? 'positive' : 'primary'}
        border
        style={{borderStyle: 'dashed'}}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          handleFile(e.dataTransfer.files && e.dataTransfer.files[0])
        }}
      >
        <Flex align="center" justify="space-between" gap={3}>
          <Box flex={1}>
            {status === 'idle' && (
              <Text size={1} muted>
                Drop a video file here, or click Upload — it goes straight to Cloudflare Stream.
              </Text>
            )}
            {status === 'requesting' && <Text size={1}>Requesting upload slot…</Text>}
            {status === 'uploading' && (
              <Text size={1}>Uploading… {progress}%</Text>
            )}
            {status === 'done' && (
              <Text size={1}>Uploaded — source type and video ID filled in below.</Text>
            )}
            {status === 'error' && (
              <Text size={1} style={{color: '#c53030'}}>
                {errorMsg} You can still fill the fields below manually.
              </Text>
            )}
          </Box>
          <Button
            text={busy ? 'Working…' : 'Upload video file'}
            icon={UploadIcon}
            mode="ghost"
            disabled={busy}
            onClick={() => inputRef.current && inputRef.current.click()}
          />
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            style={{display: 'none'}}
            onChange={(e) => handleFile(e.target.files && e.target.files[0])}
          />
        </Flex>
      </Card>
      {renderDefault(props)}
    </Stack>
  )
}
