import axios from "axios";
import { useContext, useEffect, useState } from "react";
import config from "../../config";
import { AuthContext } from "../../hooks/context";
import Dropdown, { item } from "../../components/Dropdown";
import Input from "../../components/Input";
import SubmitButton from "./submitButton";

export default ({ handleClose }: { handleClose: (alert?: string) => void }) => {
    const [usernames, setUsernames] = useState<Array<item>>([])
    const { retrieveData } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({ name: "", distance: "" })
    const [errors, setErrors] = useState({ name: "", distance: "" })

    useEffect(() => {
        axios
            .get(config.REACT_APP_API_ADDRESS + `/group/get-members?authenticationKey=` + retrieveData?.authenticationKey)
            .then(async ({ data }) => {
                setUsernames(data.map((e: { fullName: string, userID: string }) => ({ name: e.fullName, value: e.userID })))
            })
            .catch(() => { });
    }, [])

    const handleSubmit = async () => {
        if (!values.name) {
            return setErrors({ ...errors, name: 'Please choose a user to assign distance too!' })
        }
        if (!values.distance) {
            return setErrors({ ...errors, distance: 'Please enter a distance!' })
        }

        let distance: string = ''

        if (values.distance) {
            distance = values.distance
        }

        if (parseFloat(distance) <= 0 || !/^[0-9.]*$/.test(distance))
            return setErrors({ ...errors, distance: 'Please enter a distance above 0!' })
        setLoading(true)

        axios
            .post(config.REACT_APP_API_ADDRESS + `/distance/assign`, {
                userID: values.name,
                distance: values.distance,
                authenticationKey: retrieveData?.authenticationKey,
            })
            .then(async () => {
                setLoading(false)
                handleClose('Successfully requested distance\nfrom ' + usernames.filter(e => e.value === values.name)[0].name)
            })
            .catch(({ response }) => {
                console.log(response.message)
            })
    }

    return <>

        <Dropdown label="User" placeholder="Choose a username" data={usernames} handleSelected={e => setValues({ ...values, name: e })} value={values.name} errorMessage={errors.name} hiddenValue />
        <Input handleInput={e => setValues({ ...values, distance: e })} label={`Distance to apply`} errorMessage={errors.distance} placeholder={'Enter amount'} keyboardType={'numbers-and-punctuation'} inputStyle={{ paddingVertical: 10 }} style={{ marginBottom: 20 }} />
        <SubmitButton
            text="Assign Distance"
            loading={loading}
            handleClick={handleSubmit}
            errors={errors.distance}
            distance={values.distance}
        />
    </>
}