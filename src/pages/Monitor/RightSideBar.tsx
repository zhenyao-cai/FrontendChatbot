import React from 'react';

import './Monitor.css';

interface RightSideBarProps {
    num_student: number;
}

export function RightSideBar(props: RightSideBarProps) {

    return (
    <div style={{ paddingLeft: 20, paddingRight:20 }}>
      <div style={{ marginTop: '20px' }}>
  
          <div>
            <p className='sider-heading'>
                Student: {props.num_student}
            </p>
          </div>
  
        </div>
      </div>
    );
}