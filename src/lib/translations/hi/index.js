import { hiCommon } from './common'
import { hiAdmin } from './admin'
import { hiPortals } from './portals'

export const hi = {
  ...hiCommon,
  ...hiAdmin,
  ...hiPortals,
}
