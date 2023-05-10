import { defineStore } from 'pinia'
import GroupService from '../services/group.service';
import { useMainPlaylistStore } from './mainplaylist';
import { useMessagesStore } from './messages';
import { socket } from "@/socket";

export const useGroupStore = defineStore('group', {
    state: () => ({
        name: '',
        activeMembers: [],
        member: {
          name: '',
          emoji: '',
        },
        moderator: '',
        initialEmojis: [
          0x1f429,
          0x1f408,
          0x1f98e,
          0x1f98a,
          0x1f43a,
          0x1F98B,
          0x1F6C0,
          0x1F338,
          0x1F480,
          0x1f987,
          0x1f419,
          0x1f483,
          0x1f984,
          0x1f996,
          0x1F574,
          0x1f409,
          0x1f988,
          0x1f985,
          0x1f415,
          0x1f9dc,
        ],
    }),
    getters: {
        activeMembersNames() {
            return this.activeMembers.map(member => member.name);
        },
        isModerator() {
            return this.moderator === this.member.name;
        },
        moderatorEmoji() {
            if (this.member && this.moderator === this.member.name) {
                return 'you';
            } 
            const moderator = this.activeMembers.filter(member => member.name === this.moderator);
            return moderator.length === 0 ? '' : moderator[0].emoji;
        },
        emojisFreeToSet() {
            const chosenEmojis = this.activeMembers.map(member => member.emoji);
            const filtered = [];
            for (let i = 0; i < this.initialEmojis.length; i += 1) {
                if (!chosenEmojis.includes(String.fromCodePoint(this.initialEmojis[i]))) {
                    filtered.push(this.initialEmojis[i]);
                }
            }
            return filtered.map(emoji => String.fromCodePoint(emoji));
        },
    },
    actions: {
        async authenticate(payload) {
            try {
              await GroupService.authenticate(payload);
              this.setName(payload.name);
              socket.connect();
              socket.emit('getInitialState', { name: payload.name });
              return { success: true };
            } catch (err) {
              throw err;
            }
          },
        
        async createGroup(payload) {
            try {
                await GroupService.create(payload);
                this.setName(payload.name);
                socket.connect();
                socket.emit('getInitialState', { name: payload.name });
                return { success: true };
            } catch (err) {
                throw err;
            }
        },
    
        addMember(payload) {
            const { name, emoji } = payload;
            socket.emit('setMember', {
                name,
                emoji,
            }); // only this socket
            sessionStorage.setItem('username', name);
            sessionStorage.setItem('userEmoji', emoji);
            this.setMember({ name, emoji });
            socket.emit('addMember', { name, emoji });
        },
    
        async resetState() {
            try {
                await GroupService.logout();
                this.removeMember({ name: this.member.name });
                socket.disconnect();
                sessionStorage.clear();
            } catch (err) {
                throw err;
            }
        },
    
        socketConnect() {
            console.log('hey')
            this.persist();
        },
    
        socketReconnecting() {
            this.persist();
        },
    
        socketSetInitialStateSocket(payload) {
            console.log('initial state', payload)
            const messagesStore = useMessagesStore()
            const mainplaylistStore = useMainPlaylistStore()
            this.setInitialState(payload.group);
            messagesStore.setMessages({ messages: payload.group.messages });
            mainplaylistStore.setOngoingPlaylist(payload.group.ongoingPlaylist);
        },
    
        socketSetModerator(payload) {
            this.setModerator({ name: payload.name });
        },
    
        socketAddMember(payload) {
            this.setActiveMembers({ name: payload.name, emoji: payload.emoji });
        },
    
        socketSetMember(payload) {
            // only to this socket
            this.setMember({ name: payload.name, emoji: payload.emoji });
        },
    
        socketRemoveMember(payload) {
            this.removeMember({ name: payload.client });
        },

        setName(name) {
            console.log('name')
            this.name = name;
        },
        setModerator(payload) {
            this.moderator = payload.name;
        },
        setActiveMembers(payload) {
            this.activeMembers = [
                ...this.activeMembers,
                { name: payload.name, emoji: payload.emoji },
            ];
        },
        setMember(payload) {
            this.member = payload;
        },
        removeMember(payload) {
            this.activeMembers = this.activeMembers.filter(
                member => member.name !== payload.name,
            );
        },
        setInitialState(payload) {
            this.activeMembers = payload.activeMembers;
            this.moderator = payload.moderator;
        },
        resetState() {
            this.activeMembers = [];
            this.name = '';
            this.member = {
                name: '',
                emoji: '',
            };
            this.moderator = '';
        },
        async persist() {
            try {
              const { data } = await GroupService.isLoggedIn();
              if (data.success) {
                const group = data.group;
                const username = sessionStorage.getItem('username');
                const userEmoji = sessionStorage.getItem('userEmoji');
                if (!group || !username || !userEmoji) {
                  return;
                }
                console.log(group)
                this.setName(group);
                socket.emit('getInitialState', { name: group });
                socket.emit('setMember', { name: username, emoji: userEmoji }); // only this socket
                this.setMember({ name: username, emoji: userEmoji });
                socket.emit('addMember', { name: username, emoji: userEmoji });
              }
            } catch (err) {
              console.log(err);
            }
          },
    },
})

// const persist = async () => {
//     try {
//       const { data } = await GroupService.isLoggedIn();
//       if (data.success) {
//         const group = data.group;
//         const username = sessionStorage.getItem('username');
//         const userEmoji = sessionStorage.getItem('userEmoji');
//         if (!group || !username || !userEmoji) {
//           return;
//         }
//         console.log(group)
//         this.setName(group);
//         socket.emit('getInitialState', { name: group });
//         socket.emit('setMember', { name: username, emoji: userEmoji }); // only this socket
//         this.setMember({ name: username, emoji: userEmoji });
//         socket.emit('addMember', { name: username, emoji: userEmoji });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };