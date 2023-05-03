import { defineStore } from 'pinia'
import GroupService from '../services/group.service';
import { useMainPlaylistStore } from './mainplaylist';
import { useMessagesStore } from './messages';

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
            const moderator = this.activeMembers.filter(member => member.name === moderator);
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
              this.setName({ name: payload.name });
            //   vue.$socket.connect();
            //   vue.$socket.emit('getInitialState', { name: payload.name });
              return { success: true };
            } catch (err) {
              throw err;
            }
          },
        
        async createGroup(payload) {
            try {
                await GroupService.create(payload);
                this.setName({ name: payload.name });
                // vue.$socket.connect();
                // vue.$socket.emit('getInitialState', { name: payload.name });
                return { success: true };
            } catch (err) {
                throw err;
            }
        },
    
        addMember(payload) {
            const { name, emoji } = payload;
                // vue.$socket.emit('setMember', {
                //     name,
                //     emoji,
                // }); // only this socket
            sessionStorage.setItem('username', name);
            sessionStorage.setItem('userEmoji', emoji);
            this.setMember({ name, emoji });
            // vue.$socket.emit('addMember', { name, emoji });
        },
    
        async resetState() {
            try {
                await GroupService.logout();
                this.removeMember({ name: this.member.name });
                // vue.$socket.disconnect();
                sessionStorage.clear();
            } catch (err) {
                throw err;
            }
        },
    
        SOCKET_connect() {
            persist();
        },
    
        SOCKET_reconnecting() {
            persist();
        },
    
        SOCKET_setInitialState(payload) {
            const messagesStore = useMessagesStore()
            const mainplaylistStore = useMainPlaylistStore()
            this.setInitialState(payload.group);
            messagesStore.setMessages({ messages: payload.group.messages });
            mainplaylistStore.setOngoingPlaylist(payload.group.ongoingPlaylist);
        },
    
        SOCKET_setModerator(payload) {
            this.setModerator({ name: payload.name });
        },
    
        SOCKET_addMember(payload) {
            this.setActiveMembers({ name: payload.name, emoji: payload.emoji });
        },
    
        SOCKET_setMember(payload) {
            // only to this socket
            this.setMember({ name: payload.name, emoji: payload.emoji });
        },
    
        SOCKET_removeMember(payload) {
            this.removeMember({ name: payload.client });
        },

        setName(payload) {
            this.name = payload.name;
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
    },
})

const persist = async () => {
    try {
      const { data } = await GroupService.isLoggedIn();
      if (data.success) {
        const group = data.group;
        const username = sessionStorage.getItem('username');
        const userEmoji = sessionStorage.getItem('userEmoji');
        if (!group || !username || !userEmoji) {
          return;
        }
        this.setName({ name: group });
        // vue.$socket.emit('getInitialState', { name: group });
        // vue.$socket.emit('setMember', { name: username, emoji: userEmoji }); // only this socket
        this.setMember({ name: username, emoji: userEmoji });
        // vue.$socket.emit('addMember', { name: username, emoji: userEmoji });
      }
    } catch (err) {
      console.log(err);
    }
  };