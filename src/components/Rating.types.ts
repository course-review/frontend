export interface Rating {
  rating: number
  details: RatingDetails | null
}

export interface RatingDetails {
  oneStarRatings: number
  twoStarRatings: number
  threeStarRatings: number
  fourStarRatings: number
  fiveStarRatings: number
}
