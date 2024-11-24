"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MdCancel } from "react-icons/md";
import { TbDatabaseExclamation } from "react-icons/tb";
import ProductsList from "./ProductsList";

export default function AddProducts({
  domain,
  selectedProducts,
  setSelectedProducts,
}) {
  return (
    <Card className="card w-full md:w-[60%]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2>Products</h2>
          <ProductsList
            domain={domain}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </div>
      </CardHeader>
      <CardContent>
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <Card key={product.id} className="p-2">
              <div className="flex justify-between items-center">
                <h2>{product.title}</h2>
                <Badge
                  variant={
                    product.status === "ACTIVE" ? "default" : "destructive"
                  }
                >
                  {product.status}
                </Badge>
                <Button type="button" size="sm" variant="outline">
                  <MdCancel />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <TbDatabaseExclamation className="text-[50px]" />
            <h2>
              There are no products in this collection. Click browse to add
              products.
            </h2>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
