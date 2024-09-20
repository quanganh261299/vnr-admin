import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Button, message, Select, Space, Table, Tag, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import userApi from '../../api/userApi';
import { TBmUser, TBmUserField } from '../../models/user/user';
import { SelectType } from '../../models/common';
import { TypeTeamTable } from '../../models/team/team';
import groupApi from '../../api/groupApi';
import branchApi from '../../api/branchApi';
import { TAgencyTable } from '../../models/agency/agency';
import { TSystemTable } from '../../models/system/system';
import organizationApi from '../../api/organizationApi';
import BmAccountModal from '../../Components/Modal/BmAccountModal/BmAccountModal';

const SystemManagement: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataTable, setDataTable] = useState<TBmUser[]>([])
  const [dataRecord, setDataRecord] = useState<TBmUser | null>(null)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false
  })
  // const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectAgencyData, setSelectAgencyData] = useState<SelectType[]>([])
  const [selectTeamData, setSelectTeamData] = useState<SelectType[]>([])
  const [selectTeamId, setSelectTeamId] = useState<string | null>(null)
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [selectAgencyId, setSelectAgencyId] = useState<string | null>(null)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const modalRef = useRef<{ submit: () => void; reset: () => void }>(null);

  const columns: TableProps<TBmUser>['columns'] = [
    {
      title: 'Đội nhóm',
      key: 'idBM',
      render: (record) => <span>{record?.group?.name}</span>,
      width: '25%'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '25%'
    },
    {
      title: 'Danh sách id BM',
      dataIndex: 'pms',
      key: 'pms',
      render: (value) => value.map((item: { id: string; userId: string }) => <Tag>{item?.id}</Tag>),
      width: '25%'
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Button icon={<EditOutlined />} type="primary" onClick={() => handleShowModal(record)}>
              Sửa
            </Button>
            <Button icon={<DeleteOutlined />} danger onClick={() => handleShowConfirmDelete(record)}>
              Xóa
            </Button>
          </Space>
        </>
      ),
    },
  ];

  const onFinish: FormProps<TBmUserField>['onFinish'] = (values) => {
    setLoading({ ...loading, isBtn: true })
    if (dataRecord) {
      const data = {
        id: dataRecord?.id,
        email: values.email,
        groupId: values.groupId,
        bmsId: values.bmsId
      }
      userApi.updateBmUser(data).then(() => {
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        setLoading({ ...loading, isBtn: false })
        success('Sửa tài khoản BM thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    }
    else {
      const data = {
        email: values.email,
        groupId: values.groupId,
        bmsId: String(values.bmsId).split(',').map((id) => id.trim())
      }
      userApi.createBmUser(data).then(() => {
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        modalRef.current?.reset();
        setLoading({ ...loading, isBtn: false })
        success('Tạo tài khoản BM thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    };
  };

  const handleOk = () => {
    if (modalRef.current) {
      modalRef.current.submit();
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setDataRecord(null)
  }

  const handleShowModal = (data: TBmUser | null = null) => {
    if (data) {
      setDataRecord(data)
      setIsModalOpen(true)
    }
    else {
      setDataRecord(null)
      setIsModalOpen(true)
    }
  }

  const handleShowConfirmDelete = (data: TBmUser) => {
    setDataRecord(data)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    userApi.deleteUser(dataRecord?.id as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setIsDeleteConfirm(false)
      setLoading({ ...loading, isBtn: false })
      success('Xóa tài khoản BM thành công!')
    }).catch((err) => {
      error(err.response.data.message)
      setLoading({ ...loading, isBtn: false })
      setIsDeleteConfirm(false)
    })
  }

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
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false, isSelectTeam: true }))
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
  }, [selectSystemId, selectAgencyId])

  useEffect(() => {
    setLoading({ ...loading, isTable: true })
    userApi.getListBmUser(currentPage, 10).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TBmUser) => ({
          ...item,
          key: item.id,
        }));
        setTotalData(res.data.paging.totalCount)
        setDataTable(dataTableConfig)
        setLoading({ ...loading, isTable: false })
      }
    }).catch(() => {
      setLoading({ ...loading, isTable: false })
    })
  }, [currentPage, isCallbackApi])

  return (
    <>
      {contextHolder}
      <div className={styles["container"]}>
        <Tooltip title='Thêm tài khoản BM'>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            className={styles['btn']}
            onClick={() => handleShowModal()}
          >
            Thêm tài khoản BM
          </Button>
        </Tooltip>
        <div className={styles["bm-container"]}>
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            optionFilterProp="label"
            onChange={onChangeSystem}
            options={selectSystemData}
            className={styles["select-system-item"]}
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
            className={styles["select-system-item"]}
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
            className={styles["select-system-item"]}
            notFoundContent={selectAgencyId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
            loading={loading.isSelectTeam}
          />
        </div>
        <Table
          columns={columns}
          dataSource={dataTable}
          loading={loading.isTable}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: totalData,
            position: ['bottomCenter'],
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
      <BmAccountModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        editingData={dataRecord}
        selectSystemData={selectSystemData}
        isLoadingBtn={loading.isBtn}
      />
      <DeleteModal
        title='Xóa tài khoản BM'
        open={isDeleteConfirm}
        okText={'Xóa tài khoản BM'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa tài khoản BM ${dataRecord?.email} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default SystemManagement