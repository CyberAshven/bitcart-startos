import { sdk } from '../sdk'
import { autoconfig } from './config/autoconfig'
import { deploymentSettings } from './deploymentSettings'

export const actions = sdk.Actions.of()
  .addAction(deploymentSettings)
  .addAction(autoconfig)
