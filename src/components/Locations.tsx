import { AmpSheetRow } from '../Types'
import { getByLocation } from './Helpers'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

export default function Locations({ sheet }: { sheet: AmpSheetRow[] }) {
  const byLocation = getByLocation(sheet)
  const locations: string[] = []
  const data: number[] = []
  Object.keys(byLocation).forEach((retailer) => {
    locations.push(retailer)
    const total = byLocation[retailer].reduce((acc, track) => {
      return acc + track.Revenue
    }, 0)
    data.push(total)
  })

  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: locations,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  return <div>
    <ReactApexChart options={options} series={data} type="donut" height={350} />
  </div>
}
