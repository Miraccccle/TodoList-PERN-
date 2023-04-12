import ListHeaderFold from "../ListHeaderFold";
import ListItem from "../ListItem";
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'


const ListGroupsCompleted = ({userEmail}) => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const authToken = cookies.AuthToken
 
    const [ completed, setCompleted] = useState(null)
    const [ ismod, setMod] = useState(true)
    const [ group_ids, setgroup_ids] = useState(null)
  
  
    const getCompleted = async () => {
      try {
        const response = await fetch(`http://localhost:8000/completed/${userEmail}`)
        const json = await response.json()
        console.log(json)
        setCompleted(json)
      } catch (err) {
        console.error(err)
      }
    }
    useEffect(() =>{
      if(authToken) { 
        getCompleted()
      }
    }, [])
  

  
    //Sort by date
  
    const sortedTasks = completed?.sort((a, b) => new Date(a.date) - new Date(b.date))
    //
    
   
    return (
      <>
        <div className="group">
        <ListHeaderFold listName={"Completed"} getData={getCompleted} group_id={group_ids} ismod={ismod}/>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task = {task} getData={getCompleted} group_ids={task.group_id}/>)}
      </div>
      </>
    )
}

export default ListGroupsCompleted;
