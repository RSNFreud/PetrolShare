import Popup from "./Popup"
import { useState, useEffect } from 'react'
import Input from "./Input"
import Dropdown from "./Dropdown"
import { Button } from "./Themed"

type PropsType = {
    active: boolean
    handleClose: () => void
    data: { [key: number]: { fullName: string, distance: number } }
}

export default ({ active, data, handleClose }: PropsType) => {
    const usernames = Object.values(data).map(e => ({ name: e.fullName })).filter(e => e.name !== "Unaccounted Distance")
    let maxDistance: { fullName: string, distance: number } | number = Object.values(data).filter(e => e.fullName === "Unaccounted Distance")[0]
    if (maxDistance) maxDistance = maxDistance.distance
    const [errors, setErrors] = useState({ name: "", distance: "" })
    const [values, setValues] = useState({ name: "", distance: "" })

    const checkDistance = (e: string) => {
        const distance = parseFloat(e)
        setErrors({ ...values, distance: "" })
        if (isNaN(distance)) {
            return setErrors({ ...errors, distance: "Please enter a value above 0 and below " + maxDistance })
        }
        if (distance > maxDistance || distance === 0) {
            return setErrors({ ...errors, distance: "Please enter a value above 0 and below " + maxDistance })
        }
        setValues({ ...values, distance: e })
    }

    const submit = () => {
        setErrors({ name: "", distance: "" })
        const errors: { name: string, distance: string } = {}
        Object.entries(values).map(([key, value]) => {
            if (value) return
            errors[key] = "Please enter a value!"
        })
        setErrors(errors)
        if (!values.distance || !values.name) return
        console.log('test!');

    }

    return <Popup visible={active} handleClose={handleClose}>
        <Input handleInput={e => checkDistance(e)} label={`Distance to apply`} errorMessage={errors.distance} placeholder={`Enter amount (Max: ${maxDistance})`} keyboardType={'numbers-and-punctuation'} inputStyle={{ paddingVertical: 10 }} style={{ marginBottom: 20, marginTop: 20 }} />
        <Dropdown placeholder="Choose a username" data={usernames} handleSelected={e => setValues({ ...values, name: e.name })} value={values.name} height={53} errorMessage={errors.name} />
        <Button handleClick={submit}>Assign Distance</Button>
    </Popup>
}