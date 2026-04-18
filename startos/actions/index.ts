import { sdk } from '../sdk'
import { autoconfig } from './config/autoconfig'
import { hostSettings } from './hostSettings'
import { cashTokenSettings } from './cashTokenSettings'

export const actions = sdk.Actions.of()
  .addAction(hostSettings)
  .addAction(cashTokenSettings)
  .addAction(autoconfig)
