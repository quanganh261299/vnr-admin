import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Button, message, Space, Table, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { TSystemUser, TUser, TUserOption } from '../../models/user/user';
import userApi from '../../api/userApi';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import SystemAccountModal from '../../Components/Modal/SystemAccountModal/SystemAccountModal';
import { SelectType } from '../../models/common';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';

const SystemAccount: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataTable, setDataTable] = useState<TUser[]>([])
  const [dataRecord, setDataRecord] = useState<TUser | null>(null)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
  })
  // const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [selectAccountData, setSelectAccountData] = useState<SelectType[]>([])
  const [messageApi, contextHolder] = message.useMessage();
  const modalRef = useRef<{ submit: () => void; reset: () => void }>(null);

  const columns: TableProps<TUser>['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '40%'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'roleName',
      render: (role) => <span>{role?.name}</span>,
      width: '40%'
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      width: '20%',
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

  const onFinish: FormProps<TSystemUser>['onFinish'] = (values) => {
    setLoading({ ...loading, isBtn: true })
    if (dataRecord) {
      // organizationApi.updateOrganization({ ...values, id: dataRecord?.id }).then(() => {
      //   setIsModalOpen(false)
      //   setIsCallbackApi(!isCallbackApi)
      //   setLoading({ ...loading, isBtn: false })
      //   success('Sửa hệ thống thành công!')
      // }).catch((err) => {
      //   setLoading({ ...loading, isBtn: false })
      //   error(err.response.data.message)
      // })
    }
    else {
      userApi.createSystemUser(values).then(() => {
        setLoading({ ...loading, isBtn: false })
        setIsModalOpen(false)
        success('Tạo tài khoản thành công!')
        setIsCallbackApi(!isCallbackApi)
        modalRef.current?.reset();
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

  const handleShowModal = (data: TUser | null = null) => {
    if (data) {
      console.log('data', data)
      setDataRecord(data)
      setIsModalOpen(true)
    }
    else {
      setDataRecord(null)
      setIsModalOpen(true)
    }
  }

  const handleShowConfirmDelete = (data: TUser) => {
    setDataRecord(data)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    userApi.deleteUser(dataRecord?.id as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setIsDeleteConfirm(false)
      setLoading({ ...loading, isBtn: false })
      success('Xóa tài khoản hệ thống thành công!')
    }).catch((err) => {
      error(err.response.data.message)
      setLoading({ ...loading, isBtn: false })
      setIsDeleteConfirm(false)
    })
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
    userApi.getRole().then((res) => {
      setSelectAccountData(
        res.data.data.filter((item: TUserOption) => item.name === 'ADMIN').map((item: TUserOption) => ({
          value: item.id,
          label: item.name
        }))
      )
    })
  }, [])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isTable: true }))
    userApi.getListSystemUser(currentPage, 10).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TUser) => ({
          ...item,
          key: item.id,
        }));
        setTotalData(res.data.paging.totalCount)
        setDataTable(dataTableConfig)
        setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
      }
    }).catch((err) => {
      console.log('err', err)
      setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
    })
  }, [currentPage, isCallbackApi])

  return (
    <>
      {contextHolder}
      <div className={styles["container"]}>
        <Tooltip title='Thêm tài khoản hệ thống'>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            className={styles['btn']}
            onClick={() => handleShowModal()}
          >
            Thêm tài khoản hệ thống
          </Button>
        </Tooltip>
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
      <SystemAccountModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        editingData={dataRecord}
        isLoadingBtn={loading.isBtn}
        selectAccountData={selectAccountData}
      />
      <DeleteModal
        title='Xóa tài khoản hệ thống'
        open={isDeleteConfirm}
        okText={'Xóa tài khoản hệ thống'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa tài khoản ${dataRecord?.email} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default SystemAccount