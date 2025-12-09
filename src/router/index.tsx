import { createBrowserRouter } from 'react-router-dom';

import { constants } from '@/stores/constants'

import ErrorView from '@/views/ErrorView'
import LayoutRootDefault from '@/components/Layout/RootDefault'
import LayoutRootStarlight from '@/components/Layout/RootStarlight'

import Home from '@/views/Home/index'
import CopyTrading from '@/views/CopyTrading'
import Rewards from '@/views/Rewards'
import Leaderboard from '@/views/Leaderboard/index'
import TrackMonitor from '@/views/TrackMonitor'
import Discover from '@/views/Discover/index'
import TraderDetails from '@/views/TraderDetails'
import Trade from '@/views/Trade'
import HypeVaults from '@/views/HypeVaults';
import NewsPage from '@/views/News';
import FundingFee from '@/views/FundingFee';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRootStarlight />,
    errorElement: <ErrorView />,
    children: [
      {
        path: '',
        index: true,
        element: <Home />
      },
    ]
  },
  {
    path: '/',
    element: <LayoutRootStarlight />,
    errorElement: <ErrorView />,
    children: [
      {
        path: 'copy-trading',
        index: true,
        element: <CopyTrading />
      },
      {
        path: 'news',
        index: true,
        element: <NewsPage />
      },
      {
        path: 'vaults',
        index: true,
        element: <HypeVaults />
      },
      {
        path: 'funding-fee',
        index: true,
        element: <FundingFee />
      },
      {
        path: 'rewards',
        index: true,
        element: <Rewards />
      },
      {
        path: 'leaderboard',
        index: true,
        element: <Leaderboard />
      },
      {
        path: 'track-monitor',
        index: true,
        element: <TrackMonitor />
      },
      {
        path: 'discover',
        index: true,
        element: <Discover />
      },
      {
        path: 'trader/:address',
        index: true,
        element: <TraderDetails />
      }
    ]
  },
  {
    path: '/',
    element: <LayoutRootStarlight full footer={null} />,
    errorElement: <ErrorView />,
    children: [
      {
        path: 'trade/:coin',
        index: true,
        element: <Trade />
      }
    ]
  }
], {
  basename: constants.app.PUBLIC_PATH_BASE
})

export default router