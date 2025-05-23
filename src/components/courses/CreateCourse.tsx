import { LightbulbCircleOutlined as LightbulbIcon } from "@mui/icons-material"

const promptTemplates = [
  {
    id: "create",
    name: "Create Course",
    icon: <LightbulbIcon />,
    template:
      "Generate a complete online learning course on [topic] that targets [audience] in [country]  with [x] modules and [y] lesson per module which. Create one assessment quiz for every 3 topics created. ",
    description: "Ask any general question",
  },
]
const CreateCourse = () => {
  return <h1>Hi {promptTemplates[0].name}</h1>
}
export default CreateCourse
