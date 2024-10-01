import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames/bind';
import { Button, message, Modal, Select, Space, Table, Tag, Tooltip, Upload } from 'antd';
import type { FormProps, TableProps, UploadFile } from 'antd';
import { DeleteOutlined, EditOutlined, FileExcelOutlined, PlusOutlined, UndoOutlined, UploadOutlined } from '@ant-design/icons';
import { TAdvertisementField } from '../../models/advertisement/advertisement';
import advertisementApi from '../../api/advertisementApi';
import { TAdUserTable } from '../../models/user/user';
import AdAccountModal from '../../Components/Modal/AdAccountModal/AdAccountModal';
import { useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../Components/Modal/ConfirmModal/ConfirmModal';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import { DEFAULT_PAGE_SIZE, hasRole, ROLE } from '../../helper/const';
import { UploadChangeParam } from 'antd/es/upload';
import { SelectType } from '../../models/common';
import { TypeTeamTable } from '../../models/team/team';
import groupApi from '../../api/groupApi';
import { TAgencyTable } from '../../models/agency/agency';
import branchApi from '../../api/branchApi';
import { TSystemTable } from '../../models/system/system';
import organizationApi from '../../api/organizationApi';
import { TMemberTable } from '../../models/member/member';
import employeeApi from '../../api/employeeApi';

interface Props {
  role: string | null
  organizationId: string | null
  branchId: string | null
  groupId: string | null
}

const AdAccount: FC<Props> = (props) => {
  const { role, organizationId, branchId, groupId } = props
  const cx = classNames.bind(styles)
  const [modal, setModal] = useState({
    isAddModalOpen: false,
    isDeleteModalOpen: false,
    isRecoverModalOpen: false
  })
  const [dataTable, setDataTable] = useState<TAdUserTable[]>([])
  const [dataRecord, setDataRecord] = useState<TAdUserTable | null>(null)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
    isSaveBtn: false,
    isUpload: false,
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false,
    isSelectMember: false
  })
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [isSave, setIsSave] = useState<boolean>(false)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const modalRef = useRef<{ submit: () => void; reset: () => void; saveReset: () => void }>(null);
  const [searchParams] = useSearchParams()
  const [isDeleted, setIsDeleted] = useState<boolean>(!!searchParams.get('isDeleted'))
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectAgencyData, setSelectAgencyData] = useState<SelectType[]>([])
  const [selectTeamData, setSelectTeamData] = useState<SelectType[]>([])
  const [selectMemberData, setSelectMemberData] = useState<SelectType[]>([])
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [selectAgencyId, setSelectAgencyId] = useState<string | null>(null)
  const [selectTeamId, setSelectTeamId] = useState<string | null>(null)
  const [selectMemberId, setSelectMemberId] = useState<string | null>(null)

  const columns: TableProps<TAdUserTable>['columns'] = [
    {
      title: 'Tên tài khoản QC',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: 'Danh sách BM',
      dataIndex: 'pms',
      key: 'pms',
      width: '15%',
      render: (arr) => arr.length > 0 ? arr.map((item: { id: string }) => (<Tag>{item.id}</Tag>)) : null
    },
    {
      title: 'Tên thành viên',
      dataIndex: 'employee',
      key: 'name',
      width: '15%',
      className: cx('center-cell'),
      render: (employee) => <span>{employee?.name}</span>
    },
    {
      title: 'Tên đội nhóm',
      dataIndex: 'employee',
      key: 'groupName',
      className: cx('center-cell'),
      render: (employee) => <span>{employee?.group?.name}</span>,
      width: '15%',
    },
    {
      title: 'Id tài khoản QC',
      dataIndex: 'accountId',
      key: 'accountId',
      width: '15%',
      className: cx('center-cell'),
    },
    {
      title: 'Trạng thái tài khoản',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      className: cx('center-cell'),
      render: (isActive) => isActive ? <Tag color='green'>Đã được kích hoạt</Tag> : <Tag color='red'>Chưa được kích hoạt</Tag>
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (_, record) => (
        <>
          {
            !isDeleted ? (
              <Space size="middle">
                <Button icon={<EditOutlined />} type="primary" onClick={() => handleShowModal(record)}>
                  Sửa
                </Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => handleShowConfirmDelete(record)}>
                  Xóa
                </Button>
              </Space>
            )
              : (
                <Space size="middle">
                  <Button icon={<UndoOutlined />} type="primary" onClick={() => handleShowConfirmRecover(record)}>
                    Khôi phục
                  </Button>
                  <Button icon={<DeleteOutlined />} danger onClick={() => handleShowConfirmDelete(record)}>
                    Xóa
                  </Button>
                </Space>
              )
          }
        </>
      ),
      width: '10%',
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

  const onFinish: FormProps<TAdvertisementField>['onFinish'] = (values) => {
    if (!isSave) setLoading((prevLoading) => ({ ...prevLoading, isBtn: true }))
    else setLoading((prevLoading) => ({ ...prevLoading, isSaveBtn: true }))
    const data = {
      accountID: String(values.id),
      employeeID: String(values.employeeId),
      pmsId: dataRecord
        ? values.pms?.map((item: string | { value: string; label: string }) =>
          typeof item === 'string' ? item : item.value
        )
        : values.pms,
      typeAccount: values.typeAccount,
      sourceAccount: values.sourceAccount,
      cost: values.cost,
      informationLogin: values.informationLogin
    }

    if (dataRecord) {
      advertisementApi.updateAdsAccount(data).then(() => {
        if (!isSave) {
          setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
          setModal((prevState) => ({ ...prevState, isAddModalOpen: false }))
          if (modalRef.current) {
            modalRef.current.reset();
          }
        }
        else {
          setLoading((prevLoading) => ({ ...prevLoading, isSaveBtn: false }))
          if (modalRef.current) {
            modalRef.current.saveReset();
          }
        }
        setIsCallbackApi(!isCallbackApi)
        success('Sửa tài khoản quảng cáo thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    }
    else {
      advertisementApi.createAdsAccount(data).then(() => {
        if (!isSave) {
          setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
          setModal((prevState) => ({ ...prevState, isAddModalOpen: false }))
          if (modalRef.current) {
            modalRef.current.reset();
          }
        }
        else {
          setLoading((prevLoading) => ({ ...prevLoading, isSaveBtn: false }))
          if (modalRef.current) {
            modalRef.current.saveReset();
          }
        }
        success('Tạo tài khoản quảng cáo thành công!')
        setIsCallbackApi(!isCallbackApi)
      }).catch((err) => {
        setLoading((prevLoading) => ({ ...prevLoading, isBtn: false, isSaveBtn: false }))
        error(err.response.data.message)
      })
    }
  };

  const handleOk = () => {
    setIsSave(false)
    if (modalRef.current) {
      modalRef.current.submit();
    }
  }

  const handleSave = () => {
    setIsSave(true)
    if (modalRef.current) {
      modalRef.current.submit();
    }
  }

  const handleCancel = () => {
    setModal((prevState) => ({ ...prevState, isAddModalOpen: false }))
    setDataRecord(null)
    if (modalRef.current) {
      modalRef.current.reset();
    }
  }

  const handleShowModal = (data: TAdUserTable | null = null) => {
    if (data) {
      setDataRecord(data)
      setModal((prevState) => ({ ...prevState, isAddModalOpen: true }))
    }
    else {
      setDataRecord(null)
      setModal((prevState) => ({ ...prevState, isAddModalOpen: true }))
    }
  }

  const handleShowConfirmDelete = (data: TAdUserTable) => {
    setDataRecord(data)
    setModal((prevState) => ({ ...prevState, isDeleteModalOpen: true }))
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    if (!isDeleted) {
      advertisementApi.deleteAndRecoverAdsAccount(dataRecord?.accountId as string).then(() => {
        setIsCallbackApi(!isCallbackApi)
        setModal((prevState) => ({ ...prevState, isDeleteModalOpen: false }))
        setLoading({ ...loading, isBtn: false })
        success('Xóa tài khoản quảng cáo thành công!')
      }).catch((err) => {
        error(err.response.data.message)
        setLoading({ ...loading, isBtn: false })
        setModal((prevState) => ({ ...prevState, isDeleteModalOpen: false }))
      })
    }
    else {
      advertisementApi.deleteAdsAccount(dataRecord?.accountId as string).then(() => {
        setIsCallbackApi(!isCallbackApi)
        setModal((prevState) => ({ ...prevState, isDeleteModalOpen: false }))
        setLoading({ ...loading, isBtn: false })
        success('Xóa tài khoản quảng cáo khỏi hệ thống thành công!')
      }).catch((err) => {
        error(err.response.data.message)
        setLoading({ ...loading, isBtn: false })
        setModal((prevState) => ({ ...prevState, isDeleteModalOpen: false }))
      })
    }
  }

  const handleCancelDelete = () => setModal((prevState) => ({ ...prevState, isDeleteModalOpen: false }))

  const handleShowConfirmRecover = (data: TAdUserTable) => {
    setDataRecord(data)
    setModal((prevState) => ({ ...prevState, isRecoverModalOpen: true }))
  }

  const handleConfirmRecover = () => {
    setLoading((prevLoading) => ({ ...prevLoading, isBtn: true }))
    advertisementApi.deleteAndRecoverAdsAccount(dataRecord?.accountId as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setModal((prevState) => ({ ...prevState, isRecoverModalOpen: false }))
      setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
      success('Khôi phục tài khoản thành công!')
    }).catch((err) => {
      error(err.response.data.message)
      setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
      setModal((prevState) => ({ ...prevState, isRecoverModalOpen: false }))
    })
  }

  const handleCancelRecover = () => setModal((prevState) => ({ ...prevState, isRecoverModalOpen: false }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadFile = (info: UploadChangeParam<UploadFile<any>>) => {
    setLoading((prevLoading) => ({ ...prevLoading, isUpload: true }))
    const file = info.file.originFileObj
    if (file) {
      advertisementApi.createAdsAccountByExcel(file).then(() => {
        setLoading((prevLoading) => ({ ...prevLoading, isUpload: false }))
        success('Thêm tài khoản quảng cáo thành công!')
        setIsCallbackApi(!isCallbackApi)
      }).catch((err) => {
        setLoading((prevLoading) => ({ ...prevLoading, isUpload: false }))
        const errorArr = JSON.parse(err.response.data.message)
        Modal.error({
          title: 'Thông báo lỗi',
          content: (
            <div>
              {errorArr.slice(0, 9).map((element: { RowIndex: number; ErrorMessage: string }) => (
                <div key={element.RowIndex}>{element.ErrorMessage}</div>
              ))}
            </div>
          ),
          footer: (
            <div className={cx('btn-ok')}>
              <Button
                onClick={() => Modal.destroyAll()}
                type='primary'
              >
                Close
              </Button>
            </div>
          ),
          closable: true,
          centered: true,
        });
      })
    }
    else {
      setLoading((prevLoading) => ({ ...prevLoading, isUpload: false }))
      error('File chưa đúng định dạng')
    }
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
    setIsDeleted(!!searchParams.get('isDeleted'))
  }, [searchParams])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: true }))
    setSelectAgencyData([])
    setSelectTeamData([])
    organizationApi.getListOrganization().then((res) => {
      setSelectSystemData(
        res.data.data.map((item: TSystemTable) => ({
          value: item.id,
          label: item.name
        }))
      )
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false }))
    })
    if (selectSystemId || organizationId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false, isSelectAgency: true }))
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
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false, isSelectTeam: true }))
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
  }, [selectSystemId, selectAgencyId, organizationId, branchId, groupId, selectTeamId])

  useEffect(() => {
    setLoading({ ...loading, isTable: true })
    advertisementApi.getListAdsAccount({
      pageIndex: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      isDelete: isDeleted,
      organizationId: selectSystemId || organizationId || '',
      branchId: selectAgencyId || branchId || '',
      groupId: selectTeamId || groupId || '',
      employeeId: selectMemberId || ''
    }).then((res) => {
      console.log('res', res)
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        setTotalData(res.data.paging.totalCount)
        const dataTableConfig = data.map((item: TAdUserTable) => ({
          ...item,
          key: item.accountId,
        }));
        setDataTable(dataTableConfig)
        setLoading({ ...loading, isTable: false })
      }
    }).catch((err) => {
      error(err.response.data.message)
      setLoading({ ...loading, isTable: false })
    })
  }, [currentPage, isCallbackApi, isDeleted, selectSystemId, selectAgencyId, selectTeamId, selectMemberId, organizationId, branchId, groupId])

  return (
    <>
      {contextHolder}
      {
        !isDeleted && (
          <>
            <Tooltip title='Thêm tài khoản hệ thống'>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                className={cx('btn')}
                onClick={() => handleShowModal()}
              >
                Thêm tài khoản quảng cáo
              </Button>
            </Tooltip>
            <Tooltip title='Thêm nhiều tài khoản qua file excel'>
              <Upload
                accept=".xls,.xlsx,.csv"
                showUploadList={false}
                maxCount={1}
                className={cx('btn', 'btn-excel')}
                customRequest={() => { }}
                onChange={(data) => handleUploadFile(data)}
              >
                <Button
                  icon={<UploadOutlined />}
                  type="dashed"
                  loading={loading.isUpload}
                >
                  Import tài khoản quảng cáo
                </Button>
              </Upload>
            </Tooltip>
            <a href={`/sample.xlsx`} download={'sample.xlsx'}>
              <Tooltip title='File excel mẫu'>
                <Button
                  icon={<FileExcelOutlined />}
                  type='primary'
                  style={{ color: 'white', background: 'green' }}
                  className={cx('btn', 'btn-excel')}
                >
                  File mẫu
                </Button>
              </Tooltip>
            </a>
          </>
        )
      }
      {
        role && hasRole([ROLE.ADMIN], role) &&
        <Select
          allowClear
          showSearch
          placeholder="Chọn hệ thống"
          optionFilterProp="label"
          onChange={onChangeSystem}
          options={selectSystemData}
          className={cx("select-system-item")}
          notFoundContent={'Không có dữ liệu'}
          loading={loading.isSelectSystem}
        />
      }
      {
        role && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], role) &&
        <Select
          allowClear
          showSearch
          placeholder="Chọn chi nhánh"
          optionFilterProp="label"
          onChange={onChangeAgency}
          options={selectAgencyData}
          value={selectAgencyId || null}
          className={cx("select-system-item")}
          notFoundContent={selectSystemId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
          loading={loading.isSelectAgency}
        />
      }
      {
        role && hasRole([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], role) &&
        <Select
          allowClear
          showSearch
          placeholder="Chọn đội nhóm"
          optionFilterProp="label"
          onChange={onChangeTeam}
          options={selectTeamData}
          value={selectTeamId || null}
          className={cx("select-system-item")}
          notFoundContent={selectAgencyId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
          loading={loading.isSelectTeam}
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
      <div>
        <Table
          columns={columns}
          dataSource={dataTable}
          loading={loading.isTable}
          pagination={{
            current: currentPage,
            pageSize: DEFAULT_PAGE_SIZE,
            total: totalData,
            position: ['bottomCenter'],
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
      <AdAccountModal
        role={role}
        organizationId={organizationId}
        branchId={branchId}
        groupId={groupId}
        ref={modalRef}
        isModalOpen={modal.isAddModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleSave={handleSave}
        onFinish={onFinish}
        editingData={dataRecord}
        isLoadingOkBtn={loading.isBtn}
        isLoadingSaveBtn={loading.isSaveBtn}
      />
      <ConfirmModal
        title={'Khôi phục tài khoản'}
        open={modal.isRecoverModalOpen}
        okText={'Khôi phục tài khoản'}
        cancelText={'Cancel'}
        handleOk={handleConfirmRecover}
        handleCancel={handleCancelRecover}
        description={`Bạn có muốn khôi phục tài khoản ${dataRecord?.name || `id: ${dataRecord?.accountId}`} không?`}
        isLoadingBtn={loading.isBtn}
      />
      <DeleteModal
        title={isDeleted ? 'Xóa hoàn toàn tài khoản quảng cáo' : 'Xóa tài khoản quảng cáo'}
        open={modal.isDeleteModalOpen}
        okText={'Xóa tài khoản quảng cáo'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={isDeleted ? `Bạn có chắc muốn xóa hoàn toàn tài khoản ${dataRecord?.name || `id: ${dataRecord?.accountId}`} không?` : `Bạn có chắc muốn xóa tài khoản ${dataRecord?.name || `id: ${dataRecord?.accountId}`} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default AdAccount