/**
 * AuraBeats — Professional Web Music Player
 * Author: Rashid Ayub | CodeAlpha Frontend Development Internship
 * Technologies: HTML5 Audio API, CSS3, Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Track Data & Playlist Definitions (Royalty-Free NCS Tracks)
     ========================================================================== */
  const playlist = [
    {
      id: 'track-1',
      title: 'Royalty',
      artist: 'Maestro Chives, Egzod, Neoni',
      album: 'Royalty NCS',
      genre: 'Electronic / Trap',
      duration: '3:43',
      src: 'assets/audio/royalty.mp3',
      cover: 'assets/images/royalty.png'
    },
    {
      id: 'track-2',
      title: 'Feel Good Funk',
      artist: 'Syn Cole, Nakama',
      album: 'Feel Good Funk',
      genre: 'House / Funk',
      duration: '2:56',
      src: 'assets/audio/feel_good_funk.mp3',
      cover: 'assets/images/feel_good_funk.png'
    },
    {
      id: 'track-3',
      title: 'Never Knew Me',
      artist: 'Veela, Rameses B',
      album: 'Never Knew Me',
      genre: 'Melodic Bass / Drum & Bass',
      duration: '3:32',
      src: 'assets/audio/never_knew_me.mp3',
      cover: 'assets/images/never_knew_me.png'
    },
    {
      id: 'track-4',
      title: 'Mortals Funk Remix',
      artist: 'Warriyo, LXNGVX',
      album: 'Mortals (Super Slowed)',
      genre: 'Phonk / Bass',
      duration: '2:59',
      src: 'assets/audio/mortals_funk.mp3',
      cover: 'assets/images/mortals_funk.png'
    },
    {
      id: 'track-5',
      title: 'Harinezumi',
      artist: 'Waera',
      album: 'Harinezumi NCS',
      genre: 'Lofi / Ambient Chill',
      duration: '3:15',
      src: 'assets/audio/harinezumi.mp3',
      cover: 'assets/images/harinezumi.png'
    }
  ];

  /* ==========================================================================
     2. Player State
     ========================================================================== */
  const state = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 1, // 0: Off, 1: Repeat All, 2: Repeat One
    autoplay: true,
    volume: 0.8,
    isMuted: false,
    lastVolume: 0.8,
    isDraggingProgress: false,
    searchQuery: '',
    activeTab: 'all', // 'all' | 'favorites'
    favorites: new Set(loadFavoritesFromStorage()),
    shuffledIndices: []
  };

  /* ==========================================================================
     3. DOM Element Cache
     ========================================================================== */
  const elements = {
    audio: document.getElementById('audio-player'),
    playerCard: document.getElementById('player-section'),
    playerStatusText: document.getElementById('player-status-text'),
    albumArt: document.getElementById('album-art'),
    songTitle: document.getElementById('song-title'),
    songArtist: document.getElementById('song-artist'),
    songAlbum: document.getElementById('song-album'),
    songGenre: document.getElementById('song-genre'),
    currentTime: document.getElementById('current-time'),
    totalDuration: document.getElementById('total-duration'),
    progressContainer: document.getElementById('progress-container'),
    progressFill: document.getElementById('progress-fill'),
    progressBuffer: document.getElementById('progress-buffer'),
    progressHoverTime: document.getElementById('progress-hover-time'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    shuffleBtn: document.getElementById('shuffle-btn'),
    repeatBtn: document.getElementById('repeat-btn'),
    repeatOneBadge: document.getElementById('repeat-one-badge'),
    likeBtn: document.getElementById('like-btn'),
    muteBtn: document.getElementById('mute-btn'),
    volHighIcon: document.getElementById('vol-high-icon'),
    volLowIcon: document.getElementById('vol-low-icon'),
    volMutedIcon: document.getElementById('vol-muted-icon'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeBarFill: document.getElementById('volume-bar-fill'),
    volumePercent: document.getElementById('volume-percent'),
    autoplayToggle: document.getElementById('autoplay-toggle'),
    playlistContainer: document.getElementById('playlist-container'),
    playlistCount: document.getElementById('playlist-count'),
    favoritesCount: document.getElementById('favorites-count'),
    tabAll: document.getElementById('tab-all'),
    tabFavorites: document.getElementById('tab-favorites'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    emptyState: document.getElementById('empty-state'),
    audioNotice: document.getElementById('audio-notice'),
    noticeTitle: document.getElementById('notice-title'),
    noticeDesc: document.getElementById('notice-desc'),
    noticeDismissBtn: document.getElementById('notice-dismiss-btn'),
    toastContainer: document.getElementById('toast-container'),
    shortcutsBtn: document.getElementById('shortcuts-btn'),
    shortcutsModal: document.getElementById('shortcuts-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    visualizerCanvas: document.getElementById('visualizer-canvas')
  };

  /* ==========================================================================
     4. Audio Visualizer Setup (Web Audio API + Simulated Fallback)
     ========================================================================== */
  let audioContext = null;
  let analyser = null;
  let audioSource = null;
  let visualizerAnimationId = null;
  let isWebAudioInitialized = false;

  function initWebAudio() {
    if (isWebAudioInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = new AudioCtx();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      audioSource = audioContext.createMediaElementSource(elements.audio);
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);
      isWebAudioInitialized = true;
    } catch (e) {
      console.warn('Web Audio API restricted; utilizing dynamic harmonic visualizer fallback.', e);
    }
  }

  function startVisualizer() {
    const canvas = elements.visualizerCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barCount = 32;
    const barWidth = (width / barCount) - 2;

    let simPhase = 0;

    function renderFrame() {
      visualizerAnimationId = requestAnimationFrame(renderFrame);
      ctx.clearRect(0, 0, width, height);

      let dataArray;
      if (isWebAudioInitialized && analyser && state.isPlaying) {
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
      }

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4; // idle baseline

        if (state.isPlaying) {
          if (dataArray && dataArray[i] !== undefined) {
            barHeight = Math.max(4, (dataArray[i] / 255) * height * 0.95);
          } else {
            // Simulated rhythmic harmonic wave
            const wave1 = Math.sin((i * 0.35) + simPhase) * 0.5 + 0.5;
            const wave2 = Math.cos((i * 0.2) - (simPhase * 1.5)) * 0.5 + 0.5;
            const combined = (wave1 * 0.6 + wave2 * 0.4);
            barHeight = 4 + combined * (height - 8);
          }
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient for each bar
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(0.5, '#ec4899');
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();
      }

      if (state.isPlaying) {
        simPhase += 0.12;
      }
    }

    if (visualizerAnimationId) cancelAnimationFrame(visualizerAnimationId);
    renderFrame();
  }

  /* ==========================================================================
     5. Track Loading & Metadata Display
     ========================================================================== */
  function loadTrack(index, autoPlay = false) {
    if (index < 0 || index >= playlist.length) return;

    state.currentIndex = index;
    const track = playlist[index];

    // Reset error banner
    hideAudioNotice();

    // Update Player UI
    elements.songTitle.textContent = track.title;
    elements.songArtist.textContent = track.artist;
    elements.songAlbum.textContent = track.album;
    elements.songGenre.textContent = track.genre;
    elements.albumArt.src = track.cover;
    elements.albumArt.alt = `${track.title} Album Artwork`;

    // Set Audio Source
    elements.audio.src = track.src;
    elements.audio.load();

    // Reset progress displays
    elements.currentTime.textContent = '0:00';
    elements.totalDuration.textContent = track.duration || '0:00';
    elements.progressFill.style.width = '0%';
    elements.progressContainer.setAttribute('aria-valuenow', '0');

    // Update Favorite State
    updateLikeButtonState(track.id);

    // Synchronize Playlist highlighting
    renderPlaylist();

    if (autoPlay) {
      playAudio();
    } else {
      updatePlaybackUI(false);
      elements.playerStatusText.textContent = 'Ready to Play';
    }
  }

  function playAudio() {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    initWebAudio();

    const playPromise = elements.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          state.isPlaying = true;
          updatePlaybackUI(true);
        })
        .catch(error => {
          console.warn('Playback prevented or failed:', error);
          state.isPlaying = false;
          updatePlaybackUI(false);

          if (error.name === 'NotAllowedError') {
            showToast('Click anywhere or press Space to enable audio playback');
          } else {
            showAudioNotice('Playback Issue', 'Audio could not be loaded. Click Dismiss or choose another track.');
          }
        });
    }
  }

  function pauseAudio() {
    elements.audio.pause();
    state.isPlaying = false;
    updatePlaybackUI(false);
  }

  function togglePlayPause() {
    if (state.isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function updatePlaybackUI(isPlaying) {
    if (isPlaying) {
      elements.playerCard.classList.add('is-playing');
      elements.playIcon.classList.add('hidden');
      elements.pauseIcon.classList.remove('hidden');
      elements.playPauseBtn.setAttribute('aria-label', 'Pause song');
      elements.playerStatusText.textContent = 'Now Playing';
    } else {
      elements.playerCard.classList.remove('is-playing');
      elements.playIcon.classList.remove('hidden');
      elements.pauseIcon.classList.add('hidden');
      elements.playPauseBtn.setAttribute('aria-label', 'Play song');
      elements.playerStatusText.textContent = 'Paused';
    }
    syncPlaylistEqualizerState(isPlaying);
  }

  /* ==========================================================================
     6. Next / Previous & Navigation Logic
     ========================================================================== */
  function playNextTrack() {
    let nextIndex;

    if (state.isShuffle) {
      nextIndex = getNextShuffledIndex();
    } else {
      nextIndex = state.currentIndex + 1;
      if (nextIndex >= playlist.length) {
        if (state.repeatMode === 0) {
          // End of playlist without repeat
          pauseAudio();
          elements.audio.currentTime = 0;
          return;
        }
        nextIndex = 0; // Wrap around for repeat all
      }
    }

    loadTrack(nextIndex, true);
    showToast(`Playing: ${playlist[nextIndex].title}`);
  }

  function playPrevTrack() {
    // If track has played more than 3 seconds, restart it first
    if (elements.audio.currentTime > 3) {
      elements.audio.currentTime = 0;
      return;
    }

    let prevIndex;
    if (state.isShuffle) {
      prevIndex = getNextShuffledIndex();
    } else {
      prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = playlist.length - 1;
      }
    }

    loadTrack(prevIndex, true);
    showToast(`Playing: ${playlist[prevIndex].title}`);
  }

  /* Shuffle Algorithm */
  function generateShuffledQueue() {
    const indices = playlist.map((_, i) => i).filter(i => i !== state.currentIndex);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    state.shuffledIndices = indices;
  }

  function getNextShuffledIndex() {
    if (!state.shuffledIndices.length) {
      generateShuffledQueue();
    }
    return state.shuffledIndices.pop() ?? 0;
  }

  function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    elements.shuffleBtn.classList.toggle('is-active', state.isShuffle);
    if (state.isShuffle) {
      generateShuffledQueue();
      showToast('Shuffle Mode: ON');
    } else {
      showToast('Shuffle Mode: OFF');
    }
  }

  /* Repeat Mode Cycle: 0 (Off) -> 1 (All) -> 2 (One) */
  function cycleRepeatMode() {
    state.repeatMode = (state.repeatMode + 1) % 3;

    if (state.repeatMode === 0) {
      elements.repeatBtn.classList.remove('is-active', 'repeat-one');
      showToast('Repeat: OFF');
    } else if (state.repeatMode === 1) {
      elements.repeatBtn.classList.add('is-active');
      elements.repeatBtn.classList.remove('repeat-one');
      showToast('Repeat: ALL TRACKS');
    } else {
      elements.repeatBtn.classList.add('is-active', 'repeat-one');
      showToast('Repeat: CURRENT TRACK');
    }
  }

  /* ==========================================================================
     7. Progress & Seeking
     ========================================================================== */
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateProgress() {
    if (state.isDraggingProgress) return;
    const { currentTime, duration } = elements.audio;
    if (isNaN(duration) || duration === 0) return;

    const percent = (currentTime / duration) * 100;
    elements.progressFill.style.width = `${percent}%`;
    elements.progressContainer.setAttribute('aria-valuenow', Math.round(percent).toString());
    elements.currentTime.textContent = formatTime(currentTime);
  }

  function updateBuffer() {
    const { buffered, duration } = elements.audio;
    if (buffered.length > 0 && duration > 0) {
      const bufferedEnd = buffered.end(buffered.length - 1);
      const bufferPercent = (bufferedEnd / duration) * 100;
      elements.progressBuffer.style.width = `${bufferPercent}%`;
    }
  }

  function seekToPosition(event) {
    const rect = elements.progressContainer.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const seekPercentage = clickX / rect.width;
    const duration = elements.audio.duration;

    if (!isNaN(duration) && duration > 0) {
      elements.audio.currentTime = seekPercentage * duration;
      elements.progressFill.style.width = `${seekPercentage * 100}%`;
      elements.currentTime.textContent = formatTime(elements.audio.currentTime);
    }
  }

  function handleProgressHover(event) {
    const rect = elements.progressContainer.getBoundingClientRect();
    const hoverX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const seekPercentage = hoverX / rect.width;
    const duration = elements.audio.duration;

    if (!isNaN(duration) && duration > 0) {
      const hoverSeconds = seekPercentage * duration;
      elements.progressHoverTime.textContent = formatTime(hoverSeconds);
      elements.progressHoverTime.style.left = `${hoverX}px`;
    }
  }

  /* ==========================================================================
     8. Volume Controls & Mute
     ========================================================================== */
  function setVolume(value) {
    const vol = Math.max(0, Math.min(1, parseFloat(value)));
    state.volume = vol;
    elements.audio.volume = vol;
    elements.volumeSlider.value = vol;
    elements.volumePercent.textContent = `${Math.round(vol * 100)}%`;

    if (vol === 0) {
      state.isMuted = true;
    } else {
      state.isMuted = false;
      state.lastVolume = vol;
    }

    updateVolumeIcons(vol, state.isMuted);
  }

  function toggleMute() {
    if (state.isMuted) {
      // Unmute: restore last volume
      const restoreVol = state.lastVolume > 0 ? state.lastVolume : 0.8;
      setVolume(restoreVol);
      showToast(`Unmuted: ${Math.round(restoreVol * 100)}%`);
    } else {
      // Mute
      state.lastVolume = state.volume;
      setVolume(0);
      showToast('Muted');
    }
  }

  function updateVolumeIcons(vol, isMuted) {
    elements.volHighIcon.classList.add('hidden');
    elements.volLowIcon.classList.add('hidden');
    elements.volMutedIcon.classList.add('hidden');

    if (isMuted || vol === 0) {
      elements.volMutedIcon.classList.remove('hidden');
    } else if (vol < 0.45) {
      elements.volLowIcon.classList.remove('hidden');
    } else {
      elements.volHighIcon.classList.remove('hidden');
    }
  }

  /* ==========================================================================
     9. Favorite Tracks (Liked Songs)
     ========================================================================== */
  function loadFavoritesFromStorage() {
    try {
      const stored = localStorage.getItem('aurabeats_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function saveFavoritesToStorage() {
    try {
      localStorage.setItem('aurabeats_favorites', JSON.stringify(Array.from(state.favorites)));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }

  function toggleFavorite(trackId) {
    if (state.favorites.has(trackId)) {
      state.favorites.delete(trackId);
      showToast('Removed from Liked Songs');
    } else {
      state.favorites.add(trackId);
      showToast('Added to Liked Songs ❤️');
    }

    saveFavoritesToStorage();
    updateFavoritesBadge();
    updateLikeButtonState(playlist[state.currentIndex].id);
    renderPlaylist();
  }

  function updateLikeButtonState(trackId) {
    const isFav = state.favorites.has(trackId);
    elements.likeBtn.classList.toggle('is-favorite', isFav);
  }

  function updateFavoritesBadge() {
    elements.favoritesCount.textContent = state.favorites.size.toString();
  }

  /* ==========================================================================
     10. Playlist Rendering & Filtering
     ========================================================================== */
  function getFilteredPlaylist() {
    return playlist.filter((track, index) => {
      // Tab filter
      if (state.activeTab === 'favorites' && !state.favorites.has(track.id)) {
        return false;
      }
      // Search filter
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase().trim();
        const matchTitle = track.title.toLowerCase().includes(query);
        const matchArtist = track.artist.toLowerCase().includes(query);
        const matchAlbum = track.album.toLowerCase().includes(query);
        return matchTitle || matchArtist || matchAlbum;
      }
      return true;
    });
  }

  function renderPlaylist() {
    const filtered = getFilteredPlaylist();
    elements.playlistContainer.innerHTML = '';

    if (filtered.length === 0) {
      elements.emptyState.classList.remove('hidden');
      elements.playlistCount.textContent = '0 Songs';
      return;
    }

    elements.emptyState.classList.add('hidden');
    elements.playlistCount.textContent = `${filtered.length} Song${filtered.length > 1 ? 's' : ''}`;

    filtered.forEach((track) => {
      const originalIndex = playlist.findIndex(t => t.id === track.id);
      const isCurrent = originalIndex === state.currentIndex;
      const isFavorite = state.favorites.has(track.id);

      const item = document.createElement('div');
      item.className = `playlist-item ${isCurrent ? 'is-active' : ''} ${!state.isPlaying ? 'is-paused' : ''}`;
      item.dataset.index = originalIndex.toString();
      item.setAttribute('role', 'listitem');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `${track.title} by ${track.artist}`);

      item.innerHTML = `
        <div class="playlist-item-index">${originalIndex + 1}</div>
        <div class="playlist-item-thumb">
          <img src="${track.cover}" alt="${track.title} Thumbnail" loading="lazy">
          <div class="playlist-eq-overlay" aria-hidden="true">
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
          </div>
        </div>
        <div class="playlist-item-info">
          <div class="playlist-item-title">${track.title}</div>
          <div class="playlist-item-artist">${track.artist}</div>
        </div>
        <div class="playlist-item-actions">
          <span class="playlist-item-time">${track.duration}</span>
          <button class="icon-btn item-like-btn ${isFavorite ? 'is-favorite' : ''}" data-track-id="${track.id}" title="${isFavorite ? 'Unlike' : 'Like'} track" aria-label="Like song">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      `;

      // Click to play
      item.addEventListener('click', (e) => {
        if (e.target.closest('.item-like-btn')) return;
        loadTrack(originalIndex, true);
      });

      // Enter or Space key to play item
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          loadTrack(originalIndex, true);
        }
      });

      // Like button inside playlist
      const likeBtn = item.querySelector('.item-like-btn');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(track.id);
      });

      elements.playlistContainer.appendChild(item);
    });
  }

  function syncPlaylistEqualizerState(isPlaying) {
    const items = elements.playlistContainer.querySelectorAll('.playlist-item');
    items.forEach(item => {
      if (item.classList.contains('is-active')) {
        item.classList.toggle('is-paused', !isPlaying);
      }
    });
  }

  /* ==========================================================================
     11. Error Notice Banner & Toasts
     ========================================================================== */
  function showAudioNotice(title, desc) {
    elements.noticeTitle.textContent = title;
    elements.noticeDesc.textContent = desc;
    elements.audioNotice.classList.remove('hidden');
  }

  function hideAudioNotice() {
    elements.audioNotice.classList.add('hidden');
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
      <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /* ==========================================================================
     12. Keyboard Shortcuts Handler
     ========================================================================== */
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore shortcut keys if user is currently typing inside the search input
      if (document.activeElement === elements.searchInput) {
        if (e.key === 'Escape') {
          elements.searchInput.value = '';
          state.searchQuery = '';
          elements.clearSearchBtn.classList.add('hidden');
          renderPlaylist();
          elements.searchInput.blur();
        }
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            playNextTrack();
          } else {
            // Seek forward 5 seconds
            elements.audio.currentTime = Math.min(elements.audio.duration || 0, elements.audio.currentTime + 5);
            showToast(`+5s (${formatTime(elements.audio.currentTime)})`);
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            playPrevTrack();
          } else {
            // Seek backward 5 seconds
            elements.audio.currentTime = Math.max(0, elements.audio.currentTime - 5);
            showToast(`-5s (${formatTime(elements.audio.currentTime)})`);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, state.volume + 0.05));
          showToast(`Volume: ${Math.round(state.volume * 100)}%`);
          break;

        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, state.volume - 0.05));
          showToast(`Volume: ${Math.round(state.volume * 100)}%`);
          break;

        case 'KeyM':
          toggleMute();
          break;

        case 'KeyS':
          toggleShuffle();
          break;

        case 'KeyR':
          cycleRepeatMode();
          break;

        case 'KeyN':
          playNextTrack();
          break;

        case 'KeyP':
          playPrevTrack();
          break;

        case 'KeyL':
          toggleFavorite(playlist[state.currentIndex].id);
          break;

        case 'Slash':
          if (e.shiftKey) { // '?' key
            e.preventDefault();
            elements.shortcutsModal.classList.toggle('hidden');
          }
          break;

        case 'Escape':
          elements.shortcutsModal.classList.add('hidden');
          break;
      }
    });
  }

  /* ==========================================================================
     13. Event Listeners Setup
     ========================================================================== */
  function setupEventListeners() {
    // Core playback buttons
    elements.playPauseBtn.addEventListener('click', togglePlayPause);
    elements.nextBtn.addEventListener('click', playNextTrack);
    elements.prevBtn.addEventListener('click', playPrevTrack);
    elements.shuffleBtn.addEventListener('click', toggleShuffle);
    elements.repeatBtn.addEventListener('click', cycleRepeatMode);

    // Like main button
    elements.likeBtn.addEventListener('click', () => {
      toggleFavorite(playlist[state.currentIndex].id);
    });

    // Audio Element Native Events
    elements.audio.addEventListener('timeupdate', updateProgress);
    elements.audio.addEventListener('progress', updateBuffer);

    elements.audio.addEventListener('loadedmetadata', () => {
      const dur = elements.audio.duration;
      if (!isNaN(dur) && dur > 0) {
        elements.totalDuration.textContent = formatTime(dur);
      }
    });

    elements.audio.addEventListener('ended', () => {
      if (state.repeatMode === 2) {
        // Repeat One
        elements.audio.currentTime = 0;
        playAudio();
      } else if (state.autoplay) {
        playNextTrack();
      } else {
        pauseAudio();
        elements.audio.currentTime = 0;
      }
    });

    elements.audio.addEventListener('error', (e) => {
      console.warn('Audio playback encountered an error:', e);
      showAudioNotice('Playback Error', 'Cannot load audio track. Check connection or skip to next.');
      state.isPlaying = false;
      updatePlaybackUI(false);
    });

    // Progress Bar Seeking (Click & Drag)
    elements.progressContainer.addEventListener('mousedown', (e) => {
      state.isDraggingProgress = true;
      seekToPosition(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (state.isDraggingProgress) {
        seekToPosition(e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (state.isDraggingProgress) {
        state.isDraggingProgress = false;
      }
    });

    // Touch support for progress bar
    elements.progressContainer.addEventListener('touchstart', (e) => {
      state.isDraggingProgress = true;
      if (e.touches[0]) seekToPosition(e.touches[0]);
    }, { passive: true });

    elements.progressContainer.addEventListener('touchmove', (e) => {
      if (state.isDraggingProgress && e.touches[0]) {
        seekToPosition(e.touches[0]);
      }
    }, { passive: true });

    elements.progressContainer.addEventListener('touchend', () => {
      state.isDraggingProgress = false;
    });

    // Progress Hover Tooltip
    elements.progressContainer.addEventListener('mousemove', handleProgressHover);

    // Volume Slider
    elements.volumeSlider.addEventListener('input', (e) => {
      setVolume(e.target.value);
    });

    elements.muteBtn.addEventListener('click', toggleMute);

    // Autoplay toggle
    elements.autoplayToggle.addEventListener('change', (e) => {
      state.autoplay = e.target.checked;
      showToast(`Autoplay: ${state.autoplay ? 'Enabled' : 'Disabled'}`);
    });

    // Playlist Search
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      elements.clearSearchBtn.classList.toggle('hidden', state.searchQuery === '');
      renderPlaylist();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.searchQuery = '';
      elements.clearSearchBtn.classList.add('hidden');
      renderPlaylist();
      elements.searchInput.focus();
    });

    // Playlist Tabs
    elements.tabAll.addEventListener('click', () => {
      state.activeTab = 'all';
      elements.tabAll.classList.add('active');
      elements.tabFavorites.classList.remove('active');
      renderPlaylist();
    });

    elements.tabFavorites.addEventListener('click', () => {
      state.activeTab = 'favorites';
      elements.tabFavorites.classList.add('active');
      elements.tabAll.classList.remove('active');
      renderPlaylist();
    });

    // Notice Dismiss
    elements.noticeDismissBtn.addEventListener('click', hideAudioNotice);

    // Shortcuts Modal
    elements.shortcutsBtn.addEventListener('click', () => {
      elements.shortcutsModal.classList.remove('hidden');
    });

    elements.closeModalBtn.addEventListener('click', () => {
      elements.shortcutsModal.classList.add('hidden');
    });

    elements.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === elements.shortcutsModal) {
        elements.shortcutsModal.classList.add('hidden');
      }
    });

    // Setup Keyboard listener
    setupKeyboardShortcuts();
  }

  /* ==========================================================================
     14. Application Initialization
     ========================================================================== */
  function init() {
    updateFavoritesBadge();
    setVolume(state.volume);
    loadTrack(0, false);
    renderPlaylist();
    startVisualizer();
    setupEventListeners();

    // Auto-update repeat button default UI to Repeat All
    elements.repeatBtn.classList.add('is-active');

    console.log('🎵 AuraBeats Professional Music Player Initialized!');
  }

  init();
});
