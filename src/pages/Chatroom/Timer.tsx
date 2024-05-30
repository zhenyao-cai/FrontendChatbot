import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { HiArrowLongRight } from "react-icons/hi2";
import './Chatroom.css';

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
interface TimerProps {
    time: number;
    socket: Socket;
    code: String;
    setDisabled: StateSetter<boolean>;
    inactivity: string;
    setInactivity: StateSetter<string>;
}

export function Timer(props: TimerProps) {
    const [seconds, setSeconds] = useState<number>(60 * -1);
    const [inactivitySeconds, setInactivitySeconds] = useState(0);

    useEffect(() => {
        setSeconds(60 * props.time);
    }, [props.time]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setInactivitySeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (inactivitySeconds > 60) {
            props.setInactivity('inactive');
        }
    }, [inactivitySeconds, props]);

    useEffect(() => {
        if (props.inactivity === 'message') {
            props.setInactivity('pending');
            setInactivitySeconds(0);
        }
    }, [props.inactivity, props]);

    useEffect(() => {
        props.socket.on('timerUpdate', (newTime) => {
            setSeconds(newTime);
        });

        props.socket.on('timerEnded', () => {
            props.setDisabled(true);
        });

        return () => {
            props.socket.off('timerUpdate');
            props.socket.off('timerEnded');
        };
    }, [props.socket, props]);

    useEffect(() => {
        if (seconds === 60) {
            props.socket.emit('chatStartConclusionPhase', props.code, 1);
        }
    }, [seconds, props]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return (
            <p style={{ margin: 0, marginTop: 10, fontSize: '20px', fontWeight: 'bold'}}>
                <span style={{ backgroundColor: 'white', padding: '7px 14px', borderRadius: '4px', width: '20px', display: 'inline-block' }}>
                    {minutes}
                </span>{' '}
                m
                {' '}<span style={{ backgroundColor: 'white', padding: '7px 14px', borderRadius: '4px', width: '20px', display: 'inline-block' }}>
                    {remainingSeconds}
                </span>{' '}
                s
            </p>
        );
    };

    const checkMark = (time: number) => {
        const minutes = Math.floor(time / 60);
        let check1 = <IoIosCheckmarkCircle />;
        let check2 = <IoIosCheckmarkCircleOutline style={minutes < 5 ? { opacity: 1 } : { opacity : 0.5 }}/>
        let check3 = <IoIosCheckmarkCircleOutline style={minutes < 2 ? { opacity: 1 } : { opacity : 0.5 }}/>
        let arrow1 = <HiArrowLongRight style={minutes < 5 ? { opacity: 1 } : { opacity : 0.5 }}/>
        let arrow2 = <HiArrowLongRight style={minutes < 2 ? { opacity: 1 } : { opacity : 0.5 }}/>

        if (minutes < 5) {check2 = <IoIosCheckmarkCircle />;}
        if (minutes < 2) {check3 = <IoIosCheckmarkCircle />;}

        return(
            <div>        
                {check1}
                {arrow1}
                {check2}
                {arrow2}
                {check3}
            </div>);
    };

    return (
        <div className='side-container'>
            <p className='sider-heading'>Task Completion</p>
            <p style={{ margin: '8px 0'}}>{formatTime(seconds)}</p>
            <p style={{ fontSize: '42px', color:"#527785"}}>{checkMark(seconds)}</p>
            <p style={{ fontSize: '10px', color:"#527785"}}>
                Orientation &nbsp; &nbsp; &nbsp; 
                Share Opinions &nbsp; &nbsp; &nbsp;
                Conclude
            </p>
        </div>
    );
}
