import { ReactNode, useState } from "react"
import { View } from "react-native"
import { calculateWidth } from "../screens/invoices/invoice"

type PropsType = {
    elements: ReactNode[]
    gap: number
    style?: View["props"]["style"]
    withoutFade?: boolean
}

export default ({ elements, gap, style, withoutFade }: PropsType) => {
    const [width, setWidth] = useState(0)

    const elWidth = calculateWidth(width, gap, elements.length)

    return <View style={[{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }, style]} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
        {elements.map(e => <View style={{ width: elWidth, opacity: elWidth === 0 && !withoutFade ? 0 : 1 }}>{e}</View>)}
    </View>
}