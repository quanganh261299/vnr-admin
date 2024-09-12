import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Button, message, Space, Table, Tag, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import { TAdvertisementField } from '../../models/advertisement/advertisement';
import advertisementApi from '../../api/advertisementApi';
import { TAdUserTable } from '../../models/user/user';
import AdAccountModal from '../../Components/Modal/AdAccountModal/AdAccountModal';


const AdAccount: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataTable, setDataTable] = useState<TAdUserTable[]>([])
  const [dataRecord, setDataRecord] = useState<TAdUserTable | null>(null)
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

  const columns: TableProps<TAdUserTable>['columns'] = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'employee',
      key: 'name',
      width: '20%',
      render: (employee) => <span>{employee.name}</span>
    },
    {
      title: 'Tên tài khoản quảng cáo',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Id tài khoản quảng cáo',
      dataIndex: 'accountId',
      key: 'accountId',
      width: '20%',
    },
    {
      title: 'Trạng thái tài khoản',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '20%',
      render: (isActive) => isActive ? <Tag color='green'>Đã được kích hoạt</Tag> : <Tag color='red'>Chưa được kích hoạt</Tag>
    },
    {
      title: 'Tùy chọn',
      key: 'action',
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
      width: '20%',
    },
  ];

  const onFinish: FormProps<TAdvertisementField>['onFinish'] = (values) => {
    setLoading((prevLoading) => ({ ...prevLoading, isBtn: true }))
    const data = {
      accountID: String(values.id),
      employeeID: String(values.employeeId),
    }
    if (dataRecord) {
      advertisementApi.updateAdsAccount(data).then(() => {
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        setLoading({ ...loading, isBtn: false })
        success('Sửa tài khoản quảng cáo thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message)
      })
    }
    else {
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
    }
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

  const handleShowModal = (data: TAdUserTable | null = null) => {
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

  const handleShowConfirmDelete = (data: TAdUserTable) => {
    setDataRecord(data)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    advertisementApi.deleteAdsAccount(dataRecord?.accountId as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setIsDeleteConfirm(false)
      setLoading({ ...loading, isBtn: false })
      success('Xóa tài khoản quảng cáo thành công!')
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
    advertisementApi.getListAdsAccount(currentPage, 10).then((res) => {
      const data = res.data.data
      console.log('res', res.data.data)
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
      console.log('err', err)
      setLoading({ ...loading, isTable: false })
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
            Thêm tài khoản quảng cáo
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
      <AdAccountModal
        ref={modalRef}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        editingData={dataRecord}
        isLoadingBtn={loading.isBtn}
      />
      <DeleteModal
        title='Xóa tài khoản quảng cáo'
        open={isDeleteConfirm}
        okText={'Xóa tài khoản quảng cáo'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa tài khoản ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default AdAccount