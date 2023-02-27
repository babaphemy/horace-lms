import React, { useContext } from 'react';
import { Button, Typography } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';

import { AppContext } from '../../context/AllProvider';
interface Props {
  id: string;
}
const CourseHeader = ({ id }: Props) => {
  const { user } = useContext(AppContext);
  const handleOpenProjectMenu = () => {};
  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-2">
        <div className="flex flex-auto items-center min-w-0">
          <div className="box-border h-32 w-32 p-4 border-2 rounded-lg">
            <Typography variant="caption" color={'graytext'}>
              Watch preview
            </Typography>
          </div>

          <div className="flex flex-col min-w-0 mx-16">
            <Typography variant="caption" color="graytext">
              {id}
            </Typography>
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {`Course name !`}
            </Typography>

            <div className="flex items-center">
              <NotificationsActiveIcon />

              <Typography
                className="mx-6 leading-6 truncate"
                color="text.secondary"
              >
                course brief intro
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            variant="outlined"
            color="primary"
            startIcon={<MailIcon />}
          >
            Messages
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="outlined"
            color="secondary"
            startIcon={<SettingsIcon />}
          >
            Settings
          </Button>
        </div>
      </div>
      <p>Progress bar if inProgress</p>
      {/* <div className="flex items-center"> */}
      {/* <Button
					onClick={handleOpenProjectMenu}
					className="flex items-center border border-solid border-b-0 rounded-t-xl rounded-b-0 h-40 px-16 text-13 sm:text-16"
					variant="contained"
					sx={{
						backgroundColor: (theme) => theme.palette.background.default,
						borderColor: (theme) => theme.palette.divider,
					}}
					endIcon={<ExpandMoreIcon />}
				>
					Hey
				</Button> */}
      {/* <Menu
					id="project-menu"
					anchorEl={selectedProject.menuEl}
					open={Boolean(selectedProject.menuEl)}
					onClose={handleCloseProjectMenu}
				>
					{projects &&
						projects.map((project) => (
							<MenuItem
								key={project.id}
								onClick={(ev) => {
									handleChangeProject(project.id);
								}}
							>
								{project.name}
							</MenuItem>
						))}
				</Menu> */}
      {/* </div> */}
    </div>
  );
};

export default CourseHeader;
