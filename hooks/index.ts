
export const calculateDimensions = ({ nativeEvent }: any) => {
    return {
        width: nativeEvent.layout.width, height: nativeEvent.layout.height
    }
}