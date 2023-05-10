import { io } from "socket.io-client";
import { reactive } from 'vue'
import { useGroupStore } from "./stores/group.js";
import { useMessagesStore } from "./stores/messages";
import { usePlaylistStore } from './stores/playlist.js'

// `https://yours-next.herokuapp.com/#/:${location.port}`
// 'http://localhost:8081',
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:8081";


export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

export const socket = io(URL, { withCredentials: false });


socket.on("connect", () => {
  state.connected = true
  const groupStore = useGroupStore()
  groupStore.socketConnect()
});

socket.on("disconnect", () => {
  console.log('hey')
});

socket.on("reconnecting", () => {
  const groupStore = useGroupStore()
  groupStore.socketReconnecting()
});

socket.on("setInitialState", (payload) => {
  console.log('cia')
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

socket.on('updatePlaylists', (payload) => {
  const playlistStore = usePlaylistStore()
  console.log(payload, 'socket playlists')
  playlistStore.socketUpdatePlaylists(payload)
})

socket.on('sendMessage', (payload) => {
  const messagesStore = useMessagesStore()
  messagesStore.socketSetMessage(payload)
})
