import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Checkbox, DatePicker, Select, Table } from 'antd';
import type { CheckboxProps, FormProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import { NoUndefinedRangeValueType } from 'rc-picker/lib/PickerInput/RangePicker';
import { TAdvertisementField, TAdvertisementTable } from '../../models/advertisement/advertisement';
import { SelectType } from '../../models/common';
import { fakeAdvertisementTableData } from '../../api/fakeData';
import { useLocation, useNavigate } from 'react-router-dom';
import AdvertisementModal from '../../Components/Modal/AdvertisementModal/AdvertisementModal';
import organizationApi from '../../api/organizationApi';
import branchApi from '../../api/branchApi';
import groupApi from '../../api/groupApi';
import { TypeTeamTable } from '../../models/team/team';
import { TSystemTable } from '../../models/system/system';
import { TAgencyTable } from '../../models/agency/agency';
import employeeApi from '../../api/employeeApi';
import { TMemberTable } from '../../models/member/member';

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
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false,
    isSelectMember: false
  })
  const location = useLocation();
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
      dataIndex: 'account_status',
      key: 'account_status',
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
      dataIndex: 'spend_cap',
      key: 'spend_cap',
      className: styles['center-cell'],
    },
    {
      title: 'Số tiền đã chi tiêu',
      dataIndex: 'amount_spent',
      key: 'amount_spent',
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
      dataIndex: 'created_time',
      key: 'created_time',
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
      dataIndex: 'timezone_name',
      key: 'timezone_name',
      className: styles['center-cell'],
    },
    {
      title: 'Lí do tài khoản bị vô hiệu hóa',
      dataIndex: 'disable_reason',
      key: 'disable_reason',
      className: styles['center-cell'],
    },
    {
      title: 'Hạn mức chi tiêu tối thiểu nhóm chiến dịch',
      dataIndex: 'min_campaign_group_spend_cap',
      key: 'min_campaign_group_spend_cap',
      className: styles['center-cell'],
    },
    {
      title: 'Ngân sách tối thiểu hàng ngày cho chiến dịch',
      dataIndex: 'min_daily_budget',
      key: 'min_daily_budget',
      className: styles['center-cell'],
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
    console.log('Success:', values);
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

  // const handleShowModal = () => {
  //   setIsModalOpen(true)
  // }

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
    // axiosInstance.get('/test').then((res) => {
    //   console.log(res.data)
    // })
    const dataTable = fakeAdvertisementTableData.map((item) => ({
      ...item,
      key: item.account_id
    }))
    setDataTable(dataTable)
  }, [selectSystemId, selectAgencyId, selectTeamId, selectMemberId])

  return (
    <>
      <div className={styles["container"]}>
        <div className={styles['account-container']}>
          {/* <Tooltip title="Thêm tài khoản quảng cáo">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              className={styles['btn']}
              onClick={() => handleShowModal()}
            >
              Thêm tài khoản quảng cáo
            </Button>
          </Tooltip> */}
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
          <RangePicker
            format={"DD-MM-YYYY"}
            onChange={(dates) => handleRangeChange(dates)}
            placeholder={["Ngày tạo", "Ngày tạo"]}
          />
        </div>
        <div className={styles["filter-container"]}>
          <div className={styles["checkbox-list"]}>
            <Checkbox onChange={onChangePersonal}>Cá nhân</Checkbox>
            <Checkbox onChange={onChangeBusiness}>Doanh nghiệp</Checkbox>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: currentPage,
            pageSize: 10,
            // total: totalPage,
            position: ['bottomCenter'],
            onChange: (page) => setCurrentPage(page),
          }}
          onRow={(record) => {
            return {
              onClick: () => navigate(`${location.pathname}/${record.account_id}/campaigns`)
            }
          }}
          scroll={{ x: 3000 }}
        />
      </div>
      <AdvertisementModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        selectSystemData={selectSystemData}
      />
    </>
  )
}

export default AdvertisementManagement