import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { postData } from '../../utils/api'

import "./styles.css"

export default function Landing() {
    const [error, setError] = useState('')
    const [pinText, setPinText] = useState('')
    const [nameText, setNameText] = useState('')

    const navigate = useNavigate()

    async function submitPin() {
        if (pinText.length !== 36) {
            setError('Please enter a valid pin')
            return
        }
        if (nameText.length === 0) {
            setError('Please enter a name')
            return
        }
        const data = {
            pinNumber: pinText
        }

        const res = await postData('player-join', data)

        if (res.success) {
            sessionStorage.setItem('pinNumber', pinText)
            sessionStorage.setItem('name', nameText)
            navigate("/game")
        } else {
            setError(res.message)
        }
    }

    function login() {
        sessionStorage.removeItem('pinNumber')
        sessionStorage.removeItem('name')
        navigate("/auth")
    }

    return (
        <div className="landing">
            <div className="title">
                Cahut
            </div>
            <div className="text-input" >
                <textarea
                    placeholder="Enter PIN..."
                    value={pinText}
                    onChange={e => setPinText(e.target.value)}
                    autoFocus={true}
                    maxLength={36}
                />
                <textarea
                    placeholder="Enter Name..."
                    value={nameText}
                    onChange={e => setNameText(e.target.value)}
                    autoFocus={false}
                    maxLength={10}
                />
            </div>
            <div className="error-message">
                {error}
            </div>
            <div className="submit-pin">
                <button
                    style={{
                        width: '30vw',
                        fontSize: '3vh',
                        height: '10vh',
                    }}
                    onClick={submitPin}>
                    Join Room
                </button>
            </div>
            <div className="login">
                Want to create a game? &nbsp;
                <a onClick={login}>Log in</a>;
            </div>
        </div>
    )
}

