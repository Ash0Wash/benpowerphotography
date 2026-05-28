"use client";

import { useEffect, useMemo, useState } from 'react'

export default function WorkPanelsAdminPage() {
  const [localReady, setLocalReady] = useState(false)
  const [isLocalHost, setIsLocalHost] = useState(false)
  const [panels, setPanels] = useState([])
  const [parentPanel, setParentPanel] = useState('')
  const [panelName, setPanelName] = useState('')
  const [photos, setPhotos] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPanels, setIsLoadingPanels] = useState(false)
  const [compressionActive, setCompressionActive] = useState(null)
  const [childPanelsByParent, setChildPanelsByParent] = useState({})
  const [deleteParentPanel, setDeleteParentPanel] = useState('')
  const [deletePanelSlug, setDeletePanelSlug] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const host = window.location.hostname
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1'
    setIsLocalHost(isLocal)
    setLocalReady(true)
  }, [])

  useEffect(() => {
    if (!localReady || !isLocalHost) {
      return
    }

    const loadPanels = async () => {
      setIsLoadingPanels(true)
      try {
        const response = await fetch('/api/admin/work-panels')
        const raw = await response.text()
        const contentType = response.headers.get('content-type') || ''

        if (!contentType.includes('application/json')) {
          throw new Error(
            response.ok
              ? 'Admin API returned non-JSON content. Reload the server and try again.'
              : `Admin API error ${response.status}: non-JSON response received.`,
          )
        }

        const data = JSON.parse(raw)

        if (!response.ok || !Array.isArray(data.panels)) {
          throw new Error(data.error || 'Failed to load panel options.')
        }

        setPanels(data.panels)
        const children = data.childPanelsByParent ?? {}
        setChildPanelsByParent(children)
        setCompressionActive(Boolean(data.compressionActive))
        if (data.panels.length > 0) {
          setParentPanel(data.panels[0].slug)
          setDeleteParentPanel(data.panels[0].slug)
          setDeletePanelSlug(children[data.panels[0].slug]?.[0]?.slug ?? '')
        } else {
          setIsError(true)
          setStatusMessage('No parent panels were found. Add categories to a parent page first.')
        }
      } catch (error) {
        setIsError(true)
        setStatusMessage(error instanceof Error ? error.message : 'Unable to load panels.')
      } finally {
        setIsLoadingPanels(false)
      }
    }

    loadPanels()
  }, [localReady, isLocalHost])

  const fileCount = useMemo(() => photos?.length ?? 0, [photos])
  const deleteCandidates = useMemo(
    () => childPanelsByParent[deleteParentPanel] ?? [],
    [childPanelsByParent, deleteParentPanel],
  )

  useEffect(() => {
    setDeletePanelSlug(deleteCandidates[0]?.slug ?? '')
  }, [deleteCandidates])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!parentPanel || !panelName.trim() || !photos || photos.length === 0) {
      setIsError(true)
      setStatusMessage('Choose a parent panel, enter a panel name, and upload photos.')
      return
    }

    setIsSubmitting(true)
    setIsError(false)
    setStatusMessage('Creating panel...')

    try {
      const formData = new FormData()
      formData.append('parentPanel', parentPanel)
      formData.append('panelName', panelName.trim())

      Array.from(photos).forEach((file) => {
        formData.append('photos', file)
      })

      const response = await fetch('/api/admin/work-panels', {
        method: 'POST',
        body: formData,
      })

      const raw = await response.text()
      const contentType = response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        throw new Error(`Admin API error ${response.status}: non-JSON response received.`)
      }

      const data = JSON.parse(raw)

      if (!response.ok || !data.ok || !data.panel) {
        throw new Error(data.error || 'Failed to create panel.')
      }

      setIsError(false)
      setPanelName('')
      setPhotos(null)
      setStatusMessage(
        `${
          data.warning ? `${data.warning} ` : ''
        }Created ${data.panel.title} in /work/${data.panel.parentPanel}/${data.panel.slug} with ${data.panel.photoCount} photos.`,
      )
    } catch (error) {
      setIsError(true)
      setStatusMessage(error instanceof Error ? error.message : 'Failed to create panel.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()

    if (!deleteParentPanel || !deletePanelSlug) {
      setIsError(true)
      setStatusMessage('Choose a parent panel and a panel to remove.')
      return
    }

    const confirmed = window.confirm(
      `Remove panel "${deletePanelSlug}" from ${deleteParentPanel}? This deletes its files and slider entry.`,
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setIsError(false)
    setStatusMessage('Removing panel...')

    try {
      const response = await fetch('/api/admin/work-panels', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentPanel: deleteParentPanel,
          panelSlug: deletePanelSlug,
        }),
      })

      const raw = await response.text()
      const contentType = response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        throw new Error(`Admin API error ${response.status}: non-JSON response received.`)
      }

      const data = JSON.parse(raw)

      if (!response.ok || !data.ok || !data.removed) {
        throw new Error(data.error || 'Failed to remove panel.')
      }

      setChildPanelsByParent((prev) => {
        const next = { ...prev }
        const existing = next[data.removed.parentPanel] ?? []
        next[data.removed.parentPanel] = existing.filter((panel) => panel.slug !== data.removed.panelSlug)
        return next
      })

      setStatusMessage(
        `${data.warning ? `${data.warning} ` : ''}Removed /work/${data.removed.parentPanel}/${data.removed.panelSlug}.`,
      )
      setIsError(false)
    } catch (error) {
      setIsError(true)
      setStatusMessage(error instanceof Error ? error.message : 'Failed to remove panel.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!localReady) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm" style={{ opacity: 0.75 }}>Checking local environment...</p>
      </div>
    )
  }

  if (!isLocalHost) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10" style={{ paddingTop: '80px' }}>
        <h1 className="text-3xl font-light">Work Panel Admin</h1>
        <p className="mt-2 text-sm" style={{ opacity: 0.75 }}>
          This uploader is disabled outside localhost. Run the app locally with <code>npm run dev</code> and open this page on localhost.
        </p>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '100px', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Work Panel Admin</h1>
      <p style={{ opacity: 0.75, fontSize: '0.9rem', marginBottom: '1rem' }}>
        Add a new subpanel under an existing work section, upload photos, and auto-register it in the parent panel.
      </p>
      <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
        Compression active:{' '}
        <span style={{ color: compressionActive ? 'green' : 'red', fontWeight: 'bold' }}>
          {compressionActive === null ? 'Checking...' : compressionActive ? 'Yes' : 'No'}
        </span>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <div>
          <label htmlFor="parentPanel" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Parent Panel
          </label>
          <select
            id="parentPanel"
            value={parentPanel}
            onChange={(event) => setParentPanel(event.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isLoadingPanels || panels.length === 0}
            required
          >
            {isLoadingPanels && <option value="">Loading parent panels...</option>}
            {!isLoadingPanels && panels.length === 0 && <option value="">No parent panels found</option>}
            {panels.map((panel) => (
              <option key={panel.slug} value={panel.slug}>
                {panel.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="panelName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            New Panel Name
          </label>
          <input
            id="panelName"
            type="text"
            value={panelName}
            onChange={(event) => setPanelName(event.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Example: Spring Backyard Show"
            required
          />
        </div>

        <div>
          <label htmlFor="photos" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Panel Photos (First image becomes the cover)
          </label>
          <input
            id="photos"
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => setPhotos(event.target.files)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>{fileCount} photo(s) selected</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoadingPanels || panels.length === 0}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Panel'}
        </button>

        {statusMessage && (
          <p style={{ color: isError ? 'red' : 'green', fontSize: '0.9rem' }}>{statusMessage}</p>
        )}
      </form>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Remove Panel</h2>
        <p style={{ fontSize: '0.9rem', opacity: 0.75, marginBottom: '1.5rem' }}>Local only. This deletes the panel page folder, panel images, and slider entry.</p>

        <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="deleteParentPanel" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Parent Panel
            </label>
            <select
              id="deleteParentPanel"
              value={deleteParentPanel}
              onChange={(event) => setDeleteParentPanel(event.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              disabled={isLoadingPanels || panels.length === 0 || isDeleting}
              required
            >
              {isLoadingPanels && <option value="">Loading parent panels...</option>}
              {!isLoadingPanels && panels.length === 0 && <option value="">No parent panels found</option>}
              {panels.map((panel) => (
                <option key={`delete-parent-${panel.slug}`} value={panel.slug}>
                  {panel.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="deletePanelSlug" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Panel To Remove
            </label>
            <select
              id="deletePanelSlug"
              value={deletePanelSlug}
              onChange={(event) => setDeletePanelSlug(event.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              disabled={isLoadingPanels || deleteCandidates.length === 0 || isDeleting}
              required
            >
              {deleteCandidates.length === 0 && <option value="">No removable panels under this parent</option>}
              {deleteCandidates.map((panel) => (
                <option key={`delete-child-${panel.slug}`} value={panel.slug}>
                  {panel.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isDeleting || isLoadingPanels || deleteCandidates.length === 0}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.6 : 1
            }}
          >
            {isDeleting ? 'Removing...' : 'Remove Panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
