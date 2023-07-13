import { useRoute } from "@react-navigation/native"
import Layout from "../components/layout"
import Invoice from "./invoices/invoice"
import { useEffect, useState } from "react"

export default () => {
    const route = useRoute()
    const [invoiceID, setInvoiceID] = useState("")

    useEffect(() => {
        if (route && route.params && 'uniqueURL' in route.params) {
            const key = route.params['uniqueURL'] as string
            if (key) setInvoiceID(key)
        }
    }, [route])

    if (!invoiceID) return <></>

    return <Layout noScrollView noBottomPadding><Invoice invoiceID={invoiceID} isPublic /></Layout>
}