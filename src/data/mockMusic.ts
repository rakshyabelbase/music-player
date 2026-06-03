import type {
  Album,
  Artist,
  AudioTestPlanItem,
  Playlist,
  Song,
} from '../types'

const cover = (seed: string) =>
  `https://picsum.photos/seed/${seed}/400/400`

const track = (fileName: string) => `/tracks/${fileName}`

const makeLyrics = (title: string) => [
  { time: 0, text: `[Instrumental intro - ${title}]` },
  { time: 15, text: 'Lost in the rhythm of the night' },
  { time: 32, text: 'Every beat pulls me closer to the light' },
  { time: 48, text: 'We dance until the morning breaks' },
  { time: 64, text: 'Hearts in sync, no words it takes' },
  { time: 80, text: 'Feel the bass beneath our feet' },
  { time: 96, text: 'This moment pure, this moment sweet' },
  { time: 112, text: 'Lost in the rhythm of the night' },
  { time: 128, text: 'Every beat pulls me closer to the light' },
  { time: 144, text: 'We rise together, never fall' },
  { time: 160, text: 'Music is the answer after all' },
  { time: 176, text: '[Outro]' },
]

export const artists: Artist[] = [
  {
    id: 'a1',
    name: 'Mixkit QA',
    imageUrl: cover('mixkit-qa'),
    followers: 'Royalty-free',
    genre: 'Playback Testing',
  },
  {
    id: 'a2',
    name: 'Tabletop Audio',
    imageUrl: cover('tabletop-audio'),
    followers: 'Free-to-use',
    genre: 'Longform Ambience',
  },
  {
    id: 'a3',
    name: 'OpenGameArt QA',
    imageUrl: cover('opengameart-qa'),
    followers: 'CC0',
    genre: 'Format Testing',
  },
]

