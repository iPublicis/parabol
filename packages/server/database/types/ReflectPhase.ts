import {NewMeetingPhaseTypeEnum} from 'parabol-client/types/graphql'
import {REFLECT} from 'parabol-client/utils/constants'
import GenericMeetingPhase from './GenericMeetingPhase'
import GenericMeetingStage from './GenericMeetingStage'

export default class ReflectPhase extends GenericMeetingPhase {
  stages: GenericMeetingStage[]
  focusedPhaseItemId?: string

  constructor(
    public teamId: string,
    public promptTemplateId: string,
    durations: number[] | undefined
  ) {
    super(NewMeetingPhaseTypeEnum.reflect)
    this.stages = [new GenericMeetingStage(REFLECT, durations)]
  }
}
