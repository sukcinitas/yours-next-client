# Yours Next

An application to create shared playlists, play videos in embedded Youtube video player and to chat in real-time using socket.io.
You can take a look at the application demo [here](http://yours-next.herokuapp.com/#/) (it might take ~ 10 seconds for this sleeping app on Heroku to wake up).

https://github.com/sukcinitas/media/blob/master/yn/yn-1.gif
https://github.com/sukcinitas/media/blob/master/yn/yn-2.gif

---

## Technologies & methodologies

#### Front-end

- JavaScript
- Vue, Vuex, Vue Router
- VueYoutube
- Socket.io-client, Vue-socket.io
- Axios
- Font Awesome
- Sass (SCSS syntax)
- BEM naming methodology

#### Back-end [yours-next-server](https://github.com/sukcinitas/yours-next-server)

##### APIs

- Youtube IFrame Player API
- Youtube Data API

##### Bundling & compiling

- Webpack 5
- Babel

---

## Setup

You can find setup information in [yours-next-server](https://github.com/sukcinitas/yours-next-server) repository.

---

## User stories

- As a user, I can create a group by entering a name and a passcode. Group's name must be unique and a passcode must be at least 8 characters long.
- As a user, I can join a group already created by me/another user by entering the group's name and its passcode.
- As a user, after creating or joining a group, I can create a temporary (one login duration) member profile by entering my name/nickname and choosing an emoji. My name/nickname must be unique and I can choose an emoji not already in use from the ones provided. As a member, I have an access to group's playlists and chat.
- As a member, in a group's main page I can create a playlist by providing a name. A name must be unique (case sensitive). After creating a playlist, I am redirected to newly created playlist's page.
- As a member, in a playlist page I can see Youtube player and a list of playlist items. I can control the player using controls provided by Youtube Iframe Player API; options to play a previous or a next video are controlled by custom controls. I can choose to play a specific video by clicking on its name in an items list. Data of 5 videos is loaded at a time, but I can load data of more videos. An automatic loading occurs if a played video is not within the loaded ones.
- As a member, I can watch an ongoing playlist. I can pause/play it, which causes pause and play event for all members watching an ongoing playlist in real-time. On my enter, ongoing playlist is synchronized for all members in an ongoing playlist page.
- As a member, I can search for videos in a search page by a search phrase or by a playlist id. Searching by channel id provides a list of playlists I can further explore.
- As a member, I can add videos to a playlist in a search page. Playlist items are updated for all members in real-time.
- As a member, I can send messages to other members in a group's main page. Messages are updated in real-time. Chat data is not saved remotely; after all members have left the group's room, chat data is gone.
- As a user, if I am the first member to join the group's room, I automatically become a moderator. A moderator has access to additional functionalities.
- As a moderator, I can hand over my moderator title to another member by double clicking on his emoji. If I leave the group's room as a moderator, the priveleges are passed automatically to the first member to join the group's room after me.
- As a moderator, I can delete a playlist in a group's main page. A list of playlists is updated to all members in real-time.
- As a moderator, I can remove a video from a playlist in a playlist page. Items of a playlist are updated to all members in real-time.
- As a moderator, I can set an ongoing playlist in a playlist page. After setting an ongoing playlist, I am redirected to it, at the same time a link to it is created for all members in real-time. An ongoing playlist is different from a regular playlist in a way that it allows video synchronization for all members watching it. As a moderator, I am the only one who can play previous or next videos, but every member of the group can pause/unpause it. An ongoing playlist is unset for all members in real-time as soon as I leave its page.
