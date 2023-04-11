import { useRef, useState } from "react"
import GroupSettings from "./groupSettings"
import Complete from "./manageGroup/complete"
import { setItem } from "../hooks"

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
        {stage == 0 && <GroupSettings handleComplete={createGroup} handleCancel={handleClose} newGroup />}
        {stage === 1 && <Complete newGroup handleClose={handleClose} groupID={groupID.current} />}
    </>
}