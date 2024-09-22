import { Breadcrumb, DatePicker, Flex, Table, TableProps, Tooltip } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TCampaignTable } from "../../models/advertisement/advertisement"
import { DollarOutlined, InfoCircleOutlined, ProjectOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { convertStringToRoundNumber, DEFAULT_PAGE_SIZE, formatDateTime, formatDateYMD, formatNumberWithCommasNotZero, handleBuyingType, handleEffectiveStatus, handleObjective } from "../../helper/const"
import dayjs, { Dayjs } from "dayjs"
import useDateRangeStore from "../../store/dateRangeStore"

const CampaignsManagment: FC = () => {
  const [dataTable, setDataTable] = useState<TCampaignTable[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [breadCrumbData, setBreadCrumbData] = useState<{ title: ReactNode }[]>([])
  const param = useParams();
  const location = useLocation();
  const advertisementUrl = location.pathname.split('/')[1]
  const breadCrumbName = JSON.parse(sessionStorage.getItem('breadCrumbName') || 'null');
  const { RangePicker } = DatePicker;
  const { dateRange, setDateRange } = useDateRangeStore();
  const [startTime, setStartTime] = useState<string>(dateRange[0] ? formatDateYMD(dateRange[0].toDate()) : '');
  const [endTime, setEndTime] = useState<string>(dateRange[1] ? formatDateYMD(dateRange[1].toDate()) : '');

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
      title:
        <Tooltip title='Số lần quảng cáo xuất hiện trên màn hình'>
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt hiển thị
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'impressions',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.impressions)) || '-',
      width: 150,
    },
    {
      title:
        <Tooltip title='Số lượt vuốt, click hoặc nhấn vào quảng cáo của bạn'>
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Số lần nhấp
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'clicks',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.clicks)) || '-',
      width: 150,
    },
    {
      title:
        <Tooltip
          title='Tổng số tiền ước tính mà bạn đã chi tiêu cho chiến dịch, nhóm quảng cáo hoặc quảng cáo trong suốt lịch chạy'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Số tiền đã chi tiêu
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'spend',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.spend)) || '-'
    },
    {
      title:
        <Tooltip
          title='Tỷ lệ lượt hiển thị có diễn ra lượt click (tất cả) trên tổng số lượt hiển thị'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            CTR
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'ctr',
      className: styles['center-cell'],
      render: (insight) => Number(insight?.ctr) ? Number(insight?.ctr).toFixed(1) : '-'
    },
    {
      title:
        <Tooltip
          title='Chi phí trung bình cho 1.000 lượt hiển thị'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            CPM (Chi phí mỗi 1000 lần hiển thị)
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'cpm',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.cpm)) || '-'
    },
    {
      title:
        <Tooltip
          title='Chi phí trung bình cho mỗi lượt click'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            CPC
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'cpc',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.cpc)) || '-'
    },
    {
      title:
        <Tooltip
          title='Số tài khoản đã nhìn thấy quảng cáo của bạn ít nhất 1 lần. Số người tiếp cận khác với lượt hiển thị ở chỗ lượt hiển thị có thể bao gồm nhiều lượt xem quảng cáo bởi cùng một tài khoản'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Người tiếp cận
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'reach',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.reach)) || '-'
    },
    {
      title:
        <Tooltip
          title='Số lần quảng cáo đạt được kết quả, dựa trên mục tiêu và cài đặt bạn đã chọn'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Tần suất
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'frequency',
      className: styles['center-cell'],
      render: (insight) => Number(insight?.frequency) ? Number(insight?.frequency).toFixed(1) : '-'
    },
    {
      title:
        <Tooltip
          title='Số lần quảng cáo đạt được kết quả, dựa trên mục tiêu và cài đặt bạn đã chọn'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Kết quả
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'totalMessagingConnection',
      className: styles['center-cell'],
      render: (insight) =>
        formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.onsiteConversionTotalMessagingConnection)) || '-'
    },
    {
      title:
        <Tooltip
          title='Chi phí trung bình trên mỗi kết quả quảng cáo của bạn'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Chi phí trên mỗi kết quả
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'costPerResult',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.costPerAction)) || '-'
    },
    {
      title:
        <Tooltip
          title='Số người dùng nhắn tin sau 1 tuần đầu tiên'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Người dùng nhắn tin sau 7 ngày
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'conversationStarted7d',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.onsiteConversionMessagingConversationStarted7d)) || '-'
    },
    {
      title:
        <Tooltip
          title='Lượt tương tác với bài viết là tổng số hành động mà mọi người thực hiện có liên quan đến quảng cáo của bạn trên Facebook'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt tương tác với bài viết
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'postEngagement',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.postEngagement)) || '-'
    },
    {
      title:
        <Tooltip
          title='Số hành động diễn ra trên Trang Facebook, trang cá nhân Instagram hoặc bất kỳ nội dung nào của bạn, được ghi nhận cho quảng cáo của bạn'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Tương tác với trang
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'pageEngagement',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.pageEngagement)) || '-'
    },
    {
      title:
        <Tooltip
          title='Số lượt xem hình ảnh trên quảng cáo của bạn'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt xem hình ảnh
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'photoView',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.photoView)) || '-'
    },
    {
      title:
        <Tooltip
          title='Số lượt phát video trên quảng cáo của bạn'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt phát video
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'videoPlay',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.videoPlay)) || '-'
    },
    {
      title:
        <Tooltip
          title='Lượt phát video trong tối thiểu 3 giây hoặc gần hết toàn bộ thời lượng nếu video dài dưới 3 giây. Với mỗi lượt hiển thị video, chúng tôi sẽ tính riêng lượt phát video và loại trừ thời gian phát lại video'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt phát video trong tối thiểu 3 giây
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'videoView',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.videoView)) || '-'
    },
    {
      title:
        <Tooltip
          title='Lượt phát video trong tối thiểu 10 giây hoặc gần hết toàn bộ thời lượng nếu video dài dưới 10 giây. Với mỗi lượt hiển thị video, chúng tôi sẽ tính riêng lượt phát video và loại trừ thời gian phát lại video'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt phát video trong tối thiểu 10 giây
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'videoView10s',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.video10sView)) || '-'
    },
    {
      title:
        <Tooltip
          title='Lượt phát video trong tối thiểu 30 giây hoặc gần hết toàn bộ thời lượng nếu video dài dưới 30 giây. Với mỗi lượt hiển thị video, chúng tôi sẽ tính riêng lượt phát video và loại trừ thời gian phát lại video'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt phát video trong tối thiểu 30 giây
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'videoView30s',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.video30sView)) || '-'
    },
    {
      title:
        <Tooltip
          title='Lượt phát 100% thời lượng video, bao gồm lượt phát tua nhanh đến điểm này'
        >
          <Flex gap={'small'} align="center">
            <InfoCircleOutlined />
            Lượt phát 100% thời lượng video
          </Flex>
        </Tooltip>,
      dataIndex: 'insight',
      key: 'videoCompleteView',
      className: styles['center-cell'],
      render: (insight) => formatNumberWithCommasNotZero(convertStringToRoundNumber(insight?.videoCompleteView)) || '-'
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
    advertisementApi.getListCampaigns({
      adsAccountId: param.accountId || '',
      pageIndex: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      startTime,
      endTime
    }).then((res) => {
      const data = res.data.data
      console.log('data', data)
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
        scroll={{ x: 5500, y: dataTable.length > 0 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default CampaignsManagment