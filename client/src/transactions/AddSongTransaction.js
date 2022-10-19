import jsTPS_Transaction from "../common/jsTPS.js"

 export default class AddSongTransaction extends jsTPS_Transaction {
     constructor(initStore) {
         super();
         this.store = initStore;
     }
     doTransaction() {
         this.store.addSong();
     }
     undoTransaction() {
        let currList = this.store.currentList;
         this.store.removeSongAt(currList.songs.length-1);
     }
 }