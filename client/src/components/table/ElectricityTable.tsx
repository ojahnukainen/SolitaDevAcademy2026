import { flexRender, type Table } from '@tanstack/react-table'
import { type UseQueryResult } from '@tanstack/react-query'
import { Table as ChakraTable, Spinner, Text, VStack } from "@chakra-ui/react"
import type  { ElectricityDataJSON } from '@/types'

  interface ElectricityTableProps {
    table: Table<ElectricityDataJSON>
    dataQuery: UseQueryResult<{
      rows: ElectricityDataJSON[]
      rowCount: number
      pageCount: number
    }, Error>
    onRowClick: (date: string) => void
  }

export const ElectricityTable = ({ table, dataQuery, onRowClick }: ElectricityTableProps) => {

    console.log("mitä tämä tekee", dataQuery.isLoading)
    if (dataQuery.isLoading) {
        return (<VStack colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Loading...</Text>
        </VStack>)
    }

    if (dataQuery.isError) {
        return (<div>Error: {dataQuery.error.message}</div>);
    }

    return (
        <>
            <ChakraTable.Root size="sm" variant="outline" native>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <tr key={row.id} onClick={() => onRowClick(row.original.date)} style={{ cursor: 'pointer' }}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>


            </ChakraTable.Root>

        </>
    );
};
