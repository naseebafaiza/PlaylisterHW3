import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

 function EditSongModal() {
     const { store } = useContext(GlobalStoreContext);

     function handleCloseModal(event) {
         store.hideEditSongModal();
     }
     function handleEditSong(event) {
         store.addEditSongTransaction();
     }

     return(
         <div
             class = "modal"
             id="edit-song-modal"
             data-animation="zoomInOut">
                 <div class="modal-root">
                     <div class="modal-north modal-dialog">Edit Song</div>
                     <div class="modal-center">
                         <div class="modal-center-content" id='edit-song-modal-center-content'>
                             <div id='title-prompt'>Title: </div><input type="text" id="edit-song-modal-title"></input>
                             <div id='artist-prompt'>Artist: </div><input type="text" id="edit-song-modal-artist"></input>
                             <div id='you-tube-id-prompt'>YouTube ID: </div><input type="text" id="edit-song-modal-youTubeId"></input>
                         </div>
                     </div>
                     <div class="modal-south">
                         <input type="button" 
                             id="edit-song-confirm-button" 
                             class="modal-button" 
                             onClick={handleEditSong}
                             value='Confirm' />
                         <input type="button" 
                             id="edit-song-cancel-button" 
                             class="modal-button" 
                             onClick={handleCloseModal}
                             value='Cancel' />
                     </div>
                 </div>
         </div>
     )
 }

 export default EditSongModal;