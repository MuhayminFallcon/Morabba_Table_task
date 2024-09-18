import { defineStore } from 'pinia'

export const useTextLengthStore = defineStore('textlength', {
  state: () => ({}),
  actions: {
    textLength(text, length) {
      if (text == null || text === '' || undefined) {
        return '';
      }
      return text.length > length ? text.slice(0, length) + '...' : text;
    }
  }
})