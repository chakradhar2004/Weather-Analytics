import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CityLoading() {
  return (
    <div>
      <Skeleton className="h-64 md:h-80 w-full" />
      <div className="container mx-auto p-4 md:p-8 -mt-32 relative z-10">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-10 w-10" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-between items-end">
            <div>
              <Skeleton className="h-24 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mt-4 md:mt-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
