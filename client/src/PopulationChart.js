import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function PopulationChart() {
  const [data, setData] = useState([]);
  const [WorldData, setWorldData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentYear, setCurrentYear] = useState(1950);
  const [isFetching, setIsFetching] = useState(false);

  const handleData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_KEY}/data`);
      const temp_data = response.data.map((item, index) => ({
        id: index,
        title: item['Country name'],
        value: item.Population,
        year: Number(item.Year),
      }))
      // console.log(temp_data);
      setData(temp_data);
    } catch (error) {

    }
  }

  useEffect(() => {
    handleData();
  }, [])

  useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        if (isFetching === true && currentYear <= 2021) {
          const temp_data = data.filter(item => item.title !== 'World').filter((item) => item.year === currentYear).sort((a, b) => b.value - a.value);
          const temp_worlddata = data.filter(item => item.title === 'World').filter((item) => item.year === currentYear);
          // console.log(temp_data);
          // console.log(temp_worlddata);
          setWorldData(temp_worlddata);
          setChartData(temp_data);
          setCurrentYear((prevYear) => prevYear + 1);
        }
        if (currentYear > 2021) {
          setIsFetching(false);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentYear, isFetching]);

  const marks = {
    1950: '1950',
    1960: '1960',
    1970: '1970',
    1980: '1980',
    1990: '1990',
    2000: '2000',
    2010: '2010',
    2021: '2021',
  };

  return (
    <div style={{ padding: '2%' }}>

      <p style={{ textAlign: 'start', fontSize: '32px', fontWeight: 'bold' }}>
        Population growth per country, 1950 to 2021
      </p>

      {isFetching === false && currentYear === 1950 &&
        <button style={{ marginBottom: '40px', position: 'absolute', top: '50%', left: '50%' }} onClick={() => setIsFetching(true)}>Start</button>
      }

      {isFetching === false && currentYear > 2021 &&
        <button style={{ marginBottom: '40px' }} onClick={() => { setIsFetching(true); setCurrentYear(1950); }}>Retry</button>
      }

      {chartData.length > 0 &&
        <>
          <p style={{ position: 'fixed', right: '5%', bottom: '15%', fontSize: '86px', color: 'gray', fontWeight: 'bold' }}>{WorldData[0].year}</p>
          <p style={{ position: 'fixed', right: '5%', bottom: '10%', fontSize: '54px', color: 'gray' }}>Total: {WorldData[0].value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>

          <div style={{ width: '50vw', position: 'fixed', right: '5%', bottom: '10%' }}>
            <Slider
              min={1950}
              max={2021}
              marks={marks}
              value={WorldData[0].year}
              handleStyle={{
                border: 'none',
                height: 0,
                width: 0,
                marginTop: '-15px',
                background: 'none',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '12px solid #4287f5',
                pointerEvents: 'none'
              }}
            />
          </div>

          <Bar
            height={3200}
            width={500}
            data={{
              labels: chartData.map(row => row.title),
              fill: false,
              datasets: [
                {
                  label: 'Population',
                  data: chartData.map(row => row.value),
                }
              ]
            }}
            options={{
              indexAxis: 'y',
              plugins: {
                datalabels: {
                  display: true,
                  color: '#000',
                  anchor: 'end',
                  align: 'end',
                  formatter: (value) => value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
                  offset: 8
                }
              },
              scales: {
                x: {
                  position: 'top',
                },
                y: {
                  position: 'left',
                }
              }
            }}
            plugins={[ChartDataLabels]}
          />
        </>
      }
    </div>
  );

}
export default PopulationChart;