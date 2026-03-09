import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import hiveLogo from "@/assets/hive_white_logo.png";

const Index = () => {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [requiredPercentage, setRequiredPercentage] = useState("75");
  const [showResults, setShowResults] = useState(false);

  const total = parseInt(totalClasses) || 0;
  const attended = parseInt(attendedClasses) || 0;
  const required = parseFloat(requiredPercentage) || 75;
  const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
  const isAbove = currentPercentage >= required;
  const hasInput = total > 0 && attended >= 0;
  const isInvalid = attended > total;

  // How many classes can be skipped
  let canSkip = 0;
  if (isAbove && total > 0 && !isInvalid) {
    let skip = 0;
    while (((attended) / (total + skip + 1)) * 100 >= required) {
      skip++;
    }
    canSkip = skip;
  }

  // How many classes needed to reach required
  let needToAttend = 0;
  if (!isAbove && total > 0) {
    let extra = 0;
    while (((attended + extra) / (total + extra)) * 100 < required && extra < 1000) {
      extra++;
    }
    needToAttend = extra;
  }

  const clampedPct = Math.min(Math.max(currentPercentage, 0), 100);
  const chartData = [
    { name: "Attended", value: clampedPct },
    { name: "Missed", value: 100 - clampedPct },
  ];

  const getStatus = () => {
    if (isInvalid) return { label: "Invalid", color: "bg-yellow-100 text-yellow-800 border-yellow-300" };
    if (currentPercentage >= required + 10) return { label: "Safe", color: "bg-green-100 text-green-800 border-green-300" };
    if (currentPercentage >= required) return { label: "On Track", color: "bg-blue-100 text-blue-800 border-blue-300" };
    if (currentPercentage >= required - 10) return { label: "Warning", color: "bg-orange-100 text-orange-800 border-orange-300" };
    return { label: "Critical", color: "bg-red-100 text-red-800 border-red-300" };
  };

  const status = getStatus();
  const chartColor = isInvalid ? "#f59e0b" : isAbove ? "#22c55e" : "#ef4444";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-6 px-4 relative">
        <img src={hiveLogo} alt="Logo" className="absolute top-4 left-4 h-14 w-14" />
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Attendance Calculator Lite
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">Your friendly attendance calculator</p>
      </div>

      <div className="flex flex-col items-center px-4 pb-12 gap-5 max-w-lg mx-auto">
        {/* Input Card */}
        <Card className="w-full shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Enter Your Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="attended">Classes Attended</Label>
              <Input
                id="attended"
                type="number"
                min="0"
                placeholder="e.g. 40"
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="total">Total Classes Held</Label>
              <Input
                id="total"
                type="number"
                min="0"
                placeholder="e.g. 50"
                value={totalClasses}
                onChange={(e) => setTotalClasses(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="required">Minimum Required Attendance (%)</Label>
              <Input
                id="required"
                type="number"
                min="0"
                max="100"
                placeholder="75"
                value={requiredPercentage}
                onChange={(e) => setRequiredPercentage(e.target.value)}
              />
            </div>

            <Button 
              onClick={() => setShowResults(true)} 
              className="w-full"
              disabled={!hasInput}
            >
              Check Attendance
            </Button>

            {isInvalid && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ Classes attended cannot exceed total classes held.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Card */}
        {hasInput && showResults && (
          <Card className="w-full shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Stats */}
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Attendance</p>
                    <p className="text-3xl font-bold text-foreground">
                      {currentPercentage.toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {!isInvalid && (
                    <div>
                      {isAbove ? (
                        <>
                          <p className="text-xs text-muted-foreground mb-0.5">Classes you can skip</p>
                          <p className="text-2xl font-bold text-foreground">{canSkip}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground mb-0.5">Classes to attend consecutively</p>
                          <p className="text-2xl font-bold text-foreground">{needToAttend}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Donut Chart */}
                <div className="relative flex-shrink-0 w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={52}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        <Cell fill={chartColor} />
                        <Cell fill="hsl(var(--muted))" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-foreground">
                      {currentPercentage.toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isAbove ? "Safe" : "Missed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom message */}
              {!isInvalid && (
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-sm text-center text-muted-foreground">
                    {isAbove
                      ? canSkip > 0
                        ? `✅ You can skip ${canSkip} more class${canSkip !== 1 ? "es" : ""} and stay above ${required}%!`
                        : `⚠️ You're right at the edge — don't skip any more classes!`
                      : `📚 Attend ${needToAttend} more consecutive class${needToAttend !== 1 ? "es" : ""} to reach ${required}%.`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="pb-6 pt-2 text-center">
        <p className="text-xs text-muted-foreground">Developed By J Riteesh Reddy</p>
      </div>
    </div>
  );
};

export default Index;
