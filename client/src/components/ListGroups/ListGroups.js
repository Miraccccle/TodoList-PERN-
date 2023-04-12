import ListHeader from "../ListHeader";
import ListItem from "../ListItem";
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'


const ListGroups = ({group, getGroup}) => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const authToken = cookies.AuthToken
    const [ tasks, setTasks ] = useState(null)
  
  
    const getData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/todos/${group.id}`)
        const json = await response.json()
        setTasks(json)
      } catch (err) {
        console.error(err)
      }
    }
    useEffect(() =>{
      if(authToken) { 
        getData()
      }
    }, [])
  

  
    //Sort by date
  
    const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
      <>
        <div className="group">
        <ListHeader listName={group.name} getData={getData} group_id={group.id} group={group} getGroup={getGroup}/>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task = {task} getData={getData} group_ids={group.id} getGroup={getGroup}/>)}
      </div>
      </>
    )
}

export default ListGroups;
