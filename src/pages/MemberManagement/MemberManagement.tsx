import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames/bind';
import { Button, message, Select, Space, Table, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { TMemberField, TMemberTable } from '../../models/member/member';
import { SelectType } from '../../models/common';
import MemberModal from '../../Components/Modal/MemberModal/MemberModal';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import employeeApi from '../../api/employeeApi';
import organizationApi from '../../api/organizationApi';
import { TSystemTable } from '../../models/system/system';
import branchApi from '../../api/branchApi';
import { TAgencyTable } from '../../models/agency/agency';
import groupApi from '../../api/groupApi';
import { TypeTeamTable } from '../../models/team/team';
import { DEFAULT_PAGE_SIZE } from '../../helper/const';

const MemberManagement: FC = () => {
  const cx = classNames.bind(styles);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataRecord, setDataRecord] = useState<TMemberField | null>(null)
  const [dataTable, setDataTable] = useState<TMemberTable[]>([])
  const [totalData, setTotalData] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSave, setIsSave] = useState<boolean>(false)
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectAgencyData, setSelectAgencyData] = useState<SelectType[]>([])
  const [selectTeamData, setSelectTeamData] = useState<SelectType[]>([])
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [selectAgencyId, setSelectAgencyId] = useState<string | null>(null)
  const [selectTeamId, setSelectTeamId] = useState<string | null>(null)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
    isSaveBtn: false,
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false
  })
  const [messageApi, contextHolder] = message.useMessage();
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  const modalRef = useRef<{ submit: () => void; reset: () => void; saveReset: () => void }>(null);


  const columns: TableProps<TMemberTable>['columns'] = [
    {
      title: 'Tên thành viên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span>{text}</span>,
      width: 150,
      className: cx('center-cell')
    },
    {
      title: 'Tên đội nhóm',
      dataIndex: 'group',
      key: 'groupName',
      render: (group) => <span>{group?.name}</span>,
      width: 150,
      className: cx('center-cell')
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'group',
      key: 'branchName',
      render: (group) => <span>{group?.branch?.name}</span>,
      width: 150,
      className: cx('center-cell')
    },
    {
      title: 'Tên hệ thống',
      dataIndex: 'group',
      key: 'organizationName',
      render: (group) => <span>{group?.branch?.organization?.name}</span>,
      width: 150,
      className: cx('center-cell')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: cx('center-cell')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      className: cx('center-cell')
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      className: cx('center-cell')
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={() => handleShowModal(record)}
            >
              Sửa
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleShowConfirmDelete(record)}
            >
              Xóa
            </Button>
          </Space>
        </>
      ),
      className: cx('center-cell')
    },
  ];

  const onChangeSystem = (value: string) => {
    setSelectSystemId(value)
    setSelectAgencyId(null)
    setSelectTeamId(null)
  };

  const onChangeAgency = (value: string) => {
    setSelectAgencyId(value)
    setSelectTeamId(null)
  };

  const onChangeTeam = (value: string) => {
    setSelectTeamId(value)
  };

  const onFinish: FormProps<TMemberField>['onFinish'] = (values) => {
    if (!isSave) setLoading((prevLoading) => ({ ...prevLoading, isBtn: true }))
    else setLoading((prevLoading) => ({ ...prevLoading, isSaveBtn: true }))

    if (dataRecord) {
      employeeApi.updateEmployee({ ...values, id: dataRecord?.id }).then(() => {
        if (!isSave) {
          setIsModalOpen(false)
          setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
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
        setLoading({ ...loading, isBtn: false })
        success('Sửa thành viên thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    }
    else {
      employeeApi.createEmployee(values).then(() => {
        if (!isSave) {
          setIsModalOpen(false)
          setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
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
        setLoading({ ...loading, isBtn: false })
        success('Tạo thành viên thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    };
  };

  const handleOk = () => {
    setIsSave(false)
    if (modalRef.current) {
      modalRef.current.submit();
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setDataRecord(null)
    if (modalRef.current) {
      modalRef.current.reset();
    }
  }

  const handleShowModal = (data: TMemberField | null = null) => {
    if (data) {
      setDataRecord(data)
      setIsModalOpen(true)
    }
    else {
      setDataRecord(null)
      setIsModalOpen(true)
    }
  }

  const handleShowConfirmDelete = (data: TMemberField) => {
    setDataRecord(data)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    employeeApi.deleteEmployee(dataRecord?.id as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setIsDeleteConfirm(false)
      setLoading({ ...loading, isBtn: false })
      success('Xóa thành viên thành công!')
    }).catch((err) => {
      error(err.response.data.message)
      setLoading({ ...loading, isBtn: false })
      setIsDeleteConfirm(false)
    })
  }

  const handleSave = () => {
    setIsSave(true)
    if (modalRef.current) {
      modalRef.current.submit();
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteConfirm(false)
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
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false, isSelectAgency: true }))
      branchApi.getListBranch({ organizationId: selectSystemId }).then((res) => {
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
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false, isSelectTeam: true }))
      groupApi.getListGroup({ branchId: selectAgencyId }).then((res) => {
        setSelectTeamData(
          res.data.data.map((item: TypeTeamTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: false }))
      })
    }
  }, [selectSystemId, selectAgencyId])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isTable: true }))
    employeeApi.getListEmployee({
      pageIndex: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      organizationId: selectSystemId || '',
      branchId: selectAgencyId || '',
      groupId: selectTeamId || ''
    }).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TMemberTable) => ({
          ...item,
          key: item.id,
        }));
        setTotalData(res.data.paging.totalCount)
        setDataTable(dataTableConfig)
        setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
      }
    }).catch(() => {
      setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
    })
  }, [selectSystemId, selectAgencyId, selectTeamId, currentPage, isCallbackApi])

  return (
    <>
      {contextHolder}
      <div>
        <Tooltip title="Thêm thành viên">
          <Button
            icon={<PlusOutlined />}
            type="primary" className={cx('btn')}
            onClick={() => handleShowModal()}
          >
            Thêm thành viên
          </Button>
        </Tooltip>
        <div className={cx('member-container')}>
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
          loading={loading.isTable}
        />
      </div>
      <MemberModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleSave={handleSave}
        handleCancel={handleCancel}
        onFinish={onFinish}
        editingData={dataRecord}
        selectSystemData={selectSystemData}
        isLoadingOkBtn={loading.isBtn}
        isLoadingSaveBtn={loading.isSaveBtn}
      />
      <DeleteModal
        title='Xóa thành viên'
        open={isDeleteConfirm}
        okText={'Xóa thành viên'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa thành viên ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default MemberManagement