export const songs: Song[] = [
  // Short track: trimmed local MP3 for play, pause, previous, next, auto-next, and queue flow.
  {
    id: 's1',
    title: 'Short Demo - Tech House Vibes',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al1',
    albumTitle: 'Playback Flow Tests',
    coverUrl: cover('short-demo-tech-house-vibes'),
    duration: 55,
    audioUrl: track('short-demo.mp3'),
    lyrics: makeLyrics('Short Demo - Tech House Vibes'),
    genre: 'Playback Test',
    plays: 12400000,
    testPurpose:
      '30-60 second local MP3 for testing play, pause, previous, next, auto-next, and queue behavior.',
  },
  // Long track: 10-minute local MP3 for progress, seeking, duration, buffering, and performance checks.
  {
    id: 's2',
    title: 'Long Mix - Black Rider',
    artistId: 'a2',
    artistName: 'Tabletop Audio',
    albumId: 'al1',
    albumTitle: 'Playback Flow Tests',
    coverUrl: cover('long-mix-black-rider'),
    duration: 600,
    audioUrl: track('long-mix.mp3'),
    lyrics: makeLyrics('Long Mix - Black Rider'),
    genre: 'Longform Ambience',
    plays: 8900000,
    testPurpose:
      '10-minute local MP3 for testing seeking, duration display, progress bar drift, buffering, and performance.',
  },
  // EDM/bass track 1: use this for low-frequency visualizer movement and bass EQ response.
  {
    id: 's3',
    title: 'EDM Bass - Cat Walk',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al2',
    albumTitle: 'Frequency Response Tests',
    coverUrl: cover('edm-bass-cat-walk'),
    duration: 124,
    audioUrl: track('edm-bass.mp3'),
    lyrics: makeLyrics('EDM Bass - Cat Walk'),
    genre: 'EDM',
    plays: 15200000,
    testPurpose:
      'Bass-heavy local MP3 for validating visualizer energy, low frequencies, and bass equalizer gain.',
  },
  // EDM/bass track 2: alternate bass-heavy MP3 for queue and repeated analyzer tests.
  {
    id: 's4',
    title: "EDM Bass 2 - Can't Get You Off My Mind",
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al2',
    albumTitle: 'Frequency Response Tests',
    coverUrl: cover('edm-bass-cant-get-you-off-my-mind'),
    duration: 91,
    audioUrl: track('edm-bass-2.mp3'),
    lyrics: makeLyrics("EDM Bass 2 - Can't Get You Off My Mind"),
    genre: 'Future Bass',
    plays: 6700000,
    testPurpose:
      'Second bass-focused local MP3 for A/B testing visualizer response and equalizer changes.',
  },
  // Acoustic guitar track 1: use this for waveform detail and mid-frequency equalizer checks.
  {
    id: 's5',
    title: 'Acoustic Guitar - Beautiful Dream',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al3',
    albumTitle: 'Instrument Detail Tests',
    coverUrl: cover('acoustic-guitar-beautiful-dream'),
    duration: 97,
    audioUrl: track('acoustic-guitar.mp3'),
    lyrics: makeLyrics('Acoustic Guitar - Beautiful Dream'),
    genre: 'Acoustic',
    plays: 22100000,
    testPurpose:
      'Acoustic guitar local MP3 for testing waveform detail, transients, and mid-frequency equalizer response.',
  },
  // Acoustic guitar track 2: use this as a second acoustic source for queue and waveform comparison.
  {
    id: 's6',
    title: 'Acoustic Guitar 2 - Tears of Joy',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al3',
    albumTitle: 'Instrument Detail Tests',
    coverUrl: cover('acoustic-guitar-tears-of-joy'),
    duration: 140,
    audioUrl: track('acoustic-guitar-2.mp3'),
    lyrics: makeLyrics('Acoustic Guitar 2 - Tears of Joy'),
    genre: 'Acoustic',
    plays: 9800000,
    testPurpose:
      'Second acoustic local MP3 for comparing waveform shape, mids, and queue transitions.',
  },
  // Piano/classical track 1: use this for clean audio, soft passages, and visualizer sensitivity.
  {
    id: 's7',
    title: 'Piano Solo - Romantic',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al3',
    albumTitle: 'Instrument Detail Tests',
    coverUrl: cover('piano-solo-romantic'),
    duration: 159,
    audioUrl: track('piano-solo.mp3'),
    lyrics: makeLyrics('Piano Solo - Romantic'),
    genre: 'Classical',
    plays: 18500000,
    testPurpose:
      'Clean piano/classical local MP3 for testing soft sounds, dynamic range, and visualizer sensitivity.',
  },
  // Piano/classical track 2: alternate classical piece for sensitivity and duration checks.
  {
    id: 's8',
    title: 'Piano Solo 2 - Skyline',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al3',
    albumTitle: 'Instrument Detail Tests',
    coverUrl: cover('piano-solo-skyline'),
    duration: 206,
    audioUrl: track('piano-solo-2.mp3'),
    lyrics: makeLyrics('Piano Solo 2 - Skyline'),
    genre: 'Classical',
    plays: 11200000,
    testPurpose:
      'Second piano/classical local MP3 for testing clean playback, duration display, and soft visualizer movement.',
  },
  // Vocal/pop track 1: use this for lyrics UI, metadata, and mid/high-frequency behavior.
  {
    id: 's9',
    title: 'Vocal Pop - Island Beat',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al4',
    albumTitle: 'Vocal And Metadata Tests',
    coverUrl: cover('vocal-pop-island-beat'),
    duration: 102,
    audioUrl: track('vocal-pop.mp3'),
    lyrics: makeLyrics('Vocal Pop - Island Beat'),
    genre: 'Pop',
    plays: 7600000,
    testPurpose:
      'Local pop MP3 for testing lyrics UI, metadata surfaces, vocal mids, and high-frequency visualizer response.',
  },
  // Vocal/pop track 2: use this as a second pop source for metadata and queue transitions.
  {
    id: 's10',
    title: 'Vocal Pop 2 - One More Dance',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    albumId: 'al4',
    albumTitle: 'Vocal And Metadata Tests',
    coverUrl: cover('vocal-pop-one-more-dance'),
    duration: 100,
    audioUrl: track('vocal-pop-2.mp3'),
    lyrics: makeLyrics('Vocal Pop 2 - One More Dance'),
    genre: 'Pop',
    plays: 14300000,
    testPurpose:
      'Second local pop MP3 for testing metadata, lyrics panel behavior, and mid/high-frequency response.',
  },
  // WAV format: use this for uncompressed local playback and Web Audio analyzer compatibility.
  {
    id: 's11',
    title: 'WAV Compatibility - Jump',
    artistId: 'a3',
    artistName: 'OpenGameArt QA',
    albumId: 'al5',
    albumTitle: 'Format Compatibility Tests',
    coverUrl: cover('wav-compatibility-jump'),
    duration: 90,
    audioUrl: track('test-wav.wav'),
    lyrics: makeLyrics('WAV Compatibility - Jump'),
    genre: 'Format Test',
    plays: 5300000,
    testPurpose:
      'Local WAV file for testing uncompressed playback, analyzer compatibility, and browser duration parsing.',
  },
  // OGG format: use this for browser format support and fallback behavior.
  {
    id: 's12',
    title: 'OGG Compatibility - Jump',
    artistId: 'a3',
    artistName: 'OpenGameArt QA',
    albumId: 'al5',
    albumTitle: 'Format Compatibility Tests',
    coverUrl: cover('ogg-compatibility-jump'),
    duration: 90,
    audioUrl: track('test-ogg.ogg'),
    lyrics: makeLyrics('OGG Compatibility - Jump'),
    genre: 'Format Test',
    plays: 4800000,
    testPurpose:
      'Local OGG file for testing format support, load behavior, and queue recovery across browsers.',
  },
]

