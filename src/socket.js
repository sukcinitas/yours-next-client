import { io } from "socket.io-client";
import { useGroupStore } from "./stores/group.js";
import { useMessagesStore } from "./stores/messages";
import { usePlaylistStore } from './stores/playlist.js'
import { useMainPlaylistStore } from "./stores/mainplaylist.js";

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:8081";
export const socket = io(URL, { withCredentials: false });

// Group
socket.on("connect", () => {
  const groupStore = useGroupStore()
  groupStore.socketConnect()
});

socket.on("reconnecting", () => {
  const groupStore = useGroupStore()
  groupStore.socketReconnecting()
});

socket.on("setInitialState", (payload) => {
  const groupStore = useGroupStore()
  groupStore.socketSetInitialStateSocket(payload)
});

socket.on("setModerator", (payload) => {
  const groupStore = useGroupStore()
  groupStore.socketSetModerator(payload)
});

socket.on("addMember", (payload) => {
  const groupStore = useGroupStore()
  groupStore.socketAddMember(payload)
});

socket.on("setMember", (payload) => {
  const groupStore = useGroupStore()
  groupStore.socketSetMember(payload)
});

socket.on("removeMember", (payload) => {
  const groupStore = useGroupStore()
  groupStore.socketRemoveMember(payload)
});

// Playlist
socket.on('updatePlaylists', (payload) => {
  const playlistStore = usePlaylistStore()
  playlistStore.socketUpdatePlaylists(payload)
})

// Messages
socket.on('sendMessage', (payload) => {
  const messagesStore = useMessagesStore()
  messagesStore.socketSetMessage(payload)
})

// Mainplaylist
socket.on('setOngoingPlaylist', (payload) => {
  const mainplaylistStore = useMainPlaylistStore()
  mainplaylistStore.socketSetOngoingPlaylist(payload)
})

socket.on('userJoinsOngoingPlaylist', (payload) => {
  const mainplaylistStore = useMainPlaylistStore()
  mainplaylistStore.socketUserJoinsOngoingPlaylist(payload)
})

socket.on('changeOngoingPlaylistVideoIndex', (payload) => {
  const mainplaylistStore = useMainPlaylistStore()
  mainplaylistStore.socketChangeOngoingPlaylistVideoIndex(payload)
})

socket.on('toggleOngoingPlaylist', (payload) => {
  const mainplaylistStore = useMainPlaylistStore()
  mainplaylistStore.socketToggleOngoingPlaylist(payload)
})

socket.on('toggleOngoingPlaylist', (payload) => {
  const mainplaylistStore = useMainPlaylistStore()
  mainplaylistStore.socketToggleOngoingPlaylist(payload)
})

socket.on('updatePlaylist', (payload) => {
  const mainplaylistStore = useMainPlaylistStore()
  mainplaylistStore.socketUpdatePlaylist(payload)
})
