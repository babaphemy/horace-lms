import { AccessRoles } from "@/utils/roles"

interface Principal {
  id?: string
  roles?: readonly string[]
}

interface TrackScope {
  mentorTrackIds?: readonly string[]
  enrolledTrackIds?: readonly string[]
}

// UI predicates only. Assignments must come from an authenticated API response;
// the backend remains responsible for authorizing every resource request.
export class LmsAuthorization {
  private readonly principal: Principal | null | undefined
  private readonly scope: TrackScope

  constructor(principal?: Principal | null, scope: TrackScope = {}) {
    this.principal = principal
    this.scope = scope
  }

  isAdmin() {
    return (
      !!this.principal?.id &&
      !!this.principal.roles?.includes(AccessRoles.ADMIN)
    )
  }

  canAccessMentorRoutes() {
    return (
      !!this.principal?.id &&
      (this.isAdmin() || !!this.principal.roles?.includes(AccessRoles.MENTOR))
    )
  }

  isMentorOfTrack(trackId?: string | null) {
    return (
      !!trackId &&
      !!this.principal?.id &&
      !!this.principal.roles?.includes(AccessRoles.MENTOR) &&
      !!this.scope.mentorTrackIds?.includes(trackId)
    )
  }

  isEnrolled(trackId?: string | null) {
    return (
      !!trackId &&
      !!this.principal?.id &&
      !!this.scope.enrolledTrackIds?.includes(trackId)
    )
  }

  ownsResource(ownerId?: string | null) {
    return !!ownerId && !!this.principal?.id && ownerId === this.principal.id
  }

  canReadTrack(trackId?: string | null) {
    return !!trackId && (this.isAdmin() || this.isMentorOfTrack(trackId))
  }
}
