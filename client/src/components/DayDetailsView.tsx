import { Drawer,Box, Button,CloseButton,Spinner, Stat, Flex } from "@chakra-ui/react"
import { Chart, useChart } from "@chakra-ui/charts"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, LabelList } from "recharts"



interface Props {
    data: DetailedDayData | null
    isLoading: boolean
    onClose: () => void
  }

  export const DayDetailsView = ({ data, isLoading, onClose }: Props) => {
    if (isLoading) return <Spinner />
    if (!data.basicData) return null
    console.log("DayDetailsView data:", data)
    
     const chart = useChart({
         data:data.hourlyData,
         series: [{ name: "<Electricity>", color: "teal.solid" }],
        })


    return (
     
        <Flex width="80vw"direction="row" align="start" padding="4">
           
        <Chart.Root chart={chart}>
            <LineChart data={chart.data} margin={{ left: 4, right: 40, top: 40 }} height="50%">
                <CartesianGrid
                stroke={chart.color("border")}
                strokeDasharray="3 3"
                horizontal={false}
                />
                <XAxis
                dataKey={chart.key("starttime")}
                tickFormatter={(value) => value.split('T')[1].substring(0, 5)}
                stroke={chart.color("border")}
                />
                <Tooltip
                animationDuration={100}
                cursor={{ stroke: chart.color("border") }}
                content={<Chart.Tooltip hideLabel />}
                />
                <Line
                isAnimationActive={false}
                dataKey={chart.key("hourlyprice")}
                fill={chart.color("teal.solid")}
                stroke={chart.color("teal.solid")}
                strokeWidth={2}
                >
                <LabelList
                    dataKey={chart.key("hourlyprice")}
                    position="right"
                    offset={10}
                    style={{
                    fontWeight: "600",
                    fill: chart.color("fg"),
                    }}
                />
                </Line>
            </LineChart>
            </Chart.Root>
            
        <Flex direction="column
        " justifyContent="center" gap="4" padding="4">
                    <Stat.Root>
                        <Stat.Label>Date</Stat.Label>
                        <Stat.ValueText>{data.basicData[0].date}</Stat.ValueText>
                    </Stat.Root>
                    <Stat.Root>
                        <Stat.Label>Total Production MWh/h</Stat.Label>
                        <Stat.ValueText>{data.basicData[0].totalProduction}</Stat.ValueText>
                    </Stat.Root>
                    <Stat.Root>
                        <Stat.Label>Total Consumption kWh</Stat.Label>
                        <Stat.ValueText>{data.basicData[0].totalConsumption}</Stat.ValueText>
                    </Stat.Root>
                    <Stat.Root>
                        <Stat.Label>Average Price c/kWh</Stat.Label>
                        <Stat.ValueText>{data.basicData[0].averagePrice}</Stat.ValueText>
                    </Stat.Root>
                    <Stat.Root>
                        <Stat.Label>Consecutive below Zero Prices in hours</Stat.Label>
                        <Stat.ValueText>{data.basicData[0].longestNegativePriceHours}</Stat.ValueText>
                    </Stat.Root>
                </Flex>
            <Button onClick={onClose}>Close</Button>
    </Flex>
      
                    
                
    )
  }