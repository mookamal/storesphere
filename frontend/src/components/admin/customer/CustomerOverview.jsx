"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function CustomerOverview({ register }) {
  return (
    <Card className="card w-full md:w-[60%] lg:w-[40%]">
      <CardHeader>
        <h2>Customer overview</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center md:gap-4">
          {/* first name */}
          <div className="flex-1">
            <div className="mb-2">
              <Label htmlFor="firstName">First name</Label>
            </div>
            <Input
              id="firstName"
              size="sm"
              type="text"
              {...register("firstName")}
              placeholder="Ahmed"
            />
          </div>
          {/* last name */}
          <div className="flex-1">
            <div className="mb-2">
              <Label htmlFor="lastName">Last name</Label>
            </div>
            <Input
              id="lastName"
              size="sm"
              type="text"
              {...register("lastName")}
              placeholder="Mohamed"
            />
          </div>
        </div>
        {/* email */}
        <div className="mt-3">
          <div className="mb-2">
            <Label htmlFor="email">Email</Label>
          </div>
          <Input
            id="email"
            size="sm"
            type="email"
            {...register("email")}
            required
            placeholder="example@example.com"
          />
        </div>
      </CardContent>
    </Card>
  );
}
