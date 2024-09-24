import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames/bind';
import { Button, message, Select, Space, Table, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import TeamModal from '../../Components/Modal/TeamModal/TeamModal';
import { TypeTeamField, TypeTeamTable } from '../../models/team/team';
import { SelectType } from '../../models/common';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import groupApi from '../../api/groupApi';
import organizationApi from '../../api/organizationApi';
import { TSystemTable } from '../../models/system/system';
import branchApi from '../../api/branchApi';
import { TAgencyTable } from '../../models/agency/agency';
import { DEFAULT_PAGE_SIZE } from '../../helper/const';

const TeamManagement: FC = () => {
  const cx = classNames.bind(styles)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataRecord, setDataRecord] = useState<TypeTeamField | null>(null)
  const [totalData, setTotalData] = useState<number>(0);
  const [dataTable, setDataTable] = useState<TypeTeamTable[]>([])
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectAgencyData, setSelectAgencyData] = useState<SelectType[]>([])
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [selectAgencyId, setSelectAgencyId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
    isSelectSystem: false,
    isSelectAgency: false,
    isSaveBtn: false
  })
  const [isSave, setIsSave] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const modalRef = useRef<{ submit: () => void; reset: () => void; saveReset: () => void }>(null);

  const columns: TableProps<TypeTeamTable>['columns'] = [
    {
      title: 'Tên đội nhóm',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'branch',
      key: 'branchName',
      width: '20%',
      render: (branch) => <span>{branch?.name}</span>,
    },
    {
      title: 'Tên hệ thống',
      dataIndex: 'branch',
      key: 'organizationName',
      width: '20%',
      render: (branch) => <span>{branch?.organization?.name}</span>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
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
    },
  ];

  const onChangeSystem = (value: string) => {
    setSelectSystemId(value)
    setSelectAgencyId(null)
  };

  const onChangeAgency = (value: string) => {
    setSelectAgencyId(value)
  };

  const onFinish: FormProps<TypeTeamField>['onFinish'] = (values) => {
    if (!isSave) setLoading((prevLoading) => ({ ...prevLoading, isBtn: true }))
    else setLoading((prevLoading) => ({ ...prevLoading, isSaveBtn: true }))
    if (dataRecord) {
      groupApi.updateGroup({ ...values, id: dataRecord?.id }).then(() => {
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
        success('Sửa đội nhóm thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    }
    else {
      groupApi.createGroup(values).then(() => {
        if (!isSave) {
          setLoading((prevLoading) => ({ ...prevLoading, isBtn: false }))
          setIsModalOpen(false)
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
        success('Tạo đội nhóm thành công!')
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

  const handleShowModal = (data: TypeTeamField | null = null) => {
    if (data) {
      setDataRecord(data)
      setIsModalOpen(true)
    }
    else {
      setDataRecord(null)
      setIsModalOpen(true)
    }
  }

  const handleShowConfirmDelete = (data: TypeTeamField) => {
    setDataRecord(data)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    groupApi.deleteGroup(dataRecord?.id as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setIsDeleteConfirm(false)
      setLoading({ ...loading, isBtn: false })
      success('Xóa đội nhóm thành công!')
    }).catch((err) => {
      error(err.response.data.message)
      setLoading({ ...loading, isBtn: false })
      setIsDeleteConfirm(false)
    })
  }

  const handleCancelDelete = () => {
    setIsDeleteConfirm(false)
  }

  const handleSave = () => {
    setIsSave(true)
    if (modalRef.current) {
      modalRef.current.submit();
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
    setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: true }))
    setSelectAgencyData([])
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
  }, [selectSystemId])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isTable: true }))
    groupApi.getListGroup({
      pageIndex: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      organizationId: selectSystemId || '',
      branchId: selectAgencyId || ''
    }).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TypeTeamTable) => ({
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

  }, [selectSystemId, selectAgencyId, currentPage, isCallbackApi])

  return (
    <>
      {contextHolder}
      <div>
        <Tooltip title="Thêm đội nhóm">
          <Button
            icon={<PlusOutlined />}
            type="primary" className={cx('btn')}
            onClick={() => handleShowModal()}
          >
            Thêm đội nhóm
          </Button>
        </Tooltip>
        <div className={cx('team-container')}>
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
            value={selectSystemId || null}
          />
          <Select
            allowClear
            showSearch
            placeholder="Chọn chi nhánh"
            optionFilterProp="label"
            onChange={onChangeAgency}
            options={selectAgencyData}
            className={cx("select-system-item")}
            notFoundContent={selectSystemId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
            loading={loading.isSelectAgency}
            value={selectAgencyId || null}
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
      <TeamModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleSave={handleSave}
        onFinish={onFinish}
        editingData={dataRecord}
        selectSystemData={selectSystemData}
        isLoadingOkBtn={loading.isBtn}
        isLoadingSaveBtn={loading.isSaveBtn}
      />
      <DeleteModal
        title='Xóa đội nhóm'
        open={isDeleteConfirm}
        okText={'Xóa đội nhóm'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa đội nhóm ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default TeamManagement