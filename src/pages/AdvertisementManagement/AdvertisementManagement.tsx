import { FC, useEffect, useState } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames/bind';
import { Select, Spin, Table } from 'antd';
import type { TableProps } from 'antd';
import { TAdvertisementTable } from '../../models/advertisement/advertisement';
import { SelectType } from '../../models/common';
import { useLocation, useNavigate } from 'react-router-dom';
import organizationApi from '../../api/organizationApi';
import branchApi from '../../api/branchApi';
import groupApi from '../../api/groupApi';
import { TypeTeamTable } from '../../models/team/team';
import { TSystemTable } from '../../models/system/system';
import { TAgencyTable } from '../../models/agency/agency';
import employeeApi from '../../api/employeeApi';
import { TMemberTable } from '../../models/member/member';
import advertisementApi from '../../api/advertisementApi';
import { DEFAULT_PAGE_SIZE, formatDateTime, formatNumberWithCommas, handleAccountStatus, handleDisableReason, handleTypeCardBanking, hasRole, ROLE } from '../../helper/const';

interface Props {
  role: string | null
  organizationId: string | null
  branchId: string | null
  groupId: string | null
}

const AdvertisementManagement: FC<Props> = (props) => {
  const { role, organizationId, branchId, groupId } = props
  const cx = classNames.bind(styles)
  const [dataTable, setDataTable] = useState<TAdvertisementTable[]>([])
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectAgencyData, setSelectAgencyData] = useState<SelectType[]>([])
  const [selectTeamData, setSelectTeamData] = useState<SelectType[]>([])
  const [selectMemberData, setSelectMemberData] = useState<SelectType[]>([])
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [selectAgencyId, setSelectAgencyId] = useState<string | null>(null)
  const [selectTeamId, setSelectTeamId] = useState<string | null>(null)
  const [selectMemberId, setSelectMemberId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1);
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
  const location = useLocation();
  const navigate = useNavigate();

  const columns: TableProps<TAdvertisementTable>['columns'] = [
    {
      title: 'Tên tài khoản quảng cáo',
      dataIndex: 'name',
      key: 'name',
      className: cx('center-cell'),
      fixed: 'left'
    },
    {
      title: 'Tên thành viên',
      dataIndex: 'employee',
      key: 'employeeName',
      className: cx('center-cell'),
      render: (employee) => <span>{employee?.name}</span>,
      width: 180,
    },
    {
      title: 'Tên đội nhóm',
      dataIndex: 'employee',
      key: 'groupName',
      className: cx('center-cell'),
      render: (employee) => <span>{employee?.group?.name}</span>,
      width: 200,
    },
    {
      title: 'Trạng thái tài khoản quảng cáo',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      className: cx('center-cell'),
      render: (value) => handleAccountStatus(value)
    },
    {
      title: 'Lí do tài khoản bị vô hiệu hóa',
      dataIndex: 'disableReason',
      key: 'disableReason',
      className: cx('center-cell'),
      render: (value) => handleDisableReason(value),
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'typeCardBanking',
      key: 'typeCardBanking',
      className: cx('center-cell'),
      render: (value) => handleTypeCardBanking(value)
    },
    {
      title: 'Thông tin giao dịch',
      dataIndex: 'inforCardBanking',
      key: 'inforCardBanking',
      className: cx('center-cell'),
    },
    {
      title: 'Hạn mức chi tiêu',
      dataIndex: 'spendCap',
      key: 'spendCap',
      className: cx('center-cell'),
      render: (value) => <span>{formatNumberWithCommas(value)}</span>,
      width: 180
    },
    {
      title: 'Số tiền đã chi tiêu',
      dataIndex: 'amountSpent',
      key: 'amountSpent',
      className: cx('center-cell'),
      render: (value) => <span>{formatNumberWithCommas(value)}</span>,
      width: 180
    },
    {
      title: 'Đơn vị tiền tệ',
      dataIndex: 'currency',
      key: 'currency',
      className: cx('center-cell'),
      width: 180
    },
    {
      title: 'Số tiền nợ',
      dataIndex: 'balance',
      key: 'balance',
      className: cx('center-cell'),
      render: (value) => <span>{formatNumberWithCommas(value)}</span>,
      width: 180
    },
    {
      title: 'Id chủ tài khoản quảng cáo',
      dataIndex: 'owner',
      key: 'owner',
      className: cx('center-cell'),
    },
    {
      title: 'Múi giờ',
      dataIndex: 'timezoneName',
      key: 'timezoneName',
      className: cx('center-cell'),
      width: 180
    },
    {
      title: 'Thời gian tạo tài khoản quảng cáo',
      dataIndex: 'createdTime',
      key: 'createdTime',
      className: cx('center-cell'),
      render: (createdTime) => <span>{formatDateTime(createdTime)}</span>
    },
    {
      title: 'Thời gian cập nhật dữ liệu',
      dataIndex: 'updateDataTime',
      key: 'updateDataTime',
      className: cx('center-cell'),
      render: (updateDataTime) => <span>{formatDateTime(updateDataTime)}</span>
    },
  ];

  const onChangeSystem = (value: string) => {
    setSelectSystemId(value)
    setSelectAgencyId(null)
    setSelectTeamId(null)
    setSelectMemberId(null)
  };

  const onChangeAgency = (value: string) => {
    setSelectAgencyId(value)
    setSelectTeamId(null)
    setSelectMemberId(null)
  };

  const onChangeTeam = (value: string) => {
    setSelectTeamId(value)
    setSelectMemberId(null)
  };

  const onChangeMember = (value: string) => {
    setSelectMemberId(value)
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
    }).catch(() => setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false })))
    if (selectSystemId || organizationId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectSystem: false,
        isSelectAgency: true
      }))
      branchApi.getListBranch({ organizationId: selectSystemId || organizationId || '' }).then((res) => {
        setSelectAgencyData(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false }))
      })
    }
    if (selectAgencyId || branchId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectSystem: false,
        isSelectAgency: false,
        isSelectTeam: true
      }))
      groupApi.getListGroup({ branchId: selectAgencyId || branchId || '' }).then((res) => {
        setSelectTeamData(
          res.data.data.map((item: TypeTeamTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: false }))
      })
    }
    if (selectTeamId || groupId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectSystem: false,
        isSelectAgency: false,
        isSelectTeam: false,
        isSelectMember: true
      }))
      employeeApi.getListEmployee({ groupId: selectTeamId || groupId || '' }).then((res) => {
        setSelectMemberData(
          res.data.data.map((item: TMemberTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectMember: false }))
      })
    }
  }, [selectSystemId, selectAgencyId, selectTeamId, organizationId, branchId, groupId])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isTable: true }))
    advertisementApi.getListAdsAccountActive({
      pageIndex: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      organizationId: selectSystemId || organizationId || '',
      branchId: selectAgencyId || branchId || '',
      groupId: selectTeamId || groupId || '',
      employeeId: selectMemberId || ''
    }
    ).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TAdvertisementTable) => ({
          ...item,
          key: item.accountId,
        }));
        setTotalData(res.data.paging.totalCount)
        setDataTable(dataTableConfig)
        setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
      }
    }).catch(() => {
      setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
    })
  }, [currentPage, selectSystemId, selectAgencyId, selectTeamId, selectMemberId, organizationId, branchId, groupId])

  return (
    <>
      <div>
        <div className={cx('select-container')}>
          {role && hasRole([ROLE.ADMIN], role) &&
            <Select
              allowClear
              showSearch
              placeholder="Chọn hệ thống"
              optionFilterProp="label"
              onChange={onChangeSystem}
              options={selectSystemData}
              className={cx("select-system-item")}
              loading={loading.isSelectSystem}
              value={selectSystemId || null}
              notFoundContent={'Không có dữ liệu'}
            />
          }
          {role && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], role) &&
            <Select
              allowClear
              showSearch
              placeholder="Chọn chi nhánh"
              optionFilterProp="label"
              onChange={onChangeAgency}
              options={selectAgencyData}
              className={cx("select-system-item")}
              loading={loading.isSelectAgency}
              value={selectAgencyId || null}
              notFoundContent={selectSystemId || organizationId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
            />
          }
          {role && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], role) &&
            <Select
              allowClear
              showSearch
              placeholder="Chọn đội nhóm"
              optionFilterProp="label"
              onChange={onChangeTeam}
              options={selectTeamData}
              className={cx("select-system-item")}
              loading={loading.isSelectTeam}
              value={selectTeamId || null}
              notFoundContent={selectAgencyId || branchId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
            />
          }
          <Select
            allowClear
            showSearch
            placeholder="Chọn thành viên"
            optionFilterProp="label"
            onChange={onChangeMember}
            options={selectMemberData}
            className={cx("select-system-item")}
            loading={loading.isSelectMember}
            value={selectMemberId || null}
            notFoundContent={selectTeamId || groupId ? 'Không có dữ liệu' : 'Bạn cần chọn đội nhóm trước!'}
          />
        </div>
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: currentPage,
            pageSize: DEFAULT_PAGE_SIZE,
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
          scroll={{ x: 3200 }}
          loading={loading.isTable}
        />
      </div>
      <Spin fullscreen spinning={loading.isFullScreen} />
    </>
  )
}

export default AdvertisementManagement