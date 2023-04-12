import { useState } from 'react'
import { useCookies } from 'react-cookie';
import '../style/modal.css'

const ModalGroupCreate = ({setShowModal, getGroup, userEmail}) => {
  const [data, setData] = useState({
    user_email: userEmail,
    name: null,
    date: new Date(),
  })


  const postData = async (e) => {
    e.preventDefault()
    try
    {
      const response = await fetch('http://localhost:8000/groups', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)

      })
      console.log(response.status)
      if(response.status === 200) {
        console.log("WORKED")
        setShowModal(false)
        getGroup()
      }
    }
    catch(err) {
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
            <h3>Let's create your todo table</h3>
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
          <input className='create' type="submit" value="SAVE" onClick={postData}/>
          </form>
        </div>
      </div>
    );
  }
  
  export default ModalGroupCreate;