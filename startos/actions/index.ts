import { sdk } from '../sdk'
import { autoconfig } from './config/autoconfig'
import { deploymentSettings } from './deploymentSettings'
import { cashTokenSettings } from './cashTokenSettings'

export const actions = sdk.Actions.of()
  .addAction(deploymentSettings)
  .addAction(cashTokenSettings)
  .addAction(autoconfig)
