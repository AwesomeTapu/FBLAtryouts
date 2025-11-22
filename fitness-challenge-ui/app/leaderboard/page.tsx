"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Trophy, TrendingUp, Medal } from "lucide-react"

type Lift = {
  id: string
  name: string
  liftType: string
  weight: number
  sets: number
  reps: number
  timestamp: string
}

type LeaderboardEntry = {
  rank: number
  name: string
  totalWeight: number
  liftsCount: number
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const loadLeaderboard = () => {
      const stored = localStorage.getItem("fitnessLifts")
      if (!stored) {
        setLeaderboardData([])
        return
      }

      const lifts: Lift[] = JSON.parse(stored)

      // Group by name and calculate totals
      const lifterMap = new Map<string, { totalWeight: number; liftsCount: number }>()

      lifts.forEach((lift) => {
        const totalWeight = lift.weight * lift.sets * lift.reps
        const existing = lifterMap.get(lift.name)

        if (existing) {
          existing.totalWeight += totalWeight
          existing.liftsCount += 1
        } else {
          lifterMap.set(lift.name, { totalWeight, liftsCount: 1 })
        }
      })

      // Convert to array and sort
      const leaderboard: LeaderboardEntry[] = Array.from(lifterMap.entries())
        .map(([name, data]) => ({
          name,
          totalWeight: data.totalWeight,
          liftsCount: data.liftsCount,
          rank: 0,
        }))
        .sort((a, b) => b.totalWeight - a.totalWeight)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }))

      setLeaderboardData(leaderboard)
    }

    loadLeaderboard()

    // Poll for updates every 2 seconds
    const interval = setInterval(loadLeaderboard, 2000)
    return () => clearInterval(interval)
  }, [])

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-amber-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="mt-2 text-muted-foreground">Rankings of top lifters by total weight lifted</p>
        </div>

        {leaderboardData.length > 0 && (
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Top Lifter</p>
                    <p className="mt-1 text-xl font-bold">{leaderboardData[0]?.name}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Weight</p>
                    <p className="mt-1 text-xl font-bold">{leaderboardData[0]?.totalWeight.toLocaleString()} lbs</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Lifters</p>
                    <p className="mt-1 text-xl font-bold">{leaderboardData.length}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg font-bold text-primary">{leaderboardData.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leaderboard Card */}
        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
            <CardDescription>Top lifters sorted by total weight lifted</CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold">No Data Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The leaderboard will populate once lifters start logging their data.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 border-b border-border pb-2 text-sm font-medium text-muted-foreground">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-5 sm:col-span-6">Name</div>
                  <div className="col-span-3 sm:col-span-3 text-right">Total Weight</div>
                  <div className="col-span-3 sm:col-span-2 text-right">Lifts</div>
                </div>

                {/* Leaderboard Entries */}
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`grid grid-cols-12 gap-4 rounded-lg py-3 transition-colors hover:bg-muted/50 ${
                      entry.rank <= 3 ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      {getRankBadge(entry.rank) || (
                        <span className="text-lg font-bold text-muted-foreground">{entry.rank}</span>
                      )}
                    </div>
                    <div className="col-span-5 sm:col-span-6 flex items-center">
                      <span className="truncate font-medium">{entry.name}</span>
                    </div>
                    <div className="col-span-3 sm:col-span-3 flex items-center justify-end">
                      <span className="font-bold text-primary">{entry.totalWeight.toLocaleString()} lbs</span>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end">
                      <span className="text-sm text-muted-foreground">{entry.liftsCount} lifts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
