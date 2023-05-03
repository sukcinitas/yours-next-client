import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    messages: [],
    messageEmojis: ['😀', '😍', '🤣', '🍕', '👿', '🤘', '😑', '🌈', '🎶', '🍸'],
    isChatTurnedOn: false,
  }),
  getters: {
    chatState() {
      return this.isChatTurnedOn;
    },
  
    messages() {
      return this.messages;
    },
  
    messageEmojis() {
      return this.messageEmojis;
    },
  },
  actions: {
    setMessage({ message, member }) {
        if (this.messages.length === 0) {
          this.messages = [
            ...this.messages,
            { message: [message], member },
          ];
          return;
        }
    
        let lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage.member.name === member.name &&
            lastMessage.member.emoji === member.emoji) {
          const messages = [...this.messages];
          lastMessage = { member, message: [...lastMessage.message, message] };
          messages[messages.length - 1] = lastMessage;
          this.messages = [
            ...messages,
          ];
          return;
        }
    
        this.messages = [
          ...this.messages,
          { message: [message], member },
        ];
      },
    
      setMessages({ messages }) {
        this.messages = messages;
      },
    
      setChatState() {
        this.isChatTurnedOn = !this.isChatTurnedOn;
      },
  }
})