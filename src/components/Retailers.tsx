import ReactApexChart from 'react-apexcharts'
import { AmpSheetRow } from '../Types'
import { getByRetailer } from './Helpers'
import { ApexOptions } from 'apexcharts'

export default function Retailers({ sheet }: { sheet: AmpSheetRow[] }) {
  const byRetailer = getByRetailer(sheet)
  const categories: string[] = []
  const data: number[] = []
  Object.keys(byRetailer).forEach((retailer) => {
    categories.push(retailer)
    const total = byRetailer[retailer].reduce((acc, track) => {
      return acc + track.Revenue
    }, 0)
    data.push(total)
  })

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories,
    }
  }
  const series = [{ data }]
  return <div>
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  </div>
}
