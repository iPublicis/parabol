import {GraphQLID, GraphQLNonNull} from 'graphql';
import makeSubscribeIter from 'server/graphql/makeSubscribeIter';
import {isTeamMember, sendTeamAccessError} from 'server/utils/authorization';
import AddGitHubRepoPayload from 'server/graphql/types/AddGitHubRepoPayload';

export default {
  type: new GraphQLNonNull(AddGitHubRepoPayload),
  args: {
    teamId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  subscribe: (source, {teamId}, {authToken, dataLoader, socketId}) => {
    // AUTH
    if (!isTeamMember(authToken, teamId)) return sendTeamAccessError(authToken, teamId);

    // RESOLUTION
    const channelName = `githubRepoAdded.${teamId}`;
    const filterFn = (value) => value.mutatorId !== socketId;
    return makeSubscribeIter(channelName, {filterFn, dataLoader});
  }
};
