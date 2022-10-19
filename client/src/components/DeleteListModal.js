import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    console.log("Delete list modal reached");
    if (store.markForDeletion) {
        name = store.markForDeletion.name;
        console.log("NAME: " + store.markForDeletion.name);
    }

    function handleConfirmDeleteList() {
        console.log("DELETE LIST FUNCTION REACHED");
        store.deleteList(store.markForDeletion._id);
        store.hideDeleteListModal();
    }
    function handleCancelDeleteList() {
        console.log("DELETAE LIST CANCEL BUTTON REACHED");
        store.hideDeleteListModal();
    }
    return (
        <div 
        className="modal"
        id="delete-list-modal"
        data-animation="slideInOutLeft">
        <div className="modal-root modal-dialog" id='verify-delete-list-root'>
            <div className="modal-north dialog-header ">
                Delete the {name} playlist?
            </div>
            <div className="modal-center">
                <div className="modal-center-content">
                    Are you sure you wish to permanently delete the {name} playlist?
                </div>
            </div>
            <div className="modal-south">
                <input type="button" id="delete-list-confirm-button" className="modal-button" onClick={handleConfirmDeleteList} value='Confirm' />
                <input type="button" id="delete-list-cancel-button" className="modal-button" onClick={handleCancelDeleteList} value='Cancel' />
            </div>
        </div>
    </div>
    );
}

export default DeleteListModal;