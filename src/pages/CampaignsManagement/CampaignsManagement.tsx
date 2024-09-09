import { Breadcrumb, Table, TableProps } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TCampaignTable } from "../../models/advertisement/advertisement"
import { fakeCampaignTableData } from "../../api/fakeData"
import { DollarOutlined, ProjectOutlined } from "@ant-design/icons"

const CampaignsManagment: FC = () => {
  const [dataTable, setDataTable] = useState<TCampaignTable[]>([])
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [breadCrumbData, setBreadCrumbData] = useState<{ title: ReactNode }[]>([])
  const param = useParams();
  const location = useLocation();
  const advertisementUrl = location.pathname.split('/')[1]

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
      dataIndex: 'budget_rebalance_flag',
      key: 'budget_rebalance_flag',
      className: styles['center-cell'],
      render: (value) => value ? <span>Có</span> : <span>Không</span>,
      width: 200,
    },
    {
      title: 'Loại mua',
      dataIndex: 'buying_type',
      key: 'buying_type',
      className: styles['center-cell'],
    },
    {
      title: 'Thời gian bắt đầu chiến dịch',
      dataIndex: 'start_time',
      key: 'start_time',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái khởi tạo chiến dịch',
      dataIndex: 'status',
      key: 'status',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái thực tế của chiến dịch',
      dataIndex: 'effective_status',
      key: 'effective_status',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái cấu hình của chiến dịch',
      dataIndex: 'configured_status',
      key: 'configured_status',
      className: styles['center-cell'],
    },
    {
      title: 'Ngân sách còn lại của chiến dịch',
      dataIndex: 'budget_remaining',
      key: 'budget_remaining',
      className: styles['center-cell'],
    },
    {
      title: 'Các quốc gia áp dụng quảng cáo',
      dataIndex: 'special_ad_category_country',
      key: 'special_ad_category_country',
      className: styles['center-cell'],
      render: (countries) => <span>{countries.join(', ')}</span>
    },
    {
      title: 'Ngày tạo chiến dịch',
      dataIndex: 'created_time',
      key: 'created_time',
      className: styles['center-cell'],
    },
    {
      title: 'Ngày chạy chiến dịch',
      dataIndex: 'start_time',
      key: 'start_time',
      className: styles['center-cell'],
    },
  ];

  useEffect(() => {
    // axiosInstance.get('/test').then((res) => {
    //   console.log(res.data)
    // })
    const dataTable = fakeCampaignTableData.map((item) => ({
      ...item,
      key: item.id
    }))
    setPageSize(10)
    setDataTable(dataTable)
  }, [param.accountId])

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
            <span className={styles["breadcrumb-item"]}>Chiến dịch tài khoản {param.accountId}</span>
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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          // total: totalPage,
          position: ['bottomCenter'],
          onChange: (page) => setCurrentPage(page),
        }}
        onRow={(record) => {
          return {
            onClick: () => navigate(`${location.pathname}/${record.id}/adsets`)
          }
        }}
        scroll={{ x: 3000 }}
      />
    </div>
  )
}

export default CampaignsManagment