import React from 'react';

import {ImCheckmark} from "react-icons/im";
import {BsQuestionCircle} from "react-icons/bs";
import {FiSettings} from "react-icons/fi"
import {CgProfile} from 'react-icons/cg'
import {AiOutlinePlus, AiOutlineClose, AiOutlineArrowRight, AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai'
import {RiMenuFoldLine, RiMenuUnfoldLine, RiLogoutBoxRLine} from "react-icons/ri";
import {BsSun, BsStar, BsCheckAll} from 'react-icons/bs';
import {FaRegFolderOpen} from 'react-icons/fa'
import {CgDarkMode} from 'react-icons/cg'

import { useState } from 'react';
import {useCookies} from 'react-cookie'
import { Link } from 'react-router-dom'

import './style/header.css';
import './style/Nawbar1.css';
import ModalGroupCreate from './Modals/ModalGroupCreate';




const AppHeader = ({userEmail, getGroup, groups, myDay, isDark, toogleDark}) => {

    const [isProfile, setProfile] = useState("false");
    const [isRefernce, setRefernce] = useState("false");
    const [isSettings, setSettings] = useState("false");
    const [isMenu, setMenu] = useState("false");
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [showModal, setShowModal] = useState(false)
    const [mode, setMode] = useState(false)


const sortedGroups = groups?.sort((a, b) => new Date(a.date) - new Date(b.date))
const sortedMyday = myDay?.sort((a, b) => new Date(a.date) - new Date(b.date))




    const toggleProfile = () => {
        setProfile(!isProfile);
        if(!isRefernce || !isSettings) {
            setRefernce(true)
            setSettings(true)
        }
    };

    const toggleRefernce = () => {
        setRefernce(!isRefernce);
        if(!isProfile || !isSettings) {
            setProfile(true)
            setSettings(true)
        }
    };


    const toggleSettings = () => {
        setSettings(!isSettings);
        if(!isRefernce || !isProfile) {
            setRefernce(true)
            setProfile(true)
        }
    };

    const toggleMenu = () => {
        setMenu(!isMenu);
    };

    const logout = () => {
        console.log('signout')
        removeCookie('Email')
        removeCookie('AuthToken')
        window.location.reload()
    }

    const deleteItem = async (group) => {
        try {
          const response = await fetch(`http://localhost:8000/groups/${group.id}`, {
            method: 'DELETE'
          })
          if (response.status === 200) {
            getGroup()
          }
        } catch (err) {
          console.error(err)
        }
      }
   



    return (
        <>
        <div className="header">
            <div className="title">
            <Link to={'/'}>
                <div className={'headerBegin'}>
                    <ImCheckmark className="mark"/>
                    <a href="">To Do</a>
                </div>
                </Link>
                <div className={'headerEnd'}>
                    <div className={'setCont'}>
                        <FiSettings onClick={toggleSettings} className={'set'} title={"Settings"}/>
                    </div>
                    <div className={'quesCont'}>
                    <BsQuestionCircle onClick={toggleRefernce} className={'ques'} title={"Reference"}/>
                    </div>
                    <div className={'proCont'}>
                        <CgProfile onClick={toggleProfile} className={'profile'} title={"Profile"}/>
                    </div>
                </div>
            </div>
            {/*<div className={'setBlock'}>*/}
            {/*    <div className={'text'}>*/}
            {/*        <h1>kkdnsf</h1>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>

        <div className={'page'} style={{ display: "flex" }}>
            <RiMenuUnfoldLine className={isMenu? 'menuUnfoldline' : 'menuUnfoldline active'} onClick={toggleMenu}/>
            <div className={isMenu? "nawbar" : "nawbar active"}>
                <div className={'menu'}>
                    <RiMenuFoldLine className={'menufoldline'} onClick={toggleMenu}/>
                </div>
                <div className={'todo'}>
                <Link to={'/'} style={{textDecoration: "none"}}>
                    <div className={'todayToolbar'}>
                        <BsSun className={'sun'}/>
                            <p className={'text'}>My day</p>
                    </div>
                    </Link>
                    <Link to={'important'} style={{textDecoration: "none"}}>
                    <div className={'important'}>
                        <BsStar className={'star'}/>
                        <p className={'text'}>Important</p>
                    </div>
                    </Link>
                    <Link to={'completed'} style={{textDecoration: "none"}}>
                    <div className={'toolbar'}>
                        <BsCheckAll className={'all'} />
                        <p className={'text'}>Сompleted</p>
                    </div>
                    </Link>
                    <Link to={'all'} style={{textDecoration: "none"}}>
                    <div className={'toolbar'}>
                        <FaRegFolderOpen className={'folder'}/>
                        <p className={'text'}>All</p>
                    </div>
                    </Link>
                    <div className={'sidebar'}></div>
                </div>
                <div className={'mytodo'}>
                    <div className={'createTodo'} onClick={() => (setShowModal(true), setMode(true))}>
                        <>
                        <AiOutlinePlus className={'plus'} /><p className={'createText'} >Create todo</p>
                        </>
                    </div>
                </div>
                
                <div className={'todo'}>
                {sortedGroups?.map((group) => 
                <>
                    <div className={'toolbar'}>
                    <Link to={group.name} style={{textDecoration: "none"}}>
                        <div className='TextCr'>
                        <FaRegFolderOpen className={'folder'}/>
                        <p className={'text'}>{group.name}</p>
                        </div>
                        </Link>
                        <div className='update'>
                        <AiOutlineDelete className='delete' onClick={() => deleteItem(group)} />
                        </div>
                    </div>
                    </>  
                )}
                </div>

                
            </div>
            <div className={isSettings ? 'setBlock': "setBlock active"}>
                <div className={'setbar'}>
                    <p className={'Rheader'}>Setting</p>
                    <div className={'closeCont'}>
                        <AiOutlineClose className={'close'} onClick={toggleSettings}/>
                    </div>
                </div>
                <div className={'Rsidebar'}></div>
                <div className={'Rtoolbar'}>
                    <p className={'Rtext'}>Dark Mode</p>
                    <CgDarkMode className={'dark'} onClick={toogleDark}/>
                </div>
                <div className={'Rtoolbar'}>
                    <p className={'Rtext'}>Password</p>
                </div>
                <div className={'underline'}>
                    <a href={'#'} className={'undertext'}>Сhange password</a>
                    <AiOutlineArrowRight className={'arrow'}/>
                </div>
            </div>
            <div className={isRefernce ? 'reference': "reference active"}>
                <div className={'setbar'}>
                    <p className={'Rheader'}>Reference</p>
                    <div className={'closeCont'}>
                        <AiOutlineClose className={'closedd'} onClick={toggleRefernce}/>
                    </div>
                </div>
                <div className={'Rsidebar'}></div>
                <div className={'Rtoolbar'}>
                    <p className={'Rtext'}>Team:</p>
                </div>
                <div className={'teamate'}>
                    <p className={'teamtext'}>Miras</p>
                    <p className={'teamtext'}>Arsen</p>
                    <p className={'teamtext'}>Guliza</p>
                </div>
            </div>
            <div className={isProfile ? "proBlock" : "proBlock active"}>
                <div className={'setbar'}>
                    <p className={'Rheader'}>Profile</p>
                    <div className={'closeCont'}>
                        <AiOutlineClose className={'closepp'} onClick={toggleProfile}/>
                    </div>
                </div>
                <div className={'Rsidebar'}></div>
                <div className={'Rtoolbar'}>
                    <p className={'Rtext'}>Email:</p>
                </div>
                <div className={'underline'}>
                    <a href={'#'} className={'undertext'}>{userEmail}</a>
                </div>
                <div className={'Ptoolbar'} onClick={logout}>
                    <a href={'#'} className={'logout'} >Log out</a>
                    <RiLogoutBoxRLine className={'out'}/>
                </div>
            </div>
            
            {mode && showModal && <ModalGroupCreate setShowModal={setShowModal} getGroup={getGroup} userEmail={userEmail}/>}
            
            
        </div>
        </>
    )
}

export default AppHeader;
//{sortedGroups?.map((group) =><ListGroups group={group} key = {group.id} getGroup={getGroup}/>)}