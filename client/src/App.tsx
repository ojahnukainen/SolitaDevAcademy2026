import { useEffect, useState, useMemo, } from 'react'
import './App.css'
import axios from 'axios'
import { Flex, HStack, Pagination, ButtonGroup, IconButton } from '@chakra-ui/react'
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import { ElectricityTable } from './components/table/ElectricityTable'

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import {
  type PaginationState,
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table'

import type ElectricityDataJSON from '@/types'
import { getElectricityColumns } from './components/table/TableColumns'


function App() {

  const columns = useMemo<ColumnDef<ElectricityDataJSON>[]>(
    () => getElectricityColumns(), [])

  const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 20,
    })
 
  async function fetchData(options: { pageIndex: number, pageSize: number }) {
    const response = await axios.get('http://localhost:3000/api/electricity/', {
      params: { page: options.pageIndex + 1, pageSize: options.pageSize }
    })
    
    console.log("totalcount data", response.data.pagination.totalCount)
    console.log("total pages data", response.data.pagination.totalPages)
    return {
      rows: response.data.processedData,
      rowCount: response.data.pagination.totalCount,
      pageCount: response.data.pagination.totalPages,
    }
  }


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
      
      debugTable: true,
  })


 

  return (
    <div style={{height: "80%", width: "80%", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <Flex direction="column" gap="4" width="100%" height="100%" justify="center" align="center">
      <ElectricityTable table={table} dataQuery={dataQuery} />
    
        <Pagination.Root
          count={dataQuery.data?.rowCount ?? 0}
          pageSize={pagination.pageSize}
          page={pagination.pageIndex + 1}
          onPageChange={(e) =>{console.log("Page change event:", e)} }
          >
          <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                  <IconButton onClick={() => table.previousPage()}>
                      <HiChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                  <Pagination.Items
                      render={(page) => (
                          <IconButton variant={{ base: "ghost", _selected: "outline" }}
                                      onClick={(e) => {
                                        
                                        table.setPageIndex(page.value-1);
            }}>
                          {page.value}
                          </IconButton>
                      )}
                  />

                  <Pagination.NextTrigger asChild>
                  <IconButton onClick={() => table.nextPage()}>
                      <HiChevronRight />
                  </IconButton>
                  </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
    </Flex>
      
         
  </div>
  )
}

export default App
