import { useContext } from 'react'
 import { GlobalStoreContext } from '../store'

 function DeleteSongModal() {
     const { store } = useContext(GlobalStoreContext);

     let name = "";
     let currList = store.currentList;
     if (currList != null) {
         let index = store.markedSong;
         if (currList.songs[index] != null) {
            name = currList.songs[index].title;
         }
     }

     function handleCloseModal(event) {
         store.hideDeleteSongModal();
     }
     function handleDeleteSong(event) {
         store.addRemoveSongTransaction();
     }
     return (
         <div
             id="delete-song-modal"
             className={"modal"}
             data-animation="slideInOutLeft">
             <div className="modal-root modal-dialog" id='verify-delete-song-dialog'>
                 <div className="modal-north dialog-header ">
                 Delete {name}?
                 </div>
                 <div className="modal-center">
                     <div className="modal-center-content">
                         Are you sure you wish to permanently delete <b>{name}</b> from this playlist?
                     </div>
                 </div>
                 <div className="modal-south">
                     <input type="button" id="delete-song-confirm-button" className="modal-button" onClick={handleDeleteSong} value='Confirm' />
                     <input type="button" id="delete-song-cancel-button" className="modal-button" onClick={handleCloseModal} value='Cancel' />
                 </div>
             </div>
         </div>
     );
 }

 export default DeleteSongModal;