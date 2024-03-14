import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

import './Chatroom.css';

interface RightSideBarProps {
    score: number;
}

export function RightSideBar(props: RightSideBarProps) {

    // Radar Chart
    const RChart = () => {
        const data = [
        {
            subject: 'A',
            A: 7,
            B: 1,
        },
        {
            subject: 'B',
            A: 9,
            B: 1,
        },
        {
            subject: 'C',
            A: 8,
            B: 0,
        },
        {
            subject: 'D',
            A: 8,
            B: 1,
        },
        {
            subject: 'E',
            A: 8,
            B: 9,
        },
        {
            subject: 'F',
            A: 6,
            B: 8,
        },
    ];
  
    return (
        <RadarChart cx={100} cy={100} outerRadius={50} width={200} height={200} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Radar dataKey="A" 
                 stroke="#8884d8" 
                 fill="#8884d8" 
                 fillOpacity={0.5} />
        </RadarChart>
    );
  }

    return (
    <div style={{ paddingLeft: 20, paddingRight:20 }}>
      <div style={{ marginTop: '20px' }}>
  
          <ParticipationScore score={props.score}/>
  
          <div className='side-container'>
            <p className='sider-heading'>Your performance</p>
            <p><RChart/></p>
          </div>
  
        </div>
      </div>
    );
}


function ParticipationScore(props : RightSideBarProps){
    return (
        <div className='side-container'>
        <p className='sider-heading'>Group analysis</p>
        <p className='sider-subheading'>Your Participation Score:</p>
        <p className='sider-heading'>{props.score}</p>
        </div>
    );
}