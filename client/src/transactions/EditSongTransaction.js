import jsTPS_Transaction from "../common/jsTPS.js"

 export default class EditSongTransaction extends jsTPS_Transaction {
     constructor(initStore) {
         super();
         this.store = initStore;
         this.index = this.store.markedSong;
         this.newTitle = document.getElementById("edit-song-modal-title").value;
         this.newArtist = document.getElementById("edit-song-modal-artist").value;
         this.newYouTubeId = document.getElementById("edit-song-modal-youTubeId").value;
         this.oldTitle = this.store.currentList.songs[this.index].title;
         this.oldArtist = this.store.currentList.songs[this.index].artist;
         this.oldYouTubeId = this.store.currentList.songs[this.index].youTubeId;
     }
     doTransaction(){
         this.store.editSong(this.index, this.newTitle, this.newArtist, this.newYouTubeId);
     }
     undoTransaction(){
         this.store.editSong(this.index, this.oldTitle, this.oldArtist, this.oldYouTubeId)
     }
 }