/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Modal, Select } from "antd"
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


interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  onFinish: (values: TAdvertisementField) => void,
  editingData?: TAdvertisementField | null,
  selectSystemData: SelectType[],
  isLoadingBtn?: boolean
}

const AdvertisementModal = forwardRef<{ submit: () => void }, Props>((props, ref) => {
  const { isModalOpen, selectSystemData, isLoadingBtn, handleOk, handleCancel, onFinish } = props
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
  const [selectTeamDataModal, setSelectTeamDataModal] = useState<SelectType[]>([])
  const [selectMemberDataModal, setSelectMemberDataModal] = useState<SelectType[]>([])
  const [selectSystemModalId, setSelectSystemModalId] = useState<string | null>(null)
  const [selectAgencyModalId, setSelectAgencyModalId] = useState<string | null>(null)
  const [selectTeamModalId, setSelectTeamModalId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isSelectAgency: false,
    isSelectTeam: false,
    isSelectMember: false
  })
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    },
  }));

  const handleFormChange = (changedValues: any) => {
    setSelectSystemModalId(changedValues.organizationId)
    setSelectAgencyModalId(changedValues.branchId)
    setSelectTeamModalId(changedValues.groupId)
    if (changedValues.organizationId) {
      form.setFieldValue('branchId', undefined)
      form.setFieldValue('groupId', undefined)
      form.setFieldValue('employeeId', undefined)
    }
    if (changedValues.branchId) {
      form.setFieldValue('groupId', undefined)
      form.setFieldValue('employeeId', undefined)
    }
    if (changedValues.groupId) {
      form.setFieldValue('employeeId', undefined)
    }
  };

  const clearSelectSystemModalId = () => {
    form.setFieldValue('branchId', undefined)
    form.setFieldValue('groupId', undefined)
    form.setFieldValue('employeeId', undefined)
    setSelectAgencyDataModal([])
    setSelectTeamDataModal([])
    setSelectMemberDataModal([])
  }

  const clearSelectAgencyModalId = () => {
    form.setFieldValue('groupId', undefined)
    form.setFieldValue('employeeId', undefined)
    setSelectTeamDataModal([])
    setSelectMemberDataModal([])
  }

  const clearSelectTeamModalId = () => {
    form.setFieldValue('employeeId', undefined)
    setSelectMemberDataModal([])
  }

  useEffect(() => {
    if (selectSystemModalId) {
      setLoading((prevLoading) => ({ ...prevLoading, isSelectAgency: true }))
      branchApi.getListBranch(undefined, undefined, selectSystemModalId).then((res) => {
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
      groupApi.getListGroup(undefined, undefined, undefined, selectAgencyModalId).then((res) => {
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
        isSelectMember: true
      }))
      employeeApi.getListEmployee(undefined, undefined, undefined, undefined, selectTeamModalId).then((res) => {
        setSelectMemberDataModal(
          res.data.data.map((item: TMemberTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setLoading((prevLoading) => ({ ...prevLoading, isSelectMember: false }))
      })
    }
  }, [selectSystemModalId, selectAgencyModalId, selectTeamModalId])

  // useEffect(() => {
  //   if (editingData) {
  //     form.setFieldsValue({
  //       name: editingData.name || "",
  //       organizationId: selectSystemData.find((item) => item.value === editingData.organizationId)?.value,
  //       branchId: selectAgencyData.find((item) => item.value === editingData.branchId)?.value,
  //       groupId: selectTeamData.find((item) => item.value === editingData.groupId)?.value,
  //       employeeId: selectMemberData.find((item) => item.value === editingData.employeeId)?.value
  //     });
  //   } else {
  //     form.resetFields();
  //   }
  // }, [editingData, form]);

  return (
    <Modal
      title={'Thêm tài khoản quảng cáo'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      okButtonProps={{ loading: isLoadingBtn }}
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
            options={selectSystemData}
            onClear={clearSelectSystemModalId}
            notFoundContent={'Không có dữ liệu'}
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
        <Form.Item<TAdvertisementField>
          label="Id tài khoản quảng cáo"
          name="id"
          rules={[{ required: true, message: 'Không được để trống tên tài khoản quảng cáo' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default AdvertisementModal;
