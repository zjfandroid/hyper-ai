import * as React from 'react';
import Stack from '@mui/material/Stack';
import {
  Unstable_RadarDataProvider as RadarDataProvider,
  RadarGrid,
  RadarSeriesMarks,
  RadarSeriesArea,
  RadarMetricLabels,
  RadarAxisHighlight,
} from '@mui/x-charts/RadarChart';


import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';



const MUIRadarChartMini = ({ series, radar }) => {
  return (
    <RadarDataProvider height={100} width={120} shape="sharp" series={series} radar={radar} margin={{top: 0, left: 0, right: 0,bottom: 0 }} >
      <Stack direction="column" alignItems="center" gap={1} sx={{ width: '100%' }}>
        {/* <ChartsLegend /> */}
        <ChartsSurface>
          <RadarGrid divisions={5} />
          {/* <RadarMetricLabels /> */}
          <RadarSeriesArea
            fillOpacity={0.4}
            strokeWidth={1}
            seriesId="australia-id"
          />
          <RadarSeriesArea
            // fill="transparent"
            fillOpacity={0.4}
            strokeWidth={1}
            seriesId="usa-id"
            // strokeDasharray="4, 4"
            strokeLinecap="round"
          />
          <RadarAxisHighlight />
          {/* <RadarSeriesMarks /> */}
        </ChartsSurface>
        {/* <ChartsTooltip trigger='item'/> */}
        <ChartsTooltip trigger='axis' />
      </Stack>
    </RadarDataProvider>
  );
}

export default MUIRadarChartMini