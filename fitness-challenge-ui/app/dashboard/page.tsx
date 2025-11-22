"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, Trophy } from "lucide-react"

interface Lift {
  id: string
  name: string
  liftType: string
  weight: number
  sets: number
  reps: number
  timestamp: number
}

export default function DashboardPage() {
  // Challenge start date - set to 7 days from now for demo
  const challengeStart = new Date()
  challengeStart.setDate(challengeStart.getDate() + 7)
  challengeStart.setHours(0, 0, 0, 0)

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [stats, setStats] = useState({
    totalLifts: 0,
    totalWeight: 0,
    userRank: "--",
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const distance = challengeStart.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadStats = () => {
      const liftsData = localStorage.getItem("fitnessLifts")
      if (liftsData) {
        const lifts: Lift[] = JSON.parse(liftsData)

        // Calculate total lifts
        const totalLifts = lifts.length

        // Calculate total weight lifted (weight * sets * reps for all lifts)
        const totalWeight = lifts.reduce((sum, lift) => {
          return sum + lift.weight * lift.sets * lift.reps
        }, 0)

        // Calculate leaderboard for ranking
        const lifterStats = new Map<string, { totalWeight: number; liftCount: number }>()

        lifts.forEach((lift) => {
          const existing = lifterStats.get(lift.name) || { totalWeight: 0, liftCount: 0 }
          lifterStats.set(lift.name, {
            totalWeight: existing.totalWeight + lift.weight * lift.sets * lift.reps,
            liftCount: existing.liftCount + 1,
          })
        })

        const leaderboard = Array.from(lifterStats.entries())
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.totalWeight - a.totalWeight)

        // Find current rank (assuming single user for now)
        const userRank = leaderboard.length > 0 ? "1" : "--"

        setStats({
          totalLifts,
          totalWeight,
          userRank,
        })
      }
    }

    loadStats()
    const interval = setInterval(loadStats, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Track the countdown and prepare for the challenge</p>
        </div>

        {/* Countdown Timer */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Challenge Countdown</CardTitle>
            </div>
            <CardDescription>Time until the fitness challenge begins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="mb-2 flex h-20 w-full items-center justify-center rounded-lg bg-card text-4xl font-bold tabular-nums text-primary sm:h-24 sm:text-5xl">
                    {item.value.toString().padStart(2, "0")}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Challenge Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                The challenge starts on{" "}
                <span className="font-medium text-foreground">
                  {challengeStart.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Start Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Get ahead by logging your lifts now and establishing your baseline
              </p>
              <Button asChild className="w-full">
                <Link href="/log">Log Your Lift</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Lifts Logged</span>
                  <span className="font-bold text-primary">{stats.totalLifts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Rank</span>
                  <span className="font-bold">{stats.userRank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Weight Lifted</span>
                  <span className="font-bold">{stats.totalWeight.toLocaleString()} lbs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
