import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Dumbbell, Trophy, TrendingUp, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Dumbbell className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Fitness Challenge
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty">
            Track your lifts, compete with others, and push your limits. Join the challenge and see where you rank on
            the leaderboard.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="text-base">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
              <Link href="/log">Log Your Lift</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Log your lifts and monitor your strength gains over time</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Compete</CardTitle>
              <CardDescription>See how you stack up against other lifters on the leaderboard</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Join Community</CardTitle>
              <CardDescription>Be part of a motivated community pushing each other to improve</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="mt-20 border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <h2 className="text-2xl font-bold text-balance">Ready to start?</h2>
            <p className="max-w-xl text-muted-foreground text-pretty">
              Check the countdown timer to see when the challenge begins, or start logging your lifts now.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
