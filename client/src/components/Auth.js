import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import React from 'react'
import './style/auth.css'

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const [error, setError] = useState(null)


  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }
  const handleSubmit = async (e, endpoint) => {
    e.preventDefault()
    const rgExp = /^[a-zA-Z0-9._]+@[a-z]+\.[a-z]{2,6}$/
    if(!rgExp.test(email)){
      setError('Enter the correct email!')
      return
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Make sure passwords match!')
      return
    }

    const response = await fetch(`http://localhost:8000/${endpoint}`, {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({email, password})
    })
    const data = await response.json()
    if (data.detail) {
      setError(data.detail)
    } else {
      setCookie('Email', data.email)
      setCookie('AuthToken', data.token)

      window.location.reload()
    }
  }

    return (
      <div className="auth-container">
        <div className="auth-container-box">
          <form >
            <h2>{isLogin ? 'Login' : 'Please sign up'}</h2>
          <input className='far' type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
          <input className='far' type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
          {!isLogin && <input type="password" placeholder="confirm password" onChange={(e) => setConfirmPassword(e.target.value)}/>}
          <input type="submit" className="authh" value={"SIGN IN"} onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')}/>
          {error && <p>{error}</p>}
          </form>
          <div className="auth-options">
          <button className="auth-sign"
          onClick={() => viewLogin(false)}
          style={{backgroundColor : !isLogin ? '#A2C0FD' : '#578efa',
          color: 'white',
        }}
          >SIGN UP</button>
          <button className="auth-log" onClick={() => viewLogin(true)}
          style={{backgroundColor : isLogin ? '#A2C0FD' : '#578efa', color: 'white'}}>LOGIN</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Auth;
  