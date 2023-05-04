import { Box } from '@mui/material';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { getCourseLecture } from '../../api/rest';
import QuizComponent from '../../components/classroom/QuizComponent';
import SkipLecture from '../../components/classroom/SkipLecture';
import VideoLesson from '../../components/classroom/VideoLesson';
import { AppDpx, Appcontext } from '../../context/AppContext';
import { SET_PLAY_ID } from '../../context/actions';
import { tLecture } from '../../types/types';

const Classroom = () => {
  const dispatch = useContext(AppDpx);
  const { course, playId, user }: any = useContext(Appcontext);
  //  const router = useRouter();

  const playing = playId || course?.curriculum.section[0].lecture[0];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleOpenExercise = () => {
    if (course === null) return;
    if (!course.id || !user.id) return;

    const allLectures = course.curriculum.section.map((section: any) => {
      return section.lecture;
    });

    const flattened = [].concat(...allLectures);

    const playIdIndex = flattened.findIndex(
      (lecture: any) => lecture.id === playId?.id
    );
    const newAllLectures: tLecture[] = flattened.slice(playIdIndex);
    const nextQuiz = newAllLectures.findIndex((lecture: any) => {
      return lecture.type === 'quiz';
    });

    handleNext(newAllLectures[nextQuiz - 1].id);
  };

  return (
    <Box>
      {playing?.type === 'lecture' ? (
        <VideoLesson
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleOpenExercise={handleOpenExercise}
        />
      ) : playing?.type === 'quiz' ? (
        <QuizComponent
          quizzes={playing?.content?.questions}
          handleNext={handleNext}
          playId={playId}
          handlePrev={handlePrev}
          course={course}
        />
      ) : (
        <SkipLecture
          handleNext={handleNext}
          playId={playId}
          handlePrev={handlePrev}
          course={course}
        />
      )}
    </Box>
  );
};

export default Classroom;
