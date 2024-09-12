import { Breadcrumb, Table, TableProps } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TCampaignTable } from "../../models/advertisement/advertisement"
import { DollarOutlined, ProjectOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { formatDateTime, formatNumberWithCommas } from "../../helper/const"

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
      title: 'Tự động cân bằng ngân sách chiến dịch',
      dataIndex: 'budgetRebalanceFlag',
      key: 'budgetRebalanceFlag',
      className: styles['center-cell'],
      render: (value) => value ? <span>Có</span> : <span>Không</span>,
      width: 200,
    },
    {
      title: 'Loại mua',
      dataIndex: 'buyingType',
      key: 'buyingType',
      className: styles['center-cell'],
    },
    {
      title: 'Thời gian tạo chiến dịch',
      dataIndex: 'createdTime',
      key: 'createdTime',
      className: styles['center-cell'],
      render: (createdTime) => <span>{formatDateTime(createdTime)}</span>
    },
    {
      title: 'Thời gian chạy chiến dịch',
      dataIndex: 'startTime',
      key: 'startTime',
      className: styles['center-cell'],
      render: (startTime) => <span>{formatDateTime(startTime)}</span>
    },
    {
      title: 'Trạng thái khởi tạo chiến dịch',
      dataIndex: 'status',
      key: 'status',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái thực tế của chiến dịch',
      dataIndex: 'effectiveStatus',
      key: 'effectiveStatus',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái cấu hình của chiến dịch',
      dataIndex: 'configuredStatus',
      key: 'configuredStatus',
      className: styles['center-cell'],
    },
    {
      title: 'Ngân sách',
      key: 'budget',
      className: styles['center-cell'],
      render: (record) => {
        if (record.dailyBudget) {
          return <span>{formatNumberWithCommas(record.dailyBudget)}</span>;
        }
        else if (record.lifetimeBudget) {
          return <span>{formatNumberWithCommas(record.lifetimeBudget)}</span>;
        }
        else return <span>Ngân sách thuộc nhóm quảng cáo</span>
      },
    },
    {
      title: 'Ngân sách còn lại của chiến dịch',
      dataIndex: 'budgetRemaining',
      key: 'budgetRemaining',
      className: styles['center-cell'],
      render: (value) => formatNumberWithCommas(value)
    },
    {
      title: 'Các quốc gia áp dụng quảng cáo',
      dataIndex: 'specialAdCategoryCountry',
      key: 'specialAdCategoryCountry',
      className: styles['center-cell'],
      render: (countries) => {
        return (
          countries !== 'null' && (
            <span>{JSON.parse(countries)}</span>
          )
        )
      }
    },
    {
      title: 'Đối tượng quảng cáo',
      dataIndex: 'specialAdCategory',
      key: 'specialAdCategoryCountry',
      className: styles['center-cell'],
      render: (people) => {
        return (
          people !== 'null' && (
            <span>{JSON.parse(people).join(', ')}</span>
          )
        )
      }
    },
    {
      title: 'Mục tiêu chiến dịch',
      dataIndex: 'objective',
      key: 'objective',
      className: styles['center-cell'],
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
    advertisementApi.getListCampaigns(String(param.accountId), currentPage, 10).then((res) => {
      console.log('res', res)
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
        setDataTable((prevData) => {
          const prevDataIds = new Set(prevData.map(item => item.id));
          const newData = dataTableConfig.filter((item: TCampaignTable) => !prevDataIds.has(item.id));
          return [...prevData, ...newData];
        });
        setIsLoading(false)
      }
    }).catch((err) => {
      console.log('err', err)
      setIsLoading(false)
    })
  }, [currentPage, param.accountId])

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
            <span className={styles["breadcrumb-item"]}>
              Chiến dịch tài khoản {breadCrumbName.accountName}
            </span>
          </>
        )
      }
    ])
  }, [param.accountId])

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
              const updatedData = { ...breadCrumbName, campaignName: record.name }
              sessionStorage.setItem('breadCrumbName', JSON.stringify(updatedData))
              navigate(`${location.pathname}/${record.id}/adsets`)
            }
          }
        }}
        onScroll={handleScroll}
        loading={isLoading}
        scroll={{ x: 3000, y: dataTable.length > 5 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default CampaignsManagment