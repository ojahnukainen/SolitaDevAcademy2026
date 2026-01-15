import { useEffect, useState, useMemo, } from 'react'
import './App.css'
import axios from 'axios'
import {  Table, Pagination, ButtonGroup, IconButton, Spinner, Text, VStack } from "@chakra-ui/react"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import {
  type PaginationState,
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table'

interface ElectricityDataJSON {
    id: number;
    date: string;
    totalProduction: string;  
    totalConsumption: string;
    averagePrice: string;
    longestNegativePriceHours: string;
}


function App() {
  const [serverData, setServerData] = useState<ElectricityDataJSON[]>([])

  useEffect(() => {
      axios.get('http://localhost:3000/api/electricity/',{params:{dateFrom: "2024-01-01"}}).then((response) => {
          console.log("nodeserver resoponse", response.data)
          
          setServerData(response.data as ElectricityDataJSON[])
        
      }).catch((error) => {
        console.error('Error fetching data:', error)
      })
        

    }, []);

  async function fetchData(options: {
    pageIndex: number
    pageSize: number
  }) {

    console.log("fetch data func", serverData)
    return {
      rows: serverData.slice(
        options.pageIndex * options.pageSize,
        (options.pageIndex + 1) * options.pageSize,
    ),
      pageCount: Math.ceil(serverData.length / options.pageSize),
      rowCount: serverData.length,
    }}

  const columns = useMemo<ColumnDef<ElectricityDataJSON>[]>(
    () => [
       {
        accessorKey: "date",
        header: "Date",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "totalProduction",
        header: "Total Production",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "totalConsumption",
        header: "Total Consumption",
        cell: (info) => `${info.getValue() !== null ? info.getValue() : "Data not available"}`,
        //cell: (info) => ()=>{info.getValue() === "null" ? "Data not available" : info.getValue()},
      },
      {
        accessorKey: "averagePrice",
        header: "Average Price c/kWh",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "longestNegativePriceHours",
        header: "Consecutive Bello Zero Prices",
        cell: (info) => info.getValue(),
      },
  ], [])

  const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 20,
    })

  const dataQuery = useQuery({
    queryKey: ['serverData', pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  })

  const defaultData = useMemo(() => [], [])

  const table = useReactTable({
      data: dataQuery.data?.rows ?? defaultData,
      columns,
      // pageCount: dataQuery.data?.pageCount ?? -1, //you can now pass in `rowCount` instead of pageCount and `pageCount` will be calculated internally (new in v8.13.0)
      rowCount: dataQuery.data?.rowCount, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
      
      state: {
        pagination,
      },
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true, //we're doing manual "server-side" pagination
      // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
      debugTable: true,
  })
  console.log("mitä tämä tekee", dataQuery.isLoading)
  if (dataQuery.isLoading) {
    return (<VStack colorPalette="teal">
    <Spinner color="colorPalette.600" />
    <Text color="colorPalette.600">Loading...</Text>
  </VStack>)
  }

  if (dataQuery.isError) {
    return <div>Error: {dataQuery.error.message}</div>
  }

  return (
    <div style={{height: "80%", width: "80%", display: "flex", justifyContent: "center", alignItems: "center"}}>
      
      
      <Table.Root size="sm" variant="outline" native>
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
            <tbody style={{ overflowY: "scroll", maxHeight: "4000px" }}>
              {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
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
          
          </Table.Root>
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
  </div>
  )
}

export default App
