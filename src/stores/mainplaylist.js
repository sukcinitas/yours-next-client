/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import { defineStore } from 'pinia'
import PlaylistService from '../services/playlist.service';
import DataService from '../services/data.service';
import checkIfAuthorizationError from '../util/checkIfAuthorizationError';
import { socket } from "@/socket";

export const useMainPlaylistStore = defineStore('mainplaylist', {
    state: () => ({
        idsArray: [],
        nowPlayingVideoIndex: 0,
        id: '',
        title: '',
        items: [],
        setCount: 0,
        itemCount: 5, // set to whatever you want
        ongoingPlaylist: {
          id: '',
          videoIndex: 0,
          time: 0,
          paused: false,
        },
        userJoined: false,
    }),
    getters: {
      playlist() {
        return this.idsArray;
      },
      length() {
        return this.items.length;
      },
      isMainAnOngoingPlaylist() {
        return this.ongoingPlaylist.id === this.id;
      },
      isOngoingPlaylistPaused() {
        return this.ongoingPlaylist.paused;
      },
      isIndexAheadOfData() {
        const {
          itemCount,
          setCount,
          nowPlayingVideoIndex,
          ongoingPlaylist,
        } = this;
        // if I choose video which data is not loaded yet, I load another set
        // index will always be smaller than item counts if sets are not full
        if (ongoingPlaylist.id) {
          if (ongoingPlaylist.index >= itemCount * setCount) {
            return true;
          }
          return false;
        }
        if (nowPlayingVideoIndex >= itemCount * setCount) {
          return true;
        }
        return false;
      },
    },
    actions: {
        SOCKET_setOngoingPlaylist(payload) {
            this.setOngoingPlaylist({
              id: payload.id,
              videoIndex: payload.videoIndex,
              time: payload.time,
              paused: false,
            });
            if (!payload.id && (/mainplaylist/).test(window.location.hash)) {
              window.history.back();
            }
          },
        
          SOCKET_userJoinsOngoingPlaylist({ rootState }) {
            if (rootState.group.member.name === rootState.group.moderator) {
              this.setUserJoined({ state: true });
            }
          },
        
          SOCKET_changeOngoingPlaylistVideoIndex(payload) {
            this.setOngoingPlaylistVideoIndex({ videoIndex: payload.videoIndex });
            this.setOngoingPlaylistPause({ paused: false });
          },
        
          SOCKET_toggleOngoingPlaylist(payload) {
            this.setOngoingPlaylistPause({ paused: payload.paused });
          },
        
          async SOCKET_updatePlaylist({ rootState }, payload) {
            if (payload.type === 'addition') {
              if (this.items.length < this.setCount * this.itemCount) {
                const itemsData = [...this.items, payload.itemData];
                this.setPlaylist({ items: payload.idsArray });
                this.setItems({ items: itemsData });
              } else {
                this.setPlaylist({ items: payload.idsArray });
              }
            }
            if (payload.type === 'deletion') {
              // if it is a moderator, no need to change index, as it has already been changed
              const needToChangeIndex =
                rootState.group.member.name !== rootState.group.moderator &&
                this.nowPlayingVideoIndex > this.idsArray.indexOf(payload.itemData);
              const index = needToChangeIndex
                ? this.nowPlayingVideoIndex - 1
                : this.nowPlayingVideoIndex;
              const items = payload.idsArray;
              const itemsPreData = this.items.filter(
                item => item.id !== payload.itemData,
              );
              let itemsData;
              // if I have loaded certain sets, I don't hide them;
              // though if set lacks one item, I load it from another set
              if (items.length >= this.setCount * this.itemCount) {
                const { data } = await DataService.getVideos(
                  this.idsArray[this.setCount * this.itemCount],
                );
                const item = data.data.items[0];
                itemsData = [...itemsPreData, item];
              } else {
                itemsData = itemsPreData;
              }
              this.setIdsItemsIndex({ items, itemsData, index });
            }
          },
        
          async getPlaylist(payload) {
            try {
              const { data: { playlist: { items, _id, title } } } = await PlaylistService.get(payload.id);
              this.setPlaylist({ items });
              this.setId({ _id });
              this.setTitle({ title });
              this.resetSetCount();
              this.resetNowPlayingVideoIndex();
              this.setItems({ items: [] });
            } catch (err) {
              checkIfAuthorizationError(err);
              throw err;
            }
          },
        
          async getPlaylistData() {
            try {
              if (this.idsArray.length === this.items.length) {
                return { increaseSetCount: false };
              }
              const idsArrayOfItemCount = this.idsArray
                .slice(
                  this.setCount * this.itemCount,
                  (this.setCount + 1) * this.itemCount,
                )
                .join(',');
              const { data: { data: { items } } } = await DataService.getVideos(idsArrayOfItemCount);
              const itemsData = [...this.items, ...items];
              this.setItems({ items: itemsData });
              return { increaseSetCount: true }; // first time from 0 to 1
            } catch (err) {
              checkIfAuthorizationError(err);
              throw err;
            }
          },
        
          async addItemToPlaylist(payload) {
            try {
              if (this.idsArray.indexOf(payload.item) > -1) {
                throw new Error('Item is already in the playlist!');
              }
              await PlaylistService.add({
                id: payload.id,
                item: payload.item,
              });
              const items = [...this.idsArray, payload.item];
              const datum = await DataService.getVideos(payload.item);
              const itemData = datum.data.data.items[0];
              socket.emit('updatePlaylist', {
                idsArray: items,
                itemData,
                type: 'addition',
                alreadyIn: false,
                id: payload.id,
              });
              return { successMsg: 'Successfully added!' };
            } catch (err) {
              checkIfAuthorizationError(err);
              throw err;
            }
          },
        
          async removeItemFromPlaylist({ videoId, id }) {
            try {
              await PlaylistService.removeItem({
                id,
                items: [videoId],
              });
              const items = this.idsArray.filter(item => item !== videoId);
              return { items };
            } catch (err) {
              checkIfAuthorizationError(err);
              throw new Error('Could not remove item!');
            }
          },
          changeNowPlayingVideoIndex(index) {
            this.nowPlayingVideoIndex = index;
          },
          resetNowPlayingVideoIndex() {
            this.nowPlayingVideoIndex = 0;
          },
          setPlaylist(payload) {
            this.idsArray = payload.items;
          },
          setItems(payload) {
            this.items = payload.items;
          },
          setIdsItemsIndex(payload) {
            this.idsArray = payload.items;
            this.items = payload.itemsData;
            this.nowPlayingVideoIndex = payload.index;
          },
          setId(payload) {
            this.id = payload.id;
          },
          setTitle(payload) {
            this.title = payload.title;
          },
          setOngoingPlaylistPause(payload) {
            this.ongoingPlaylist = Object.assign({}, this.ongoingPlaylist, {
              paused: payload.paused,
            });
          },
          setOngoingPlaylist(payload) {
            this.ongoingPlaylist = payload;
          },
          setOngoingPlaylistVideoIndex(payload) {
            this.ongoingPlaylist = Object.assign({}, this.ongoingPlaylist, {
              videoIndex: payload.videoIndex,
            });
          },
          setUserJoined(payload) {
            this.userJoined = payload.this;
          },
          setSetCount() {
            this.setCount += 1;
          },
          makeSetCount(set) {
            this.setCount = set;
          },
          resetSetCount() {
            this.setCount = 0;
          },
    }
})
