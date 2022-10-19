import jsTPS_Transaction from "../common/jsTPS.js"

 export default class MoveSongTransaction extends jsTPS_Transaction {
     constructor(initStore, oldIndex, newIndex) {
         super();
         this.store = initStore;
         this.oldIndex = oldIndex;
         this.newIndex = newIndex;
     }
     doTransaction() {
         this.store.moveSong(this.oldIndex, this.newIndex);
     }
     undoTransaction() {
         this.store.moveSong(this.newIndex, this.oldIndex);
     }
 }