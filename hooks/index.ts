
export const calculateDimensions = ({ nativeEvent }: any) => {
    console.log(nativeEvent);

    return {
        width: nativeEvent.layout.width, height: nativeEvent.layout.height
    }
}