import { Breadcrumb, DatePicker, Table, TableProps, Tooltip } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TCampaignTable } from "../../models/advertisement/advertisement"
import { DollarOutlined, ProjectOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { formatDateTime, formatDateYMD, formatNumberWithCommasNotZero, handleBuyingType, handleEffectiveStatus, handleObjective } from "../../helper/const"
import dayjs, { Dayjs } from "dayjs"
import useDateRangeStore from "../../store/dateRangeStore"

const CampaignsManagment: FC = () => {
  const [dataTable, setDataTable] = useState<TCampaignTable[]>([])
  // const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [breadCrumbData, setBreadCrumbData] = useState<{ title: ReactNode }[]>([])
  const param = useParams();
  const location = useLocation();
  const advertisementUrl = location.pathname.split('/')[1]
  const breadCrumbName = JSON.parse(sessionStorage.getItem('breadCrumbName') || 'null');
  const { RangePicker } = DatePicker;
  const currentDate = new Date();
  const oneMonthBeforeToday = new Date(currentDate);
  oneMonthBeforeToday.setMonth(currentDate.getMonth() - 1);
  const [startTime, setStartTime] = useState<string>(formatDateYMD(oneMonthBeforeToday))
  const [endTime, setEndTime] = useState<string>(formatDateYMD(currentDate))
  const { dateRange, setDateRange } = useDateRangeStore();

  const navigate = useNavigate()

  const columns: TableProps<TCampaignTable>['columns'] = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'name',
      key: 'name',
      className: styles['center-cell'],
      fixed: 'left',
      width: 200
    },
    {
      title: 'Loại mua',
      dataIndex: 'buyingType',
      key: 'buyingType',
      className: styles['center-cell'],
      render: (value) => handleBuyingType(value),
      width: 200,
    },
    {
      title: 'Trạng thái chiến dịch',
      dataIndex: 'effectiveStatus',
      key: 'effectiveStatus',
      className: styles['center-cell'],
      render: (value) => handleEffectiveStatus(value),
      width: 180
    },
    {
      title: 'Ngân sách',
      key: 'budget',
      className: styles['center-cell'],
      render: (record) => {
        if (record.dailyBudget) {
          return (
            <>
              <div>Ngân sách hàng ngày:</div>
              <span> {formatNumberWithCommasNotZero(record.dailyBudget)}</span>
            </>
          );
        }
        else if (record.lifetimeBudget) {
          return (
            <>
              <div>Ngân sách trọn đời:</div>
              <span> {formatNumberWithCommasNotZero(record.lifetimeBudget)}</span>
            </>
          );
        }
        else return <span>Ngân sách thuộc nhóm quảng cáo</span>
      },
      width: 250
    },
    {
      title: 'Ngân sách còn lại của chiến dịch',
      dataIndex: 'budgetRemaining',
      key: 'budgetRemaining',
      className: styles['center-cell'],
      render: (value) => formatNumberWithCommasNotZero(value),
      width: 250
    },
    {
      title: 'Mục tiêu chiến dịch',
      dataIndex: 'objective',
      key: 'objective',
      className: styles['center-cell'],
      render: (value) => handleObjective(value)
    },
    {
      title: 'Thời gian chạy chiến dịch',
      dataIndex: 'startTime',
      key: 'startTime',
      className: styles['center-cell'],
      render: (startTime) => <span>{formatDateTime(startTime) || '-'}</span>,
      width: 250,
    },
    {
      title: 'Thời gian cập nhật dữ liệu',
      dataIndex: 'updateDataTime',
      key: 'updateDataTime',
      className: styles['center-cell'],
      render: (updateDataTime) => <span>{formatDateTime(updateDataTime) || '-'}</span>,
      width: 250,
    },
    // {
    //   title: 'Các quốc gia áp dụng quảng cáo',
    //   dataIndex: 'specialAdCategoryCountry',
    //   key: 'specialAdCategoryCountry',
    //   className: styles['center-cell'],
    //   render: (countries) => {
    //     return (
    //       countries !== 'null' && (
    //         <span>{JSON.parse(countries).join(',')}</span>
    //       )
    //     )
    //   },
    //   width: 250
    // },
  ];

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading && currentPage < totalPage) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates !== null) {
      setDateRange(dates);
      if (dates[0] !== null && dates[1] !== null) {
        const startTime = formatDateYMD(dates[0].toDate());
        const endTime = formatDateYMD(dates[1].toDate());
        setStartTime(startTime);
        setEndTime(endTime);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true)
    advertisementApi.getListCampaigns(String(param.accountId), currentPage, 10, startTime, endTime).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TCampaignTable) => ({
          ...item,
          key: item.id,
        }));
        setTotalPage(res.data.paging.totalPages)
        setDataTable(prevData => {
          const updatedData = [...prevData];
          dataTableConfig.forEach((newItem: TCampaignTable) => {
            const existingIndex = updatedData.findIndex(item => item.id === newItem.id);
            if (existingIndex >= 0) {
              updatedData[existingIndex] = newItem;
            } else {
              updatedData.push(newItem);
            }
          });
          return updatedData;
        });
        setIsLoading(false)
      }
    }).catch(() => {
      setIsLoading(false)
    })
  }, [currentPage, param.accountId, startTime, endTime])

  useEffect(() => {
    setBreadCrumbData([
      {
        title: (
          <>
            <Link to={`/${advertisementUrl}`}>
              <DollarOutlined />
              <span className={styles["breadcrumb-item"]}>Tài khoản quảng cáo</span>
            </Link>
          </>
        )
      },
      {
        title: (
          <>
            <ProjectOutlined />
            <Tooltip title={`Chiến dịch tài khoản: ${breadCrumbName.accountName}`} placement="bottom">
              <span className={styles["breadcrumb-item"]}>
                Chiến dịch
              </span>
            </Tooltip>
          </>
        )
      }
    ])
  }, [param.accountId])

  return (
    <div className={styles["container"]}>
      <div className={styles["detail-information"]}>
        <Breadcrumb items={breadCrumbData} className={styles["breadcrumb"]} />
        <RangePicker
          allowClear={false}
          format={"DD-MM-YYYY"}
          onChange={(dates) => handleRangeChange(dates)}
          placeholder={["Bắt đầu", "Kết thúc"]}
          value={dateRange}
          maxDate={dayjs()}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: () => {
              const updatedData = { ...breadCrumbName, campaignName: record.name }
              sessionStorage.setItem('breadCrumbName', JSON.stringify(updatedData))
              navigate(`${location.pathname}/${record.id}/adsets`)
            }
          }
        }}
        onScroll={handleScroll}
        loading={isLoading}
        scroll={{ x: 2000, y: dataTable.length > 5 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default CampaignsManagment