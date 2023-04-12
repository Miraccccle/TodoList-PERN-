import ListHeaderFold from "../ListHeaderFold";
import ListItem from "../ListItem";
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'

const ListGroupsImportant = ({userEmail}) => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const authToken = cookies.AuthToken
 
    const [ important, setImportant] = useState(null)
    const [ ismod, setMod] = useState(true)
    const [ group_ids, setgroup_ids] = useState(null)
  
  
    const getImportant = async () => {
      try {
        const response = await fetch(`http://localhost:8000/important/${userEmail}`)
        const json = await response.json()
        console.log(json)
        setImportant(json)
      } catch (err) {
        console.error(err)
      }
    }
    useEffect(() =>{
      if(authToken) { 
        getImportant()
      }
    }, [])
  

  
    //Sort by date
  
    const sortedTasks = important?.sort((a, b) => new Date(a.date) - new Date(b.date))
    //
    
   
    return (
      <>
        <div className="group">
        <ListHeaderFold listName={"Important"} getData={getImportant} group_id={group_ids} ismod={ismod}/>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task = {task} getData={getImportant} group_ids={task.group_id}/>)}
      </div>
      </>
    )
}

export default ListGroupsImportant;
