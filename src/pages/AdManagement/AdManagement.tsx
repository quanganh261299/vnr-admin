import { Breadcrumb, Table, TableProps, Tooltip } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useParams } from "react-router-dom"
import { TAdsTable } from "../../models/advertisement/advertisement"
import { ClusterOutlined, DollarOutlined, NotificationOutlined, ProjectOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { convertArrayToObject, formatDateTime, formatNumberWithCommas, handleEffectiveStatus } from "../../helper/const"

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

  const handleCallToActionType = (value: string) => {
    switch (value) {
      case "BUY_NOW": return "Mua ngay"
      case "CONTACT_US": return "Liên hệ với chúng tôi"
      case "DOWNLOAD": return "Tải xuống"
      case "LEARN_MORE": return "Tìm hiểu thêm"
      case "MESSAGE_PAGE": return "Gửi tin nhắn đến trang"
      case "NO_BUTTON": return "Không có nút"
      case "ORDER_NOW": return "Đặt hàng ngay"
      case "PLAY_GAME": return "Chơi game"
      case "SHOP_NOW": return "Mua sắm ngay"
      case "SIGN_UP": return "Đăng ký"
      case "WATCH_MORE": return "Xem thêm"
      case "GET_DIRECTIONS": return "Xem chỉ đường"
    }
  }

  const columns: TableProps<TAdsTable>['columns'] = [
    {
      title: 'Tên quảng cáo',
      dataIndex: 'name',
      key: 'name',
      className: styles['center-cell'],
    },
    {
      title: 'Trạng thái quảng cáo',
      dataIndex: 'effectiveStatus',
      key: 'effectiveStatus',
      className: styles['center-cell'],
      render: (value) => handleEffectiveStatus(value)
    },
    {
      title: 'Nội dung quảng cáo',
      dataIndex: 'adcreatives',
      key: 'body',
      className: styles['center-cell'],
      render: (adcreatives) => {
        const adcreativesData = adcreatives ? JSON.parse(adcreatives).data[0] : null
        return (
          <Tooltip
            title={adcreativesData.body}
            placement="bottom"
            overlayStyle={{ maxWidth: '85%' }}
          >
            <div className="ellipsis">{adcreativesData?.body}</div>
          </Tooltip>
        )
      },
      width: 400
    },
    {
      title: 'Nút kêu gọi hành động',
      dataIndex: 'adcreatives',
      key: 'call_to_action_type',
      className: styles['center-cell'],
      render: (adcreatives) => {
        const adcreativesData = adcreatives ? JSON.parse(adcreatives).data[0] : null
        return (
          <span>{handleCallToActionType(adcreativesData?.call_to_action_type)}</span>
        )
      },
    },
    {
      title: 'Tổng số lần hiển thị',
      dataIndex: 'insighn',
      key: 'impressions',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{formatNumberWithCommas(insight?.impressions)}</span> : null
    },
    {
      title: 'Số lần người dùng nhấp vào quảng cáo',
      dataIndex: 'insighn',
      key: 'clicks',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{formatNumberWithCommas(insight?.clicks)}</span> : null
    },
    {
      title: 'Số tiền đã chi tiêu',
      dataIndex: 'insighn',
      key: 'spend',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{formatNumberWithCommas(insight?.spend)}</span> : null
    },
    {
      title: 'Tỉ lệ nhấp chuột',
      dataIndex: 'insighn',
      key: 'ctr',
      className: styles['center-cell'],
      render: (insight) => {
        const ctr = insight?.ctr ? parseFloat(insight?.ctr) : null;
        return (
          ctr ? <span>{ctr.toFixed(1)}</span> : null
        )
      }
    },
    {
      title: 'Chi phí mỗi 1000 lượt hiển thị',
      dataIndex: 'insighn',
      key: 'cpm',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{formatNumberWithCommas(Math.round(insight?.cpm))}</span> : null
    },
    {
      title: 'Chi phí mỗi lần nhấp chuột',
      dataIndex: 'insighn',
      key: 'cpc',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{formatNumberWithCommas(Math.round(insight?.cpc))}</span> : null
    },
    {
      title: 'Chi phí mỗi hành động',
      dataIndex: 'insighn',
      key: 'cpp',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{formatNumberWithCommas(Math.round(insight?.cpp))}</span> : null
    },
    {
      title: 'Số lượng người dùng quảng cáo đã tiếp cận',
      dataIndex: 'insighn',
      key: 'reach',
      className: styles['center-cell'],
      render: (insight) => insight ? <span>{formatNumberWithCommas(insight?.reach)}</span> : null
    },
    {
      title: 'Tần suất trung bình mỗi người dùng thấy quảng cáo',
      dataIndex: 'insighn',
      key: 'frequency',
      className: styles['center-cell'],
      render: (insight) => {
        const insightFrequency = insight?.frequency ? parseFloat(insight?.frequency) : null;
        return (
          insightFrequency ? <span>{insightFrequency.toFixed(1)}</span> : null
        )
      }
    },
    {
      title: 'Kết quả tin nhắn',
      dataIndex: 'insighn',
      key: 'totalMessagingConnection',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["onsite_conversion.total_messaging_connection"]
          && <span>{formatNumberWithCommas(actionData["onsite_conversion.total_messaging_connection"])}</span>
        )
      }
    },
    {
      title: 'Chi phí trên mỗi kết quả',
      dataIndex: 'insighn',
      key: 'costPerResult',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        const costPerResult = insight?.spend && actionData["onsite_conversion.total_messaging_connection"] && insight?.spend / actionData["onsite_conversion.total_messaging_connection"];
        return (
          costPerResult
          && <span>{formatNumberWithCommas(Math.round(costPerResult))}</span>
        )
      }
    },
    {
      title: 'Số người nhắn tin',
      dataIndex: 'insighn',
      key: 'messagingFirstReply',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["onsite_conversion.messaging_first_reply"]
          && <span>{formatNumberWithCommas(actionData["onsite_conversion.messaging_first_reply"])}</span>
        )
      }
    },
    {
      title: 'Lượt tương tác với bài viết',
      dataIndex: 'insighn',
      key: 'postEngagement',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["post_engagement"]
          && <span>{formatNumberWithCommas(actionData["post_engagement"])}</span>
        )
      }
    },
    {
      title: 'Lượt tương tác với trang',
      dataIndex: 'insighn',
      key: 'pageEngagement',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["page_engagement"]
          && <span>{formatNumberWithCommas(actionData["page_engagement"])}</span>
        )
      }
    },
    {
      title: 'Lượt xem hình ảnh',
      dataIndex: 'insighn',
      key: 'photoView',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["photo_view"]
          && <span>{formatNumberWithCommas(actionData["photo_view"])}</span>
        )
      }
    },
    {
      title: 'Số lần phát video',
      dataIndex: 'insighn',
      key: 'videoPlay',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["video_play"]
          && <span>{formatNumberWithCommas(actionData["video_play"])}</span>
        )
      }
    },
    {
      title: 'Số lần video được xem ít nhất 3 giây',
      dataIndex: 'insighn',
      key: 'videoView',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["video_view"] && <span>{formatNumberWithCommas(actionData["video_view"])}</span>
        )
      }
    },
    {
      title: 'Số lần video được xem ít nhất 10 giây',
      dataIndex: 'insighn',
      key: 'videoView10s',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["video_10s_view"] && <span>{formatNumberWithCommas(actionData["video_10s_view"])}</span>
        )
      }
    },
    {
      title: 'Số lần video được xem ít nhất 30 giây',
      dataIndex: 'insighn',
      key: 'videoView30s',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["video_30s_view"] && <span>{formatNumberWithCommas(actionData["video_30s_view"])}</span>
        )
      }
    },
    {
      title: 'Số lần video được xem đầy đủ',
      dataIndex: 'insighn',
      key: 'videoCompleteView',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["video_complete_view"] && <span>{formatNumberWithCommas(actionData["video_complete_view"])}</span>
        )
      }
    },
    {
      title: 'Người dùng nhắn tin sau 7 ngày',
      dataIndex: 'insighn',
      key: 'conversationStarted7d',
      className: styles['center-cell'],
      render: (insight) => {
        const actionData = insight?.actions ? convertArrayToObject(JSON.parse(insight?.actions)) : {};
        return (
          actionData["onsite_conversion.messaging_conversation_started_7d"]
          && <span>{formatNumberWithCommas(actionData["onsite_conversion.messaging_conversation_started_7d"])}</span>
        )
      }
    },
    {
      title: 'Thời gian chạy quảng cáo',
      dataIndex: 'startTime',
      key: 'start_time',
      className: styles['center-cell'],
      render: (startTime) => <span>{formatDateTime(startTime)}</span>
    },
    // {
    //   title: 'Tracking specs',
    //   dataIndex: 'trackingSpecs',
    //   key: 'trackingSpecs',
    //   className: styles['center-cell'],
    // },
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
      console.log('res', res)
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
        scroll={{ x: 4200, y: dataTable.length > 5 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default AdManagement