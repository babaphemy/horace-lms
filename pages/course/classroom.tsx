import { Paper } from '@mui/material';
import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import DashboardHoc from '../../components/DashboardHoc';
import Coursebar from '../../components/layout/Coursebar';
import { AppContext } from '../../context/AllProvider';

const Classroom = () => {
  const { lecture } = useContext(AppContext);

  return (
    <DashboardHoc isClass={true}>
      <Coursebar />
      <Paper className="w-9/12">
        {lecture?.type === 'lecture' && (
          <div className="w-fit">
            <ReactPlayer
              url={`https://essl.b-cdn.net/${lecture?.video}`}
              width="640"
              height="360"
              controls
            />
          </div>
        )}
      </Paper>
    </DashboardHoc>
  );
};

export default Classroom;
