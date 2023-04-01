import { Box, Button, Paper, Skeleton } from '@mui/material';
import React, { useContext } from 'react';
import DashboardHoc from '../../components/DashboardHoc';
import Coursebar from '../../components/layout/Coursebar';
import { SET_PLAY_ID } from '../../context/actions';
import { Appcontext, AppDpx } from '../../context/AppContext';
import { tLecture } from '../../types/types';
import { useMutation } from 'react-query';
import { getCourseLecture } from '../../api/rest';
import ReactPlayer from 'react-player';
import css from './classroom.module.css';

const Classroom = () => {
  const { course, playId, user } = useContext(Appcontext);
  const dispatch = useContext(AppDpx);
  const playing = playId || course?.curriculum.section[0].lecture[0];

  React.useEffect(() => {
    if (playId?.video === '' && playId?.id && playId.id > 1)
      handleNext(playId?.id - 1);
  }, [course, playId]);

  const { mutate, isLoading } = useMutation(getCourseLecture, {
    onSuccess(data) {
      dispatch({
        type: SET_PLAY_ID,
        data: data as tLecture,
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleNext = (id: number | undefined = playId?.id) => {
    if (course === null || id == null) return;
    if (!course.id || !user.id) return;

    const payload = {
      id: course.id,
      user: user.id,
      count: id,
    };

    mutate(payload);
  };

  const handlePrev = () => {
    if (course === null) return;
    if (!course.id || !user.id) return;

    const payload = {
      id: course.id,
      user: user.id,
      count: null,
    };

    mutate(payload);
  };

  return (
    <DashboardHoc
      isClass={true}
      curriculum={course?.curriculum}
      courseName={course?.courseName}
    >
      <Box sx={playerStyles.boxWrapper}>
        {isLoading ? (
          <Skeleton variant="rectangular" width={640} height={360} />
        ) : (
          <>
            <Coursebar
              title={course?.courseName}
              subtitle={`${playing?.id}.${playing?.title}`}
            />
            <Paper className="w-full md:w-2/3">
              {playing?.type === 'lecture' && (
                <div>
                  {playing.id === 1 ? (
                    <ReactPlayer
                      url={`https://essl.b-cdn.net/${playing?.video}`}
                      width="640"
                      height="360"
                      controls
                    />
                  ) : (
                    <Box sx={playerStyles.frameContainer}>
                      <iframe
                        src={`https://iframe.mediadelivery.net/embed/59546/${playing?.video}?autoplay=true`}
                        loading="lazy"
                        className={css.framePlayer}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                      ></iframe>
                    </Box>
                  )}
                </div>
              )}
              <Box display={'flex'} justifyContent="space-between">
                <Button onClick={handlePrev} disabled={playId?.id === 1}>
                  Previous
                </Button>
                <Button
                  onClick={() => handleNext(playId?.id)}
                  disabled={playId?.id === course?.assetCount?.lessonCount}
                >
                  Next
                </Button>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </DashboardHoc>
  );
};

export default Classroom;
const playerStyles = {
  boxWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameContainer: { position: 'relative', paddingTop: '56.25%' },
  framePlayer: {
    border: 'none',
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
  },
};
