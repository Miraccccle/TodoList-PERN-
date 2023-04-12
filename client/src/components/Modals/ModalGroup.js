import { useState } from 'react'
import { useCookies } from 'react-cookie';
import '../style/modal.css'

const ModalGroup = ({setShowModal, getGroup, group}) => {
  const [data, setData] = useState({
    user_email: group.user_email,
    name: group.name,
    date: group.date,
  })



  const editData = async(e) => {
    try {
      const response = await fetch(`http://localhost:8000/groups/${group.id}`, 
      {
      method: 'PUT',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(data)
    })
    if(response.status === 200) {
      console.log("WORKED")
      setShowModal(false)
      getGroup()
    }
    } 
    catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setData(data => ({
      ...data,
      [name] : value
    }))

    console.log(data)
  }
    return (
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
            <h3>Let's edit your group</h3>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
          <form>
          <input 
          required
          maxLength={30}
          placeholder=" Youre task goes here"
          name={"name"}
          value={data.name}
          onChange={handleChange}/>
          <br/>
          <input className='edit' type="submit" onClick={editData}/>
          </form>
        </div>
      </div>
    );
  }
  
  export default ModalGroup;