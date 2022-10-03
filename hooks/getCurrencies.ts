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
