import { Breadcrumb, DatePicker, Table, TableProps, Tag, Tooltip } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TAdSetsTable } from "../../models/advertisement/advertisement"
import { ClusterOutlined, DollarOutlined, ProjectOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { convertStringToRoundNumber, formatDateTime, formatDateYMD, formatNumberWithCommas, formatNumberWithCommasNotZero, handleDevice, handleEffectiveStatus, handleFacebookPosition } from "../../helper/const"
import useDateRangeStore from "../../store/dateRangeStore"
import dayjs, { Dayjs } from "dayjs"

const AdSetManagement: FC = () => {
  const [dataTable, setDataTable] = useState<TAdSetsTable[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [breadCrumbData, setBreadCrumbData] = useState<{ title: ReactNode }[]>([])
  const breadCrumbName = JSON.parse(sessionStorage.getItem('breadCrumbName') || 'null');
  const param = useParams();
  const location = useLocation();
  const advertisementUrl = location.pathname.split('/')[1]
  const campaignsUrl = location.pathname.split('/').slice(1, 4).join('/')

  const navigate = useNavigate()

  const { RangePicker } = DatePicker;
  const { dateRange, setDateRange } = useDateRangeStore();
  const [startTime, setStartTime] = useState<string>(dateRange[0] ? formatDateYMD(dateRange[0].toDate()) : '');
  const [endTime, setEndTime] = useState<string>(dateRange[1] ? formatDateYMD(dateRange[1].toDate()) : '');

  const columns: TableProps<TAdSetsTable>['columns'] = [
    {
      title: 'Tên nhóm quảng cáo',
      dataIndex: 'name',
      key: 'name',
      className: styles['center-cell'],
      fixed: 'left'
    },
    {
      title: 'Trạng thái nhóm quảng cáo',
      dataIndex: 'effectiveStatus',
      key: 'effectiveStatus',
      className: styles['center-cell'],
      render: (value) => handleEffectiveStatus(value),
      width: 210
    },
    {
      title: 'Giới hạn độ tuổi',
      dataIndex: 'targeting',
      key: 'age',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = targeting ? JSON.parse(targeting) : null
        return (
          <span>{targetingData?.age_min} - {targetingData?.age_max}</span>
        )
      },
      width: 150
    },
    {
      title: 'Địa điểm mục tiêu quảng cáo',
      dataIndex: 'targeting',
      key: 'countries',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = targeting ? JSON.parse(targeting) : null;
        return targetingData?.geo_locations?.countries ? (
          <>
            {targetingData.geo_locations.countries.map((item: string, index: number) => (
              <Tag key={index}>{item}</Tag>
            ))}
          </>
        ) : '-';
      },
      width: 220
    },
    {
      title: 'Nền tảng',
      dataIndex: 'targeting',
      key: 'publisher_platforms',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = targeting ? JSON.parse(targeting) : null
        return (
          targetingData.publisher_platforms ? (
            <>
              {targetingData?.publisher_platforms?.map((item: string) => <Tag>{item}</Tag>)}
            </>
          ) : '-'
        )
      },
      width: 200
    },
    {
      title: 'Vị trí hiển thị trên facebook',
      dataIndex: 'targeting',
      key: 'facebook_positions',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = targeting ? JSON.parse(targeting) : null
        const facebookPositionData = targetingData?.facebook_positions?.map((item: string) => handleFacebookPosition(item))
        return (
          facebookPositionData ? (
            <>
              {facebookPositionData.map((item: string, index: number) => (
                <Tag key={index}>{item}</Tag>
              ))}
            </>
          ) : '-'
        )
      }
    },
    {
      title: 'Nền tảng hiển thị',
      dataIndex: 'targeting',
      key: 'device_platforms',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = targeting ? JSON.parse(targeting) : null;
        const deviceData = targetingData?.device_platforms?.map((item: string) => handleDevice(item));

        return deviceData ? (
          <>
            {deviceData.map((item: string, index: number) => (<Tag key={index}>{item}</Tag>))}
          </>
        ) : '-';
      },
      width: 200
    },
    {
      title: 'Id Fanpage',
      dataIndex: 'promoteObjectPageId',
      key: 'page_id',
      className: styles['center-cell'],
      render: (value) => value || '-',
      width: 200
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
              <span>{formatNumberWithCommas(record?.dailyBudget)}</span>
            </>
          )
        }
        else if (record.lifetimeBudget) {
          return (
            <>
              <div>Ngân sách trọn đời:</div>
              <span>{formatNumberWithCommas(record?.lifetimeBudget)}</span>
            </>
          )
        }
        else {
          return (
            <>
              <div>Ngân sách thuộc quảng cáo</div>
            </>
          )
        }
      },
      width: 200
    },
    {
      title: 'Ngân sách còn lại của nhóm quảng cáo',
      dataIndex: 'budgetRemaining',
      key: 'budgetRemaining',
      className: styles['center-cell'],
      render: (value) => formatNumberWithCommasNotZero(convertStringToRoundNumber(value)),
      width: 200
    },
    {
      title: 'Thời gian chạy nhóm quảng cáo',
      dataIndex: 'startTime',
      key: 'startTime',
      className: styles['center-cell'],
      render: (startTime) => <span>{formatDateTime(startTime) || '-'}</span>
    },
    {
      title: 'Thời gian cập nhật dữ liệu',
      dataIndex: 'updateDataTime',
      key: 'updateDataTime',
      className: styles['center-cell'],
      render: (updateDataTime) => <span>{formatDateTime(updateDataTime) || '-'}</span>
    },
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
    advertisementApi.getListAdSet(String(param.campaignId), currentPage, 10, startTime, endTime).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TAdSetsTable) => ({
          ...item,
          key: item.id,
        }));
        setTotalPage(res.data.paging.totalPages)
        setDataTable(prevData => {
          const updatedData = [...prevData];
          dataTableConfig.forEach((newItem: TAdSetsTable) => {
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
  }, [currentPage, param.campaignId, startTime, endTime])

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
            <Link to={`/${campaignsUrl}`}>
              <ProjectOutlined />
              <Tooltip title={`Chiến dịch tài khoản: ${breadCrumbName.accountName}`} placement="bottom">
                <span className={styles["breadcrumb-item"]}>Chiến dịch</span>
              </Tooltip>
            </Link>
          </>
        )
      },
      {
        title: (
          <>
            <ClusterOutlined />
            <Tooltip title={`Nhóm quảng cáo chiến dịch: ${breadCrumbName.campaignName}`} placement="bottom">
              <span className={styles["breadcrumb-item"]}>Nhóm quảng cáo</span>
            </Tooltip>
          </>
        )
      }
    ])
  }, [param.accountId, param.campaignId])

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
              const updatedData = { ...breadCrumbName, groupName: record.name }
              sessionStorage.setItem('breadCrumbName', JSON.stringify(updatedData))
              navigate(`${location.pathname}/${record.id}/ad`)
            }
          }
        }}
        loading={isLoading}
        onScroll={handleScroll}
        scroll={{ x: 2500, y: dataTable.length > 5 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default AdSetManagement