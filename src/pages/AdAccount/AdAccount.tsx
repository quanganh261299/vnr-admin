import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Button, message, Space, Table, Tag, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import { TAdvertisementField } from '../../models/advertisement/advertisement';
import advertisementApi from '../../api/advertisementApi';
import { TAdUserTable } from '../../models/user/user';
import AdAccountModal from '../../Components/Modal/AdAccountModal/AdAccountModal';
import { useSearchParams } from 'react-router-dom';
import ConfirmModal from '../../Components/Modal/ConfirmModal/ConfirmModal';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import { DEFAULT_PAGE_SIZE } from '../../helper/const';


const AdAccount: FC = () => {
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
    isSaveBtn: false
  })
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [isSave, setIsSave] = useState<boolean>(false)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const modalRef = useRef<{ submit: () => void; reset: () => void; saveReset: () => void }>(null);
  const [searchParams] = useSearchParams()
  const isDeleted = !!searchParams.get('isDeleted')

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
      render: (employee) => <span>{employee?.name}</span>
    },
    {
      title: 'Tên đội nhóm',
      dataIndex: 'employee',
      key: 'groupName',
      className: styles['center-cell'],
      render: (employee) => <span>{employee?.group?.name}</span>,
      width: '15%',
    },
    {
      title: 'Id tài khoản QC',
      dataIndex: 'accountId',
      key: 'accountId',
      width: '15%',
    },
    {
      title: 'Trạng thái tài khoản',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
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
        : values.pms
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
    advertisementApi.deleteAdsAccount(dataRecord?.accountId as string).then(() => {
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

  const handleCancelDelete = () => setModal((prevState) => ({ ...prevState, isDeleteModalOpen: false }))

  const handleShowConfirmRecover = (data: TAdUserTable) => {
    setDataRecord(data)
    setModal((prevState) => ({ ...prevState, isRecoverModalOpen: true }))
  }

  const handleConfirmRecover = () => {
    setModal((prevState) => ({ ...prevState, isRecoverModalOpen: false }))
  }

  const handleCancelRecover = () => setModal((prevState) => ({ ...prevState, isRecoverModalOpen: false }))

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
    advertisementApi.getListAdsAccount({ pageIndex: currentPage, pageSize: DEFAULT_PAGE_SIZE }).then((res) => {
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
  }, [currentPage, isCallbackApi])

  return (
    <>
      {contextHolder}
      {
        !isDeleted && (
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
        )
      }
      <div className={styles["container"]}>
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
        description={`Bạn có muốn khôi phục tài khoản ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      />
      <DeleteModal
        title={isDeleted ? 'Xóa hoàn toàn tài khoản quảng cáo' : 'Xóa tài khoản quảng cáo'}
        open={modal.isDeleteModalOpen}
        okText={'Xóa tài khoản quảng cáo'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={isDeleted ? `Bạn có chắc muốn xóa hoàn toàn tài khoản ${dataRecord?.name} không?` : `Bạn có chắc muốn xóa tài khoản ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default AdAccount