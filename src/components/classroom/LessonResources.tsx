import { useState, useEffect } from "react"
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import {
  NoteAltOutlined,
  FolderOutlined,
  CloudDownload,
} from "@mui/icons-material"
import { LessonDto, LessonMaterial } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { addNote, myNotes } from "@/app/api/rest"
import { MaterialItem } from "./StyledComponents"

interface Props {
  tabValue: number
  setTabValue: (_value: number) => void
  currentLesson: LessonDto
  handleTabChange: (_event: React.SyntheticEvent, _newValue: number) => void
  lessonMaterials: LessonMaterial[]
  userID: string
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
  userID,
}) => {
  const queryClient = useQueryClient()
  const [noteContent, setNoteContent] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch user notes
  const {
    data: notesData,
    isLoading: notesLoading,
    error: notesError,
  } = useQuery({
    queryKey: ["myNotes", userID, currentLesson?.id],
    queryFn: () => myNotes(userID, currentLesson?.id as string),
    enabled: !!userID && !!currentLesson?.id,
    refetchOnWindowFocus: false,
  })

  // Save/update notes mutation
  const noteMutation = useMutation({
    mutationFn: (newNote: string) =>
      addNote({
        userId: userID,
        lessonId: currentLesson?.id as string,
        notes: newNote,
      }),
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({
        queryKey: ["myNotes", userID, currentLesson?.id],
      })
      setShowSuccess(true)
      setHasChanges(false)
    },
  })

  // Populate notes when data loads or lesson changes
  useEffect(() => {
    if (notesData?.notes) {
      setNoteContent(notesData.notes)
      setHasChanges(false)
    } else {
      setNoteContent("")
      setHasChanges(false)
    }
  }, [notesData, currentLesson?.id])

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteContent(e.target.value)
    setHasChanges(true)
  }

  const handleSaveNotes = async () => {
    if (!noteContent.trim() || !userID || !currentLesson?.id) {
      return
    }
    noteMutation.mutate(noteContent)
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
  }

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

      <TabPanel value={tabValue} index={0}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Your Notes {userID}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Take notes during the course to help with your learning.
          </Typography>

          {notesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : notesError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load notes. Please try again.
            </Alert>
          ) : (
            <>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Add your notes here..."
                variant="outlined"
                value={noteContent}
                onChange={handleNoteChange}
                disabled={noteMutation.isLoading}
              />
              <Box
                sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveNotes}
                  disabled={
                    !hasChanges || noteMutation.isLoading || !noteContent.trim()
                  }
                >
                  {noteMutation.isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Saving...
                    </>
                  ) : (
                    `Save Notes ${userID}`
                  )}
                </Button>
                {hasChanges && (
                  <Typography variant="caption" color="text.secondary">
                    You have unsaved changes
                  </Typography>
                )}
              </Box>

              {noteMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Failed to save notes. Please try again.
                </Alert>
              )}
            </>
          )}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
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

          {!lessonMaterials.filter(
            (item: LessonMaterial) => item.id === currentLesson?.id
          ).length && (
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

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Notes saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LessonResources
