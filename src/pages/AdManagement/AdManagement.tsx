import { Breadcrumb, Table, TableProps } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useParams } from "react-router-dom"
import { TAdsTable } from "../../models/advertisement/advertisement"
import { fakeAdsData } from "../../api/fakeData"
import { ClusterOutlined, DollarOutlined, NotificationOutlined, ProjectOutlined } from "@ant-design/icons"

const AdManagement: FC = () => {
  const [dataTable, setDataTable] = useState<TAdsTable[]>([])
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [breadCrumbData, setBreadCrumbData] = useState<{ title: ReactNode }[]>([])
  const param = useParams();
  const location = useLocation();
  const advertisementUrl = location.pathname.split('/')[1]
  const campaignsUrl = location.pathname.split('/').slice(1, 4).join('/')
  const adsetUrl = location.pathname.split('/').slice(1, 6).join('/')

  const columns: TableProps<TAdsTable>['columns'] = [
    {
      title: 'Tên quảng cáo',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      className: styles['center-cell'],
    },
    {
      title: 'Chi tiết trạng thái quảng cáo',
      dataIndex: 'effective_status',
      key: 'effective_status',
      width: '20%',
      className: styles['center-cell'],
    },
    {
      title: 'Ngày tạo quảng cáo',
      dataIndex: 'created_time',
      key: 'created_time',
      width: '20%',
      className: styles['center-cell'],
    },
    {
      title: 'Ngày chạy quảng cáo',
      dataIndex: 'start_time',
      key: 'start_time',
      width: '20%',
      className: styles['center-cell'],
    },
  ];

  useEffect(() => {
    // axiosInstance.get('/test').then((res) => {
    //   console.log(res.data)
    // })
    const dataTable = fakeAdsData.map((item) => ({
      ...item,
      key: item.id
    }))
    setPageSize(10)
    setDataTable(dataTable)
  }, [param.adsetsId])

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
              <span className={styles["breadcrumb-item"]}>Chiến dịch tài khoản {param.accountId}</span>
            </Link>
          </>
        )
      },
      {
        title: (
          <>
            <Link to={`/${adsetUrl}`}>
              <ClusterOutlined />
              <span className={styles["breadcrumb-item"]}>Nhóm quảng cáo chiến dịch {param.campaignId}</span>
            </Link>
          </>
        )
      },
      {
        title: (
          <>
            <NotificationOutlined />
            <span className={styles["breadcrumb-item"]}>Quảng cáo thuộc nhóm quảng cáo {param.adsetsId}</span>
          </>
        )
      }
    ])
  }, [param.accountId, param.campaignId, param.adsetsId])

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
      />
    </div>
  )
}

export default AdManagement