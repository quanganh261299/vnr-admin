import { Breadcrumb, Table, TableProps } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useParams } from "react-router-dom"
import { TAdsTable } from "../../models/advertisement/advertisement"
import { ClusterOutlined, DollarOutlined, NotificationOutlined, ProjectOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { formatDateTime } from "../../helper/const"

const AdManagement: FC = () => {
  const [dataTable, setDataTable] = useState<TAdsTable[]>([])
  // const [pageSize, setPageSize] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [breadCrumbData, setBreadCrumbData] = useState<{ title: ReactNode }[]>([])
  const breadCrumbName = JSON.parse(sessionStorage.getItem('breadCrumbName') || 'null');
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái được cấu hình cho quảng cáo',
      dataIndex: 'configuredStatus',
      key: 'configuredStatus',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái quảng cáo',
      dataIndex: 'status',
      key: 'status',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái quảng cáo sau khi áp dụng qui tắc phân phối',
      dataIndex: 'effectiveStatus',
      key: 'effectiveStatus',
      className: styles['center-cell'],
    },
    {
      title: 'Nội dung quảng cáo',
      dataIndex: 'adcreatives',
      key: 'body',
      className: styles['center-cell'],
      render: (adcreatives) => {
        const adcreativesData = JSON.parse(adcreatives).data[0]
        return (
          <span>{adcreativesData.body}</span>
        )
      }
    },
    {
      title: 'Nút kêu gọi hành động',
      dataIndex: 'adcreatives',
      key: 'call_to_action_type',
      className: styles['center-cell'],
      render: (adcreatives) => {
        const adcreativesData = JSON.parse(adcreatives).data[0]
        return (
          <span>{adcreativesData.call_to_action_type}</span>
        )
      }
    },
    {
      title: 'Tổng số lần hiển thị',
      dataIndex: 'insighn',
      key: 'impressions',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.impressions}</span> : null
    },
    {
      title: 'Số lần người dùng nhấp vào quảng cáo',
      dataIndex: 'insighn',
      key: 'clicks',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.clicks}</span> : null
    },
    {
      title: 'Tổng chi phí quảng cáo',
      dataIndex: 'insighn',
      key: 'spend',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.spend}</span> : null
    },
    {
      title: 'Tỉ lệ nhấp chuột',
      dataIndex: 'insighn',
      key: 'ctr',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.ctr}</span> : null

    },
    {
      title: 'Chi phí mỗi 1000 lượt hiển thị',
      dataIndex: 'insighn',
      key: 'cpm',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.cpm}</span> : null
    },
    {
      title: 'Chi phí mỗi lần nhấp chuột',
      dataIndex: 'insighn',
      key: 'cpc',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.cpc}</span> : null
    },
    {
      title: 'Chi phí mỗi hành động',
      dataIndex: 'insighn',
      key: 'cpp',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.cpp}</span> : null
    },
    {
      title: 'Số lượng người dùng quảng cáo đã tiếp cận',
      dataIndex: 'insighn',
      key: 'reach',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.reach}</span> : null
    },
    {
      title: 'Tần suất trung bình mỗi người dùng thấy quảng cáo',
      dataIndex: 'insighn',
      key: 'frequency',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{insight.frequency}</span> : null
    },
    {
      title: 'Actions',
      dataIndex: 'insighn',
      key: 'actions',
      className: styles['center-cell'],
      render: (insight) => insight && insight.actions && <span>{insight.actions}</span>
    },
    {
      title: 'Tracking specs',
      dataIndex: 'trackingSpecs',
      key: 'trackingSpecs',
      className: styles['center-cell'],
    },
    // {
    //   title: 'Số lần người dùng tương tác với bài viết',
    //   dataIndex: 'post_engagement',
    //   key: 'post_engagement',
    //   className: styles['center-cell'],
    // },
    // {
    //   title: 'Số lần người dùng tương tác với trang',
    //   dataIndex: 'page_engagement',
    //   key: 'page_engagement',
    //   className: styles['center-cell'],
    // },
    // {
    //   title: 'Số lần người dùng xem ảnh từ quảng cáo',
    //   dataIndex: 'photo_view',
    //   key: 'photo_view',
    //   className: styles['center-cell'],
    // },
    // {
    //   title: 'Số lần người dùng nhấp vào liên kết trong quảng cáo',
    //   dataIndex: 'link_click',
    //   key: 'link_click',
    //   className: styles['center-cell'],
    // },
    {
      title: 'Thời gian tạo quảng cáo',
      dataIndex: 'createdTime',
      key: 'created_time',
      className: styles['center-cell'],
      render: (createdTime) => <span>{formatDateTime(createdTime)}</span>
    },
    {
      title: 'Thời gian chạy quảng cáo',
      dataIndex: 'startTime',
      key: 'start_time',
      className: styles['center-cell'],
      render: (startTime) => <span>{formatDateTime(startTime)}</span>
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
    advertisementApi.getListAd(String(param.adsetsId), currentPage, 10).then((res) => {
      console.log('res', res.data.data)
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TAdsTable) => ({
          ...item,
          key: item.id,
        }));
        setTotalPage(res.data.paging.totalPages)
        setDataTable((prevData) => {
          const prevDataIds = new Set(prevData.map(item => item.id));
          const newData = dataTableConfig.filter((item: TAdsTable) => !prevDataIds.has(item.id));
          return [...prevData, ...newData];
        });
        setIsLoading(false)
      }
    }).catch((err) => {
      console.log('err', err)
      setIsLoading(false)
    })
  }, [param.adsetsId, currentPage])

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
            <Link to={`/${adsetUrl}`}>
              <ClusterOutlined />
              <span className={styles["breadcrumb-item"]}>Nhóm quảng cáo chiến dịch {breadCrumbName.campaignName}</span>
            </Link>
          </>
        )
      },
      {
        title: (
          <>
            <NotificationOutlined />
            <span className={styles["breadcrumb-item"]}>Quảng cáo thuộc nhóm quảng cáo {breadCrumbName.groupName}</span>
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
        pagination={false}
        loading={isLoading}
        onScroll={handleScroll}
        scroll={{ x: 8500, y: dataTable.length > 5 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default AdManagement