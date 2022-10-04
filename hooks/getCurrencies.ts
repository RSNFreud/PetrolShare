import axios from 'axios'

export default async () => {
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
  const { data } = await axios.get(
    `https://restcountries.com/v3.1/currency/${code}?fields=currencies`)

  let cleanList: any = {}

  data.map((e: { currencies: Object }) => {
    Object.keys(e.currencies).map((key: string) => {
      if (key !== code) return
      const q: { symbol: string; name: string } = e.currencies[key]
      cleanList[key] = { ...q }
    })
  })

  if ((cleanList[code].name.includes('dollar') && code !== "USD") || (cleanList[code].name.includes('pound') && code !== "GBP")) {
    return `${code}`
  }
  return cleanList[code].symbol
}
