"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { cardVariants } from "@/utils/cardVariants";
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
import {
  CollectionNode,
  ProductInput,
  useAdminCollectionsFindQuery,
} from "@/codegen/generated";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

// Define the props for the ProductOrganization component.
interface ProductOrganizationProps {
  domain: string;
  register: UseFormRegister<ProductInput>;
  setValue: UseFormSetValue<ProductInput>;
  watch: UseFormWatch<ProductInput>;
}

export default function ProductOrganization({
  domain,
  setValue,
  watch,
  register,
}: ProductOrganizationProps) {
  const selectedIds = watch("collectionIds") || ([] as string[]);
  // State to manage the search input.
  const [search, setSearch] = useState<string>("");
  // State to manage the open state of the popover.
  const [open, setOpen] = useState<boolean>(false);

  // Handles selection and deselection of a collection.
  const handleSelectedCollection = (
    checked: boolean,
    collection: Partial<CollectionNode>
  ): void => {
    const collectionId = String(collection.collectionId);
    if (checked) {
      setValue("collectionIds", [...selectedIds, collectionId], {
        shouldDirty: true,
      });
    } else {
      setValue(
        "collectionIds",
        selectedIds.filter((id) => id !== collectionId),
        { shouldDirty: true }
      );
    }
  };

  // Fetch collections from the API.
  const {
    data: collectionsData,
    error: collectionsError,
    loading: collectionsLoading,
    refetch,
  } = useAdminCollectionsFindQuery({
    variables: {
      domain: domain,
      search: search,
      first: 10,
    },
  });

  // Re-fetch collections whenever the search query changes.
  useEffect(() => {
    refetch();
  }, [search]);

  return (
    <Card className={cardVariants.base}>
      <CardHeader className={cardVariants.header}>
        <h2 className={cardVariants.title}>Product organization</h2>
      </CardHeader>
      <CardContent className={cardVariants.content}>
        <div className="md:w-2/4 mx-auto">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                />
                <CommandList>
                  <CommandEmpty>
                    {collectionsLoading ? "Loading.." : "No collection found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {collectionsData?.collectionsFind?.edges.map((edge) => {
                      const collection = edge?.node;
                      if (!collection) return null;

                      return (
                        <CommandItem
                          key={collection.collectionId}
                          value={collection.title}
                        >
                          <Checkbox
                            checked={selectedIds.includes(
                              String(collection.collectionId)
                            )}
                            onCheckedChange={(checked: boolean) => {
                              handleSelectedCollection(checked, collection);
                            }}
                          />
                          {collection.title}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex mt-2 gap-1">
          {collectionsData?.collectionsFind?.edges.map((edge) => {
            const collection = edge?.node;
            if (
              !collection ||
              !selectedIds.includes(String(collection.collectionId))
            )
              return null;

            return (
              <span
                key={collection.collectionId}
                className="text-sm bg-purple-100 rounded p-1 flex items-center gap-1"
              >
                {collection.title}
                <CiCircleRemove
                  onClick={() => {
                    setValue(
                      "collectionIds",
                      selectedIds.filter(
                        (id) => id !== collection.collectionId
                      ),
                      { shouldDirty: true }
                    );
                  }}
                  className="text-sm hover:text-red-500"
                />
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
