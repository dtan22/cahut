import React from 'react';
import './styles.css';

export default function Question() {
    return (
        <>
            <div className="question-container">
                <div className="question-box">
                    Question: nguoi yeu cua DTA dep trai nhu Son Tung hay Hieu Thu Hai?
                </div>
            </div>
            <div className="answer-container">
                <div className="answer-box">
                    Son Tung
                </div>
                <div className="answer-box">
                    Hieu Thu Hai
                </div>
                <div className="answer-box">
                    Dep trai hon ca 2
                </div>
                <div className="answer-box">
                    Dep trai nhat tren doi
                </div>
            </div>
        </>
    )
}