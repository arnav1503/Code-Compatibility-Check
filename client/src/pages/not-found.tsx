import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl relative z-10">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertCircle className="h-10 w-10 text-destructive animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-display text-white">404</h1>
            <p className="text-xl font-medium text-destructive">System Error</p>
            <p className="text-muted-foreground text-sm font-mono">
              The requested neural pathway could not be found.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/" className="block">
              <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 hover:border-primary transition-all duration-300">
                Return to Neural Core
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
