import { getUserBadges } from "@/lib/badges/getUserBadges"

const BadgesDisplay = ({ user }) => {
  const badges = getUserBadges(user)

  if (badges.length === 0) return null

  const lastBadge = badges[badges.length - 1]

  return (
    <span className="font-semibold">
      {lastBadge.label}
    </span>
  )
}

export default BadgesDisplay