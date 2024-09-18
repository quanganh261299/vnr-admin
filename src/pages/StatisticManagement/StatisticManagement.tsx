import { FC, useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import styles from './style.module.scss'
import { DatePicker, Select, Spin } from "antd";
import { formatDateYMD, statisticType } from "../../helper/const";
import { NoUndefinedRangeValueType } from 'rc-picker/lib/PickerInput/RangePicker';
import dayjs from "dayjs";
import { TBarChartData } from "../../models/statistic/statistic";
import { SelectType } from "../../models/common";
import organizationApi from "../../api/organizationApi";
import { TSystemTable } from "../../models/system/system";
import branchApi from "../../api/branchApi";
import { TAgencyTable } from "../../models/agency/agency";
import groupApi from "../../api/groupApi";
import { TypeTeamTable } from "../../models/team/team";
import statisticApi from "../../api/statisticApi";

const StatisticManagement: FC = () => {
  const [totalAmountSpentData, setTotalAmountSpentData] = useState<TBarChartData>({ x: [], y: [] })
  const [title, setTitle] = useState<string>('Thống kê tổng tiền chi tiêu cho Facebook cá nhân')
  const [barChartType, setBarChartType] = useState<number>(1)
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectAgencyData, setSelectAgencyData] = useState<SelectType[]>([])
  const [selectTeamData, setSelectTeamData] = useState<SelectType[]>([])
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [selectAgencyId, setSelectAgencyId] = useState<string | null>(null)
  const [selectTeamId, setSelectTeamId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isBarChart: false,
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false
  })
  const { RangePicker } = DatePicker;
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const oneMonthFromYesterday = new Date(yesterday);
  oneMonthFromYesterday.setMonth(yesterday.getMonth() - 1);
  const [startTime, setStartTime] = useState<string>(formatDateYMD(oneMonthFromYesterday))
  const [endTime, setEndTime] = useState<string>(formatDateYMD(yesterday))


  const totalAmountSpent = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {

    },
    xAxis: [
      {
        type: 'category',
        data: totalAmountSpentData?.x?.length ? totalAmountSpentData.x : [],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        name: 'VND',
        type: 'value'
      }
    ],
    series: [
      {
        type: 'bar',
        // barWidth: '60%',
        data: totalAmountSpentData?.y?.length ? totalAmountSpentData.y : []
      }
    ]
  };

  const highestResultEmployee = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {

    },
    xAxis: [
      {
        type: 'category',
        data: ['Test', 'Tue2', 'Wed2', 'Thu2', 'Fri2', 'Sat2', 'Sun2', 'r12'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        name: 'Budget (million USD)',
        type: 'value'
      }
    ],
    series: [
      {
        type: 'bar',
        // barWidth: '60%',
        data: [1321, 5212, 2200, 3234, 3190, 1330, 220]
      }
    ]
  };

  const highestResultCampaign = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {

    },
    xAxis: [
      {
        type: 'category',
        data: ['Test', 'Tue2', 'Wed2', 'Thu2', 'Fri2', 'Sat2', 'Sun2', 'r12'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        name: 'Budget (million USD)',
        type: 'value'
      }
    ],
    series: [
      {
        type: 'bar',
        // barWidth: '60%',
        data: [1321, 5212, 2200, 3234, 3190, 1330, 220]
      }
    ]
  };

  const spendingThresholdLeft = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {

    },
    xAxis: [
      {
        type: 'category',
        data: ['Test', 'Tue2', 'Wed2', 'Thu2', 'Fri2', 'Sat2', 'Sun2', 'r12'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        name: 'Budget (million USD)',
        type: 'value'
      }
    ],
    series: [
      {
        type: 'bar',
        // barWidth: '60%',
        data: [1321, 5212, 2200, 3234, 3190, 1330, 220]
      }
    ]
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [optionBarChart, setOptionBarChart] = useState<any>(totalAmountSpent)

  const handleChangeBarChartType = (value: number) => {
    switch (value) {
      case 1: {
        setBarChartType(1)
        setOptionBarChart(totalAmountSpent)
        setTitle('Thống kê tổng tiền chi tiêu cho Facebook cá nhân')
        break;
      }
      case 2: {
        setBarChartType(2)
        setOptionBarChart(highestResultEmployee)
        setTitle('Thống kê nhân sự có số lượng kết quả cao nhất')
        break;
      }
      case 3: {
        setBarChartType(3)
        setOptionBarChart(highestResultCampaign)
        setTitle('Thống kê tổng chiến dịch')
        break;
      }
      case 4: {
        setBarChartType(4)
        setOptionBarChart(spendingThresholdLeft)
        setTitle('Thống kê ngưỡng chi tiêu còn lại')
        break;
      }
    }
  };

  const onChangeSystem = (value: string) => {
    setSelectSystemId(value)
    setSelectAgencyId(null)
    setSelectTeamId(null)
  };

  const onSearchSystem = (value: string) => {
    console.log('search:', value);
  };

  const onChangeAgency = (value: string) => {
    setSelectAgencyId(value)
    setSelectTeamId(null)
  };

  const onSearchAgency = (value: string) => {
    console.log('search:', value);
  };

  const onChangeTeam = (value: string) => {
    setSelectTeamId(value)
  };

  const onSearchTeam = (value: string) => {
    console.log('search:', value);
  };

  const handleRangeChange = (dates: NoUndefinedRangeValueType<dayjs.Dayjs> | null) => {
    if (dates !== null && dates[0] !== null && dates[1] !== null) {
      const startTime = formatDateYMD(dates[0].toDate());
      const endTime = formatDateYMD(dates[1].toDate());
      setStartTime(startTime)
      setEndTime(endTime)
    }
  };

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: true }))
    setSelectAgencyData([])
    setSelectTeamData([])
    organizationApi.getListOrganization().then((res) => {
      setSelectSystemData(
        res.data.data.map((item: TSystemTable) => ({
          value: item.id,
          label: item.name
        }))
      )
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false }))
    })
    if (selectSystemId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false, isSelectAgency: true }))
      branchApi.getListBranch(undefined, undefined, selectSystemId).then((res) => {
        setSelectAgencyData(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false }))
      })
    }
    if (selectAgencyId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false, isSelectTeam: true }))
      groupApi.getListGroup(undefined, undefined, undefined, selectAgencyId).then((res) => {
        setSelectTeamData(
          res.data.data.map((item: TypeTeamTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: false }))
      })
    }
  }, [selectSystemId, selectAgencyId])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isBarChart: true }))
    switch (barChartType) {
      case 1: {
        statisticApi.getTotalAmountSpent(
          startTime,
          endTime,
          selectSystemId as string,
          selectAgencyId as string,
          selectTeamId as string)
          .then((res) => {
            setTotalAmountSpentData(res.data.data.data)
            setLoading((prevLoading) => ({ ...prevLoading, isBarChart: false }))
          })
        break;
      }
    }
  }, [startTime, endTime, selectSystemId, selectAgencyId, selectTeamId, barChartType])

  useEffect(() => {
    setOptionBarChart(totalAmountSpent);
  }, [totalAmountSpentData]);

  return (
    <>
      <div className={styles['statistic-filter']}>
        <Select
          allowClear
          showSearch
          placeholder="Chọn loại biểu đồ"
          options={statisticType}
          onChange={handleChangeBarChartType}
          defaultValue={1}
          className={styles['statistic-type']}
        />
        <div className={styles['statistic-filter-system']}>
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            optionFilterProp="label"
            onChange={onChangeSystem}
            onSearch={onSearchSystem}
            options={selectSystemData}
            className={styles["select-system-item"]}
            notFoundContent={'Không có dữ liệu'}
            loading={loading.isSelectSystem}
          />
          <Select
            allowClear
            showSearch
            placeholder="Chọn chi nhánh"
            optionFilterProp="label"
            onChange={onChangeAgency}
            onSearch={onSearchAgency}
            options={selectAgencyData}
            value={selectAgencyId || null}
            className={styles["select-system-item"]}
            notFoundContent={selectSystemId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
            loading={loading.isSelectAgency}
          />
          <Select
            allowClear
            showSearch
            placeholder="Chọn đội nhóm"
            optionFilterProp="label"
            onChange={onChangeTeam}
            onSearch={onSearchTeam}
            options={selectTeamData}
            value={selectTeamId || null}
            className={styles["select-system-item"]}
            notFoundContent={selectAgencyId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
            loading={loading.isSelectTeam}
          />
          <RangePicker
            format={"DD-MM-YYYY"}
            onChange={(dates) => handleRangeChange(dates)}
            placeholder={["Bắt đầu", "Kết thúc"]}
            defaultValue={[dayjs(oneMonthFromYesterday), dayjs(yesterday)]}
          />
        </div>
      </div>
      <h1 className={styles['title']}>{title}</h1>
      <Spin spinning={loading.isBarChart}>
        <ReactECharts
          option={optionBarChart}
          style={{ height: 'calc(100vh - 240px)' }}
        />
      </Spin>
    </>
  )
}

export default StatisticManagement