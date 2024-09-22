/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import styles from './style.module.scss'
import { SelectType } from "../../../models/common";
import { TMemberField } from "../../../models/member/member";
import branchApi from "../../../api/branchApi";
import { TAgencyTable } from "../../../models/agency/agency";
import groupApi from "../../../api/groupApi";
import { TypeTeamTable } from "../../../models/team/team";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../helper/const";

interface Props {
  isModalOpen: boolean,
  handleSave: () => void,
  handleOk: () => void,
  handleCancel: () => void,
  onFinish: (values: TMemberField) => void,
  editingData?: TMemberField | null,
  selectSystemData: SelectType[],
  isLoadingOkBtn?: boolean,
  isLoadingSaveBtn?: boolean
}

const MemberModal = forwardRef<{ submit: () => void; reset: () => void; saveReset: () => void }, Props>((props, ref) => {
  const {
    isModalOpen,
    editingData,
    selectSystemData,
    isLoadingOkBtn,
    isLoadingSaveBtn,
    handleSave,
    handleOk,
    handleCancel,
    onFinish
  } = props
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
  const [selectAgencyEditingDataModal, setSelectAgencyEditingDataModal] = useState<SelectType[]>([])
  const [selectTeamDataModal, setSelectTeamDataModal] = useState<SelectType[]>([])
  const [selectTeamEditingDataModal, setSelectTeamEditingDataModal] = useState<SelectType[]>([])
  const [selectSystemModalId, setSelectSystemModalId] = useState<string | null>(null)
  const [selectAgencyModalId, setSelectAgencyModalId] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    isSelectAgency: false,
    isSelectTeam: false
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
      form.resetFields(['name', 'description']);
    }
  }));

  const handleFormChange = (changedValues: any) => {
    setSelectSystemModalId(changedValues.organizationId)
    setSelectAgencyModalId(changedValues.branchId)
    if (changedValues.organizationId) {
      form.setFieldValue('branchId', undefined)
      form.setFieldValue('groupId', undefined)
    }
    if (changedValues.branchId) {
      form.setFieldValue('groupId', undefined)
    }
  };

  const clearSelectSystemModalId = () => {
    form.setFieldValue('branchId', undefined)
    form.setFieldValue('groupId', undefined)
    setSelectAgencyDataModal([])
    setSelectTeamDataModal([])
  }

  const clearSelectAgencyModalId = () => {
    form.setFieldValue('groupId', undefined)
    setSelectTeamDataModal([])
  }

  useEffect(() => {
    branchApi.getListBranch().then((res) => {
      setSelectAgencyEditingDataModal(
        res.data.data.map((item: TAgencyTable) => ({
          value: item.id,
          label: item.name
        }))
      )
    })
    groupApi.getListGroup().then((res) => {
      setSelectTeamEditingDataModal(
        res.data.data.map((item: TypeTeamTable) => ({
          value: item.id,
          label: item.name
        }))
      )
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
        setLoading((prevLoading) => ({ ...prevLoading, iseSelectTeam: false }))
      })
    }
  }, [selectSystemModalId, selectAgencyModalId])

  useEffect(() => {
    if (editingData) {
      setSelectSystemModalId(editingData?.group?.branch.organization.id as string)
      setSelectAgencyModalId(editingData?.group?.branch.id as string)
      form.setFieldsValue({
        name: editingData.name || "",
        email: editingData.email || "",
        phone: editingData.phone || "",
        description: editingData.description || "",
        organizationId: selectSystemData.find((item) => item.value === editingData?.group?.branch?.organization.id)?.value,
        branchId: selectAgencyEditingDataModal.find((item) => item.value === editingData.group?.branch.id)?.value,
        groupId: selectTeamEditingDataModal.find((item) => item.value === editingData.groupId)?.value
      });
    } else {
      form.resetFields();
      setSelectSystemModalId(null)
      setSelectAgencyModalId(null)
      setSelectAgencyDataModal([])
      setSelectTeamDataModal([])
    }
  }, [editingData, form]);

  return (
    <Modal
      title={editingData ? 'Sửa đội nhóm' : 'Thêm đội nhóm'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
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
        <div className={styles["select-form"]}>
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
        </div>
        <Form.Item
          label="Chọn đội nhóm"
          name="groupId"
          rules={[{ required: true, message: 'Bạn phải chọn đội nhóm!' }]}
          className={styles["custom-margin-form"]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn đội nhóm"
            options={selectTeamDataModal}
            notFoundContent={selectAgencyModalId ? 'Không có dữ liệu' : 'Bạn cần chọn chi nhánh trước!'}
            loading={loading.isSelectTeam}
          />
        </Form.Item>
        <Form.Item<TMemberField>
          label="Tên thành viên"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống tên thành viên' }]}
          className={styles["custom-margin-form"]}
        >
          <Input />
        </Form.Item>
        <Form.Item<TMemberField>
          label="Email"
          name="email"
          rules={[
            { required: true, whitespace: true, message: 'Không được để trống tên email' },
            { pattern: EMAIL_REGEX, message: 'Email không hợp lệ' }
          ]}
          className={styles["custom-margin-form"]}
        >
          <Input />
        </Form.Item>
        <Form.Item<TMemberField>
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, whitespace: true, message: 'Không được để trống số điện thoại' },
            { pattern: PHONE_REGEX, message: 'Số điện thoại không hợp lệ, bắt đầu từ 0 và có 9 - 11 số' }
          ]}
          className={styles["custom-margin-form"]}
        >
          <Input />
        </Form.Item>
        <Form.Item<TMemberField>
          label="Ghi chú"
          name="description"
        >
          <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} maxLength={249} />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default MemberModal;
