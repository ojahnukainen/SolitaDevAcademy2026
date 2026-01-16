import { useEffect, useState, useMemo, } from 'react'
import './App.css'
import axios from 'axios'
import { Drawer, Flex, Button, CloseButton, Pagination, ButtonGroup, IconButton, Box } from '@chakra-ui/react'
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
import { DayDetailsView } from './components/DayDetailsView'


function App() {

  const [selectedDayId, setSelectedDayId] = useState<number | null>(null)

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

  const dayDetailsQuery = useQuery({
    queryKey: ['dayDetails', selectedDayId],
    queryFn: async () => {
      if (!selectedDayId) return null
      console.log("selectedDayId in query fn:", selectedDayId)
      const response = await axios.get(`http://localhost:3000/api/electricity/${selectedDayId}`)
      return response.data
    },
    enabled: selectedDayId !== null,  // Only run when a day is selected
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
    <>
    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <Flex direction="row" gap="4" width="100%" height="100%" justify="center" align="center">
      <Flex direction="column" gap="4" width="100%" height="100%" justify="center" align="center">
        <ElectricityTable table={table} dataQuery={dataQuery} onRowClick={setSelectedDayId} />
      
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
                                      onClick={() => {
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
      <Box width="400px" bgColor="blue.200" >
       {selectedDayId !== null ? 
        <DayDetailsView 
          data={dayDetailsQuery.data}
          isLoading={dayDetailsQuery.isLoading}
          onClose={() => setSelectedDayId(null)} 
        /> : <b>Select a day to see details</b>}
      </Box>
    </Flex>
       
            
              
  </div>
        
        </>
  )
}

export default App
