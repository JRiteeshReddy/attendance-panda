import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [requiredPercentage, setRequiredPercentage] = useState("75");

  const total = parseInt(totalClasses) || 0;
  const attended = parseInt(attendedClasses) || 0;
  const required = parseFloat(requiredPercentage) || 75;
  const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
  const isAbove = currentPercentage >= required;
  const hasInput = total > 0 && attended >= 0 && attended <= total;

  // How many classes can be skipped
  let canSkip = 0;
  if (isAbove && total > 0) {
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          🐼 AttendancePanda
        </h1>
        <p className="mt-2 text-muted-foreground">Your friendly attendance calculator</p>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Enter your details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
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

          {hasInput && (
            <div className="mt-6 space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Attendance</p>
                <p
                  className={`text-5xl font-bold ${
                    isAbove ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {currentPercentage.toFixed(1)}%
                </p>
              </div>

              <Progress
                value={Math.min(currentPercentage, 100)}
                className={`h-3 ${isAbove ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"}`}
              />

              <div
                className={`rounded-lg p-4 text-center text-sm font-medium ${
                  isAbove
                    ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                    : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
                }`}
              >
                {isAbove ? (
                  canSkip > 0 ? (
                    <p>
                      ✅ You can skip <span className="font-bold">{canSkip}</span> more class
                      {canSkip !== 1 ? "es" : ""} and still stay above {required}%!
                    </p>
                  ) : (
                    <p>⚠️ You're at the edge — don't skip any more classes!</p>
                  )
                ) : (
                  <p>
                    📚 You need to attend <span className="font-bold">{needToAttend}</span> more consecutive class
                    {needToAttend !== 1 ? "es" : ""} to reach {required}%.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
