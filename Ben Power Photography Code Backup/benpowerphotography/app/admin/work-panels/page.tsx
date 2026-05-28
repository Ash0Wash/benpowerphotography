"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react'

type PanelOption = {
  slug: string
  label: string
}

type ChildPanelOption = {
  slug: string
  label: string
}

export default function WorkPanelsAdminPage() {
  const [localReady, setLocalReady] = useState(false)
  const [isLocalHost, setIsLocalHost] = useState(false)
  const [panels, setPanels] = useState<PanelOption[]>([])
  const [parentPanel, setParentPanel] = useState('')
  const [panelName, setPanelName] = useState('')
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPanels, setIsLoadingPanels] = useState(false)
  const [compressionActive, setCompressionActive] = useState<boolean | null>(null)
  const [childPanelsByParent, setChildPanelsByParent] = useState<Record<string, ChildPanelOption[]>>({})
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

        const data = JSON.parse(raw) as {
          panels?: PanelOption[]
          childPanelsByParent?: Record<string, ChildPanelOption[]>
          compressionActive?: boolean
          error?: string
        }

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

    void loadPanels()
  }, [localReady, isLocalHost])

  const fileCount = useMemo(() => photos?.length ?? 0, [photos])
  const deleteCandidates = useMemo(
    () => childPanelsByParent[deleteParentPanel] ?? [],
    [childPanelsByParent, deleteParentPanel],
  )

  useEffect(() => {
    setDeletePanelSlug(deleteCandidates[0]?.slug ?? '')
  }, [deleteCandidates])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

      const data = JSON.parse(raw) as {
        ok?: boolean
        error?: string
        warning?: string
        panel?: { parentPanel: string; slug: string; title: string; photoCount: number }
      }

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

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
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

      const data = JSON.parse(raw) as {
        ok?: boolean
        error?: string
        warning?: string
        removed?: { parentPanel: string; panelSlug: string }
      }

      if (!response.ok || !data.ok || !data.removed) {
        throw new Error(data.error || 'Failed to remove panel.')
      }

      setChildPanelsByParent((prev) => {
        const next = { ...prev }
        const existing = next[data.removed!.parentPanel] ?? []
        next[data.removed!.parentPanel] = existing.filter((panel) => panel.slug !== data.removed!.panelSlug)
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
        <p className="text-sm opacity-75">Checking local environment...</p>
      </div>
    )
  }

  if (!isLocalHost) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-light">Work Panel Admin</h1>
        <p className="mt-2 text-sm opacity-75">
          This uploader is disabled outside localhost. Run the app locally with <code>npm run dev</code> and open this page on localhost.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-light">Work Panel Admin</h1>
      <p className="mt-2 text-sm opacity-75">
        Add a new subpanel under an existing work section, upload photos, and auto-register it in the parent panel.
      </p>
      <p className="mt-2 text-sm">
        Compression active:{' '}
        <span className={compressionActive ? 'text-green-700' : 'text-amber-700'}>
          {compressionActive === null ? 'Checking...' : compressionActive ? 'Yes' : 'No'}
        </span>
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="parentPanel">
            Parent Panel
          </label>
          <select
            id="parentPanel"
            value={parentPanel}
            onChange={(event) => setParentPanel(event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2"
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
          <label className="mb-2 block text-sm font-medium" htmlFor="panelName">
            New Panel Name
          </label>
          <input
            id="panelName"
            type="text"
            value={panelName}
            onChange={(event) => setPanelName(event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2"
            placeholder="Example: Spring Backyard Show"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="photos">
            Panel Photos
          </label>
          <input
            id="photos"
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => setPhotos(event.target.files)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2"
            required
          />
          <p className="mt-2 text-xs opacity-70">{fileCount} photo(s) selected</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoadingPanels || panels.length === 0}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create Panel'}
        </button>

        {statusMessage && (
          <p className={`text-sm ${isError ? 'text-red-600' : 'text-green-700'}`}>{statusMessage}</p>
        )}
      </form>

      <form className="mt-10 space-y-5 border-t border-neutral-200 pt-8" onSubmit={handleDelete}>
        <h2 className="text-xl font-light">Remove Panel</h2>
        <p className="text-sm opacity-75">Local only. This deletes the panel page folder, panel images, and slider item.</p>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="deleteParentPanel">
            Parent Panel
          </label>
          <select
            id="deleteParentPanel"
            value={deleteParentPanel}
            onChange={(event) => setDeleteParentPanel(event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2"
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
          <label className="mb-2 block text-sm font-medium" htmlFor="deletePanelSlug">
            Panel To Remove
          </label>
          <select
            id="deletePanelSlug"
            value={deletePanelSlug}
            onChange={(event) => setDeletePanelSlug(event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2"
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
          className="rounded-md bg-red-700 px-4 py-2 text-white disabled:opacity-60"
        >
          {isDeleting ? 'Removing...' : 'Remove Panel'}
        </button>
      </form>
    </div>
  )
}
