import { FC, useEffect, useState } from 'react'
import styles from './style.module.scss'
import { Button, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { TUser } from '../../models/user/user';
import userApi from '../../api/userApi';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const ListAccount: FC = () => {
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataTable, setDataTable] = useState<TUser[]>([])
  // const [dataRecord, setDataRecord] = useState<TSystemField | null>(null)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
  })
  // const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  // const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  // const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  // const [messageApi, contextHolder] = message.useMessage();
  // const modalRef = useRef<{ submit: () => void; reset: () => void }>(null);

  const handleShowModal = (data: TUser | null = null) => {
    console.log('data', data)
  }

  const handleShowConfirmDelete = (data: TUser | null = null) => {
    console.log('data', data)
  }

  const columns: TableProps<TUser>['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'roleName',
      render: (role) => <span>{role.name}</span>,
    },
    {
      title: 'Đội nhóm',
      dataIndex: 'group',
      key: 'groupName',
      render: (group) => (
        group ? (
          <>
            <span>{group.name}</span>
          </>
        )
          :
          (
            <>
              <span>Tài khoản admin không thuộc đội nhóm nào</span>
            </>
          )
      ),
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      width: '10%',
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

  // const onFinish: FormProps<TSystemField>['onFinish'] = (values) => {
  //   setLoading({ ...loading, isBtn: true })
  //   if (dataRecord) {
  //     organizationApi.updateOrganization({ ...values, id: dataRecord?.id }).then(() => {
  //       setIsModalOpen(false)
  //       setIsCallbackApi(!isCallbackApi)
  //       setLoading({ ...loading, isBtn: false })
  //       success('Sửa hệ thống thành công!')
  //     }).catch((err) => {
  //       setLoading({ ...loading, isBtn: false })
  //       error(err.response.data.message)
  //     })
  //   }
  //   else {
  //     organizationApi.createOrganization(values).then(() => {
  //       setIsModalOpen(false)
  //       setIsCallbackApi(!isCallbackApi)
  //       modalRef.current?.reset();
  //       setLoading({ ...loading, isBtn: false })
  //       success('Tạo hệ thống thành công!')
  //     }).catch((err) => {
  //       setLoading({ ...loading, isBtn: false })
  //       error(err.response.data.message)
  //     })
  //   };
  // };

  // const handleOk = () => {
  //   if (modalRef.current) {
  //     modalRef.current.submit();
  //   }
  // }

  // const handleCancel = () => {
  //   setIsModalOpen(false)
  //   setDataRecord(null)
  // }

  // const handleShowModal = (data: TSystemField | null = null) => {
  //   if (data) {
  //     console.log('data', data)
  //     setDataRecord(data)
  //     setIsModalOpen(true)
  //   }
  //   else {
  //     setDataRecord(null)
  //     setIsModalOpen(true)
  //   }
  // }

  // const handleShowConfirmDelete = (data: TSystemField) => {
  //   setDataRecord(data)
  //   setIsDeleteConfirm(true)
  // }

  // const handleConfirmDelete = () => {
  //   setLoading({ ...loading, isBtn: true })
  //   organizationApi.deleteOrganization(dataRecord?.id as string).then(() => {
  //     setIsCallbackApi(!isCallbackApi)
  //     setIsDeleteConfirm(false)
  //     setLoading({ ...loading, isBtn: false })
  //     success('Xóa hệ thống thành công!')
  //   }).catch((err) => {
  //     error(err.response.data.message)
  //     setLoading({ ...loading, isBtn: false })
  //     setIsDeleteConfirm(false)
  //   })
  // }

  // const handleCancelDelete = () => {
  //   setIsDeleteConfirm(false)
  // }

  // const success = (message: string) => {
  //   messageApi.open({
  //     type: 'success',
  //     content: message,
  //   });
  // };

  // const error = (message: string) => {
  //   messageApi.open({
  //     type: 'error',
  //     content: message,
  //   });
  // };

  useEffect(() => {
    setLoading({ ...loading, isTable: true })
    userApi.getListUser(currentPage, 10).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        setTotalData(res.data.paging.totalCount)
        setDataTable(data)
        setLoading({ ...loading, isTable: false })
      }
    }).catch((err) => {
      console.log('err', err)
      setLoading({ ...loading, isTable: false })
    })
    const dataTableConfig = dataTable.map((item) => ({
      ...item,
      key: item.id,
    }));
    setDataTable(dataTableConfig)
  }, [currentPage])

  return (
    <>
      {/* {contextHolder} */}
      <div className={styles["container"]}>
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
      {/* <SystemModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        editingData={dataRecord}
        isLoadingBtn={loading.isBtn}
      /> */}
      {/* <DeleteModal
        title='Xóa hệ thống'
        open={isDeleteConfirm}
        okText={'Xóa hệ thống'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa hệ thống ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      /> */}
    </>
  )
}

export default ListAccount