import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Button, Checkbox, DatePicker, message, Select, Spin, Table, Tooltip } from 'antd';
import type { CheckboxProps, FormProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import { NoUndefinedRangeValueType } from 'rc-picker/lib/PickerInput/RangePicker';
import { TAdvertisementField, TAdvertisementTable } from '../../models/advertisement/advertisement';
import { SelectType } from '../../models/common';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AdvertisementModal from '../../Components/Modal/AdvertisementModal/AdvertisementModal';
import organizationApi from '../../api/organizationApi';
import branchApi from '../../api/branchApi';
import groupApi from '../../api/groupApi';
import { TypeTeamTable } from '../../models/team/team';
import { TSystemTable } from '../../models/system/system';
import { TAgencyTable } from '../../models/agency/agency';
import employeeApi from '../../api/employeeApi';
import { TMemberTable } from '../../models/member/member';
import { PlusOutlined } from '@ant-design/icons';
import advertisementApi from '../../api/advertisementApi';
import { formatDateTime } from '../../helper/const';

const AdvertisementManagement: FC = () => {
  const { RangePicker } = DatePicker;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  // const [dataRecord, setDataRecord] = useState<TypeTeamField | null>(null)
  const [dataTable, setDataTable] = useState<TAdvertisementTable[]>([])
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectAgencyData, setSelectAgencyData] = useState<SelectType[]>([])
  const [selectTeamData, setSelectTeamData] = useState<SelectType[]>([])
  const [selectMemberData, setSelectMemberData] = useState<SelectType[]>([])
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [selectAgencyId, setSelectAgencyId] = useState<string | null>(null)
  const [selectTeamId, setSelectTeamId] = useState<string | null>(null)
  const [selectMemberId, setSelectMemberId] = useState<string | null>(null)
  // const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [totalPage, setTotalPage] = useState<number>(0);
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
    isFullScreen: false,
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false,
    isSelectMember: false
  })
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const modalRef = useRef<{ submit: () => void }>(null);
  const navigate = useNavigate()

  const columns: TableProps<TAdvertisementTable>['columns'] = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'name',
      key: 'name',
      className: styles['center-cell'],
      fixed: 'left'
    },
    {
      title: 'Trạng thái tài khoản',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      className: styles['center-cell'],
    },
    {
      title: 'Đơn vị tiền tệ',
      dataIndex: 'currency',
      key: 'currency',
      className: styles['center-cell'],
    },
    {
      title: 'Hạn mức chi tiêu',
      dataIndex: 'spendCap',
      key: 'spendCap',
      className: styles['center-cell'],
    },
    {
      title: 'Số tiền đã chi tiêu',
      dataIndex: 'amountSpent',
      key: 'amountSpent',
      className: styles['center-cell'],
    },
    {
      title: 'Số tiền nợ',
      dataIndex: 'balance',
      key: 'balance',
      className: styles['center-cell'],
    },
    {
      title: 'Thời gian tạo tài khoản',
      dataIndex: 'createdTime',
      key: 'createdTime',
      className: styles['center-cell'],
    },
    {
      title: 'Chủ tài khoản quảng cáo',
      dataIndex: 'owner',
      key: 'owner',
      className: styles['center-cell'],
    },
    {
      title: 'Múi giờ',
      dataIndex: 'timezoneName',
      key: 'timezoneName',
      className: styles['center-cell'],
    },
    {
      title: 'Lí do tài khoản bị vô hiệu hóa',
      dataIndex: 'disableReason',
      key: 'disableReason',
      className: styles['center-cell'],
    },
    {
      title: 'Hạn mức chi tiêu tối thiểu nhóm chiến dịch',
      dataIndex: 'minCampaignGroupSpendCap',
      key: 'minCampaignGroupSpendCap',
      className: styles['center-cell'],
    },
    {
      title: 'Ngân sách tối thiểu hàng ngày cho chiến dịch',
      dataIndex: 'minDailyBudget',
      key: 'minDailyBudget',
      className: styles['center-cell'],
    },
    {
      title: 'Cá nhân hóa',
      dataIndex: 'isPersonal',
      key: 'isPersonal',
      className: styles['center-cell'],
    },
    {
      title: 'Thời gian cập nhật dữ liệu',
      dataIndex: 'updateDataTime',
      key: 'updateDataTime',
      className: styles['center-cell'],
      render: (dateTime) => <span>{formatDateTime(dateTime)}</span>
    },
    // {
    //   title: 'Tùy chọn',
    //   key: 'action',
    //   width: 200,
    //   fixed: 'right',
    //   render: () => (
    //     <>
    //       <Space size="middle">
    //         <Button icon={<EditOutlined />} type="primary">
    //           Sửa
    //         </Button>
    //         <Button icon={<DeleteOutlined />} danger>
    //           Xóa
    //         </Button>
    //       </Space>
    //     </>
    //   ),
    //   className: styles['center-cell']
    // },
  ];

  const onChangeSystem = (value: string) => {
    setSelectSystemId(value)
    setSelectAgencyId(null)
    setSelectTeamId(null)
    setSelectMemberId(null)
  };

  const onSearchSystem = (value: string) => {
    console.log('search:', value);
  };

  const onChangeAgency = (value: string) => {
    setSelectAgencyId(value)
    setSelectTeamId(null)
    setSelectMemberId(null)
  };

  const onSearchAgency = (value: string) => {
    console.log('search:', value);
  };

  const onChangeTeam = (value: string) => {
    setSelectTeamId(value)
    setSelectMemberId(null)
  };

  const onSearchTeam = (value: string) => {
    console.log('search:', value);
  };

  const onChangeMember = (value: string) => {
    setSelectMemberId(value)
  };

  const onSearchMember = (value: string) => {
    setSelectMemberId(value)
  };

  const onChangePersonal: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onChangeBusiness: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleRangeChange = (dates: NoUndefinedRangeValueType<dayjs.Dayjs> | null) => {
    if (dates !== null && dates[0] !== null && dates[1] !== null) {
      const startTime = dates[0].toDate().getTime();
      const endTime = dates[1].toDate().getTime();
      console.log('Start Time:', startTime);
      console.log('End Time:', endTime);
    }
  };

  const onFinish: FormProps<TAdvertisementField>['onFinish'] = (values) => {
    setLoading((prevLoading) => ({ ...prevLoading, isBtn: true }))
    const data = {
      accountID: String(values.id),
      employeeID: String(values.employeeId),
    }
    advertisementApi.createAdsAccount(data).then(() => {
      setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
      success('Tạo tài khoản quảng cáo thành công!')
      setIsModalOpen(false)
      setIsCallbackApi(!isCallbackApi)
    }).catch((err) => {
      console.log('err', err)
      setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
      error(err.response.data.message)
    })
  };

  const handleOk = () => {
    if (modalRef.current) {
      modalRef.current.submit();
    }
    console.log('OK')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleShowModal = () => {
    setIsModalOpen(true)
  }

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: true }))
    setSelectAgencyData([])
    setSelectTeamData([])
    setSelectMemberData([])
    organizationApi.getListOrganization().then((res) => {
      setSelectSystemData(
        res.data.data.map((item: TSystemTable) => ({
          value: item.id,
          label: item.name
        }))
      )
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false }))
    })
    if (selectSystemId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectSystem: false,
        isSelectAgency: true
      }))
      branchApi.getListBranch(undefined, undefined, selectSystemId).then((res) => {
        setSelectAgencyData(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false }))
      })
    }
    if (selectAgencyId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectSystem: false,
        isSelectAgency: false,
        isSelectTeam: true
      }))
      groupApi.getListGroup(undefined, undefined, undefined, selectAgencyId).then((res) => {
        setSelectTeamData(
          res.data.data.map((item: TypeTeamTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: false }))
      })
    }
    if (selectTeamId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectSystem: false,
        isSelectAgency: false,
        isSelectTeam: false,
        isSelectMember: true
      }))
      employeeApi.getListEmployee(undefined, undefined, undefined, undefined, selectTeamId).then((res) => {
        setSelectMemberData(
          res.data.data.map((item: TMemberTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectMember: false }))
      })
    }
  }, [selectSystemId, selectAgencyId, selectTeamId])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isTable: true }))
    advertisementApi.getListAdsAccount(currentPage, 10).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        setTotalData(res.data.paging.totalCount)
        setDataTable(data)
        setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
      }
    }).catch((err) => {
      console.log('err', err)
      setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
    })
    const dataTableConfig = dataTable.map((item) => ({
      ...item,
      key: item.accountId,
    }));
    setDataTable(dataTableConfig)
  }, [currentPage, selectSystemId, selectAgencyId, selectTeamId, selectMemberId, isCallbackApi])

  return (
    <>
      {contextHolder}
      <div className={styles["container"]}>
        <div className={styles['account-container']}>
          {searchParams.get('isPM') && (
            <>
              <Tooltip title="Thêm tài khoản quảng cáo">
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  className={styles['btn']}
                  onClick={() => handleShowModal()}
                >
                  Thêm tài khoản quảng cáo
                </Button>
              </Tooltip>
            </>
          )}
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            optionFilterProp="label"
            onChange={onChangeSystem}
            onSearch={onSearchSystem}
            options={selectSystemData}
            className={styles["select-system-item"]}
            loading={loading.isSelectSystem}
            value={selectSystemId || null}
            notFoundContent={'Không có dữ liệu'}
          />
          <Select
            allowClear
            showSearch
            placeholder="Chọn chi nhánh"
            optionFilterProp="label"
            onChange={onChangeAgency}
            onSearch={onSearchAgency}
            options={selectAgencyData}
            className={styles["select-system-item"]}
            loading={loading.isSelectAgency}
            value={selectAgencyId || null}
            notFoundContent={selectSystemId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
          />
          <Select
            allowClear
            showSearch
            placeholder="Chọn đội nhóm"
            optionFilterProp="label"
            onChange={onChangeTeam}
            onSearch={onSearchTeam}
            options={selectTeamData}
            className={styles["select-system-item"]}
            loading={loading.isSelectTeam}
            value={selectTeamId || null}
            notFoundContent={selectAgencyId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
          />
          <Select
            allowClear
            showSearch
            placeholder="Chọn thành viên"
            optionFilterProp="label"
            onChange={onChangeMember}
            onSearch={onSearchMember}
            options={selectMemberData}
            className={styles["select-system-item"]}
            loading={loading.isSelectMember}
            value={selectMemberId || null}
            notFoundContent={selectTeamId ? 'Không có dữ liệu' : 'Bạn cần chọn đội nhóm trước!'}
          />
          <div>
            <Checkbox onChange={onChangePersonal}>Cá nhân</Checkbox>
            <Checkbox onChange={onChangeBusiness}>Doanh nghiệp</Checkbox>
          </div>
          <RangePicker
            format={"DD-MM-YYYY"}
            onChange={(dates) => handleRangeChange(dates)}
            placeholder={["Ngày tạo", "Ngày tạo"]}
          />
        </div>
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalData,
            position: ['bottomCenter'],
            onChange: (page) => setCurrentPage(page),
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                sessionStorage.setItem('breadCrumbName',
                  JSON.stringify({
                    accountName: record.name,
                    campaignName: '',
                    groupName: ''
                  }))
                navigate(`${location.pathname}/${record.accountId}/campaigns`)
              }
            }
          }}
          scroll={{ x: 3000 }}
          loading={loading.isTable}
        />
      </div>
      <AdvertisementModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        selectSystemData={selectSystemData}
        isLoadingBtn={loading.isBtn}
      />
      <Spin fullscreen spinning={loading.isFullScreen} />
    </>
  )
}

export default AdvertisementManagement