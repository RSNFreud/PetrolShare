import { View } from "react-native"
import Layout from "../../components/Layout"
import { Breadcrumbs, Button, Text } from "../../components/Themed"
import Colors from "../../constants/Colors"
import Svg, { Path } from "react-native-svg"
import { useState } from "react"
import Popup from "../../components/Popup"
import Create from "./create"

export default () => {
    const [visible, setVisible] = useState(false)

    return <Layout homepage>
        <View style={{ paddingBottom: 15, backgroundColor: Colors.secondary, paddingHorizontal: 25 }}>
            <Breadcrumbs style={{ marginBottom: 0 }} links={[{
                name: 'Dashboard'
            }, { name: 'Schedules' }]} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ fontWeight: '300', textAlign: 'center', lineHeight: 24, maxWidth: 325 }}>There are no schedules added. Please add a new schedule by clicking the button below.</Text>
            <Button size="medium" handleClick={() => setVisible(true)} styles={{ width: 153, marginTop: 15, borderRadius: 8, height: 44 }} icon={<Svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 14 14"
            >
                <Path fill="#fff" d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2z"></Path>
            </Svg>}>Add</Button>
        </View>
        <Popup children={<Create />} visible={visible} handleClose={() => setVisible(false)} />
    </Layout>
}