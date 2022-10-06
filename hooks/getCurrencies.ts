import axios from 'axios'
import { getItem, setItem } from '.'

export const getAllCurrencies = async () => {
  const { data } = await axios.get(
    'https://restcountries.com/v3.1/all?fields=currencies',
  )

  let cleanList: any = {}

  data.map((e: { currencies: Object }) => {
    Object.keys(e.currencies).map((key: string) => {
      const q: { symbol: string; name: string } = e.currencies[key]
      cleanList[key] = { ...q }
    })
  })
  return cleanList
}

export const convertCurrency = async (code: string) => {
  let data: string | null | Object = await getAllCurrencies()

  let cleanList: any = {}
  if (typeof data === 'string' || !data) return
  Object.entries(data).map(([key, data]) => {
    if (key === code) cleanList = { ...data }
  })

  if ((cleanList.name.includes('dollar') && code !== "USD") || (cleanList.name.includes('pound') && code !== "GBP")) {
    setItem("currencySymbol", code.toString())
    return `${code}`
  }
  setItem("currencySymbol", cleanList.symbol)
  return cleanList.symbol
}
