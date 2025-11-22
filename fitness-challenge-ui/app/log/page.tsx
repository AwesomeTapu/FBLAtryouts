"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Dumbbell } from "lucide-react"

const liftTypes = ["Squat", "Bench Press", "Deadlift", "Overhead Press", "Barbell Row", "Pull-up", "Dip", "Other"]

export default function LogPage() {
  const [formData, setFormData] = useState({
    name: "",
    liftType: "",
    weight: "",
    sets: "",
    reps: "",
  })

  const [recentLifts, setRecentLifts] = useState<
    Array<{
      id: string
      name: string
      liftType: string
      weight: number
      sets: number
      reps: number
      timestamp: Date
    }>
  >([])

  useEffect(() => {
    const stored = localStorage.getItem("fitnessLifts")
    if (stored) {
      const parsed = JSON.parse(stored)
      setRecentLifts(
        parsed
          .map((lift: any) => ({
            ...lift,
            timestamp: new Date(lift.timestamp),
          }))
          .slice(0, 5),
      )
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLift = {
      id: Date.now().toString(),
      name: formData.name,
      liftType: formData.liftType,
      weight: Number.parseFloat(formData.weight),
      sets: Number.parseInt(formData.sets),
      reps: Number.parseInt(formData.reps),
      timestamp: new Date(),
    }

    const stored = localStorage.getItem("fitnessLifts")
    const allLifts = stored ? JSON.parse(stored) : []
    const updatedLifts = [newLift, ...allLifts]
    localStorage.setItem("fitnessLifts", JSON.stringify(updatedLifts))

    setRecentLifts([newLift, ...recentLifts].slice(0, 5))

    // Reset form
    setFormData({
      name: "",
      liftType: "",
      weight: "",
      sets: "",
      reps: "",
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Log Your Lift</h1>
          <p className="mt-2 text-muted-foreground">Enter your lift details to track your progress</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Lift Entry
              </CardTitle>
              <CardDescription>Fill in the details of your lift</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liftType">Lift Type</Label>
                  <Select value={formData.liftType} onValueChange={(value) => handleChange("liftType", value)} required>
                    <SelectTrigger id="liftType">
                      <SelectValue placeholder="Select lift type" />
                    </SelectTrigger>
                    <SelectContent>
                      {liftTypes.map((lift) => (
                        <SelectItem key={lift} value={lift}>
                          {lift}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="0"
                      value={formData.weight}
                      onChange={(e) => handleChange("weight", e.target.value)}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      placeholder="0"
                      value={formData.sets}
                      onChange={(e) => handleChange("sets", e.target.value)}
                      required
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      placeholder="0"
                      value={formData.reps}
                      onChange={(e) => handleChange("reps", e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Log Lift
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Lifts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Lifts</CardTitle>
              <CardDescription>Your latest logged lifts</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLifts.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">No lifts logged yet</p>
              ) : (
                <div className="space-y-3">
                  {recentLifts.map((lift) => (
                    <div key={lift.id} className="rounded-lg border border-border bg-card p-3">
                      <div className="mb-1 flex items-start justify-between">
                        <p className="text-sm font-medium">{lift.liftType}</p>
                        <span className="text-xs text-muted-foreground">
                          {lift.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{lift.name}</p>
                      <div className="mt-2 flex gap-3 text-xs">
                        <span className="font-medium text-primary">{lift.weight} lbs</span>
                        <span className="text-muted-foreground">
                          {lift.sets} × {lift.reps}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> Total weight lifted is calculated as weight × sets ×
              reps. Make sure to log all your lifts to climb the leaderboard!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
