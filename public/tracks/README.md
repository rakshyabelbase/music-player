# Local Audio Test Files

These files are intentionally served from `public/tracks/` so the Web Audio API analyzer can inspect same-origin audio without remote CORS issues.

| File | Source | Format | Test purpose |
| --- | --- | --- | --- |
| `short-demo.mp3` | Mixkit, trimmed locally from "Tech House vibes" | MP3 | Short play, pause, previous, next, auto-next, and queue flow |
| `edm-bass.mp3` | Mixkit "Cat Walk" | MP3 | Frequency visualizer, bass EQ, and low-frequency response |
| `edm-bass-2.mp3` | Mixkit "Can't Get You Off My Mind" | MP3 | Second bass-heavy track for A/B visualizer checks |
| `acoustic-guitar.mp3` | Mixkit "Beautiful Dream" | MP3 | Waveform detail, transients, and mid frequencies |
| `acoustic-guitar-2.mp3` | Mixkit "Tears of Joy" | MP3 | Second acoustic track for queue and waveform comparison |
| `piano-solo.mp3` | Mixkit "Romantic" | MP3 | Clean audio, soft sounds, and visualizer sensitivity |
| `piano-solo-2.mp3` | Mixkit "Skyline" | MP3 | Second piano/classical track |
| `vocal-pop.mp3` | Mixkit "Island Beat" | MP3 | Lyrics UI, metadata, vocals, and mid/high frequencies |
| `vocal-pop-2.mp3` | Mixkit "One More Dance" | MP3 | Second vocal/pop style metadata test |
| `long-mix.mp3` | Tabletop Audio "Black Rider" | MP3 | 10-minute progress bar, seeking, duration, buffering, and performance |
| `test-wav.wav` | OpenGameArt "Jump" by ThePixel, CC0 | WAV | Uncompressed playback and analyzer compatibility |
| `test-ogg.ogg` | OpenGameArt "Jump" by ThePixel, CC0 | OGG | Browser format support and error recovery |

Mixkit tracks are covered by the Mixkit music license. Tabletop Audio publishes original free-to-use 10-minute MP3 ambience/music files. The OpenGameArt format files are CC0.

Keep filenames stable when swapping in real tracks, or update the `audioUrl` values in the catalog.
