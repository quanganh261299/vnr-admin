import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Button, message, Space, Table, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import { TSystemField, TSystemTable } from '../../models/system/system';
import organizationApi from '../../api/organizationApi';
import BmModal from '../../Components/Modal/BmModal/BmModal';
import userApi from '../../api/userApi';

const SystemManagement: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataTable, setDataTable] = useState<TSystemTable[]>([])
  const [dataRecord, setDataRecord] = useState<TSystemField | null>(null)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
  })
  // const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const modalRef = useRef<{ submit: () => void; reset: () => void }>(null);

  const columns: TableProps<TSystemTable>['columns'] = [
    {
      title: 'Id BM',
      dataIndex: 'idBM',
      key: 'idBM',
      render: (text) => <span>{text}</span>,
      width: '22%',
    },
    {
      title: 'Id tài khoản facebook',
      dataIndex: 'idFB',
      key: 'idFB',
      width: '22%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '22%',
    },
    {
      title: 'Đội nhóm',
      dataIndex: 'group',
      key: 'group',
      width: '22%',
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      width: '12%',
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

  const onFinish: FormProps<TSystemField>['onFinish'] = (values) => {
    setLoading({ ...loading, isBtn: true })
    if (dataRecord) {
      organizationApi.updateOrganization({ ...values, id: dataRecord?.id }).then(() => {
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        setLoading({ ...loading, isBtn: false })
        success('Sửa hệ thống thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    }
    else {
      organizationApi.createOrganization(values).then(() => {
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        modalRef.current?.reset();
        setLoading({ ...loading, isBtn: false })
        success('Tạo hệ thống thành công!')
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

  const handleShowModal = (data: TSystemField | null = null) => {
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

  const handleShowConfirmDelete = (data: TSystemField) => {
    setDataRecord(data)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    organizationApi.deleteOrganization(dataRecord?.id as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setIsDeleteConfirm(false)
      setLoading({ ...loading, isBtn: false })
      success('Xóa hệ thống thành công!')
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
    setLoading({ ...loading, isTable: true })
    userApi.getListBmUser(currentPage, 10).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TSystemTable) => ({
          ...item,
          key: item.id,
        }));
        setTotalData(res.data.paging.totalCount)
        setDataTable(dataTableConfig)
        setLoading({ ...loading, isTable: false })
      }
    }).catch((err) => {
      console.log('err', err)
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
      <BmModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        editingData={dataRecord}
        isLoadingBtn={loading.isBtn}
      />
      <DeleteModal
        title='Xóa tài khoản BM'
        open={isDeleteConfirm}
        okText={'Xóa tài khoản BM'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa hệ thống ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default SystemManagement