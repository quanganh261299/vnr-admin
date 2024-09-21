/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import styles from './style.module.scss'
import { SelectType } from "../../../models/common";
import { TypeTeamField } from "../../../models/team/team";
import { TAgencyTable } from "../../../models/agency/agency";
import branchApi from "../../../api/branchApi";

interface Props {
  isModalOpen: boolean,
  handleOk: () => void,
  handleSave: () => void,
  handleCancel: () => void,
  onFinish: (values: TypeTeamField) => void,
  editingData?: TypeTeamField | null,
  selectSystemData: SelectType[],
  isLoadingOkBtn?: boolean,
  isLoadingSaveBtn?: boolean
}

const TeamModal = forwardRef<{ submit: () => void; reset: () => void; saveReset: () => void }, Props>((props, ref) => {
  const {
    isModalOpen,
    editingData,
    selectSystemData,
    isLoadingOkBtn,
    isLoadingSaveBtn,
    handleOk,
    handleSave,
    handleCancel,
    onFinish
  } = props
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
  const [selectAgencyEditingDataModal, setSelectAgencyEditingDataModal] = useState<SelectType[]>([])
  const [selectSystemModalId, setSelectSystemModalId] = useState<string | null>(null)
  const [isLoadingSelectAgency, setIsLoadingSelectAgency] = useState<boolean>(false)
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
    if (changedValues.organizationId) {
      setSelectSystemModalId(changedValues.organizationId)
      form.setFieldValue('branchId', undefined)
    }
  };

  const clearSelectSystemModalId = () => {
    setSelectSystemModalId(null)
    form.setFieldValue('branchId', undefined)
    setSelectAgencyDataModal([])
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
  }, [])

  useEffect(() => {
    if (selectSystemModalId) {
      setIsLoadingSelectAgency(true)
      branchApi.getListBranch(undefined, undefined, selectSystemModalId).then((res) => {
        setSelectAgencyDataModal(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setIsLoadingSelectAgency(false)
      })
    }
  }, [selectSystemModalId])

  useEffect(() => {
    if (editingData) {
      setSelectSystemModalId(String(editingData.branch?.organizationId))
      form.setFieldsValue({
        name: editingData.name || "",
        description: editingData.description || "",
        organizationId: selectSystemData.find((item) => item.value === editingData.branch?.organizationId)?.value,
        branchId: selectAgencyEditingDataModal.find((item) => item.value === editingData.branchId)?.value
      });
    } else {
      form.resetFields();
      setSelectSystemModalId(null)
      setSelectAgencyDataModal([])
    }
  }, [editingData, form, selectAgencyEditingDataModal]);

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
        <Form.Item
          label="Chọn hệ thống"
          name="organizationId"
          className={styles["custom-margin-form"]}
          rules={[{ required: true, message: 'Không được để trống hệ thống' }]}
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
          className={styles["custom-margin-form"]}
          rules={[{ required: true, message: 'Không được để trống chi nhánh' }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn chi nhánh"
            options={selectAgencyDataModal}
            notFoundContent={selectSystemModalId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước!'}
            loading={isLoadingSelectAgency}
          />
        </Form.Item>
        <Form.Item<TypeTeamField>
          label="Tên đội nhóm"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống tên đội nhóm' }]}
          className={styles["custom-margin-form"]}
        >
          <Input />
        </Form.Item>

        <Form.Item<TypeTeamField>
          label="Ghi chú"
          name="description"
        >
          <Input.TextArea autoSize={{ minRows: 6, maxRows: 10 }} maxLength={249} />
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default TeamModal;
