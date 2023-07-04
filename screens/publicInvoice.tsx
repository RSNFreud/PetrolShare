import { useRoute } from "@react-navigation/native"
import Layout from "../components/Layout"
import Invoice from "./invoices/invoice"
import { useEffect, useState } from "react"

export default () => {
    const route = useRoute()
    const [invoiceID, setInvoiceID] = useState("")

    useEffect(() => {
        if (route && route.params && 'paymentID' in route.params) {
            const key = route.params['paymentID'] as string
            if (key) setInvoiceID(key)
        }
    }, [route])

    if (!invoiceID) return <></>

    return <Layout><Invoice invoiceID={invoiceID} isPublic /></Layout>
}