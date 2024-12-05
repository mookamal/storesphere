"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_COLLECTIONS_FIND } from "@/graphql/queries";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { CiCircleRemove } from "react-icons/ci";

export default function ProductOrganization({
  domain,
  selectedCollections,
  setSelectedCollections,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [collections, setCollections] = useState([]);
  const [shoeCollections, setShoeCollections] = useState(false);

  const handleSelectedCollection = (checked, collection) => {
    setSelectedCollections((prev) => {
      if (checked) {
        return [...prev, collection];
      } else {
        return prev.filter((c) => collection.collectionId !== c.collectionId);
      }
    });
  };

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
            // onBlur={() => setShoeCollections(false)}
          />
          {shoeCollections && (
            <div className="mt-2 border rounded shadow-md p-2 flex flex-col justify-center items-center">
              {isLoading ? (
                <AiOutlineLoading className="animate-spin" />
              ) : collections.length > 0 ? (
                collections.map(({ node }) => {
                  const { title, collectionId } = node;
                  return (
                    <div
                      key={collectionId}
                      className="rounded hover:bg-gray-200 dark:hover:bg-black w-full p-1 flex gap-2 items-center"
                    >
                      <Checkbox
                        checked={selectedCollections.some(
                          (c) => c.collectionId === collectionId
                        )}
                        onCheckedChange={(checked) =>
                          handleSelectedCollection(checked, node)
                        }
                      />
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

        <div className="flex mt-2 gap-1">
          {selectedCollections.length > 0 &&
            selectedCollections.map((collection) => (
              <span
                key={collection.collectionId}
                className="text-sm bg-purple-100 rounded p-1 flex items-center gap-1"
              >
                {collection.title}
                <CiCircleRemove
                  onClick={() => {
                    setSelectedCollections(
                      selectedCollections.filter(
                        (c) => c.collectionId !== collection.collectionId
                      )
                    );
                  }}
                  className="text-sm hover:text-red-500"
                />
              </span>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
