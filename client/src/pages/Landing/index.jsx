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
    const [text, setText] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function submitPin() {
        const data = {
            pinNumber: text
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
            <div className="pin-input">
                <textarea
                    placeholder="Enter PIN..."
                    value={text}
                    onChange={e => setText(e.target.value)}
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
        </div>
    )
}

