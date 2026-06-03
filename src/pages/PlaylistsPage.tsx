import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import { SectionHeader } from '../components/layout/SectionHeader'
import { PlaylistCard } from '../components/music/PlaylistCard'
import { SongRow } from '../components/music/SongRow'
import { Button } from '../components/ui/Button'
import { DraggableList } from '../components/ui/DraggableList'
import { usePlaylistStore } from '../store/playlistStore'
import { usePlayerStore } from '../store/playerStore'
import { getSongsByIds } from '../data/mockMusic'
import { formatTime } from '../utils/formatTime'

export function PlaylistsPage() {
  const selectedPlaylistId = usePlayerStore((s) => s.selectedPlaylistId)
  const setSelectedPlaylistId = usePlayerStore((s) => s.setSelectedPlaylistId)
  const playQueue = usePlayerStore((s) => s.playQueue)

  const getAllPlaylists = usePlaylistStore((s) => s.getAllPlaylists)
  const getPlaylist = usePlaylistStore((s) => s.getPlaylist)
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist)
  const renamePlaylist = usePlaylistStore((s) => s.renamePlaylist)
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist)
  const removeSongFromPlaylist = usePlaylistStore((s) => s.removeSongFromPlaylist)
  const reorderPlaylistSongs = usePlaylistStore((s) => s.reorderPlaylistSongs)
  const userPlaylists = usePlaylistStore((s) => s.userPlaylists)

  const [newTitle, setNewTitle] = useState('')
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const allPlaylists = getAllPlaylists()
  const playlist = selectedPlaylistId ? getPlaylist(selectedPlaylistId) : null
  const isUserPlaylist = playlist && userPlaylists.some((p) => p.id === playlist.id)
  const tracks = playlist ? getSongsByIds(playlist.songIds) : []
  const totalDuration = tracks.reduce((acc, s) => acc + s.duration, 0)

  const handleCreate = () => {
    const title = newTitle.trim() || 'My Playlist'
    const id = createPlaylist(title)
    setNewTitle('')
    setSelectedPlaylistId(id)
  }

  if (playlist) {
    return (
      <div className="p-4 sm:p-6 pb-8">
        <button
          type="button"
          onClick={() => {
            setSelectedPlaylistId(null)
            setEditing(false)
          }}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to playlists
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-6 mb-8"
        >
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-2xl glow-accent shrink-0"
          />
          <div className="flex flex-col justify-end flex-1">
            <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Playlist
            </p>
            {editing && isUserPlaylist ? (
              <div className="space-y-3 mb-4">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-white/10 rounded-lg px-3 py-2"
                  aria-label="Playlist title"
                />
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Description"
                  aria-label="Playlist description"
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      renamePlaylist(playlist.id, editTitle, editDesc)
                      setEditing(false)
                    }}
                  >
                    Save
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl sm:text-5xl font-bold mb-2">{playlist.title}</h1>
                <p className="text-[var(--color-text-muted)] mb-4">{playlist.description}</p>
              </>
            )}
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              {playlist.createdBy} · {tracks.length} songs · {formatTime(totalDuration)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => tracks.length && playQueue(tracks, 0)}
              >
                <Play className="w-4 h-4 fill-current" />
                Play all
              </Button>
              {isUserPlaylist && !editing && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditTitle(playlist.title)
                      setEditDesc(playlist.description)
                      setEditing(true)
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                    Rename
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      deletePlaylist(playlist.id)
                      setSelectedPlaylistId(null)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {isUserPlaylist && tracks.length > 0 ? (
          <DraggableList
            items={tracks}
            keyExtractor={(s) => s.id}
            onReorder={(from, to) => reorderPlaylistSongs(playlist.id, from, to)}
            renderItem={(song, i) => (
              <div className="flex items-center gap-2 flex-1">
                <SongRow song={song} index={i} playlist={tracks} showIndex />
                <button
                  type="button"
                  onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                  className="p-2 text-[var(--color-text-muted)] hover:text-red-400 shrink-0"
                  aria-label="Remove from playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        ) : (
          <div className="space-y-1">
            {tracks.map((song, i) => (
              <SongRow key={song.id} song={song} index={i} playlist={tracks} />
            ))}
          </div>
        )}

        {tracks.length === 0 && (
          <p className="text-center text-[var(--color-text-muted)] py-8">
            No songs yet. Use the menu on any track to add songs here.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 pb-8">
      <SectionHeader
        title="Playlists"
        subtitle="Curated collections and your own mixes"
      />

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 px-4 py-2 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allPlaylists.map((p, i) => (
          <PlaylistCard key={p.id} playlist={p} index={i} />
        ))}
      </div>
    </div>
  )
}
