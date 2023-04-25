import { useRef, useState } from "react"
import GroupSettings from "./groupSettings"
import Complete from "./complete"
import { Alert, setItem } from "../hooks"

type PropsType = {
    handleClose: () => void
    handleCancel?: () => void
    handleUpdate?: () => void
}

export default ({ handleClose, handleUpdate }: PropsType) => {
    const [stage, setStage] = useState(0)
    const groupID = useRef("")

    const createGroup = async (e?: string, message?: string) => {
        setItem('groupData', '')
        if (message) Alert('Notice:', message)
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