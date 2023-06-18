import socketIOClient from "socket.io-client"
import React, { useState, useEffect, useRef } from 'react'
import messages from "../../../../constants/messages.json"
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { setId, setPinNumber } from '../../utils/slices/sessionSlice'
import { getData, postData } from '../../utils/api'

import "./styles.css"

export default function Landing() {
    const [error, setError] = useState('')
    const [pinText, setPinText] = useState('')
    const [nameText, setNameText] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function submitPin() {
        const data = {
            pinNumber: pinText
        }

        const res = await postData('player-join', data)

        if (res.success) {
            dispatch(setPinNumber(res.pinNumber))
            navigate("/game")
        } else {
            setError(res.message)
        }
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
                    maxLength={10}
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
                    onClick={submitPin}>
                    Join Room
                </button>
            </div>
            <div className="login">
                Want to create a game? &nbsp;
                <a href={'/auth'}>Log in</a>;
            </div>
        </div>
    )
}

