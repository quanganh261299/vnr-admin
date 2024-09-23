/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import styles from './style.module.scss'
import { SelectType } from "../../../models/common";
import { TAdvertisementField } from "../../../models/advertisement/advertisement";
import branchApi from "../../../api/branchApi";
import { TAgencyTable } from "../../../models/agency/agency";
import groupApi from "../../../api/groupApi";
import { TypeTeamTable } from "../../../models/team/team";
import employeeApi from "../../../api/employeeApi";
import { TMemberTable } from "../../../models/member/member";
import organizationApi from "../../../api/organizationApi";
import { TSystemTable } from "../../../models/system/system";
import { TAdUserTable } from "../../../models/user/user";
import advertisementApi from "../../../api/advertisementApi";

interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleSave: () => void,
  handleCancel: () => void,
  onFinish: (values: TAdvertisementField) => void,
  editingData?: TAdUserTable | null,
  isLoadingOkBtn?: boolean,
  isLoadingSaveBtn?: boolean
}

const AdAccountModal = forwardRef<{ submit: () => void; reset: () => void; saveReset: () => void }, Props>((props, ref) => {
  const {
    isModalOpen,
    isLoadingOkBtn,
    isLoadingSaveBtn,
    editingData,
    handleOk,
    handleSave,
    handleCancel,
    onFinish
  } = props
  const [selectSystemDataModal, setSelectSystemDataModal] = useState<SelectType[]>([])
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
  const [selectTeamDataModal, setSelectTeamDataModal] = useState<SelectType[]>([])
  const [selectMemberDataModal, setSelectMemberDataModal] = useState<SelectType[]>([])
  const [selectBmDataModal, setSelectBmDataModal] = useState<SelectType[]>([])
  const [selectSystemModalId, setSelectSystemModalId] = useState<string | null>(null)
  const [selectAgencyModalId, setSelectAgencyModalId] = useState<string | null>(null)
  const [selectTeamModalId, setSelectTeamModalId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isSelectSystem: false,
    isSelectAgency: false,
    isSelectTeam: false,
    isSelectMember: false,
    isSelectBM: false,
  })
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
    reset: () => {
      form.resetFields();
    },
    saveReset: () => {
      form.resetFields(['id']);
    }
  }));

  const handleFormChange = (changedValues: any) => {
    if (changedValues.organizationId) {
      setSelectSystemModalId(changedValues.organizationId)
      setSelectAgencyDataModal([])
      setSelectTeamDataModal([])
      setSelectMemberDataModal([])
      form.setFieldValue('branchId', undefined)
      form.setFieldValue('groupId', undefined)
      form.setFieldValue('employeeId', undefined)
      form.setFieldValue('pms', undefined)
    }
    if (changedValues.branchId) {
      setSelectAgencyModalId(changedValues.branchId)
      setSelectTeamDataModal([])
      setSelectMemberDataModal([])
      form.setFieldValue('groupId', undefined)
      form.setFieldValue('employeeId', undefined)
      form.setFieldValue('pms', undefined)
    }
    if (changedValues.groupId) {
      setSelectTeamModalId(changedValues.groupId)
      setSelectMemberDataModal([])
      form.setFieldValue('employeeId', undefined)
      form.setFieldValue('pms', undefined)
    }
  };

  const clearSelectSystemModalId = () => {
    setSelectSystemModalId(null)
    setSelectAgencyModalId(null)
    setSelectTeamModalId(null)
    form.setFieldValue('branchId', undefined)
    form.setFieldValue('groupId', undefined)
    form.setFieldValue('employeeId', undefined)
    form.setFieldValue('pms', undefined)
    setSelectAgencyDataModal([])
    setSelectTeamDataModal([])
    setSelectMemberDataModal([])
    setSelectBmDataModal([])
  }

  const clearSelectAgencyModalId = () => {
    setSelectAgencyModalId(null)
    setSelectTeamModalId(null)
    form.setFieldValue('groupId', undefined)
    form.setFieldValue('employeeId', undefined)
    form.setFieldValue('pms', undefined)
    setSelectTeamDataModal([])
    setSelectMemberDataModal([])
    setSelectBmDataModal([])
  }

  const clearSelectTeamModalId = () => {
    setSelectTeamModalId(null)
    form.setFieldValue('employeeId', undefined)
    form.setFieldValue('pms', undefined)
    setSelectMemberDataModal([])
    setSelectBmDataModal([])
  }

  useEffect(() => {
    setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: true }))
    organizationApi.getListOrganization().then((res) => {
      setSelectSystemDataModal(
        res.data.data.map((item: TSystemTable) => ({
          value: item.id,
          label: item.name
        }))
      )
      setLoading((prevLoading) => ({ ...prevLoading, isSelectSystem: false }))
    })
  }, [])

  useEffect(() => {
    if (selectSystemModalId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: true }))
      branchApi.getListBranch({ organizationId: selectSystemModalId }).then((res) => {
        setSelectAgencyDataModal(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false }))
      })
    }
    if (selectAgencyModalId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: false, isSelectTeam: true }))
      groupApi.getListGroup({ branchId: selectAgencyModalId }).then((res) => {
        setSelectTeamDataModal(
          res.data.data.map((item: TypeTeamTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectTeam: false }))
      })
    }
    if (selectTeamModalId) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        isSelectAgency: false,
        isSelectTeam: false,
        isSelectMember: true,
        isSelectBM: true,
      }))
      employeeApi.getListEmployee({ groupId: selectTeamModalId }).then((res) => {
        setSelectMemberDataModal(
          res.data.data.map((item: TMemberTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectMember: false }))
      })
      advertisementApi.getListBm(selectTeamModalId || '').then((res) => {
        setSelectBmDataModal(
          res.data.data.map((item: TMemberTable) => ({
            value: item.id,
            label: item.id
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectBM: false }))
      })
    }
  }, [selectSystemModalId, selectAgencyModalId, selectTeamModalId])

  useEffect(() => {
    if (editingData) {
      setSelectSystemModalId(String(editingData.employee?.group?.branch?.organizationId))
      setSelectAgencyModalId(String(editingData.employee?.group?.branchId))
      setSelectTeamModalId(String(editingData.employee?.groupId))
      form.setFieldsValue({
        name: editingData?.name,
        organizationId: editingData?.employee?.group?.branch?.organizationId,
        branchId: editingData?.employee?.group?.branchId,
        groupId: editingData?.employee?.groupId,
        employeeId: editingData?.employee?.id,
        pms: editingData?.pms?.map((pms) => typeof pms === 'object' && pms.id),
        id: editingData?.accountId,
      });
    } else {
      form.resetFields();
      setSelectSystemModalId(null)
      setSelectAgencyModalId(null)
      setSelectTeamModalId(null)
      setSelectAgencyDataModal([])
      setSelectTeamDataModal([])
      setSelectMemberDataModal([])
      setSelectBmDataModal([])
    }
  }, [editingData, form]);


  return (
    <Modal
      title={'Thêm tài khoản quảng cáo'}
      open={isModalOpen}
      centered
      onCancel={handleCancel}
      footer={(
        <Flex gap={"small"} justify="flex-end">
          <Button onClick={handleCancel}>Cancel</Button>
          {!editingData &&
            <Button
              type="primary"
              onClick={handleSave}
              loading={isLoadingSaveBtn}
            >
              Save & Continue
            </Button>
          }
          <Button
            type="primary"
            onClick={handleOk}
            loading={isLoadingOkBtn}
          >
            Ok
          </Button>
        </Flex>
      )}
    >
      <Form
        form={form}
        name="form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label="Chọn hệ thống"
          name="organizationId"
          rules={[{ required: true, message: 'Bạn phải chọn hệ thống!' }]}
          className={styles["custom-select-form"]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            options={selectSystemDataModal}
            onClear={clearSelectSystemModalId}
            notFoundContent={'Không có dữ liệu'}
            loading={loading.isSelectSystem}
          />
        </Form.Item>
        <Form.Item
          label="Chọn chi nhánh"
          name="branchId"
          rules={[{ required: true, message: 'Bạn phải chọn chi nhánh!' }]}
          className={styles["custom-select-form"]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn chi nhánh"
            options={selectAgencyDataModal}
            onClear={clearSelectAgencyModalId}
            notFoundContent={selectSystemModalId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
            loading={loading.isSelectAgency}
          />
        </Form.Item>
        <Form.Item
          label="Chọn đội nhóm"
          name="groupId"
          rules={[{ required: true, message: 'Bạn phải chọn đội nhóm!' }]}
          className={"custom-margin-form"}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn đội nhóm"
            options={selectTeamDataModal}
            notFoundContent={selectAgencyModalId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
            loading={loading.isSelectTeam}
            onClear={clearSelectTeamModalId}
          />
        </Form.Item>
        <Form.Item
          label="Chọn thành viên"
          name="employeeId"
          rules={[{ required: true, message: 'Bạn phải chọn thành viên!' }]}
          className={"custom-margin-form"}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn thành viên"
            options={selectMemberDataModal}
            notFoundContent={selectTeamModalId ? 'Không có dữ liệu' : 'Bạn cần chọn đội nhóm trước!'}
            loading={loading.isSelectMember}
          />
        </Form.Item>
        <Form.Item
          label="Chọn BM"
          name="pms"
          rules={[{ required: true, message: 'Bạn phải chọn ít nhất một id BM!' }]}
          className={"custom-margin-form"}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="Chọn ít nhất một id BM"
            options={selectBmDataModal}
            notFoundContent={selectTeamModalId ? 'Không có dữ liệu' : 'Bạn cần chọn đội nhóm trước!'}
            loading={loading.isSelectBM}
          />
        </Form.Item>
        <Form.Item<TAdvertisementField>
          label="Id tài khoản quảng cáo"
          name="id"
          rules={[{ required: true, message: 'Không được để trống Id tài khoản quảng cáo' }]}
        >
          <Input disabled={editingData ? true : false} />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default AdAccountModal;
