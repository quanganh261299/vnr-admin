import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames/bind';
import { Button, message, Select, Space, Table, Tooltip } from 'antd';
import type { FormProps, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import AgencyModal from '../../Components/Modal/AgencyModal/AgencyModal';
import { TAgencyField, TAgencyTable } from '../../models/agency/agency';
import { SelectType } from '../../models/common';
import DeleteModal from '../../Components/Modal/DeleteModal/DeleteModal';
import branchApi from '../../api/branchApi';
import organizationApi from '../../api/organizationApi';
import { TSystemTable } from '../../models/system/system';
import { DEFAULT_PAGE_SIZE, hasRole, ROLE } from '../../helper/const';

interface Props {
  role: string | null
  organizationId: string | null
}

const AgencyManagement: FC<Props> = (props) => {
  const { role, organizationId } = props
  const cx = classNames.bind(styles)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataTable, setDataTable] = useState<TAgencyTable[]>([])
  const [dataRecord, setDataRecord] = useState<TAgencyField | null>(null)
  const [selectSystemData, setSelectSystemData] = useState<SelectType[]>([])
  const [selectSystemId, setSelectSystemId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isTable: false,
    isBtn: false,
    isSelect: false
  })
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  const [isCallbackApi, setIsCallbackApi] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const modalRef = useRef<{ submit: () => void; reset: () => void; organizationReset: () => void }>(null);

  const columns: TableProps<TAgencyTable>['columns'] = [
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Tên hệ thống',
      dataIndex: 'organization',
      key: 'organizationName',
      width: '20%',
      render: (organization) => <span>{organization?.name}</span>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      width: '50%',
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

  const onChange = (value: string) => {
    setSelectSystemId(value)
  };

  const onFinish: FormProps<TAgencyField>['onFinish'] = (values) => {
    setLoading({ ...loading, isBtn: true })
    if (dataRecord) {
      branchApi.updateBranch({ ...values, id: dataRecord?.id }).then(() => {
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        setLoading({ ...loading, isBtn: false })
        success('Sửa chi nhánh thành công!')
      }).catch((err) => {
        setLoading({ ...loading, isBtn: false })
        error(err.response.data.message || err.message)
      })
    }
    else {
      branchApi.createBranch(values).then(() => {
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        if (role && hasRole([ROLE.ADMIN], role)) modalRef.current?.reset()
        else modalRef.current?.organizationReset()
        setLoading({ ...loading, isBtn: false })
        success('Tạo chi nhánh thành công!')
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

  const handleShowModal = (data: TAgencyField | null = null) => {
    if (data) {
      setDataRecord(data)
      setIsModalOpen(true)
    }
    else {
      setDataRecord(null)
      setIsModalOpen(true)
    }
  }

  const handleShowConfirmDelete = (data: TAgencyField) => {
    setDataRecord(data)
    setIsDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setLoading({ ...loading, isBtn: true })
    branchApi.deleteBranch(dataRecord?.id as string).then(() => {
      setIsCallbackApi(!isCallbackApi)
      setIsDeleteConfirm(false)
      setLoading({ ...loading, isBtn: false })
      success('Xóa chi nhánh thành công!')
    }).catch((err) => {
      error(err.response.data.message || err.message)
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
    setLoading((prevLoading) => ({ ...prevLoading, isSelect: true }))
    organizationApi.getListOrganization().then((res) => {
      setSelectSystemData(
        res.data.data.map((item: TSystemTable) => ({
          value: item.id,
          label: item.name
        }))
      );
      setLoading((prevLoading) => ({ ...prevLoading, isSelect: false }))
    }).catch(() => setLoading((prevLoading) => ({ ...prevLoading, isSelect: false })))
  }, [])

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isTable: true }))
    branchApi.getListBranch({
      pageIndex: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      organizationId: selectSystemId || organizationId || ''
    }).then((res) => {
      const data = res.data.data
      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      else {
        const dataTableConfig = data.map((item: TAgencyTable) => ({
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
  }, [selectSystemId, currentPage, isCallbackApi, organizationId])

  return (
    <>
      {contextHolder}
      <div>
        <div>
          <Tooltip title="Thêm chi nhánh">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              className={cx('btn')}
              onClick={() => handleShowModal()}
            >
              Thêm chi nhánh
            </Button>
          </Tooltip>
          {
            role && hasRole([ROLE.ADMIN], role) &&
            <Select
              allowClear
              showSearch
              placeholder="Chọn hệ thống"
              optionFilterProp="label"
              onChange={onChange}
              options={selectSystemData}
              loading={loading.isSelect}
              className={cx("select-system")}
              notFoundContent={'Không có dữ liệu'}
            />
          }
        </div>
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
      <AgencyModal
        role={role}
        organizationId={organizationId}
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
        title='Xóa chi nhánh'
        open={isDeleteConfirm}
        okText={'Xóa chi nhánh'}
        cancelText={'Cancel'}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        description={`Bạn có chắc muốn xóa chi nhánh ${dataRecord?.name} không?`}
        isLoadingBtn={loading.isBtn}
      />
    </>
  )
}

export default AgencyManagement