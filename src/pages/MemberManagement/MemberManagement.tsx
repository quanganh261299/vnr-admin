import { FC, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
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

const MemberManagement: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [dataRecord, setDataRecord] = useState<TMemberField | null>(null)
  const [dataTable, setDataTable] = useState<TMemberTable[]>([])
  const [totalData, setTotalData] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [totalPage, setTotalPage] = useState<number>(0);
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
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false
  })
  const [messageApi, contextHolder] = message.useMessage();
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false)
  const modalRef = useRef<{ submit: () => void; reset: () => void }>(null);


  const columns: TableProps<TMemberTable>['columns'] = [
    {
      title: 'Tên thành viên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span>{text}</span>,
      width: 150,
      className: styles['center-cell']
    },
    {
      title: 'Tên đội nhóm',
      dataIndex: 'group',
      key: 'groupName',
      render: (group) => <span>{group?.name}</span>,
      width: 150,
      className: styles['center-cell']
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'group',
      key: 'branchName',
      render: (group) => <span>{group?.branch?.name}</span>,
      width: 150,
      className: styles['center-cell']
    },
    {
      title: 'Tên hệ thống',
      dataIndex: 'group',
      key: 'organizationName',
      render: (group) => <span>{group?.branch?.organization?.name}</span>,
      width: 150,
      className: styles['center-cell']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: styles['center-cell']
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      className: styles['center-cell']
    },
    // {
    //   title: 'Ngày tham gia',
    //   dataIndex: 'startDate',
    //   key: 'startDate',
    //   width: 150,
    //   className: styles['center-cell']
    // },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      className: styles['center-cell']
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
      className: styles['center-cell']
    },
  ];

  const onChangeSystem = (value: string) => {
    setSelectSystemId(value)
    setSelectAgencyId(null)
    setSelectTeamId(null)
  };

  const onSearchSystem = (value: string) => {
    console.log('search:', value);
  };

  const onChangeAgency = (value: string) => {
    setSelectAgencyId(value)
    setSelectTeamId(null)
  };

  const onSearchAgency = (value: string) => {
    console.log('search:', value);
  };

  const onChangeTeam = (value: string) => {
    setSelectTeamId(value)
  };

  const onSearchTeam = (value: string) => {
    console.log('search:', value);
  };

  const onFinish: FormProps<TMemberField>['onFinish'] = (values) => {
    setLoading({ ...loading, isBtn: true })
    if (dataRecord) {
      employeeApi.updateEmployee({ ...values, id: dataRecord?.id }).then(() => {
        setIsModalOpen(false)
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
        setIsModalOpen(false)
        setIsCallbackApi(!isCallbackApi)
        modalRef.current?.reset();
        setLoading({ ...loading, isBtn: false })
        success('Tạo thành viên thành công!')
      }).catch((err) => {
        console.log('err', err)
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
    setLoading((prevLoading) => ({ ...prevLoading, isTable: true }))
    employeeApi.getListEmployee(
      currentPage,
      10,
      selectSystemId as string,
      selectAgencyId as string,
      selectTeamId as string
    ).then((res) => {
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
    }).catch((err) => {
      console.log('error', err)
      setLoading((prevLoading) => ({ ...prevLoading, isTable: false }))
    })
  }, [selectSystemId, selectAgencyId, selectTeamId, currentPage, isCallbackApi])

  return (
    <>
      {contextHolder}
      <div className={styles["container"]}>
        <Tooltip title="Thêm thành viên">
          <Button
            icon={<PlusOutlined />}
            type="primary" className={styles['btn']}
            onClick={() => handleShowModal()}
          >
            Thêm thành viên
          </Button>
        </Tooltip>
        <div className={styles['member-container']}>
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            optionFilterProp="label"
            onChange={onChangeSystem}
            onSearch={onSearchSystem}
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
            onSearch={onSearchAgency}
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
            onSearch={onSearchTeam}
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
          pagination={{
            current: currentPage,
            pageSize: 10,
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
        handleCancel={handleCancel}
        onFinish={onFinish}
        editingData={dataRecord}
        selectSystemData={selectSystemData}
        isLoadingBtn={loading.isBtn}
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

