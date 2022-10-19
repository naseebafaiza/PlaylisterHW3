import jsTPS_Transaction from "../common/jsTPS.js"

 export default class RemoveSongTransaction extends jsTPS_Transaction {
     constructor(initStore) {
         super();
         this.store = initStore;
         this.index = this.store.markedSong;
         this.title = this.store.currentList.songs[this.index].title;
         this.artist = this.store.currentList.songs[this.index].artist;
         this.youTubeId = this.store.currentList.songs[this.index].youTubeId;

     }
     doTransaction() {
         this.store.removeSongAt(this.index);
     }
     undoTransaction() {
         this.store.addSongAt(this.index, {
             title: this.title,
             artist: this.artist,
             youTubeId: this.youTubeId
         });
     }
 }