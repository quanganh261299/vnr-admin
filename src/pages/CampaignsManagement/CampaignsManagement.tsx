import { Breadcrumb, Table, TableProps, Tag } from "antd"
import { FC, ReactNode, useEffect, useState } from "react"
import styles from './style.module.scss'
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { TCampaignTable } from "../../models/advertisement/advertisement"
import { DollarOutlined, ProjectOutlined, PushpinOutlined } from "@ant-design/icons"
import advertisementApi from "../../api/advertisementApi"
import { formatDateTime, formatNumberWithCommas, handleEffectiveStatus } from "../../helper/const"

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

  const handleBuyingType = (value: string) => {
    switch (value) {
      case "AUCTION": return <Tag color="green" icon={<DollarOutlined />}>Đấu giá</Tag>
      case "RESERVED": return <Tag color="gold" icon={<PushpinOutlined />}>RESERVED - Đặt chỗ</Tag>
    }
  }

  const handleObjective = (value: string) => {
    switch (value) {
      case "BRAND_AWARENESS": return <span>Tăng độ nhận diện thương hiệu</span>
      case "REACH": return <span>Tối ưu hóa lượng người dùng tiếp cận quảng cáo</span>
      case "TRAFFIC": return <span>Tăng lượng truy cập</span>
      case "ENGAGEMENT": return <span>Tăng lượt tương tác</span>
      case "APP_INSTALLS": return <span>Tăng số lượng cài đặt ứng dụng</span>
      case "VIDEO_VIEWS": return <span>Tăng lượt xem video</span>
      case "LEAD_GENERATION": return <span>Thu thập thông tin người dùng</span>
      case "MESSAGES": return <span>Thúc đẩy người dùng gửi tin nhắn tới doanh nghiệp</span>
      case "CONVERSIONS": return <span>Tối ưu hóa hành động chuyển đổi</span>
      case "CATALOG_SALES": return <span>Tự động hiển thị sản phẩm cho người có khả năng mua cao nhất</span>
      case "STORE_VISITS": return <span>Tăng lượng khách hàng ghé thăm cửa hàng</span>
      case "OUTCOME_ENGAGEMENT": return <span>Tăng chất lượng tương tác</span>
      case "OUTCOME_LEADS": return <span>Thu thập thông tin khách hàng tiềm năng</span>
      case "OUTCOME_AWARENESS": return <span>Tăng độ nhận diện thương hiệu</span>
      case "OUTCOME_SALES": return <span>Tăng doanh số</span>
    }
  }

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
              <span> {formatNumberWithCommas(record.dailyBudget)}</span>
            </>
          );
        }
        else if (record.lifetimeBudget) {
          return (
            <>
              <div>Ngân sách trọn đời:</div>
              <span> {formatNumberWithCommas(record.lifetimeBudget)}</span>
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
      render: (value) => formatNumberWithCommas(value),
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
      render: (startTime) => <span>{formatDateTime(startTime)}</span>,
      width: 250,
    },
    {
      title: 'Thời gian cập nhật dữ liệu',
      dataIndex: 'updateDataTime',
      key: 'updateDataTime',
      className: styles['center-cell'],
      render: (updateDataTime) => <span>{formatDateTime(updateDataTime)}</span>,
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
        scroll={{ x: 2000, y: dataTable.length > 5 ? 'calc(100vh - 300px)' : undefined }}
      />
    </div>
  )
}

export default CampaignsManagment