import {useState} from 'react';
import { useCookies } from 'react-cookie';
import './style/listHeader.css'
import {BsPlusCircle} from 'react-icons/bs';
import {AiOutlineEdit} from 'react-icons/ai'
import ModalGroup from './Modals/ModalGroup';
import Modal from "./Modals/Modal";


const ListHeader = ( {listName, getData, group_id, group, getGroup} ) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState(false)
    return (
      <div className="list-header">
        <h1 className="text">{listName}</h1>
        <div className="button-container">
        
        <AiOutlineEdit className='edit' onClick={() => (setShowModal(true), setMode(false))} />
        <BsPlusCircle className="plus" onClick={() => (setShowModal(true), setMode(true))}>ADD NEW</BsPlusCircle>
        </div>
        {mode && showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData} group_ids={group_id}/>}

        {!mode && showModal && <ModalGroup setShowModal={setShowModal} getGroup={getGroup} group={group}/>}
      </div>
    );
  }
  
  export default ListHeader;
  