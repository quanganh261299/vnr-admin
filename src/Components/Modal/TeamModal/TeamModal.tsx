/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Form, Input, Modal, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import styles from './style.module.scss'
import classNames from "classnames/bind";
import { SelectType } from "../../../models/common";
import { TypeTeamField } from "../../../models/team/team";
import { TAgencyTable } from "../../../models/agency/agency";
import branchApi from "../../../api/branchApi";
import { hasRole, ROLE } from "../../../helper/const";

interface Props {
  role: string | null,
  organizationId: string | null,
  branchId: string | null
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
    role,
    organizationId,
    branchId,
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
  const cx = classNames.bind(styles)
  const [selectAgencyDataModal, setSelectAgencyDataModal] = useState<SelectType[]>([])
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
    },
    organizationReset: () => {
      form.resetFields(['name', 'branchId', 'description'])
    },
    branchReset: () => {
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
    if (selectSystemModalId || organizationId) {
      setIsLoadingSelectAgency(true)
      branchApi.getListBranch({ organizationId: selectSystemModalId || organizationId || '' }).then((res) => {
        setSelectAgencyDataModal(
          res.data.data.map((item: TAgencyTable) => ({
            value: item.id,
            label: item.name
          }))
        )
        setIsLoadingSelectAgency(false)
      })
    }
  }, [selectSystemModalId, organizationId])

  useEffect(() => {
    if (editingData) {
      setSelectSystemModalId(String(editingData.branch?.organizationId))
      form.setFieldsValue({
        name: editingData.name || "",
        description: editingData.description || "",
        organizationId: editingData.branch?.organizationId,
        branchId: editingData.branchId
      });
    }
    else {
      form.resetFields();
      setSelectSystemModalId(null)
      setSelectAgencyDataModal([])
      if (!hasRole([ROLE.ADMIN], String(role))) {
        form.setFieldsValue({ organizationId: organizationId });
      }
      if (!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], String(role))) {
        form.setFieldsValue({ branchId: branchId })
      }
    }
  }, [editingData, form, role, organizationId, branchId]);

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
          className={cx("custom-margin-form")}
          rules={[{ required: true, message: 'Không được để trống hệ thống' }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn hệ thống"
            options={selectSystemData}
            onClear={clearSelectSystemModalId}
            notFoundContent={'Không có dữ liệu'}
            disabled={!hasRole([ROLE.ADMIN], String(role))}
          />
        </Form.Item>
        <Form.Item
          label="Chọn chi nhánh"
          name="branchId"
          className={cx("custom-margin-form")}
          rules={[{ required: true, message: 'Không được để trống chi nhánh' }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn chi nhánh"
            options={selectAgencyDataModal}
            notFoundContent={selectSystemModalId ? 'Không có dữ liệu' : 'Bạn cần chọn hệ thống trước'}
            loading={isLoadingSelectAgency}
            disabled={!hasRole([ROLE.ADMIN, ROLE.ORGANIZATION], String(role))}
          />
        </Form.Item>
        <Form.Item<TypeTeamField>
          label="Tên đội nhóm"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Không được để trống tên đội nhóm' }]}
          className={cx("custom-margin-form")}
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
