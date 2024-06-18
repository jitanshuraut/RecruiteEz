import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function Tabs_Holder({
  children,
  TableHead_Data,
  card_Title,
  card_Description,
} = props) {
  return (
    <>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>{card_Title}</CardTitle>
          <CardDescription>{card_Description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {TableHead_Data.map((head) => {
                  if (head.class_ == true) {
                    return (
                      <TableHead
                        key={head.name}
                        className="hidden sm:table-cell"
                      >
                        {head.name}
                      </TableHead>
                    );
                  } else {
                    return <TableHead>{head.name}</TableHead>;
                  }
                })}
              </TableRow>
            </TableHeader>
            <TableBody>{children}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export default Tabs_Holder;
