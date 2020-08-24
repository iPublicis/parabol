import graphql from 'babel-plugin-relay/macro'
import {RouterProps} from 'react-router'
import {requestSubscription, Variables} from 'relay-runtime'
import {addCommentMeetingUpdater} from '~/mutations/AddCommentMutation'
import {deleteCommentMeetingUpdater} from '~/mutations/DeleteCommentMutation'
import {MeetingSubscriptionResponse} from '~/__generated__/MeetingSubscription.graphql'
import Atmosphere from '../Atmosphere'
import {createReflectionMeetingUpdater} from '../mutations/CreateReflectionMutation'
import {dragDiscussionTopicMeetingUpdater} from '../mutations/DragDiscussionTopicMutation'
import {editReflectionMeetingUpdater} from '../mutations/EditReflectionMutation'
import {
  endDraggingReflectionMeetingOnNext,
  endDraggingReflectionMeetingUpdater
} from '../mutations/EndDraggingReflectionMutation'
import {promoteNewMeetingFacilitatorMeetingOnNext} from '../mutations/PromoteNewMeetingFacilitatorMutation'
import {removeReflectionMeetingUpdater} from '../mutations/RemoveReflectionMutation'
import {setStageTimerMeetingUpdater} from '../mutations/SetStageTimerMutation'
import {startDraggingReflectionMeetingUpdater} from '../mutations/StartDraggingReflectionMutation'

const subscription = graphql`
  subscription MeetingSubscription($meetingId: ID!) {
    meetingSubscription(meetingId: $meetingId) {
      __typename
      ...AddReactjiToReactableMutation_meeting @relay(mask: false)
      ...AddCommentMutation_meeting @relay(mask: false)
      ...CreateReflectionMutation_meeting @relay(mask: false)
      ...DeleteCommentMutation_meeting @relay(mask: false)
      ...DragDiscussionTopicMutation_meeting @relay(mask: false)
      ...EditReflectionMutation_meeting @relay(mask: false)
      ...EndDraggingReflectionMutation_meeting @relay(mask: false)
      ...FlagReadyToAdvanceMutation_meeting @relay(mask: false)
      ...NewMeetingCheckInMutation_meeting @relay(mask: false)
      ...PromoteNewMeetingFacilitatorMutation_meeting @relay(mask: false)
      ...RemoveReflectionMutation_meeting @relay(mask: false)
      ...SetAppLocationMutation_meeting @relay(mask: false)
      ...SetPhaseFocusMutation_meeting @relay(mask: false)
      ...SetStageTimerMutation_meeting @relay(mask: false)
      ...StartDraggingReflectionMutation_meeting @relay(mask: false)
      ...UpdateCommentContentMutation_meeting @relay(mask: false)
      ...UpdateNewCheckInQuestionMutation_meeting @relay(mask: false)
      ...UpdateDragLocationMutation_meeting @relay(mask: false)
      ...UpdateReflectionContentMutation_meeting @relay(mask: false)
      ...UpdateReflectionGroupTitleMutation_meeting @relay(mask: false)
      ...UpdateRetroMaxVotesMutation_meeting @relay(mask: false)
      ...VoteForReflectionGroupMutation_meeting @relay(mask: false)
    }
  }
`

const onNextHandlers = {
  EndDraggingReflectionPayload: endDraggingReflectionMeetingOnNext,
  PromoteNewMeetingFacilitatorPayload: promoteNewMeetingFacilitatorMeetingOnNext
}

const updateHandlers = {
  AddCommentSuccess: addCommentMeetingUpdater,
  CreateReflectionPayload: createReflectionMeetingUpdater,
  DeleteCommentSuccess: deleteCommentMeetingUpdater,
  DragDiscussionTopicPayload: dragDiscussionTopicMeetingUpdater,
  EditReflectionPayload: editReflectionMeetingUpdater,
  EndDraggingReflectionPayload: endDraggingReflectionMeetingUpdater,
  RemoveReflectionPayload: removeReflectionMeetingUpdater,
  SetStageTimerPayload: setStageTimerMeetingUpdater,
  StartDraggingReflectionPayload: startDraggingReflectionMeetingUpdater
}

const MeetingSubscription = (
  atmosphere: Atmosphere,
  variables: Variables,
  router: {history: RouterProps['history']}
) => {
  return requestSubscription<MeetingSubscriptionResponse>(atmosphere, {
    subscription,
    variables,
    updater: (store) => {
      const payload = store.getRootField('meetingSubscription') as any
      if (!payload) return
      const type = payload.getValue('__typename') as string
      const handler = updateHandlers[type]
      if (handler) {
        handler(payload, {atmosphere, store})
      }
    },
    onNext: (result) => {
      if (!result) return
      const {meetingSubscription} = result
      const {__typename: type} = meetingSubscription
      const handler = onNextHandlers[type]
      if (handler) {
        handler(meetingSubscription, {...router, atmosphere})
      }
    },
    onCompleted: () => {
      atmosphere.unregisterSub(MeetingSubscription.name, variables)
    }
  })
}
MeetingSubscription.key = 'meeting'
export default MeetingSubscription
