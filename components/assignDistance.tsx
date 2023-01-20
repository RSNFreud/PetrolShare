import Popup from "./Popup"
import { useState, useEffect, useContext } from 'react'
import Input from "./Input"
import Dropdown from "./Dropdown"
import { Button } from "./Themed"
import axios from "axios"
import config from "../config"
import { AuthContext } from "../hooks/context"

type PropsType = {
    active: boolean
    handleClose: () => void
    handleUpdate: () => void
    data: { [key: number]: { fullName: string, distance: number, userID: number } }
    invoiceID: number
}

export default ({ active, data, handleClose, invoiceID, handleUpdate }: PropsType) => {
    const usernames = Object.entries(data).map(([key, e]) => ({ name: e.fullName, value: key })).filter(e => e.name !== "Unaccounted Distance")
    let maxDistance: { fullName: string, distance: number } | number = Object.values(data).filter(e => e.fullName === "Unaccounted Distance")[0]
    if (maxDistance) maxDistance = maxDistance.distance
    const [errors, setErrors] = useState({ name: "", distance: "" })
    const [values, setValues] = useState({ name: "", distance: "" })
    const [loading, setLoading] = useState(false)
    const { retrieveData } = useContext(AuthContext);


    const checkDistance = (e: string) => {
        const distance = parseFloat(e)
        setErrors({ ...errors, distance: "" })
        setValues({ ...values, distance: e })
        if (isNaN(distance)) {
            setErrors({ ...errors, distance: "Please enter a value above 0 and below " + maxDistance })
            return false
        }
        if (distance > maxDistance || distance === 0) {
            setErrors({ ...errors, distance: "Please enter a value above 0 and below " + maxDistance })
            return false
        }
        return true
    }

    const submit = () => {
        setErrors({ name: "", distance: "" })
        if (!checkDistance(values.distance)) return
        const errors: { name: string, distance: string } = {}
        Object.entries(values).map(([key, value]) => {
            if (value) return
            errors[key] = "Please enter a value!"
        })
        setErrors(errors)
        if (!values.distance || !values.name) return
        setLoading(true);
        axios
            .post(config.REACT_APP_API_ADDRESS + `/invoices/assign`, {
                authenticationKey: retrieveData().authenticationKey,
                userID: values.name,
                distance: values.distance,
                invoiceID: invoiceID,
            })
            .then(async ({ data }) => {
                setLoading(false);
                handleUpdate()
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return <Popup visible={active} handleClose={handleClose}>
        <Input handleInput={e => checkDistance(e)} label={`Distance to apply`} errorMessage={errors.distance} placeholder={`Enter amount (Max: ${maxDistance})`} keyboardType={'numbers-and-punctuation'} inputStyle={{ paddingVertical: 10 }} style={{ marginBottom: 20, marginTop: 20 }} />
        <Dropdown placeholder="Choose a username" data={usernames} handleSelected={e => setValues({ ...values, name: e.value || e.name })} value={values.name} height={53} errorMessage={errors.name} hiddenValue />
        <Button loading={loading} handleClick={submit}>Assign Distance</Button>
    </Popup>
}