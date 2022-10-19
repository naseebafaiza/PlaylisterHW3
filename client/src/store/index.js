import { createContext, useState, startTransition } from 'react'
import jsTPS from '../common/jsTPS'
import RemoveSongTransaction from '../transactions/RemoveSongTransaction';
import AddSongTransaction from '../transactions/AddSongTransaction';
import MoveSongTransaction from '../transactions/MoveSongTransaction';
import api from '../api'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG: "MARK_SONG",
    DELETE_LIST: "DELETE_LIST",
    EDIT_LIST_CARD: "EDIT_LIST_CARD"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        markForDeletion: null,
        markedSong: -1
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markForDeletion: store.markForDeletion,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markForDeletion: store.markForDeletion,
                    markedSong: -1
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    markForDeletion: store.markForDeletion,
                    markedSong: -1
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markForDeletion: store.markForDeletion,
                    markedSong: -1
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markForDeletion: payload,
                    markedSong: -1
                });
            }
            // Delete a list
            case GlobalStoreActionType.DELETE_LIST:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter - 1,
                    listNameActive: false,
                    markForDeletion: null,
                    markedSong: -1
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markForDeletion: store.markForDeletion,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    markForDeletion: null
                });
            }

            case GlobalStoreActionType.EDIT_LIST_CARD:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markForDeletion: null,
                    markedSong: -1
                });
            }
            case GlobalStoreActionType.MARK_SONG: {
                return setStore ({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markForDeletion: null,
                    markedSong : payload
                })
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // This function processes adding a new list

    store.createNewList = function(){
        async function asyncCreatePlaylist(){
            console.log("In asyn create new list function");
            let response = await api.createNewList();
            if (response.data.success){
                let playlistId = response.data.playlist._id; // param for setting here
                async function asyncSetCurrentList(id){ // line 200
                    let response = await api.getPlaylistById(id);
                    if(response.data.success){
                        let playlist = response.data.playlist;
                        if (response.data.success) {
                            storeReducer({
                                type: GlobalStoreActionType.CREATE_NEW_LIST,
                                payload: playlist
                            });
                            store.history.push("/playlist/" + playlist._id); // add to store
                        } 
                    } 
                } asyncSetCurrentList(playlistId);
            }
            else {
                console.log("API FAILED TO CREATE A NEW LIST");
            }
        } asyncCreatePlaylist();
    }

    // add song stuff
    store.addSong = function(){
        console.log("ADD SONG FUNCTZION REACHED");
        let currentList = store.currentList;
        console.log("CURRENT LISTY LOOKS LIKE : " + currentList);
        console.log("SIZE OF LIST: " + store.currentList.songs.length);
        let newSong = {title:"Untitled", artist:"Unknown", youTubeId:"dQw4w9WgXcQ"};
        currentList.songs.push(newSong); // new song added to curr list
        async function reloadList(currentList){
            let response = await api.editPlaylist(currentList._id, currentList);
            if(response.data.success){
                storeReducer({type: GlobalStoreActionType.SET_CURRENT_LIST, 
                    payload: currentList,
                })
            }

        } reloadList(currentList);
    }

    // moving song
    store.moveSong = function(sourceId,targetId){
        let currlist = store.currentList;
        if(sourceId < targetId){
            let tempList = currlist.songs[sourceId];
            for (let i = sourceId; i < targetId; i++) {
                currlist.songs[i] = currlist.songs[i + 1];
            }
            currlist.songs[targetId] = tempList;
        }
        else if (sourceId>targetId){
            let tempList = currlist.songs[sourceId];
            for (let i = sourceId; i > targetId; i--) {
                currlist.songs[i] = currlist.songs[i - 1];
            }
            currlist.songs[targetId] = tempList;
        }
        async function reloadList(currlist){
            console.log("CURRENT LISTA LOOKIN LIKE: " + currlist);
            let response=await api.editPlaylist(currlist._id,currlist);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.EDIT_LIST_CARD,
                    payload:currlist,
                })
            }
        }reloadList(currlist);
    }

    // delete song & transaction
    store.addSongAt = function (index, song) {
        console.log("ADD SONG AT FUNCTION REACHED");
        if (store.currentList != null) {
            async function asyncAddSongAt(index, song) {
                let response = await api.getPlaylistById(store.currentList._id);
                if (response.data.success) {
                    let playlist = response.data.playlist;
                    playlist.songs.splice(index, 0, song);
                    async function updateList(playlist) {
                        response = await api.editPlaylist(playlist._id, playlist);
                        if (response.data.success) {
                            storeReducer({
                                type: GlobalStoreActionType.EDIT_LIST_ITEM,
                                payload: playlist
                            });
                        }
                    }
                    updateList(playlist);
                }
            }
            asyncAddSongAt(index, song);
            store.history.push("/playlist/" + store.currentList._id);
        }
    }

    store.removeSongAt  = function (index) {
        
        if (store.currentList != null) {
            async function asyncRemoveSongAt(index) {
                let response = await api.getPlaylistById(store.currentList._id);
                if (response.data.success) {
                    let playlist = response.data.playlist;
                    playlist.songs.splice(index, 1)
                    async function updateList(playlist) {
                        response = await api.editPlaylist(playlist._id, playlist);
                        if (response.data.success) {
                            storeReducer({
                                type: GlobalStoreActionType.EDIT_LIST_ITEM,
                                payload: playlist
                            });
                        }
                    }
                    updateList(playlist);
                }
            }
            asyncRemoveSongAt(index);
            
            store.history.push("/playlist/" + store.currentList._id);
        }
    }

    store.markSong = function(id) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: id
        })
        store.showDeleteSongModal();
    }
    store.showDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }
    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }

    // delete list stuff

    store.deleteList = function (id) {
        console.log("reached delete list function. Id: " + id);
        
        async function asyncDeleteList(id){
            let response = await api.deleteListById(id);
            if(response.data.success){
                
                    store.loadIdNamePairs();
                    store.history.push('/');
            } 
        } asyncDeleteList(id);
    }

    store.markListForDeletion = function (id) {
        console.log("MARKLISTFORDELETION FUNCTION here's id : " + id.name)
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: id
        });
        store.showDeleteListModal();
    }

    store.deleteMarkedList = function() {
        store.deleteList(store.markForDeletion._id);
        store.hideDeleteListModal();
    }

    store.showDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    store.hideDeleteListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.editPlaylist(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.history.push("/");
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.addAddSongTransaction = function() {
        console.log("ADD song trans");
        let transaction = new AddSongTransaction(store);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function(to, from) {
        let transaction = new MoveSongTransaction(store, to, from);
        tps.addTransaction(transaction);
    }
    store.addRemoveSongTransaction = function() {
        let transaction = new RemoveSongTransaction(store);
        store.hideDeleteSongModal();
        tps.addTransaction(transaction);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}