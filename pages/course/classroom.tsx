import { Box, Button, Paper } from '@mui/material';
import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import DashboardHoc from '../../components/DashboardHoc';
import Coursebar from '../../components/layout/Coursebar';
import { Appcontext } from '../../context/AppContext';

const Classroom = () => {
  const { course, playId } = useContext(Appcontext);
  const current = course?.curriculum.section
    .flatMap((section) => section.lecture)
    .find((lecture) => lecture.id === playId?.id || 1);

  return (
    <DashboardHoc
      isClass={true}
      curriculum={course?.curriculum}
      courseName={course?.courseName}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Coursebar />
        <Paper className="w-full md:w-2/3">
          {current?.type === 'lecture' && (
            <div className="w-fit">
              <ReactPlayer
                url={`https://essl.b-cdn.net/${current?.video}`}
                width="640"
                height="360"
                controls
              />
            </div>
          )}
          <Box display={'flex'} justifyContent="space-between">
            <Button>Previous</Button>
            <Button>Next</Button>
          </Box>
        </Paper>
      </Box>
    </DashboardHoc>
  );
};

export default Classroom;
