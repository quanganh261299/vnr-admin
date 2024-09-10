import { Breadcrumb, Table, TableProps } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TAdSetsTable } from "../../models/advertisement/advertisement"
import { fakeAdSetsTableData } from "../../api/fakeData"
import { ClusterOutlined, DollarOutlined, ProjectOutlined } from "@ant-design/icons"

const AdSetManagement: FC = () => {
  const [dataTable, setDataTable] = useState<TAdSetsTable[]>([])
  const [pageSize, setPageSize] = useState<number>(10);
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
      title: 'Tổng số lần hiển thị',
      dataIndex: 'lifetime_imps',
      key: 'lifetime_imps',
      className: styles['center-cell'],
    },
    {
      title: 'Giới hạn độ tuổi',
      dataIndex: 'targeting',
      key: 'age',
      className: styles['center-cell'],
      render: (targeting) => <span>{targeting.age_min} - {targeting.age_max}</span>
    },
    {
      title: 'Tự động hóa nhắm mục tiêu',
      dataIndex: 'targeting',
      key: 'age_advantage_audiencemax',
      className: styles['center-cell'],
      render: (targeting) => <span>{targeting.targeting_automation.advantage_audience}</span>
    },
    {
      title: 'Địa điểm mục tiêu quảng cáo',
      dataIndex: 'targeting',
      key: 'countries',
      className: styles['center-cell'],
      render: (targeting) => <span>{targeting.geo_locations.countries.join(', ')}</span>
    },
    {
      title: 'Nền tảng quảng cáo sẽ hiển thị',
      dataIndex: 'targeting',
      key: 'publisher_platforms',
      className: styles['center-cell'],
      render: (targeting) => <span>{targeting.publisher_platforms.join(', ')}</span>
    },
    {
      title: 'Vị trí hiển thị trên facebook',
      dataIndex: 'targeting',
      key: 'facebook_positions',
      className: styles['center-cell'],
      render: (targeting) => <span>{targeting.facebook_positions.join(', ')}</span>
    },
    {
      title: 'Nền tảng thiết bị quảng cáo hiển thị',
      dataIndex: 'targeting',
      key: 'device_platforms',
      className: styles['center-cell'],
      render: (targeting) => <span>{targeting.device_platforms.join(', ')}</span>
    },
    {
      title: 'Trạng thái nhóm quảng cáo sau khi áp dụng qui tắc phân phối',
      dataIndex: 'effective_status',
      key: 'effective_status',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái được cấu hình cho nhóm quảng cáo',
      dataIndex: 'configured_status',
      key: 'configured_status',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái nhóm quảng cáo',
      dataIndex: 'status',
      key: 'status',
      className: styles['center-cell'],
    },
    {
      title: 'Trang đối tượng được quảng cáo',
      dataIndex: 'promoted_object',
      key: 'page_id',
      className: styles['center-cell'],
      render: (promoted_object) => <span>{promoted_object.page_id}</span>
    },
    {
      title: 'Ngân sách còn lại của nhóm quảng cáo',
      dataIndex: 'budget_remaining',
      key: 'budget_remaining',
      className: styles['center-cell'],
    },
    {
      title: 'Ngân sách theo ngày',
      dataIndex: 'daily_budget',
      key: 'daily_budget',
      className: styles['center-cell'],
    },
    {
      title: 'Ngân sách trọn đời',
      dataIndex: 'lifetime_budget',
      key: 'lifetime_budget',
      className: styles['center-cell'],
    },
    {
      title: 'Ngày tạo nhóm quảng cáo',
      dataIndex: 'created_time',
      key: 'created_time',
      className: styles['center-cell'],
    },
    {
      title: 'Ngày chạy nhóm quảng cáo',
      dataIndex: 'start_time',
      key: 'start_time',
      className: styles['center-cell'],
    },
  ];

  useEffect(() => {
    // axiosInstance.get('/test').then((res) => {
    //   console.log(res.data)
    // })
    const dataTable = fakeAdSetsTableData.map((item) => ({
      ...item,
      key: item.id
    }))
    setPageSize(10)
    setDataTable(dataTable)
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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          // total: totalPage,
          position: ['bottomCenter'],
          onChange: (page) => setCurrentPage(page),
        }}
        onRow={(record) => {
          return {
            onClick: () => navigate(`${location.pathname}/${record.id}/ad`)
          }
        }}
        scroll={{ x: 3500 }}
      />
    </div>
  )
}

export default AdSetManagement