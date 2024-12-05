"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ADMIN_COLLECTIONS_FIND } from "@/graphql/queries";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiCircleRemove } from "react-icons/ci";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

export default function ProductOrganization({
  domain,
  selectedCollections,
  setSelectedCollections,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [collections, setCollections] = useState([]);
  const [open, setOpen] = useState(false);

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
          {" "}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? "Loading.." : "No collection found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {collections.map(({ node }) => (
                      <CommandItem key={node.collectionId} value={node.title}>
                        <Checkbox
                          checked={selectedCollections.some(
                            (c) => c.collectionId === node.collectionId
                          )}
                          onCheckedChange={(checked) =>
                            handleSelectedCollection(checked, node)
                          }
                        />
                        {node.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
