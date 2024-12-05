"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
export default function ProductOrganization() {
  const [search, setSearch] = useState("");
  const [collections, setCollections] = useState([]);
  const [shoeCollections, setShoeCollections] = useState(false);

  return (
    <Card className="card">
      <CardHeader>
        <h2>Product organization</h2>
      </CardHeader>
      <CardContent>
        <div className="md:w-2/4 mx-auto">
          <div className="mb">
            <Label>Collections</Label>
          </div>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShoeCollections(true)}
            onBlur={() => setShoeCollections(false)}
          />
          {shoeCollections && (
            <div className="mt-2 border rounded shadow-md p-2">
              collection list
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
