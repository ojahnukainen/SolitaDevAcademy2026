import {  Table, Pagination, ButtonGroup, IconButton, Spinner, Text, VStack } from "@chakra-ui/react"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
 
 
 export const TablePagination = ({ pagination, setPagination, dataQuery }) => {
  return (
    <Pagination.Root
        count={dataQuery.data?.rowCount ?? 0}
        pageSize={pagination.pageSize}
        page={pagination.pageIndex + 1}
        onPageChange={(e) => setPagination((old) => ({ ...old, pageIndex: e.page - 1 }))}
        >
        <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger asChild>
            <IconButton>
                <HiChevronLeft />
            </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
                render={(page) => (
                    <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                    </IconButton>
                )}
            />

            <Pagination.NextTrigger asChild>
            <IconButton>
                <HiChevronRight />
            </IconButton>
            </Pagination.NextTrigger>
        </ButtonGroup>
    </Pagination.Root>
  );
};
