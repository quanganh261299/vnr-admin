import { Breadcrumb, Table, TableProps } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TAdSetsTable } from "../../models/advertisement/advertisement"
import { ClusterOutlined, DollarOutlined, ProjectOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { formatDateTime, formatNumberWithCommas } from "../../helper/const"

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

  const columns: TableProps<TAdSetsTable>['columns'] = [
    {
      title: 'Tên nhóm quảng cáo',
      dataIndex: 'name',
      key: 'name',
      className: styles['center-cell'],
      fixed: 'left'
    },
    {
      title: 'Giới hạn độ tuổi',
      dataIndex: 'targeting',
      key: 'age',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = JSON.parse(targeting)
        return (
          <span>{targetingData.age_min} - {targetingData.age_max}</span>
        )
      }
    },
    {
      title: 'Tự động hóa nhắm mục tiêu',
      dataIndex: 'targeting',
      key: 'age',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = JSON.parse(targeting)
        console.log('data', targetingData)
        return (
          targetingData && targetingData.targeting_automation && targetingData.targeting_automation.advantage_audience ? (
            <span>{targetingData.targeting_automation.advantage_audience}</span>
          ) : null
        )
      }
    },
    {
      title: 'Địa điểm mục tiêu quảng cáo',
      dataIndex: 'targeting',
      key: 'countries',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = JSON.parse(targeting)
        console.log('data', targetingData)
        return (
          targetingData.geo_locations.countries ? (
            <span>{targetingData.geo_locations.countries.join(', ')}</span>
          ) : null
        )
      }
    },
    {
      title: 'Nền tảng quảng cáo sẽ hiển thị',
      dataIndex: 'targeting',
      key: 'publisher_platforms',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = JSON.parse(targeting)
        return (
          targetingData.publisher_platforms ? (
            <span>{targetingData.publisher_platforms.join(', ')}</span>
          ) : null
        )
      }
    },
    {
      title: 'Vị trí hiển thị trên facebook',
      dataIndex: 'targeting',
      key: 'facebook_positions',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = JSON.parse(targeting)
        return (
          targetingData.facebook_positions ? (
            <span>{targetingData.facebook_positions.join(', ')}</span>
          ) : null
        )
      }
    },
    {
      title: 'Nền tảng thiết bị quảng cáo hiển thị',
      dataIndex: 'targeting',
      key: 'device_platforms',
      className: styles['center-cell'],
      render: (targeting) => {
        const targetingData = JSON.parse(targeting)
        return (
          targetingData.device_platforms ? (
            <span>{targetingData.device_platforms.join(', ')}</span>
          ) : null
        )
      }
    },
    {
      title: 'Trạng thái nhóm quảng cáo sau khi áp dụng qui tắc phân phối',
      dataIndex: 'effectiveStatus',
      key: 'effectiveStatus',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái được cấu hình cho nhóm quảng cáo',
      dataIndex: 'configuredStatus',
      key: 'configuredStatus',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái nhóm quảng cáo',
      dataIndex: 'status',
      key: 'status',
      className: styles['center-cell'],
    },
    {
      title: 'Id Fanpage',
      dataIndex: 'promoteObjectPageId',
      key: 'page_id',
      className: styles['center-cell'],
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
              <span>{formatNumberWithCommas(record.dailyBudget)}</span>
            </>
          )
        }
        else if (record.lifetimeBudget) {
          return (
            <>
              <div>Ngân sách trọn đời:</div>
              <span>{formatNumberWithCommas(record.lifetimeBudget)}</span>
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
    },
    {
      title: 'Ngân sách còn lại của nhóm quảng cáo',
      dataIndex: 'budgetRemaining',
      key: 'budgetRemaining',
      className: styles['center-cell'],
      render: (value) => <span>{formatNumberWithCommas(value)}</span>
    },
    {
      title: 'Thời gian tạo nhóm quảng cáo',
      dataIndex: 'createdTime',
      key: 'createdTime',
      className: styles['center-cell'],
      render: (createdTime) => <span>{formatDateTime(createdTime)}</span>
    },
    {
      title: 'Thời gian chạy nhóm quảng cáo',
      dataIndex: 'startTime',
      key: 'startTime',
      className: styles['center-cell'],
      render: (startTime) => <span>{formatDateTime(startTime)}</span>
    },
    {
      title: 'Thời gian cập nhật dữ liệu',
      dataIndex: 'updateDataTime',
      key: 'updateDataTime',
      className: styles['center-cell'],
      render: (updateDataTime) => <span>{formatDateTime(updateDataTime)}</span>
    },
  ];

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading && currentPage < totalPage) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    advertisementApi.getListAdSet(String(param.campaignId), currentPage, 10).then((res) => {
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
        setDataTable((prevData) => {
          const prevDataIds = new Set(prevData.map(item => item.id));
          const newData = dataTableConfig.filter((item: TAdSetsTable) => !prevDataIds.has(item.id));
          return [...prevData, ...newData];
        });
        setIsLoading(false)
      }
    }).catch((err) => {
      console.log('err', err)
      setIsLoading(false)
    })
  }, [param.campaignId])

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
              <span className={styles["breadcrumb-item"]}>Chiến dịch tài khoản {breadCrumbName.accountName}</span>
            </Link>
          </>
        )
      },
      {
        title: (
          <>
            <ClusterOutlined />
            <span className={styles["breadcrumb-item"]}>Nhóm quảng cáo chiến dịch {breadCrumbName.campaignName}</span>
          </>
        )
      }
    ])
  }, [param.accountId, param.campaignId])

  return (
    <div className={styles["container"]}>
      <Breadcrumb items={breadCrumbData} className={styles["breadcrumb"]} />
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
        scroll={{ x: 3500, y: dataTable.length > 5 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default AdSetManagement