export const albums: Album[] = [
  {
    id: 'al1',
    title: 'Playback Flow Tests',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    coverUrl: cover('playback-flow-tests'),
    year: 2026,
    trackIds: ['s1', 's2'],
  },
  {
    id: 'al2',
    title: 'Frequency Response Tests',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    coverUrl: cover('frequency-response-tests'),
    year: 2026,
    trackIds: ['s3', 's4'],
  },
  {
    id: 'al3',
    title: 'Instrument Detail Tests',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    coverUrl: cover('instrument-detail-tests'),
    year: 2026,
    trackIds: ['s5', 's6', 's7', 's8'],
  },
  {
    id: 'al4',
    title: 'Vocal And Metadata Tests',
    artistId: 'a1',
    artistName: 'Mixkit QA',
    coverUrl: cover('vocal-and-metadata-tests'),
    year: 2026,
    trackIds: ['s9', 's10'],
  },
  {
    id: 'al5',
    title: 'Format Compatibility Tests',
    artistId: 'a3',
    artistName: 'OpenGameArt QA',
    coverUrl: cover('format-compatibility-tests'),
    year: 2026,
    trackIds: ['s11', 's12'],
  },
]

export const playlists: Playlist[] = [
  {
    id: 'p1',
    title: 'Playback Flow QA',
    description: 'Short and long tracks for queue, auto-next, seeking, and duration checks',
    coverUrl: cover('playback-flow-qa'),
    songIds: ['s1', 's2', 's1', 's3'],
    createdBy: 'Aura QA',
  },
  {
    id: 'p2',
    title: 'Visualizer & EQ QA',
    description: 'Bass, acoustic, piano, and vocal tracks for analyzer and equalizer tuning',
    coverUrl: cover('visualizer-eq-qa'),
    songIds: ['s3', 's4', 's5', 's7', 's9'],
    createdBy: 'Aura QA',
  },
  {
    id: 'p3',
    title: 'Instrument Detail QA',
    description: 'Acoustic, piano, and pop tracks for waveform and metadata checks',
    coverUrl: cover('instrument-detail-qa'),
    songIds: ['s5', 's6', 's7', 's8', 's9', 's10'],
    createdBy: 'Aura QA',
  },
  {
    id: 'p4',
    title: 'Format Compatibility QA',
    description: 'MP3, WAV, and OGG files for browser format support testing',
    coverUrl: cover('format-compatibility-qa'),
    songIds: ['s1', 's11', 's12'],
    createdBy: 'Aura QA',
  },
]

export const audioTestingPlan: AudioTestPlanItem[] = [
  {
    area: 'Playback controls and queue',
    trackIds: ['s1', 's2'],
    checks: [
      'Play, pause, resume, previous, next, and replay from the mini and full players.',
      'Confirm the short track auto-advances to the next queued track.',
      'Confirm queue order survives repeated next and previous actions.',
    ],
  },
  {
    area: 'Seeking, duration, and performance',
    trackIds: ['s2'],
    checks: [
      'Seek near the beginning, middle, and final 30 seconds.',
      'Confirm duration and progress display remain stable over the 10-minute track.',
      'Watch memory and CPU while the visualizer runs for several minutes.',
    ],
  },
  {
    area: 'Visualizer and equalizer response',
    trackIds: ['s3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'],
    checks: [
      'Use the EDM tracks to validate strong bass-band movement.',
      'Use acoustic and vocal tracks to inspect mid/high-frequency response.',
      'Adjust bass, mid, and treble bands and confirm audible and visual changes.',
    ],
  },
  {
    area: 'Format compatibility',
    trackIds: ['s1', 's11', 's12'],
    checks: [
      'Confirm local MP3, WAV, and OGG files load or fail gracefully by browser.',
      'Verify unsupported formats show the existing audio error state.',
      'Check that analyzer data is active for supported local files.',
    ],
  },
]

export const trendingSongs = songs
  .slice()
  .sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0))
  .slice(0, 6)

export const recentlyPlayedSeed = ['s5', 's1', 's7', 's3', 's10']

export function getSongById(id: string): Song | undefined {
  return songs.find((s) => s.id === id)
}

export function getSongsByIds(ids: string[]): Song[] {
  return ids.map((id) => getSongById(id)).filter((s): s is Song => !!s)
}

export function getAlbumById(id: string): Album | undefined {
  return albums.find((a) => a.id === id)
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id)
}

/** @deprecated Use `searchSongs` from `../utils/search` */
export function searchSongs(query: string): Song[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return songs.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artistName.toLowerCase().includes(q) ||
      s.albumTitle.toLowerCase().includes(q) ||
      (s.genre?.toLowerCase().includes(q) ?? false) ||
      (s.testPurpose?.toLowerCase().includes(q) ?? false),
  )
}
