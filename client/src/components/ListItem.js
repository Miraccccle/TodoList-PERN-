import { useState } from 'react';
import ProgressBar from './ProgressBar'
import TickIcon from './TickIcon'
import Modal from './Modals/Modal';
import './style/listItem.css'
import { useCookies } from 'react-cookie';
import {BsStar} from 'react-icons/bs';
import {AiFillStar} from 'react-icons/ai'
import {AiOutlinePlus, AiOutlineClose, AiOutlineArrowRight, AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai'


const ListItem = ({task, getData, group_ids}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [showModal, setShowModal] = useState(false)
  const [data, setData] = useState({
    user_email: cookies.Email,
    title: task.title,
    progress: task.progress,
    date: task.date,
    group_id: group_ids,
    important: task.important
  })
  const editData = async(e) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, 
      {
      method: 'PUT',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(data)
    })
    if(response.status === 200) {
      console.log("WORKED")
      setShowModal(false)
      getData()
    }
    } 
    catch (err) {
      console.error(err)
    }
  }


  const deleteItem = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, {
        method: 'DELETE'
      })
      if (response.status === 200) {
        getData()
      }
    } catch (err) {
      console.error(err)
    }
  }
  const toogleImportant = () => {
    if(data.important === 0) {
      data.important = 1
    }
      else {
        data.important = 0
      }
      
      editData()
  }
  
  
    return (
      
      <li className="list-item">
        <div className="info-container">
        {data.important === 0 && <BsStar className={'star'} onClick={(toogleImportant)}/>}
        {data.important === 1 && <AiFillStar className={'star'} onClick={(toogleImportant)}/>}
          <p className="task-title">{task.title}</p>
        </div>
        <div className='rightCont'>
        <ProgressBar progress={task.progress}/>
        <div className='button-container'>
        
          
        <AiOutlineEdit  className='edit' onClick={() => setShowModal(true)}>EDIT</AiOutlineEdit>
        <AiOutlineDelete className='delete' onClick={deleteItem}>DELETE</AiOutlineDelete>
        </div>
        </div>
        {showModal && (<Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task} group_ids={group_ids}/>
        
        )}
       
      </li>
    );
  }
  
  export default ListItem;
  