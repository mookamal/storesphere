"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_COLLECTIONS_FIND } from "@/graphql/queries";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
export default function ProductOrganization({ domain }) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [collections, setCollections] = useState([]);
  const [shoeCollections, setShoeCollections] = useState(false);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/get-data", {
        query: ADMIN_COLLECTIONS_FIND,
        variables: {
          domain: domain,
          search: search,
          first: 10,
        },
      });
      if (response.data.collectionsFind) {
        setCollections(response.data.collectionsFind.edges);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [search]);

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
            <div className="mt-2 border rounded shadow-md p-2 flex flex-col justify-center items-center">
              {isLoading ? (
                <AiOutlineLoading className="animate-spin" />
              ) : collections.length > 0 ? (
                collections.map((node) => {
                  const { title, collectionId } = node.node;
                  return (
                    <div
                      key={collectionId}
                      className="rounded hover:bg-gray-200 dark:hover:bg-black w-full p-1 flex gap-2 items-center"
                    >
                      <Checkbox />
                      {title}
                    </div>
                  );
                })
              ) : (
                "Not found"
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
