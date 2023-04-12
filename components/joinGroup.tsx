import { useRef, useState } from "react"
import Complete from "./complete"
import { setItem } from "../hooks"
import JoinGroupForm from "./joinGroupForm"

type PropsType = {
    firstSteps?: boolean
    handleClose: () => void
    handleCancel?: () => void
    handleUpdate?: () => void
}

export default ({ firstSteps, handleClose, handleUpdate }: PropsType) => {
    const [stage, setStage] = useState(0)
    const groupID = useRef("")

    const createGroup = async (e?: string) => {
        setItem('groupData', '')
        handleUpdate && handleUpdate()
        if (e)
            groupID.current = e
        setStage(1)
    }

    return <>
        {stage == 0 && <JoinGroupForm firstSteps={firstSteps} handleComplete={createGroup} handleCancel={handleClose} />}
        {stage === 1 && <Complete handleClose={handleClose} groupID={groupID.current} />}
    </>
}