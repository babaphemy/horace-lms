import {
  CloudDownload,
  FolderOutlined,
  NoteAltOutlined,
} from "@mui/icons-material"
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import { MaterialItem } from "./StyledComponents"
import { LessonDto } from "@/types/types"
type LessonMaterial = {
  id: string
  name: string
  size: string
}
type LessonMaterials = LessonMaterial[]
interface Props {
  tabValue: number
  setTabValue: (_value: number) => void
  currentLesson: LessonDto
  handleTabChange: (_event: React.SyntheticEvent, _newValue: number) => void
  lessonMaterials: LessonMaterials
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  )
}

const LessonResources: React.FC<Props> = ({
  tabValue,
  handleTabChange,
  lessonMaterials,
  currentLesson,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
        }}
      >
        <Tab
          icon={<NoteAltOutlined fontSize="small" />}
          label="Notes"
          iconPosition="start"
        />
        <Tab
          icon={<FolderOutlined fontSize="small" />}
          label="Materials"
          iconPosition="start"
        />
      </Tabs>

      <TabPanel value={tabValue} index={1}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Your Notes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Take notes during the course to help with your learning.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Add your notes here..."
            variant="outlined"
          />
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Notes
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Materials
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Download resources for the currently selected lesson.
          </Typography>

          {lessonMaterials
            .filter((item: LessonMaterial) => item.id === currentLesson?.id)
            .map((item: LessonMaterial) => (
              <MaterialItem key={item.id}>
                <Box>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.size}
                  </Typography>
                </Box>
                <IconButton size="small">
                  <CloudDownload fontSize="small" />
                </IconButton>
              </MaterialItem>
            ))}

          {!lessonMaterials[
            currentLesson?.id as keyof typeof lessonMaterials
          ] && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              No materials available for this lesson.
            </Typography>
          )}
        </Box>
      </TabPanel>
    </Box>
  )
}
export default LessonResources
