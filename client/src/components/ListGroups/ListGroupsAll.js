import ListHeaderFold from "../ListHeaderFold";
import ListItem from "../ListItem";
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'


const ListGroupsAll= ({userEmail}) => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const authToken = cookies.AuthToken
 
    const [ all, setAll] = useState(null)
    const [ ismod, setMod] = useState(true)
    const [ group_ids, setgroup_ids] = useState(null)
  
  
    const getAll = async () => {
      try {
        const response = await fetch(`http://localhost:8000/all/${userEmail}`)
        const json = await response.json()
        console.log(json)
        setAll(json)
      } catch (err) {
        console.error(err)
      }
    }
    useEffect(() =>{
      if(authToken) { 
        getAll()
      }
    }, [])
  

  
    //Sort by date
  
    const sortedTasks = all?.sort((a, b) => new Date(a.date) - new Date(b.date))
    //
    
   
    return (
      <>
        <div className="group">
        <ListHeaderFold listName={"All"} getData={getAll} group_id={group_ids} ismod={ismod}/>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task = {task} getData={getAll} group_ids={task.group_id}/>)}
      </div>
      </>
    )
}

export default ListGroupsAll;
