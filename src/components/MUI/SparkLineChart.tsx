import { SparkLineChart } from '@mui/x-charts/SparkLineChart';


const MUISparkLineChart = () => {
  return (
    <SparkLineChart
      plotType="bar"
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
      height={44}
      showTooltip
      showHighlight
      xAxis={{
        scaleType: 'band',
        data: [
          new Date(2016, 0, 1),
          new Date(2017, 0, 1),
          new Date(2018, 0, 1),
          new Date(2019, 0, 1),
          new Date(2020, 0, 1),
          new Date(2021, 0, 1),
          new Date(2022, 0, 1),
          new Date(2023, 0, 1),
        ],
        valueFormatter: (value) => value.toString(),
      }}
      margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
    />
  )
}

export default MUISparkLineChart